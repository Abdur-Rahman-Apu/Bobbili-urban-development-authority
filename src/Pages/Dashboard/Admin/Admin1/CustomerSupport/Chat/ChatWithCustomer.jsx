import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { IoMdArrowBack } from "react-icons/io";
import { IoRemoveCircleSharp } from "react-icons/io5";
import { MdMenu, MdOutlineCancelScheduleSend, MdSend } from "react-icons/md";
import { AuthContext } from "../../../../../../AuthProvider/AuthProvider";
import femaleImg from "../../../../../../assets/images/female.png";
import maleImg from "../../../../../../assets/images/male.png";
import unknownImg from "../../../../../../assets/images/unknown.png";
import socket from "../../../../../Common/socket";

const ChatWithCustomer = ({
  activeChat,
  setActiveChat,
  setShow,
  removeUser,
  chatEnd,
  messages,
  setMessages,
}) => {
  console.log(activeChat, "c");
  const { userInfoFromLocalStorage } = useContext(AuthContext);
  const [connectionStatus, setConnectionStatus] = useState(true);
  const [userLeft, setUserLeft] = useState(false);
  const messagesRef = useRef(null);

  useEffect(() => {
    // Scroll to the bottom when messages change
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    // Scroll to the bottom of the messages container
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  };

  const { register, errors, handleSubmit, resetField } = useForm();

  console.log(userLeft, "userLeft");

  useEffect(() => {
    socket.emit("check-connection", { id: activeChat?.userId });

    socket.on("connection-status", (status) => {
      console.log(status, "Status");
      setConnectionStatus(status);
    });

    const handleCheckLeave = async (data) => {
      // Your existing logic here
      if (data?.change?.updateDescription?.updatedFields?.leave) {
        // activeChat?.leave=true;
        console.log(
          data?.change?.updateDescription?.updatedFields?.leave,
          "LEAVE OF ACTIVE CHAT"
        );
        console.log(activeChat, "Active chat");
        setActiveChat((prev) => {
          const newData = { ...prev };
          newData.leave = data?.change?.updateDescription?.updatedFields?.leave;
          console.log(newData, "prev");
          return newData;
        });
      }
    };

    socket.on("check-accept-message", handleCheckLeave);
  }, [socket]);

  useEffect(() => {
    console.log(activeChat, "USER LEAVE MESSAGE");

    setUserLeft(activeChat?.leave);
  }, [userLeft, activeChat]);

  const onSubmit = async (data) => {
    console.log(data);

    const messageData = {
      userId: userInfoFromLocalStorage()?.role?.toLowerCase(),
      message: data?.message,
    };

    socket.emit("private-message", {
      to: activeChat?.userId,
      message: messageData,
    });
    setMessages((prevMessages) => [...prevMessages, { ...messageData }]);

    await axios.patch(
      `https://residential-building.onrender.com/messageRequest?update=${JSON.stringify(
        {
          id: activeChat?._id,
          action: "text",
          message: {
            userId: userInfoFromLocalStorage()?.role?.toLowerCase(),
            message: messageData?.message,
          },
        }
      )}`
    );

    resetField("message");
  };

  console.log(messages, "CHECK ALL MESSAGES");

  return (
    <>
      {activeChat !== null ? (
        <div className="flex flex-col">
          {/* header part  */}
          <div className="bg-[#7871e1] h-16 flex items-center gap-3 px-4">
            {/* arrow icon to hide  */}
            <IoMdArrowBack
              size={25}
              className="md:hidden text-white"
              onClick={() => setShow((prev) => !prev)}
            />

            {/* user info  */}
            <div className="flex items-center gap-3 flex-1 h-full">
              {/* image  */}
              <div className="h-full">
                <img
                  src={
                    (activeChat.gender === "male" && maleImg) ||
                    (activeChat.gender === "female" && femaleImg) ||
                    (activeChat.gender === null && unknownImg)
                  }
                  alt="user avatar image"
                  className="h-full"
                />
              </div>
              {/* user info  */}
              <div>
                <p className="text-xl font-bold text-white">
                  {activeChat.name}
                </p>
                <p className="text-white text-sm">
                  {connectionStatus ? "Online" : "Offline"}
                </p>
              </div>
            </div>

            {/* menubar */}
            <div className="dropdown dropdown-end dropdown-hover">
              <div tabIndex={0} role="button" className="text-white m-1">
                <MdMenu size={30} />
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content z-[1] menu p-2 shadow bg-base-200 rounded-box w-32"
              >
                <li>
                  <button
                    className="flex items-center gap-2  text-normalViolet font-bold text-sm"
                    onClick={() => {
                      chatEnd(activeChat._id);
                      setActiveChat({ ...activeChat, chatEnd: 1 });
                    }}
                  >
                    Chat End
                    <MdOutlineCancelScheduleSend size={18} />
                  </button>
                </li>
                <li>
                  <button
                    className="flex items-center gap-2 text-red-500 font-bold text-sm"
                    onClick={() => {
                      removeUser(activeChat._id);
                    }}
                  >
                    Remove
                    <IoRemoveCircleSharp size={18} />
                  </button>
                </li>
              </ul>
            </div>
          </div>
          {/* message part  */}
          <div
            className="h-[calc(82vh-112px)] message-bg overflow-y-auto"
            ref={messagesRef}
          >
            <p className="mx-auto text-sm bg-[#8B5BF6] text-white w-fit font-bold mt-1 px-3 rounded-xl">
              Today
            </p>
            {messages?.map((message, index) => (
              <div
                key={index}
                className={`${
                  message?.userId?.includes("admin")
                    ? "justify-end"
                    : "justify-start"
                } flex m-3`}
              >
                <div>
                  <div className="text-sm font-bold capitalize mx-2">
                    {message?.userId?.includes("admin") ? (
                      <span className="flex justify-end">You</span>
                    ) : (
                      <span className="flex justify-start">
                        {message?.userId}
                      </span>
                    )}
                  </div>
                  <p
                    className={`${
                      message?.userId?.includes("admin")
                        ? "bg-[#7871e1] font-bold text-white rounded-xl"
                        : "bg-white rounded-xl"
                    } p-3 max-w-[500px] break-words`}
                  >
                    {message?.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
          {/* input boxes  */}

          {activeChat.chatEnd === 1 || activeChat?.leave === true ? (
            <>
              {activeChat.chatEnd === 1 && (
                <p className="bg-[#7871e1] p-3 text-center font-bold text-white">
                  You end your chat with this person
                </p>
              )}

              {console.log(userLeft, "USER LEFT")}
              {userLeft === true && (
                <p className="bg-[#7871e1] p-3 text-center font-bold text-white">
                  Customer left
                </p>
              )}
            </>
          ) : (
            <form
              className="flex justify-between items-center bg-gray-200"
              onSubmit={handleSubmit(onSubmit)}
            >
              <input
                className="input rounded-none focus:outline-none border-none bg-gray-200 flex-1"
                type="text"
                placeholder="Type your message here..."
                {...register("message", { required: true })}
              />
              <button
                type="submit"
                className="bg-normalViolet text-white p-3 border-none fancy-button mr-[2px]"
              >
                <MdSend size={20} />
              </button>
            </form>
          )}

          {console.log(activeChat.chatEnd, userLeft, "ACU")}
          {/* {(activeChat.chatEnd !== 1 || userLeft === false) && (
            <form
              className="flex justify-between items-center bg-gray-200"
              onSubmit={handleSubmit(onSubmit)}
            >
              <input
                className="input rounded-none focus:outline-none border-none bg-gray-200 flex-1"
                type="text"
                placeholder="Type your message here..."
                {...register("message", { required: true })}
              />
              <button
                type="submit"
                className="bg-normalViolet text-white p-3 border-none fancy-button mr-[2px]"
              >
                <MdSend size={20} />
              </button>
            </form>
          )} */}
        </div>
      ) : (
        <p className="flex justify-center items-center h-full text-2xl font-bold capitalize font-titleFont message-bg">
          Select user & start chat
        </p>
      )}
    </>
  );
};

export default ChatWithCustomer;
