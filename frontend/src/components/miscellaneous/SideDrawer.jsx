import React, { useState } from "react";
import {
  Box,
  Button,
  Text,
  Menu,
  Portal,
  Avatar,
  Drawer,
  CloseButton,
  Input,
  Spinner,
} from "@chakra-ui/react";
import { Tooltip } from "@/components/ui/tooltip";
import { Search, Bell, EllipsisVertical } from "lucide-react";
import { ChatState } from "@/context/ChatProvider";
import ProfileModal from "./ProfileModal";
import { useHistory } from "react-router-dom";
import { toaster } from "@/components/ui/toaster";
import axios from "axios";
import ChatLoading from "../ChatLoading";
import UserListItem from "../UserAvatar/UserListItem";
import { getSender } from "@/config/ChatLogics";
import { Badge } from "primereact/badge";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const {
    user,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
  } = ChatState();
  const [open, setOpen] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const history = useHistory();

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    history.push("/");
  };

  const handleSearch = async () => {
    if (!search.trim()) {
      toaster.create({
        title: "Please Enter something in search",
        description: "Search field cannot be empty.",
        type: "warning",
        duration: 3000,
      });
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config);

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toaster.create({
        title: "Error Occurred",
        description: "Failed to fetch search results.",
        type: "error",
        duration: 3000,
      });
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post("/api/chat", { userId }, config);
      if (!chats.find((c) => c._id === data._id)) {
        setChats([data, ...chats]);
      }

      setSelectedChat(data);
      setLoadingChat(false);
      setOpenDrawer(false);
    } catch (error) {
      setLoadingChat(false);
      toaster.create({
        title: "Error Occurred",
        description: error.response?.data?.message || "Failed to access chat.",
        type: "error",
        duration: 3000,
      });
    }
  };

  return (
    <>
      {/* navbar */}
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        p={"5px 10px"}
        bg="white"
      >
        <Tooltip
          content="Search Users"
          showArrow
          openDelay={0}
          closeDelay={100}
          positioning={{ placement: "bottom" }}
        >
          <Button
            variant="ghost"
            colorPalette="purple"
            onClick={() => setOpenDrawer(true)}
          >
            <Search />
            <Text display={{ base: "none", md: "flex" }} px={4}>
              Search
            </Text>
          </Button>
        </Tooltip>

        <Text
          fontSize="2xl"
          color={"gray.800"}
          fontFamily="Outfit"
          fontWeight="bold"
        >
          🚀 Let's Chat!
        </Text>

        <div style={{ display: "flex", alignItems: "center" }}>
          <Menu.Root>
            <Menu.Trigger asChild>
              <Button variant="ghost" size="sm" colorPalette="purple">
                <Bell />
                <Badge value={notification.length} severity="danger"></Badge>
              </Button>
            </Menu.Trigger>
            <Portal>
              <Menu.Positioner>
                <Menu.Content p={5} bg="white" color="black" borderRadius="md">
                  {!notification.length && "No new messages"}
                  {notification.map((notif) => (
                    <Menu.Item
                      key={notif._id}
                      as="button"
                      onClick={() => {
                        setSelectedChat(notif.chat);
                        setNotification(
                          notification.filter((n) => n._id !== notif._id)
                        );
                      }}
                      value={notif._id}
                      transition="background 0.2s ease-in"
                      _hover={{
                        bg: "gray.100",
                      }}
                      p={2}
                      borderRadius="md"
                      color="black"
                    >
                      {notif.chat.isGroupChat
                        ? `New message in ${notif.chat.chatName}`
                        : `New message from ${getSender(
                            user,
                            notif.chat.users
                          )}`}
                    </Menu.Item>
                  ))}
                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>

          <ProfileModal
            user={user}
            open={open}
            onOpenChange={(e) => setOpen(e.open)}
          >
            <Button variant={"plain"} colorPalette="purple">
              <Avatar.Root size="xs">
                <Avatar.Fallback name={user.name} />
                <Avatar.Image src={user.pic} />
              </Avatar.Root>
            </Button>
          </ProfileModal>

          <Menu.Root>
            <Menu.Trigger asChild>
              <Button variant="ghost" colorPalette="purple">
                <EllipsisVertical absoluteStrokeWidth />
              </Button>
            </Menu.Trigger>
            <Portal>
              <Menu.Positioner>
                <Menu.Content>
                  <Menu.Item
                    as="button"
                    onClick={handleLogout}
                    value="logout"
                    color="fg.error"
                    _hover={{ bg: "bg.error", color: "fg.error" }}
                  >
                    Logout
                  </Menu.Item>
                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>
        </div>
      </Box>

      {/* drawer */}
      <Drawer.Root
        placement={"start"}
        open={openDrawer}
        onOpenChange={(e) => setOpenDrawer(e.open)}
      >
        <Portal>
          <Drawer.Backdrop />
          <Drawer.Positioner>
            <Drawer.Content bg="black" color="white" p={2}>
              <Drawer.Header>
                <Drawer.Title>Search User</Drawer.Title>
              </Drawer.Header>
              <Drawer.Body>
                <Box display={"flex"} pb={2} mb={4}>
                  <Input
                    placeholder="Search Users..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    mr={2}
                  />
                  <Button onClick={handleSearch} fontSize={"lg"}>
                    🔎
                  </Button>
                </Box>
                {loading ? (
                  <ChatLoading />
                ) : (
                  searchResult.map((user) => (
                    <UserListItem
                      key={user._id}
                      user={user}
                      handleFunction={() => accessChat(user._id)}
                    />
                  ))
                )}
                {loadingChat && (
                  <Spinner
                    ml="auto"
                    display="flex"
                    size="lg"
                    color="purple.500"
                    borderWidth="4px"
                  />
                )}
              </Drawer.Body>
              <Drawer.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Drawer.CloseTrigger>
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>
    </>
  );
};

export default SideDrawer;
