import axios from "axios";
import React, { useEffect, useState } from "react";
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
  const [error, setError] = useState("");
  useEffect(() => {
    if (activeChat) {
      setError("");
      (async function () {
        try {
          const { data } = await axios.get(
            `http://localhost:5000/messages?id=${activeChat?._id}`
          );

          console.log(data, "GET OLD MESSAGES");

          setMessages(data?.text);
        } catch (err) {
          toast.error("Server Error");
          setError("Server Error");
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
      {error?.length !== 0 ? (
        <p>Error</p>
      ) : (
        <ChatWithCustomer
          activeChat={activeChat}
          setActiveChat={setActiveChat}
          setShow={setShow}
          removeUser={removeUser}
          chatEnd={chatEnd}
          messages={messages}
          setMessages={setMessages}
        />
      )}
    </div>
  );
};

export default RightSidebar;
