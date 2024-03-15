import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaUsers } from "react-icons/fa";
import { IoHappySharp } from "react-icons/io5";
import { AuthContext } from "../../../../../../AuthProvider/AuthProvider";
import femaleImg from "../../../../../../assets/images/female.png";
import maleImg from "../../../../../../assets/images/male.png";
import unknownImg from "../../../../../../assets/images/unknown.png";
import socket from "../../../../../Common/socket";

const ConnectedCustomers = ({ setActiveChat, setShow }) => {
  const { userInfoFromLocalStorage } = useContext(AuthContext);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [checkNewMessage, setCheckNewMessage] = useState([]);

  useEffect(() => {
    const handleCheckAcceptMessage = async (data) => {
      // Your existing logic here
      if (
        (data?.change?.operationType === "update" &&
          data?.change?.updateDescription?.updatedFields?.chatEnd === 1) ||
        (data?.change?.operationType === "update" &&
          data?.change?.updateDescription?.updatedFields?.isAccepted === 1) ||
        (data?.change?.operationType === "update" &&
          data?.change?.updateDescription?.updatedFields
            ?.newTextFromCustomer) ||
        data?.change?.operationType === "delete"
      ) {
        try {
          const { data: updateData } = await axios.get(
            `http://localhost:5000/acceptMessage?role=${JSON.stringify(
              userInfoFromLocalStorage().role.toLowerCase()
            )}`
          );

          console.log(updateData, "connected user update");

          setConnectedUsers(updateData);
        } catch (err) {
          toast.error("Server Error");
        }
      }
    };
    socket.on("check-accept-message", handleCheckAcceptMessage);
  }, [socket]);

  useEffect(() => {}, [connectedUsers]);

  useEffect(() => {
    (async function () {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/acceptMessage?role=${JSON.stringify(
            userInfoFromLocalStorage().role.toLowerCase()
          )}`
        );

        console.log(data, "data");
        setConnectedUsers(data);
        // const extractUserMessage = data?.map((eachOne) => {
        //   console.log(eachOne, "Each one extrach message");
        //   const newText = eachOne?.text
        //     ?.filter((text) => {
        //       if (!text?.userId?.includes("admin")) {
        //         if (text?.message?.length) {
        //           return text?.message;
        //         }
        //       }
        //     })
        //     ?.map((eachText) => eachText?.message);
        //   return {
        //     id: eachOne._id,
        //     name: eachOne?.name,
        //     prevText: [],
        //     newText,
        //   };
        // });
        // console.log(extractUserMessage, "Extract user message");
        // setCheckNewMessage(extractUserMessage);
      } catch (err) {
        console.log(err, "ERROR MESSAGE");
        toast.error("Server Error");
      }
    })();
  }, []);

  const messageSeen = async (id) => {
    try {
      await axios.patch(
        `http://localhost:5000/messageRequest?update=${JSON.stringify({
          id,
          action: "trackCustomerNewMessage",
        })}`
      );
    } catch (err) {
      console.log(err, "Error message");
      toast.error("Server Error");
    }
  };

  console.log(connectedUsers, "Connected users");
  console.log(checkNewMessage, "Check new message");
  return (
    <div className="h-full p-3 nm_Container">
      <p className="capitalize text-lg font-bold font-roboto flex justify-center items-center gap-4 text-white">
        <FaUsers size={20} /> Connected users
      </p>
      <div className="h-[90%] overflow-y-auto no-scrollbar">
        {connectedUsers?.length === 0 ? (
          <div className="h-full flex flex-col justify-center items-center font-bold text-white text-lg capitalize gap-3">
            <IoHappySharp size={35} />
            <p>YAH!</p>
            <p>NO ONE CONNECTED YET</p>
          </div>
        ) : (
          <div className="">
            {connectedUsers?.map((user) => (
              <div
                key={user._id}
                className="flex items-center bg-white rounded-2xl gap-3 my-3 cursor-pointer"
                onClick={() => {
                  if (user?.newTextFromCustomer?.length) {
                    messageSeen(user?._id);
                  }
                  setActiveChat(user);
                  setShow((prev) => !prev);
                }}
              >
                <div className="h-16">
                  <img
                    className="h-full"
                    src={
                      (user.gender === "male" && maleImg) ||
                      (user.gender === "female" && femaleImg) ||
                      (user.gender === null && unknownImg)
                    }
                    alt="user avatar"
                  />
                </div>
                <div>
                  <p className="font-bold text-base">{user.name}</p>
                  <p className="text-gray-500">{user?.mobile}</p>
                </div>

                {user?.newTextFromCustomer?.length !== 0 && (
                  <div className="badge bg-[#7871e1] ml-auto mr-4 text-white font-bold">
                    {user?.newTextFromCustomer?.length}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConnectedCustomers;
