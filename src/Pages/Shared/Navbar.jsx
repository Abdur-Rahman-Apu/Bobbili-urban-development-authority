import React, { useEffect, useState } from "react";
import UserImg from "../../assets/images//user.png";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { FiSun } from "react-icons/fi";
import { MdOutlineDarkMode } from "react-icons/md";

const Navbar = () => {
  const navigate = useNavigate();

  const [theme, setTheme] = useState(localStorage.getItem("theme"));

  useEffect(() => {
    // console.log("theme" in localStorage);

    if (
      theme === "dark" ||
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");

      // console.log(theme);
    }

    return () => {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    };
  }, [theme]);

  // console.log(theme);

  const user = JSON.parse(localStorage.getItem("loggedUser"));

  const handleLogOut = () => {
    localStorage.removeItem("loggedUser");
    navigate("/");
  };

  return (
    <div className="navbar bg-base-100 sticky top-0 z-50 shadow-md dark:bg-gradient-to-r dark:from-violet-500 dark:to-fuchsia-500 dark:text-white">
      <div className="flex-1">
        <Link to="/dashboard" className="btn btn-ghost normal-case text-xl">
          {/* <img className="h-full" src={Logo} alt="The logo of the website" /> */}
          <p className="hidden lg:block font-sofadi">
            Bobbili Urban Development Authority
          </p>
        </Link>
      </div>

      <div className="me-3 flex flex-col font-roboto">
        <p className="font-semibold md:text-lg">{user?.name}</p>
        <small className="font-medium md:text-base">({user?.role})</small>
      </div>
      <div className="dropdown dropdown-end me-5 ">
        <label
          tabIndex={0}
          className="btn btn-ghost btn-circle avatar shadow-sm"
        >
          <div className="w-10 rounded-full">
            <img src={UserImg} alt="An image of user icon" />
          </div>
        </label>
        <ul
          tabIndex={0}
          className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 dark:bg-black "
        >
          <li>
            <a className="justify-between dark:text-white">
              Profile
              <span className="badge">New</span>
            </a>
          </li>
          <li>
            <a className="dark:text-white">Settings</a>
          </li>
          <li>
            <a className="dark:text-white" onClick={handleLogOut}>
              Logout
            </a>
          </li>
        </ul>
      </div>

      <div className="mx-4">
        {theme === "dark" ? (
          <FiSun size={25} onClick={() => setTheme("light")} />
        ) : (
          <MdOutlineDarkMode size={25} onClick={() => setTheme("dark")} />
        )}
      </div>
    </div>
  );
};

export default Navbar;
