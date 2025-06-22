import {
  IconButton,
  Button,
  CloseButton,
  Dialog,
  Portal,
  Box,
  Fieldset,
  Field,
  Input,
  Spinner,
} from "@chakra-ui/react";
import React, { useState, useRef } from "react";
import { Settings } from "lucide-react";
import { ChatState } from "@/context/ChatProvider";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";
import axios from "axios";
import { toaster } from "../ui/toaster";
import UserListItem from "../UserAvatar/UserListItem";

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);

  const searchTimeout = useRef();

  const [open, setOpen] = useState(false);
  const { selectedChat, setSelectedChat, user } = ChatState();

  const handleRemove = async (userToBeRemoved) => {
    if (
      selectedChat.groupAdmin._id !== user._id &&
      userToBeRemoved._id !== user._id
    ) {
      toaster.create({
        title: "Only group admin can remove someone!",
        description:
          "You are not authorized to remove someone from this group chat.",
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
      const { data } = await axios.put(
        "/api/chat/groupremove",
        {
          chatId: selectedChat._id,
          userId: userToBeRemoved._id,
        },
        config
      );
      userToBeRemoved._id === user._id
        ? setSelectedChat("")
        : setSelectedChat(data);

      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
      toaster.create({
        title: "User Removed",
        description: `${userToBeRemoved.name} has been removed from the group chat.`,
        type: "success",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error removing user from group chat:", error);
      toaster.create({
        title: "Error Occurred",
        description:
          error.response?.data?.message ||
          "Failed to remove user from group chat.",
        type: "error",
        duration: 3000,
      });
    }
  };

  const handleAddUser = async (userToBeAdded) => {
    if (selectedChat.users.find((u) => u._id === userToBeAdded._id)) {
      toaster.create({
        title: "User already in group",
        description: "This user is already part of the group chat.",
        type: "warning",
        duration: 3000,
      });
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      toaster.create({
        title: "Only group admin can add someone!",
        description:
          "You are not authorized to add someone to this group chat.",
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
      const { data } = await axios.put(
        `/api/chat/groupadd`,
        {
          chatId: selectedChat._id,
          userId: userToBeAdded._id,
        },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
      toaster.create({
        title: "User Added",
        description: `${userToBeAdded.name} has been added to the group chat.`,
        type: "success",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error adding user to group chat:", error);
      toaster.create({
        title: "Error Occurred",
        description:
          error.response?.data?.message || "Failed to add user to group chat.",
        type: "error",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRename = async () => {
    if (!groupChatName) {
      toaster.create({
        title: "Please Enter a Group Name",
        description: "Group name cannot be empty.",
        type: "warning",
        duration: 3000,
      });
      return;
    }
    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/chat/rename`,
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
      toaster.create({
        title: "Group Chat Renamed",
        description: `Group chat name has been updated to "${groupChatName}".`,
        type: "success",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error renaming group chat:", error);
      toaster.create({
        title: "Error Occurred",
        description:
          error.response?.data?.message || "Failed to rename group chat.",
        type: "error",
        duration: 3000,
      });
    } finally {
      setRenameLoading(false);
    }

    setGroupChatName("");
    setSearch("");
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    searchTimeout.current = setTimeout(async () => {
      if (!query) {
        setSearchResult([]);
        return;
      }

      if (!user || !user.token) {
        toaster.create({
          title: "Not authenticated",
          description: "Please log in to search users.",
          type: "error",
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

        const { data } = await axios.get(`/api/user?search=${query}`, config);
        // console.log("Search results:", data);

        setLoading(false);
        setSearchResult(data);
      } catch (error) {
        // console.error("User search error:", error, error.response);
        toaster.create({
          title: "Error fetching search results",
          description:
            error.response?.data?.message ||
            error.message ||
            "An error occurred",
          type: "error",
          duration: 3000,
        });
      } finally {
        setLoading(false);
      }
    }, 500); // 500ms debounce
  };

  return (
    <>
      <Dialog.Root
        lazyMount
        open={open}
        onOpenChange={(e) => setOpen(e.open)}
        placement={"center"}
        centered
      >
        <Dialog.Trigger asChild>
          <IconButton
            backgroundColor={"#E8E8E8"}
            _hover={{ backgroundColor: "#D3D3D3" }}
          >
            <Settings />
          </IconButton>
        </Dialog.Trigger>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>{selectedChat.chatName}</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Box display="flex" flexWrap="wrap" gap={2} mb={4}>
                  {selectedChat.users.map((user) => (
                    <UserBadgeItem
                      key={user._id}
                      user={user}
                      handleFunction={() => handleRemove(user)}
                    />
                  ))}
                </Box>

                <Fieldset.Root size="lg" mb={4}>
                  <Fieldset.Content w="100%">
                    <Field.Root display="flex" flexDirection="row" gap={3}>
                      {/* <Field.Label>Name</Field.Label> */}
                      <Input
                        name="name"
                        placeholder="Chat Name"
                        value={groupChatName}
                        onChange={(e) => setGroupChatName(e.target.value)}
                      />
                      <Button
                        type="submit"
                        alignSelf="flex-start"
                        variant={"solid"}
                        bg="purple.400"
                        color="white"
                        _hover={{ bg: "purple.500" }}
                        isLoading={renameLoading}
                        onClick={handleRename}
                      >
                        Update
                      </Button>
                    </Field.Root>
                    <Field.Root>
                      {/* <Field.Label>Name</Field.Label> */}
                      <Input
                        name="addUser"
                        placeholder="Add User"
                        mb={1}
                        w="100%"
                        onChange={(e) => handleSearch(e.target.value)}
                      />
                    </Field.Root>
                  </Fieldset.Content>
                </Fieldset.Root>

                {loading ? (
                  <Spinner size={"md"} />
                ) : (
                  searchResult?.map((user) => (
                    <UserListItem
                      key={user._id}
                      user={user}
                      handleFunction={() => handleAddUser(user)}
                    />
                  ))
                )}
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button
                    onClick={() => handleRemove(user)}
                    bg="red.500"
                    color={"white"}
                  >
                    Leave Group
                  </Button>
                </Dialog.ActionTrigger>
              </Dialog.Footer>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
};

export default UpdateGroupChatModal;
