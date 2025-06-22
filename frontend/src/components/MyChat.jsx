import React, { useEffect, useState } from "react";
import { ChatState } from "../context/ChatProvider";
import axios from "axios";
import { toaster } from "./ui/toaster";
import { Box, Button, Stack, Text } from "@chakra-ui/react";
import { CirclePlus } from "lucide-react";
import ChatLoading from "./ChatLoading";
import { getSender } from "../config/ChatLogics";
import GroupChatModal from "./miscellaneous/GroupChatModal";

const MyChat = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { user, setUser, selectedChat, setSelectedChat, chats, setChats } =
    ChatState();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      console.log("Fetched chats:", data);
      setChats(data);
    } catch (error) {
      toaster.create({
        title: "Error fetching chats",
        description:
          error.response?.data?.message || "An unexpected error occurred.",
        type: "error",
        duration: 3000,
        closable: true,
        position: "bottom-right",
      });
    }
  };

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    // setUser(userInfo);
    setLoggedUser(userInfo);

    if (!userInfo) {
      window.location.href = "/";
    } else {
      fetchChats();
    }
  }, [user, fetchAgain]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir={"column"}
      alignItems="center"
      p={3}
      bg="#F8F8F8"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        display={"flex"}
        justifyContent={"space-between"}
        alignItems="center"
        w="100%"
        fontFamily={"Outfit"}
        color={"#171717"}
      >
        <b>ᯓ💌 My Chat</b>

        <GroupChatModal>
          <Button
            display={"flex"}
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            boxShadow={"sm"}
            shadowColor={"#BF40BF"}
            _hover={{ bg: "#E8E8E8" }}
          >
            New Group <CirclePlus color="#000000" absoluteStrokeWidth />
          </Button>
        </GroupChatModal>
      </Box>

      <Box
        display={"flex"}
        flexDir={"column"}
        w="100%"
        h="100%"
        p={3}
        bg="#F8F8F8"
        borderRadius={"lg"}
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY={"scroll"} spacing={3}>
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor={"pointer"}
                bg={selectedChat === chat ? "#AB47BC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                borderRadius="lg"
                px={3}
                py={2}
                key={chat._id}
                // borderBottomWidth="1px"
              >
                <Text>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
                <Text fontWeight={"bold"}>{chat.name}</Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChat;
