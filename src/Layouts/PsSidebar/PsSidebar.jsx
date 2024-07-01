import React, { useContext, useEffect, useState } from "react";
import { AiOutlineFileDone, AiOutlineFileSearch } from "react-icons/ai";
import { BiSolidAddToQueue } from "react-icons/bi";
import { MdSpaceDashboard } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../../AuthProvider/AuthProvider";

function PsSidebar() {
  const path = useLocation()?.pathname;
  console.log(path, "Path from the sidebar");

  const {
    handleLogOut,
    decideActiveColor,
    decideHoverColor,
    isDark,
    findWhichMenuIsActiveForPsSideBar,
    userInfoFromCookie,
  } = useContext(AuthContext);

  const role = userInfoFromCookie()?.role;

  const [activeColor, setActiveColor] = useState("");
  const [hoverColor, setHoverColor] = useState("");

  useEffect(() => {
    const getActiveColor = decideActiveColor();
    const getHoverColor = decideHoverColor();
    setActiveColor(getActiveColor);
    setHoverColor(getHoverColor);
  }, [isDark]);

  return (
    <>
      <li
        className={`${
          path === "/dashboard" && activeColor
        } flex items-center  ps-3 ${hoverColor}`}
      >
        <span>
          <MdSpaceDashboard size={20} />
        </span>
        <Link className={`p-[10px] font-medium `} to="/dashboard">
          Dashboard
        </Link>
      </li>

      <li
        className={`${
          findWhichMenuIsActiveForPsSideBar(
            path,
            "/dashboard/inward",
            "submit",
            role,
            "inward"
          ) && activeColor
        } mt-1  flex items-center  ps-3 ${hoverColor}`}
      >
        <span>
          <BiSolidAddToQueue size={20} />
        </span>
        <Link
          className={`p-[10px] font-medium `}
          to="/dashboard/inward"
          onClick={() => {
            localStorage.setItem("page", JSON.stringify("submit"));
            localStorage.setItem("psMenu", JSON.stringify("inward"));
          }}
        >
          Inward Application
        </Link>
      </li>
      <li
        className={`${
          findWhichMenuIsActiveForPsSideBar(
            path,
            "/dashboard/outWard",
            "outward",
            role,
            "outward"
          ) && activeColor
        } mt-1 flex items-center  ps-3 ${hoverColor}`}
      >
        <span>
          <AiOutlineFileDone size={20} />
        </span>
        <Link
          className={`p-[10px] font-medium `}
          to="/dashboard/outWard"
          onClick={() => {
            localStorage.setItem("page", JSON.stringify("Outward"));
            localStorage.setItem("psMenu", JSON.stringify("outward"));
          }}
        >
          Outward Application
        </Link>
      </li>
      <li
        className={`${
          findWhichMenuIsActiveForPsSideBar(
            path,
            "/dashboard/searchApplication",
            "searchApplicationByPs",
            role,
            "search"
          ) && activeColor
        } mt-1 flex items-center  ps-3 ${hoverColor}`}
      >
        <span>
          <AiOutlineFileSearch size={20} />
        </span>
        <Link
          className={`p-[10px] font-medium `}
          to="/dashboard/searchApplication"
          onClick={() => {
            localStorage.setItem(
              "page",
              JSON.stringify("searchApplicationByPs")
            );
            localStorage.setItem("psMenu", JSON.stringify("search"));
          }}
        >
          Search Application
        </Link>
      </li>
      {/* <li
        className={`${
          path === "/dashboard/reValidation" && activeColor
        } mt-1 flex items-center  ps-3 ${hoverColor}`}
      >
        <span>
          <MdSpaceDashboard size={20} />
        </span>
        <Link className={`p-[10px] font-medium `} to="/dashboard/reValidation">
          Re-validation
        </Link>
      </li> */}

      {/* <Link to="/dashboard">
        <button>Dashboard</button>
      </Link>
      <Link to="/dashboard/Inward">
        <button>Inward Applications</button>
      </Link>
      <Link to="/dashboard/outwardApplication">
        <button>Outward Application</button>
      </Link>
      <Link to="/dashboard/searchApplication">
        <button>Search Application</button>
      </Link>
      <Link to="/dashboard/reValidation">
        <button>Re-validation</button>
      </Link> */}
    </>
  );
}

export default PsSidebar;
