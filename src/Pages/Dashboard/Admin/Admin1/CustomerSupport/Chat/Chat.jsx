import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AuthContext } from "../../../../../../AuthProvider/AuthProvider";
import socket from "../../../../../Common/socket";
import ConnectedCustomers from "./ConnectedCustomers";
import RightSidebar from "./RightSidebar";

const Chat = () => {
  const { userInfoFromLocalStorage } = useContext(AuthContext);
  const [activeChat, setActiveChat] = useState(null);
  const [show, setShow] = useState(false);

  useEffect(() => {}, [activeChat]);

  useEffect(() => {
    socket.emit("login", {
      id: userInfoFromLocalStorage()?.role?.toLowerCase(),
    });
  }, [socket]);

  const chatEnd = async (id) => {
    console.log(id, "id");
    try {
      const { data } = await axios.patch(
        `https://residential-building.onrender.com/messageRequest?update=${JSON.stringify(
          {
            id,
            action: "chatEnd",
          }
        )}`
      );

      if (data.acknowledged) {
        toast.success("Chat removed");
      }
    } catch (err) {
      toast.error("Server Error");
    }
  };
  const removeUser = async (id) => {
    console.log(id, "ID");

    try {
      const { data } = await axios.delete(
        `https://residential-building.onrender.com/messageRequest?id=${id}`
      );

      if (data.acknowledged) {
        toast.success("Chat removed");

        setActiveChat(null);
      }
    } catch (err) {
      toast.error("Server Error");
    }
  };

  function leftSideBar(setActiveChat, setShow) {
    return (
      <div
        className={` basis-[100%] md:basis-[30%] rounded-lg bg-[#7871e1] md:block overflow-hidden overflow-y-auto`}
      >
        <ConnectedCustomers setActiveChat={setActiveChat} setShow={setShow} />
      </div>
    );
  }

  // function rightSideBar(activeChat, setShow, removeUser) {
  //   const [messages, setMessages] = useState([]);
  //   useEffect(() => {
  //     if (activeChat) {
  //       (async function () {
  //         try {
  //           const { data } = await axios.get(
  //             `https://residential-building.onrender.com/messages?id=${activeChat?._id}`
  //           );

  //           console.log(data, "GET OLD MESSAGES");

  //           setMessages(data?.text);
  //         } catch (err) {
  //           toast.error("Server Error");
  //         }
  //       })();
  //     }
  //   }, []);

  //   useEffect(() => {
  //     socket.on("private-message", (message) => {
  //       console.log(message, message?.userId === activeChat?.name, "message");
  //       if (message?.userId === activeChat?.name) {
  //         setMessages((prevMessages) => {
  //           return [...prevMessages, { ...message }];
  //         });
  //       }
  //     });
  //   }, [socket]);

  //   return (
  //     <div
  //       className={` basis-[100%] md:basis-[68%] rounded-lg overflow-hidden md:block`}
  //     >
  //       <ChatWithCustomer
  //         activeChat={activeChat}
  //         setActiveChat={setActiveChat}
  //         setShow={setShow}
  //         removeUser={removeUser}
  //         chatEnd={chatEnd}
  //         messages={messages}
  //         setMessages={setMessages}
  //       />
  //     </div>
  //   );
  // }

  return (
    <>
      <div className="md:hidden flex justify-between flex-wrap h-[calc(100vh-18vh)] overflow-hidden rounded-lg">
        {/* left sidebar  */}
        {!show && leftSideBar(setActiveChat, setShow)}
        {/* right sidebar  */}
        {/* {show && rightSideBar(activeChat, setShow, removeUser, chatEnd)} */}
        {show && (
          <RightSidebar
            activeChat={activeChat}
            setActiveChat={setActiveChat}
            setShow={setShow}
            removeUser={removeUser}
            chatEnd={chatEnd}
          />
        )}
      </div>

      <div className="hidden md:flex justify-between flex-wrap h-[calc(100vh-18vh)] overflow-hidden rounded-lg">
        {/* left sidebar  */}
        {leftSideBar(setActiveChat, setShow)}
        {/* right sidebar  */}
        {/* {rightSideBar(activeChat, setShow, removeUser, chatEnd)} */}
        <RightSidebar
          activeChat={activeChat}
          setActiveChat={setActiveChat}
          setShow={setShow}
          removeUser={removeUser}
          chatEnd={chatEnd}
        />
      </div>
    </>
  );
};

export default Chat;
