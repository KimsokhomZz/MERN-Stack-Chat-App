import React, { useState, useRef } from "react";
import {
  Button,
  CloseButton,
  Dialog,
  HStack,
  Portal,
  Field,
  Fieldset,
  Input,
  NativeSelect,
  Stack,
  Box,
} from "@chakra-ui/react";
import { ChatState } from "../../context/ChatProvider";
import { toaster } from "../ui/toaster";
import axios from "axios";
import UserListItem from "../UserAvatar/UserListItem";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";

const GroupChatModal = ({ children }) => {
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const searchTimeout = useRef();

  const { user, chats, setChats } = ChatState();
  const [open, setOpen] = useState(false);

  const handleUserSearch = (query) => {
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

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers.length) {
      toaster.create({
        title: "Please fill all the fields",
        description: "Group name and users are required.",
        type: "warning",
        duration: 3000,
      });
      return;
    }

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        "/api/chat/group",
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );

      setChats([data, ...chats]);
      setGroupChatName("");
      setSelectedUsers([]);
      setSearchResult([]);
      setSearch("");
      setOpen(false);
      toaster.create({
        title: "Group chat created successfully",
        description: `Group chat "${data.chatName}" created!`,
        type: "success",
        duration: 3000,
      });
    } catch (error) {
      // console.error("Group chat creation error:", error, error.response);
      toaster.create({
        title: "Error creating group chat",
        description:
          error.response?.data?.message ||
          error.message ||
          "An unexpected error occurred.",
        type: "error",
        duration: 3000,
      });
    }
  };

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toaster.create({
        title: "User already added",
        description: "This user is already in the group.",
        type: "warning",
        duration: 3000,
      });
      return;
    }

    setSelectedUsers((prev) => [...prev, userToAdd]);
  };

  const handleDeleteUser = (userToDelete) => {
    setSelectedUsers((prev) =>
      prev.filter((user) => user._id !== userToDelete._id)
    );
  };

  return (
    <>
      <Dialog.Root
        motionPreset="slide-in-bottom"
        size="md"
        lazyMount
        open={open}
        onOpenChange={(e) => setOpen(e.open)}
      >
        <Dialog.Trigger asChild>{children}</Dialog.Trigger>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title
                  fontSize="lg"
                  fontWeight="bold"
                  display="flex"
                  justifyContent="center"
                  fontFamily={"Outfit"}
                >
                  ➕ Create Group Chat
                </Dialog.Title>
              </Dialog.Header>
              <Dialog.Body
                display={"flex"}
                flexDirection="column"
                alignItems="center"
                gap={4}
              >
                <Fieldset.Root size="lg">
                  <Stack>
                    <Fieldset.Legend>Group details ✍🏼</Fieldset.Legend>
                    <Fieldset.HelperText>
                      Please provide your group details below.
                    </Fieldset.HelperText>
                  </Stack>

                  <Fieldset.Content>
                    <Field.Root>
                      <Field.Label>Name</Field.Label>
                      <Input
                        type="text"
                        placeholder="Group Name"
                        name="name"
                        mb={3}
                        onChange={(e) => setGroupChatName(e.target.value)}
                      />
                    </Field.Root>
                    <Field.Root>
                      <Field.Label>Add Users</Field.Label>
                      <Input
                        placeholder="Add Users eg: Jonh, Kaizen, Jane"
                        name="users"
                        mb={1}
                        onChange={(e) => handleUserSearch(e.target.value)}
                      />
                    </Field.Root>

                    <Box w="100%" display="flex" flexWrap="wrap" gap={2}>
                      {/* selected user */}
                      {selectedUsers.map((user) => (
                        <UserBadgeItem
                          key={user._id}
                          user={user}
                          handleFunction={() => handleDeleteUser(user)}
                        />
                      ))}
                    </Box>

                    {/* render search results */}
                    {loading ? (
                      <div>Loading</div>
                    ) : (
                      searchResult
                        ?.slice(0, 4)
                        .map((user) => (
                          <UserListItem
                            key={user._id}
                            user={user}
                            handleFunction={() => handleGroup(user)}
                          />
                        ))
                    )}
                  </Fieldset.Content>

                  <Button
                    type="submit"
                    fontSize={"md"}
                    alignSelf="flex-end"
                    onClick={handleSubmit}
                  >
                    Create Chat 🚀
                  </Button>
                </Fieldset.Root>
              </Dialog.Body>
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

export default GroupChatModal;
