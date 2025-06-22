import { Box } from "@chakra-ui/react";
import React from "react";
import { X } from "lucide-react";

const UserBadgeItem = ({ user, handleFunction }) => {
  return (
    <Box
      px={2}
      py={1}
      borderRadius="lg"
      m={1}
      mb={2}
      variant="solid"
      fontSize={12}
      bg="purple.400"
      color="white"
      cursor="pointer"
      onClick={handleFunction}
      display={"flex"}
      alignItems="center"
      gap={2}
    >
      {user.name} <X size={16} />
    </Box>
  );
};

export default UserBadgeItem;
