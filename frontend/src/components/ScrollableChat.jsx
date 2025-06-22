import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "@/config/ChatLogics";
import React, { useEffect, useRef } from "react";
import { ChatState } from "@/context/ChatProvider";
import { Avatar } from "@chakra-ui/react";
import { Tooltip } from "@/components/ui/tooltip";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div
      style={{ overflowY: "auto", maxHeight: "400px", padding: "10px" }}
      className="messages"
    >
      {messages &&
        messages.map((msg, index) => (
          <div style={{ display: "flex" }} key={index}>
            {/* profile */}
            {(isSameSender(messages, msg, index, user._id) ||
              isLastMessage(messages, index, user._id)) && (
              <Tooltip
                content={msg.sender.name}
                positioning={{ placement: "bottom-end" }}
                openDelay={100}
                showArrow
              >
                <Avatar.Root mt="7px" mr={1} size="sm" cursor="pointer">
                  <Avatar.Fallback name={msg.sender.name} />
                  <Avatar.Image src={msg.sender.pic} />
                </Avatar.Root>
              </Tooltip>
            )}
            {/* message */}
            <span
              style={{
                background: `${
                  msg.sender._id === user._id ? "#B9FBC0" : "#E5E4E2"
                }`,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
                marginLeft: isSameSenderMargin(messages, msg, index, user._id),
                marginTop: isSameUser(messages, msg, index) ? 10 : 10,
                color: "black",
                wordBreak: "break-word",
              }}
            >
              {msg.content}
            </span>
          </div>
        ))}
      <div ref={bottomRef} />
    </div>
  );
};

export default ScrollableChat;
