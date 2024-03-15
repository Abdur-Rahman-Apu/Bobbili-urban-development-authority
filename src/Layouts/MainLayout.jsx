import axios from "axios";
import React, { useEffect, useState } from "react";
import { AiFillMessage, AiOutlineHome } from "react-icons/ai";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import { MdOutlineDashboard } from "react-icons/md";
import { Link, Outlet, useLocation } from "react-router-dom";
import ParticleBg from "../Pages/Components/ParticleBg";

import toast from "react-hot-toast";
import { FaUsers } from "react-icons/fa6";
import ChatBox from "../Pages/Shared/ChatBox";

const MainLayout = () => {
  const path = useLocation()?.pathname;

  const [removeChatUser, setRemoveChatUser] = useState(null);
  const [visitorCount, setVisitorCount] = useState(0);

  // get total visitor number
  useEffect(() => {
    fetch("http://localhost:5000/getVisitorCount")
      .then((res) => res.json())
      .then((result) => {
        console.log(result, "result");
        setVisitorCount(result[0]?.count);
      })
      .catch((err) => {
        toast.error("Server Error");
      });
  }, []);

  console.log(path);
  const active =
    "bg-[#8B5BF6] shadow-md shadow-violetDark text-white border-none ";

  const notActive =
    "hover:bg-normalViolet text-[#8B5BF6] hover:text-white border border-violetLight";

  const gradientColor =
    "font-bold bg-gradient-to-r from-violet-500 to-fuchsia-500";

  const [theme, setTheme] = useState(localStorage.getItem("theme"));

  useEffect(() => {
    // console.log("theme" in localStorage);

    if (
      theme === "dark" ||
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.add("dark:bg-black");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.remove("dark:bg-black");
      localStorage.setItem("theme", "light");

      // console.log(theme);
    }

    return () => {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.remove("dark:bg-black");
      localStorage.setItem("theme", "light");
    };
  }, [theme]);

  const [toggleChat, setToggleChat] = useState(false);

  return (
    <>
      {/* particle  */}

      <div className="px-10 min-h-screen z-[10] bg-[#E8EAEC] relative">
        {!path.includes("/statistics") && <ParticleBg />}
        {/* upper part  */}
        <div className="py-3 flex-col lg:flex-row flex justify-between items-center z-[10]">
          <div className="basis-3/4 z-[10] pt-2">
            <p
              // className="css-3d-text w-fit p-2 text-4xl text-gray-600 font-bold font-sofadi"
              className="w-fit italic tracking-wider p-2 text-5xl font-bold font-titleFont text-black"
            >
              Bobbili Urban Development Authority
            </p>
            <p
              // className={`css-3d-text w-fit p-2 text-2xl text-gray-600 font-bold font-sofadi`}
              className={`w-fit px-2 tracking-wider italic text-3xl text-gray-600 font-bold font-titleFont `}
            >
              Residential Building Plan Approval System
            </p>
          </div>

          <div className="basis-[20%] mt-7 lg:mt-0 z-[10] flex justify-end items-center space-x-6 dark:text-black">
            <Link
              to="/"
              className={`nm_Container w-12 h-12 cursor-pointer transition-all duration-700 border  rounded-full flex justify-center items-center  ${
                path === "/" ||
                path === "/onlinePayment" ||
                path === "/listOfLTP" ||
                path === "/demoVideos" ||
                path === "/privacyPolicy" ||
                path === "/defaultDrawingFormat"
                  ? active
                  : ` ${notActive}`
              }`}
            >
              <AiOutlineHome size={25} className="text-2xl " />
            </Link>
            <Link
              to="/statistics"
              className={`nm_Container w-12 h-12 cursor-pointer transition-all duration-700 border rounded-full flex justify-center items-center ${
                path.includes("/statistics") ? active : ` ${notActive}`
              }`}
            >
              <MdOutlineDashboard size={25} className="text-2xl" />
            </Link>

            {/* <div className="cursor-pointer">
            {theme === "dark" ? (
              <FiSun
                size={25}
                onClick={() => setTheme("light")}
                className="dark:text-white"
              />
            ) : (
              <MdOutlineDarkMode
                size={25}
                onClick={() => setTheme("dark")}
                className=""
              />
            )}
          </div> */}
          </div>
        </div>

        {/* lower part  */}
        <Outlet />

        <p className="z-[10] text-black  mt-5 text-xl relative font-bold italic hidden 2xl:flex justify-center items-center gap-2 font-titleFont">
          {`Total visitors - ${visitorCount}`}
          <FaUsers size={20} />
        </p>
        <div
          className="chatbox-wrapper"
          onClick={async () => {
            setToggleChat(!toggleChat);
            console.log(removeChatUser, "Remove chat user");
            console.log(toggleChat, "toggleChat");
            if (removeChatUser && toggleChat) {
              console.log("ASCHI REMOVE KORTE");
              try {
                await axios.patch(
                  `http://localhost:5000/messageRequest?update=${JSON.stringify(
                    {
                      id: removeChatUser.uniqueId,
                      action: "leaveFromTheMessage",
                    }
                  )}`
                );
              } catch (err) {
                console.log(err, "Error message");
                toast.error("Server Error");
              }
            }
            setRemoveChatUser(null);
          }}
        >
          <div className="chatbox-toggle">
            {toggleChat ? (
              <IoIosArrowDropdownCircle size={36} />
            ) : (
              <AiFillMessage size={33} />
            )}
          </div>
        </div>

        {toggleChat && (
          <div className="fixed border-2 border-[#8B5BF6] shadow-lg bottom-[70px] right-8 z-10 h-[86vh] w-[400px] bg-white rounded-lg hover:transform hover:translate-y-[-5px] hover:scale-[1.005] hover:translate-z-0 transition-all duration-500 ease-out">
            <ChatBox setRemoveChatUser={setRemoveChatUser} />
          </div>
        )}
      </div>
    </>
  );
};

export default MainLayout;
