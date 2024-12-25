import axios from "axios";
import React, { useEffect, useState } from "react";
import { AiFillMessage } from "react-icons/ai";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/images/home/logo2.jpg";

import toast from "react-hot-toast";
import { FaFilePdf, FaFileVideo, FaSearch } from "react-icons/fa";
import { FaUsers } from "react-icons/fa6";
import { IoHome, IoPersonSharp } from "react-icons/io5";
import { MdDashboard, MdOutlinePolicy, MdPayment } from "react-icons/md";
import ChatBox from "../Pages/Shared/ChatBox";
import { baseUrl } from "../utils/api";
import { getCookie } from "../utils/utils";

const MainLayout = () => {
  const path = useLocation()?.pathname;
  const navigate = useNavigate();

  const [toggleChat, setToggleChat] = useState(false);
  const [removeChatUser, setRemoveChatUser] = useState(null);
  const [visitorCount, setVisitorCount] = useState(0);
  const [theme, setTheme] = useState(localStorage.getItem("theme"));

  const isAuthExist = JSON.parse(getCookie("loggedUser"));

  // get total visitor number
  useEffect(() => {
    fetch(`${baseUrl}/visitorAmount`)
      .then((res) => res.json())
      .then((result) => {
        console.log(result, "result");
        setVisitorCount(result[0]?.count);
      })
      .catch((err) => {
        toast.error("Server Error");
      });
  }, []);

  // const active =
  //   "bg-normalViolet shadow-md shadow-violetDark text-white border-none ";

  const notActive =
    "hover:bg-normalViolet text-normalViolet hover:text-white border border-violetLight";

  useEffect(() => {
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
    }

    return () => {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.remove("dark:bg-black");
      localStorage.setItem("theme", "light");
    };
  }, [theme]);

  if (isAuthExist) {
    navigate("/dashboard");
  }

  const hoverGradientColor =
    "hover:bg-Primary hover:text-brown hover:font-bold";
  const active = "font-bold bg-Primary text-brown";
  // const active = "nm_Container font-bold bg-[#8B5BF6] text-white";

  const menu = (
    <>
      <Link
        to="/"
        type="button"
        className={`relative inline-flex gap-1 items-center w-full h-full px-2 py-2 text-base border-r-2 border-white text-white ${hoverGradientColor} ${
          path.length === 1 && path.includes("/") ? active : ""
        }`}
      >
        <IoHome />
        Home
      </Link>
      <Link
        to="/"
        type="button"
        className={`relative inline-flex gap-1 items-center w-full h-full px-4 py-2  text-base border-r-2 text-white border-white ${hoverGradientColor} ${
          path.length === 1 && path.includes("/") ? "" : ""
        }`}
      >
        <MdDashboard />
        Dashboard
      </Link>
      <Link
        to="/"
        type="button"
        className={`relative inline-flex gap-1 items-center w-full h-full px-4 py-2 text-base border-r-2 border-white  text-white ${hoverGradientColor} ${
          path.length === 1 && path.includes("/") ? "" : ""
        }`}
      >
        <FaSearch />
        App. Search
      </Link>
      <Link
        to="/onlinePayment"
        type="button"
        className={`relative inline-flex gap-1 items-center w-full h-full px-4 py-2 text-base border-r-2 border-white text-white ${hoverGradientColor} ${
          path.includes("onlinePayment") ? active : ""
        }`}
      >
        <MdPayment />
        Pay Online
      </Link>
      <Link
        to="/listOfLTP"
        type="button"
        className={`relative inline-flex gap-1 items-center w-full h-full px-4 py-2 text-base  border-r-2 border-white text-white ${hoverGradientColor} ${
          path.includes("listOfLTP") ? active : ""
        }`}
      >
        {/* <FaThList /> */}
        <IoPersonSharp />
        List of LTP's
      </Link>
      <Link
        to="/demoVideos"
        type="button"
        className={`relative inline-flex gap-1 items-center w-full h-full px-4 py-2 text-base border-r-2 border-white text-white ${hoverGradientColor} ${
          path.includes("demoVideos") ? active : ""
        }`}
      >
        <FaFileVideo />
        Demo Videos
      </Link>
      <Link
        to="/privacyPolicy"
        type="button"
        className={`relative inline-flex gap-1 items-center w-full h-full px-4 py-2 text-base  border-r-2 border-white text-white ${hoverGradientColor} ${
          path.includes("privacyPolicy") ? active : ""
        }`}
      >
        <MdOutlinePolicy />
        Privacy Policy
      </Link>
      <Link
        to="/defaultDrawingFormat"
        type="button"
        className={`relative inline-flex gap-1 items-center w-full h-full px-4 py-2 text-base border-r-2 border-white text-white ${hoverGradientColor} ${
          path.includes("defaultDrawingFormat") ? active : ""
        }`}
      >
        <FaFilePdf />
        Drawing Format
      </Link>
    </>
  );

  return (
    <>
      {/* particle  */}

      <div className="z-[10] relative">
        {/* {!path.includes("/statistics") && <ParticleBg />} */}
        {/* upper part  */}
        {/* <div className="py-3 flex-col lg:flex-row flex justify-between items-center z-[10]">
          <div className="basis-3/4 z-[10] pt-2">
            <p className="w-fit italic tracking-wider p-2 text-5xl font-bold font-titleFont text-black">
              Bobbili Urban Development Authority
            </p>
            <p
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
          </div>
        </div> */}
        <header className=" p-2 ">
          {/* <div>
            <figure className="flex items-center gap-2">
              <img
                src={CBNImg}
                alt="logo"
                width={80}
                className="rounded-full"
              />
              <figcaption>
                <strong>Sri Nara Chandrababu Naidu,</strong>
                <p>Hon'ble Chief Minister of AP.</p>
              </figcaption>
            </figure>
          </div> */}
          <div className="flex  flex-col flex-1 items-center gap-3">
            <div>
              <img src={logo} alt="logo" width={80} className="rounded-full" />
            </div>
            <div className="w-3/5 text-center">
              {/* text-[#008c33] text-[#f9900e]*/}
              <h1 className="font-poppins uppercase text-2xl font-bold  text-leaf">
                bobbili urban development authority
              </h1>
              <p lang="tel" className="mt-2 font-bold text-brown">
                బొబ్బిలి అర్బన్ డెవలప్‌మెంట్ అథారిటీ
              </p>
            </div>
            {/* <div>
              <img src={logo} alt="logo" width={80} className="rounded-full" />
            </div> */}
          </div>

          {/* <div>
            <figure className="flex flex-row-reverse items-center gap-2">
              <img
                src={pongurunarayanaImg}
                alt="logo"
                width={80}
                className="rounded-full"
              />
              <figcaption>
                <strong>Sri Ponguru Narayana,</strong>

                <p>Hon'ble Minister for MA&UD of AP.</p>
              </figcaption>
            </figure>
          </div> */}
        </header>
        <nav className="bg-leaf hidden lg:flex z-[10] w-full text-base justify-between  text-black border border-gray-200  shadow-md">
          {menu}
        </nav>

        {/* lower part  */}
        <Outlet />

        <footer className="flex flex-col gap-2 bg-leaf p-5">
          <p className="text-lg text-center text-white">
            &copy; 2024 Bobbili Urban Development Authority. All Rights
            Reserved.
          </p>
          <p className="z-[10] text-white text-lg relative flex justify-center items-center gap-2  font-titleFont">
            <FaUsers size={20} />
            {`Visitor count - `}
            <span className="bg-Primary text-brown h-7 p-2 rounded-sm inline-flex items-center">{`${visitorCount}`}</span>
          </p>
        </footer>

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
                  `${baseUrl}/message?update=${JSON.stringify({
                    id: removeChatUser.uniqueId,
                    action: "leaveFromTheMessage",
                  })}`
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
          <div className="fixed border-2 border-normalViolet shadow-lg bottom-[70px] right-8 z-10 h-[86vh] w-[400px] bg-white rounded-lg hover:transform hover:translate-y-[-5px] hover:scale-[1.005] hover:translate-z-0 transition-all duration-500 ease-out">
            <ChatBox setRemoveChatUser={setRemoveChatUser} />
          </div>
        )}
      </div>
    </>
  );
};

export default MainLayout;
