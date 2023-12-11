import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import socket from "../../../../../Common/socket";
import ChatWithCustomer from "./ChatWithCustomer";

const RightSidebar = ({
  activeChat,
  setActiveChat,
  setShow,
  removeUser,
  chatEnd,
}) => {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    if (activeChat) {
      (async function () {
        try {
          const { data } = await axios.get(
            `https://residential-building.vercel.app/messages?id=${activeChat?._id}`
          );

          console.log(data, "GET OLD MESSAGES");

          setMessages(data?.text);
        } catch (err) {
          toast.error("Server Error");
        }
      })();
    }
  }, [activeChat]);

  useEffect(() => {
    const handlePrivateMessage = (message) => {
      console.log(message, message?.userId === activeChat?.name, "message");
      if (message?.userId === activeChat?.name) {
        setMessages((prevMessages) => [...prevMessages, { ...message }]);
      }
    };
    socket.on("private-message", handlePrivateMessage);

    return () => {
      socket.off("private-message", handlePrivateMessage);
    };
  }, [socket, activeChat]);
  return (
    <div
      className={` basis-[100%] md:basis-[68%] rounded-lg overflow-hidden md:block`}
    >
      <ChatWithCustomer
        activeChat={activeChat}
        setActiveChat={setActiveChat}
        setShow={setShow}
        removeUser={removeUser}
        chatEnd={chatEnd}
        messages={messages}
        setMessages={setMessages}
      />
    </div>
  );
};

export default RightSidebar;