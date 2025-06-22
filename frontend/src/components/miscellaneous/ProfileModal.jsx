import React from "react";
import {
  Button,
  CloseButton,
  Dialog,
  IconButton,
  Portal,
  Image,
  Text,
  Center,
} from "@chakra-ui/react";
import { UserPen } from "lucide-react";

const ProfileModal = ({ user, children, open, onOpenChange }) => {
  if (!user) return null;

  return (
    <Dialog.Root
      placement="center"
      motionPreset="slide-in-bottom"
      size="md"
      centered
      open={open}
      onOpenChange={onOpenChange}
      rounded="lg"
    >
      <Dialog.Trigger asChild>
        {children ? (
          <span>{children}</span>
        ) : (
          <IconButton
            display={{ base: "flex" }}
            variant="ghost"
            color="white"
            icon={<UserPen color="#ffffff" absoluteStrokeWidth />}
          />
        )}
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>{user.name}</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Center
                // bg="bg.emphasized"
                w="100%"
                p={4}
                flexDirection="column"
                rounded={"md"}
              >
                <Image
                  src={user.pic}
                  alt={user.name}
                  boxSize={"150px"}
                  borderRadius={"full"}
                  objectFit="cover"
                  mb={4}
                />
                <Text fontSize={{ base: "28px", md: "30px" }}>
                  <b>Email:</b> {user.email}
                </Text>
              </Center>
            </Dialog.Body>
            <Dialog.Footer>
              <Button
                variant="outline"
                onClick={() => onOpenChange?.({ open: false })}
              >
                Close
              </Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton
                size="sm"
                onClick={() => onOpenChange?.({ open: false })}
              />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default ProfileModal;
