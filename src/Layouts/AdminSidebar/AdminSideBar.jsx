import React, { useContext, useEffect, useState } from "react";
import { BiSolidUserPlus } from "react-icons/bi";
import { FaLocationDot, FaUsersGear } from "react-icons/fa6";
import { MdSpaceDashboard } from "react-icons/md";
import { RiCustomerService2Fill } from "react-icons/ri";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../../AuthProvider/AuthProvider";

const AdminSideBar = () => {
  const path = useLocation().pathname;

  const {
    handleLogOut,
    decideActiveColor,
    decideHoverColor,
    isDark,
    userInfoFromCookie,
  } = useContext(AuthContext);

  const [activeColor, setActiveColor] = useState("");
  const [hoverColor, setHoverColor] = useState("");

  const role = userInfoFromCookie()?.role?.toLowerCase();

  console.log(role, "role");

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
        } mb-1 ps-4  flex items-center ${hoverColor}`}
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
          path === "/dashboard/addUser" && activeColor
        }  ps-4 mb-1 flex items-center  ${hoverColor}`}
      >
        <span>
          <BiSolidUserPlus size={20} />
        </span>
        <Link className={`p-[10px] font-medium `} to="/dashboard/addUser">
          Add User
        </Link>
      </li>
      <li
        className={`${
          path === "/dashboard/allUser" && activeColor
        }  ps-4 mb-1 flex items-center  ${hoverColor}`}
      >
        <span>
          <FaUsersGear size={20} />
        </span>
        <Link className={`p-[10px] font-medium `} to="/dashboard/allUser">
          All Users
        </Link>
      </li>
      <li
        className={`${
          path === "/dashboard/updateLocation" && activeColor
        }  ps-4 mb-1 flex items-center  ${hoverColor}`}
      >
        <span>
          <FaLocationDot size={20} />
        </span>
        <Link
          className={`p-[10px] font-medium `}
          to="/dashboard/updateLocation"
        >
          Location
        </Link>
      </li>
      {(role === "admin1" || role === "admin2") && (
        <li
          className={`${
            path === "/dashboard/support" && activeColor
          }  ps-4 mb-1 flex items-center  ${hoverColor}`}
        >
          <span>
            <RiCustomerService2Fill size={20} />
          </span>
          <Link className={`p-[10px] font-medium `} to="/dashboard/support">
            Customer Support
          </Link>
        </li>
      )}
    </>
  );
};

export default AdminSideBar;
