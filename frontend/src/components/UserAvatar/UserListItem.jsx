import React from "react";
import { Box, Avatar, Text } from "@chakra-ui/react";

const UserListItem = ({ user, handleFunction }) => {
  return (
    <Box
      display={"flex"}
      alignItems={"center"}
      p={2}
      bg={"gray.600"}
      borderRadius={"md"}
      color={"white"}
      mb={"5px"}
      _hover={{ bg: "purple.400", cursor: "pointer" }}
      onClick={handleFunction}
    >
      <Avatar.Root mr={2} size="sm" cursor="pointer">
        <Avatar.Fallback name={user.name} />
        <Avatar.Image src={user.pic} />
      </Avatar.Root>
      <Box>
        <Text fontWeight={"bold"}>{user.name}</Text>
        <Text fontSize={"xs"}>Email: {user.email}</Text>
      </Box>
    </Box>
  );
};

export default UserListItem;
