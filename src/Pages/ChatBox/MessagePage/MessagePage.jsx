import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { CiStar } from "react-icons/ci";
import { IoMdStar } from "react-icons/io";
import { MdSend } from "react-icons/md";
import chatAvatarImg from "../../../assets/images/chat.png";
import curveLogo from "../../../assets/images/curveLogo.png";
import customerImg from "../../../assets/images/customer-service.png";
import lineSvg from "../../../assets/images/line.svg";
import stairLikeLine from "../../../assets/images/stairLikeLine.png";
import triangle from "../../../assets/images/triangle.png";
import socket from "../../Common/socket";
import TextEditor from "../../Components/TextEditor";

const MessagePage = ({ props }) => {
  const {
    setUserInfo,
    setRequestSent,
    userInfo,
    requestSent,
    setRemoveChatUser,
  } = props;
  const [timeEnd, setTimeEnd] = useState(false);
  const [checkUpdateData, setCheckUpdateData] = useState({});
  const [error, setError] = useState("");
  const [isAccepted, setIsAccepted] = useState(false);
  const [isChatEnd, setIsChatEnd] = useState(0);
  const [receiverId, setReceiverId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editorContent, setEditorContent] = useState(null);
  const [queryLoading, setQueryLoading] = useState(false);
  const [queryErrorMessage, setQueryErrorMessage] = useState("");
  const [wantToLeaveMessage, setWantToLeaveMessage] = useState(false);
  const { register, errors, handleSubmit, resetField } = useForm();
  console.log(userInfo, "Userinfo");

  useEffect(() => {
    setRemoveChatUser(userInfo);
  }, []);

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

  useEffect(() => {
    socket.emit("login", {
      id: `Help-${userInfo?.name}-${userInfo?.mobileNo}`,
    });
  }, [socket]);

  useEffect(() => {
    socket.on("private-message", (message) => {
      setMessages((prevMessages) => [...prevMessages, { ...message }]);
    });

    return () => {
      // Clean up event listeners on component unmount
      socket.off("private-message");
      setEditorContent(null);
    };
  }, [socket]);

  useEffect(() => {
    !timeEnd &&
      socket.on("check-accept-message", (data) => {
        // Handle the new data received from the server
        console.log(data, "Data");

        console.log(userInfo, "Userinfo");
        if (
          data?.change?.updateDescription?.updatedFields?.isAccepted &&
          userInfo?.uniqueId === data?.change?.documentKey?._id
        ) {
          setCheckUpdateData(data);
          setIsAccepted(true);
          setReceiverId(
            data?.change?.updateDescription?.updatedFields?.acceptedBy
          );
          setTimeout(true);
          // clearInterval(countDownInterval);
          // axios.patch(
          //   `https://residential-building.onrender.com/messageRequest?update=${JSON.stringify({
          //     id: userInfo.uniqueId,
          //     senderId: data.senderId,
          //     action: "sendId",
          //   })}`
          // );
        }
      });

    return () => {
      // Clean up event listeners on component unmount
      socket.off("check-accept-message");
    };
  }, [socket, timeEnd]);

  useEffect(() => {
    socket.on("check-accept-message", (data) => {
      // Handle the new data received from the server
      console.log(data, "Data");

      console.log(userInfo, "Userinfo");

      if (
        data?.change?.updateDescription?.updatedFields?.chatEnd === 1 &&
        userInfo?.uniqueId === data?.change?.documentKey?._id
      ) {
        setIsChatEnd(1);
      }

      if (
        data?.change?.operationType === "delete" &&
        userInfo?.uniqueId === data?.change?.documentKey?._id
      ) {
        setRequestSent(false);
      }
    });
  }, [socket]);

  // useEffect(() => {
  //   // Listen for private messages
  //   socket.on("private-message", ({ from, message }) => {
  //     setMessages((prevMessages) => [...prevMessages, { from, message }]);
  //   });

  //   // Handle errors for private messages (e.g., friend not online)
  //   socket.on("private-message-error", ({ to, message }) => {
  //     console.log(`Error sending message to ${to}: ${message}`);
  //   });

  //   return () => {
  //     // Clean up event listeners on component unmount
  //     socket.off("private-message");
  //     socket.off("private-message-error");
  //   };
  // }, [socket]);

  const [counter, setCounter] = useState(10);

  useEffect(() => {
    const countDownInterval = setInterval(() => {
      if (counter > 0) {
        setCounter((prevCounter) => prevCounter - 1);
      }
    }, 1000);

    if (isAccepted) {
      clearInterval(countDownInterval);
    }

    // Cleanup function to clear the interval when the component is unmounted
    return () => {
      clearInterval(countDownInterval);
    };
  }, [counter, isAccepted]);

  useEffect(() => {
    if (counter === 0) {
      setTimeEnd(true);
      socket.off("check-accept-message");
      console.log("Counter inside");
      fetch(
        `https://residential-building.onrender.com/messageRequest?update=${JSON.stringify(
          {
            id: userInfo.uniqueId,
            action: "timeUp",
          }
        )}`,
        {
          method: "PATCH",
        }
      )
        .then((res) => res.json())
        .then((result) => {
          console.log(result, "result");
        })
        .catch((err) => {
          toast.error("Server Error");
          setError("Server Error");
        });
    }
  }, [counter]);

  console.log(isAccepted, "HELLO");

  const requestAgain = async () => {
    // clearInterval(countDownInterval);
    setLoading(true);
    try {
      const { data } = await axios.patch(
        `https://residential-building.onrender.com/messageRequest?update=${JSON.stringify(
          {
            id: userInfo.uniqueId,
            action: "requestAgain",
          }
        )}`
      );

      console.log(data, "UPDATE REQ");

      if (data.acknowledged) {
        setCounter(30);
        setTimeEnd(false);
        setCheckUpdateData({});
        setError("");
        setIsAccepted(false);
        socket.on("check-accept-message");
      }
    } catch (error) {
      setError("Server Error");
    }
    setLoading(false);
  };

  const onSubmit = async (data) => {
    console.log(data);

    const messageData = {
      userId: userInfo?.name,
      message: data?.message,
    };

    console.log(receiverId, "Receiver id");

    socket.emit("private-message", {
      to: receiverId,
      message: { ...messageData },
    });
    setMessages((prevMessages) => [...prevMessages, { ...messageData }]);
    await axios.patch(
      `https://residential-building.onrender.com/messageRequest?update=${JSON.stringify(
        {
          id: userInfo.uniqueId,
          action: "text",
          message: { userId: userInfo?.name, message: messageData?.message },
        }
      )}`
    );

    resetField("message");
  };

  const leaveMessage = async () => {
    console.log(editorContent, editorContent === "<p><br></p>");
    setQueryErrorMessage("");
    if (
      editorContent === "<p><br></p>" ||
      editorContent?.length === 0 ||
      editorContent === null
    ) {
      toast.error("Please enter your queries");
      setQueryErrorMessage("Please Enter Your Queries");
    } else {
      setQueryLoading(true);

      try {
        const { data } = await axios.patch(
          `https://residential-building.onrender.com/messageRequest?update=${JSON.stringify(
            {
              id: userInfo.uniqueId,
              message: editorContent,
              action: "leaveMessage",
            }
          )}`
        );

        if (data?.acknowledged) {
          toast.success("Your message sent");
          setRequestSent(false);
        }
      } catch (err) {
        toast.error("Server Failed");
      }
      setQueryLoading(false);
    }
  };

  return (
    <div className="h-full overflow-hidden rounded-md relative">
      {/* if admin accept message request then show message page
      if not accepted by the admin, then
      1. if click on leave message button then show message page
      2. if click on request again then show another page */}
      {!isAccepted ? (
        !wantToLeaveMessage ? (
          <>
            <div className="message-box h-full flex flex-col justify-center items-center">
              <div className="flex flex-col justify-center items-center gap-3">
                <div className="text-[22px] font-bold text-normalViolet absolute top-5 left-2 rotate-3">
                  {/* Bobbili Urban Development Authority */}
                  <img
                    src={curveLogo}
                    alt="A curved logo"
                    className="object-fit"
                  />
                </div>
                <div className="h-[150px]">
                  <img
                    src={chatAvatarImg}
                    alt="An image of avatar"
                    className="h-full"
                  />
                </div>
              </div>
              {timeEnd && (
                <div className="flex flex-col justify-center items-center gap-2 mt-3">
                  <p className="font-bold text-lg text-black">
                    Sorry. No one received.
                  </p>

                  {loading ? (
                    <span className="loading loading-dots loading-lg text-normalViolet"></span>
                  ) : (
                    <div className="flex flex-col w-full border-opacity-50">
                      <button
                        className="bg-normalViolet text-white fancy-button mt-4 w-fit"
                        onClick={() => setWantToLeaveMessage(true)}
                      >
                        Leave a reply
                      </button>

                      <div className="divider">OR</div>

                      <button
                        className="bg-normalViolet text-white fancy-button  w-fit"
                        onClick={requestAgain}
                      >
                        Request Again
                      </button>

                      {/* modal of leave a message  */}
                      {/* <dialog
                    id="leaveMessage"
                    className="modal absolute top-0 left-0 overflow-hidden"
                  >
                    <div className="modal-box w-11/12 message-bg">
                      <div className="flex flex-col justify-center items-center ">
                        <div className="h-20">
                          <img
                            src={customerImg}
                            alt="Customer avatar"
                            className="h-full object-cover"
                          />
                        </div>
                        <div className="text-center">
                          <p className="text-xl font-bold text-normalViolet capitalize">
                            {userInfo?.name}
                          </p>
                          <p className="text-black font-bold font-mono text-base">
                            {userInfo?.mobileNo}
                          </p>
                        </div>
                      </div>
                      <div className="w-full h-full my-4 overflow-hidden">
                        <div className="indicator my-2">
                          <span className="indicator-item badge badge-xs text-red-500 bg-[#FFFFFF]">
                            <IoMdStar />
                          </span>
                          <label
                            htmlFor="mobile"
                            className="inline-block font-bold"
                          >
                            Your Queries
                          </label>
                        </div>

                        <div className="z-[100] rounded-lg ">
                          <TextEditor
                            editorContent={editorContent}
                            setEditorContent={setEditorContent}
                            extraOptions={{ autofocus: true }}
                          />
                        </div>
                        {queryErrorMessage?.length !== 0 && (
                          <p className="text-red-500 font-bold text-center">
                            {queryErrorMessage}
                          </p>
                        )}
                      </div>
                      <div className="modal-action">
                        {queryLoading ? (
                          <div className="w-full flex justify-center items-center">
                            <span className=" loading loading-dots loading-lg text-normalViolet"></span>
                          </div>
                        ) : (
                          <>
                            <button
                              className="btn fancy-button text-white"
                              onClick={leaveMessage}
                            >
                              Submit
                            </button>
                            <form method="dialog">
                             

                              <button
                                className="btn btn-neutral save-btn font-bold text-base hover:scale-105"
                                onClick={() => {
                                  setEditorContent(null);
                                  setQueryErrorMessage("");
                                }}
                              >
                                Close
                              </button>
                            </form>
                          </>
                        )}
                      </div>
                    </div>
                  </dialog> */}
                    </div>
                  )}
                </div>
              )}{" "}
              {!timeEnd && (
                <div className="flex flex-col justify-center items-center">
                  <span
                    id="counterElement"
                    className={`${
                      counter < 15 ? "text-red-500" : "text-normalViolet"
                    } text-black text-xl font-bold inline-block`}
                    style={{ "--value": counter }}
                  >
                    {counter}
                  </span>
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-bold font-poppins">
                      <span className="text-warning">Please wait.</span>{" "}
                      <span className="text-normalViolet">Connecting</span>
                    </p>
                    <span className="loading loading-dots loading-lg text-normalViolet"></span>
                  </div>
                </div>
              )}
            </div>
            <>
              <div className="absolute flex justify-center items-center text-white h-10 w-10 rounded-full bg-violet-400 bottom-5 left-10 nm_Container">
                {" "}
                <CiStar size={30} />
              </div>
              <div className="absolute flex justify-center items-center text-white h-10 w-10  rounded-full bg-violet-400 top-5 right-5 nm_Container">
                <CiStar size={30} />
              </div>
            </>
          </>
        ) : (
          <div className="w-full h-full relative ">
            <div className="flex flex-col justify-center items-center pt-3">
              <div className="h-20">
                <img
                  src={customerImg}
                  alt="Customer avatar"
                  className="h-full object-cover"
                />
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-normalViolet capitalize">
                  {userInfo?.name}
                </p>
                <p className="text-black font-bold font-mono text-base">
                  {userInfo?.mobileNo}
                </p>
              </div>
            </div>
            <div className="w-full my-4 overflow-hidden">
              <div className="indicator my-2 ml-2">
                <span className="indicator-item badge badge-xs text-red-500 bg-[#FFFFFF]">
                  <IoMdStar />
                </span>
                <label htmlFor="mobile" className="inline-block font-bold">
                  Your Queries
                </label>
              </div>

              <div className="z-[100] rounded-lg overflow-hidden">
                <TextEditor
                  editorContent={editorContent}
                  setEditorContent={setEditorContent}
                  extraOptions={{ autofocus: true }}
                />
              </div>
              {queryErrorMessage?.length !== 0 && (
                <p className="text-red-500 font-bold text-center">
                  {queryErrorMessage}
                </p>
              )}
            </div>
            <div className="flex justify-center items-center">
              {queryLoading ? (
                <div className="w-full flex justify-center items-center">
                  <span className=" loading loading-dots loading-lg text-normalViolet"></span>
                </div>
              ) : (
                <button
                  className="btn fancy-button text-white"
                  onClick={leaveMessage}
                >
                  Submit
                </button>
              )}
            </div>

            {/* design pattern  */}
            <div className="absolute w-6 h-6 rounded-full -top-2 left-2/3 bg-blue-400 bg-gradient-to-r from-[#FF2967] to-[#ffab40]"></div>

            <div className="absolute w-12 h-12 rounded-full top-[18%] -right-4 bg-white border-4 border-[#7945C5]"></div>

            <div className="absolute w-8 h-8 rounded-full bottom-[12%] -left-4 bg-gradient-to-br from-[#6e3bba] to-[#b478ff]"></div>
            <div className="absolute w-10 h-10 rounded-full bottom-[10%s] -right-4 bg-gradient-to-tr from-[#ffb23c] to-[#ffc935]"></div>

            <div className=" absolute w-24 h-24 top-0 left-0 -rotate-90">
              <img src={triangle} alt="A triangle image" />
            </div>
            {/* stair like line  */}
            <div className=" absolute w-28 h-28 bottom-0 -left-14 rotate-[170deg]">
              <img src={stairLikeLine} alt="A stair like line image" />
            </div>
            {/* // shape line draw */}
            <div className="absolute -bottom-16 -right-10 w-36 h-36">
              <img src={lineSvg} alt="svg image" />
            </div>
          </div>
        )
      ) : (
        <div className="h-full bg-[#c9c0fd] flex flex-col justify-between">
          {/* upper part  */}
          <div className="bg-normalViolet h-[10vh] w-full items-center flex gap-3">
            <div className="h-full">
              <img
                src={chatAvatarImg}
                alt="customer support user avatar image"
                className="h-full object-cover"
              />
            </div>
            <div className="flex flex-col justify-center ">
              <p className="font-bold text-white text-lg">
                Bobbili Urban Development Authority
              </p>
              <span className="text-white font-bold text-xs">
                Customer Support
              </span>
            </div>
          </div>

          {/* message box part  */}

          <div className="flex-1 message-bg  overflow-y-auto" ref={messagesRef}>
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
                      <span className="flex justify-end">Admin</span>
                    ) : (
                      <span className="flex justify-start">You</span>
                    )}
                  </div>
                  <p
                    className={`${
                      message?.userId?.includes("admin")
                        ? "bg-[#8B5BF6] font-bold text-white rounded-xl"
                        : "bg-white rounded-xl"
                    } p-3  max-w-[500px]`}
                  >
                    {message?.message}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* input boxes */}
          {!isChatEnd ? (
            <form
              className="flex justify-between items-center"
              onSubmit={handleSubmit(onSubmit)}
            >
              <input
                className="input input-bordered rounded-none focus:outline-none bg-white  flex-1"
                type="text"
                placeholder="Type your message"
                {...register("message", { required: true })}
              />
              <button
                type="submit"
                className="bg-normalViolet text-white p-3 border-none fancy-button mr-[2px]"
              >
                <MdSend size={20} />
              </button>
            </form>
          ) : (
            <div className="bg-[#7871e1] p-4 text-center font-bold text-white">
              Your chat is End
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MessagePage;
