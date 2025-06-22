import { ChatState } from "@/context/ChatProvider";
import { Box, Text, IconButton, Spinner, Field, Input } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { ChevronLeft, CircleUserRound } from "lucide-react";
import { getSender, getSenderFull } from "@/config/ChatLogics";
import ProfileModal from "./miscellaneous/ProfileModal";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import axios from "axios";
import { toaster } from "@/components/ui/toaster";
import "@/components/styles.css";
import ScrollableChat from "@/components/ScrollableChat";
import { io } from "socket.io-client";
import Lottie from "lottie-react";
import typingAnimation from "@/animations/typingAnimation.json";

const ENDPOINT = "http://localhost:5000";
let socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const { user, selectedChat, setSelectedChat, notification, setNotification } =
    ChatState();

  // const defaultOptions = {
  //   loop: true,
  //   autoplay: true,
  //   animationData: typingAnimation,
  //   rendererSettings: {
  //     preserveAspectRatio: "xMidYMid slice",
  //   },
  // };

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );

      console.log("Messages fetched:", data);

      setMessages(data);
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toaster.create({
        title: "Error Occurred!",
        description: error.response?.data?.message || "Something went wrong",
        type: "error",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        // If the chat is not selected, show a notification or update UI accordingly
        if (!notification.includes(newMessageReceived)) {
          setNotification([newMessageReceived, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages((prevMessages) => [...prevMessages, newMessageReceived]);
      }
    });

    return () => {
      socket.off("message received");
    };
  });

  const sendMessage = async (e) => {
    if (e.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };

        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          { content: newMessage, chatId: selectedChat._id },
          config
        );

        console.log(data);
        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        console.error("Error sending message:", error);
        toaster.create({
          title: "Error Occurred!",
          description: error.response?.data?.message || "Something went wrong",
          type: "error",
          duration: 3000,
        });
      }
    }
  };

  const typingHandler = async (e) => {
    setNewMessage(e.target.value);

    // Typing Indicator Logic
    if (!socketConnected) return;
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    let lastTypingTime = new Date().getTime();
    let timerLength = 3000; // 3 seconds
    setTimeout(() => {
      let timeNow = new Date().getTime();
      let timeDiff = timeNow - lastTypingTime;

      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Box
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            display={"flex"}
            justifyContent={{ base: "space-between", md: "flex-start" }}
            alignItems={"center"}
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              onClick={() => setSelectedChat("")}
              backgroundColor={"#E8E8E8"}
              _hover={{ backgroundColor: "#D3D3D3" }}
            >
              <ChevronLeft />
            </IconButton>
            {!selectedChat?.isGroupChat ? (
              <Box
                display={"flex"}
                alignItems={"center"}
                justifyContent={"space-between"}
                w="100%"
              >
                <Text
                  fontSize={{ base: "28px", md: "30px" }}
                  fontFamily={"Outfit"}
                >
                  {getSender(user, selectedChat?.users)}
                </Text>
                <ProfileModal user={getSenderFull(user, selectedChat?.users)}>
                  <IconButton
                    backgroundColor={"#E8E8E8"}
                    _hover={{ backgroundColor: "#D3D3D3" }}
                  >
                    <CircleUserRound />
                  </IconButton>
                </ProfileModal>
              </Box>
            ) : (
              <Box
                display={"flex"}
                alignItems={"center"}
                justifyContent={"space-between"}
                w="100%"
              >
                {selectedChat?.chatName?.toUpperCase()}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </Box>
            )}
          </Box>

          {/* Message Here */}
          <Box
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"flex-end"}
            p={3}
            bg={"#F8F8F8"}
            w="100%"
            h="100%"
            borderRadius={"lg"}
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size={"xl"}
                w={20}
                h={20}
                alignSelf={"center"}
                margin={"auto"}
              />
            ) : (
              <>
                <div className="messages">
                  <ScrollableChat messages={messages} />
                </div>
              </>
            )}

            <Field.Root onKeyDown={sendMessage} required mt={3}>
              {isTyping && (
                <div>
                  <Lottie
                    animationData={typingAnimation}
                    loop={true}
                    style={{
                      marginLeft: 0,
                      marginButton: 15,
                      width: 40,
                    }}
                  />
                </div>
              )}
              <Input
                variant={"filled"}
                bg={"#E8E8E8"}
                placeholder="Type a message..."
                onChange={typingHandler}
                value={newMessage}
              />
            </Field.Root>
          </Box>
        </>
      ) : (
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          h={"100%"}
        >
          <Text fontSize={"lg"} pb={3}>
            Click on a user to start chatting!
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
