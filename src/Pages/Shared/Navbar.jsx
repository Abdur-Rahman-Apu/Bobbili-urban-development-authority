import React from "react";
import UserImg from "../../assets/images//user.png";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import Logo from "../../assets/images/logo.png";

const Navbar = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("loggedUser"));

  const handleLogOut = () => {
    localStorage.removeItem("loggedUser");
    navigate("/");
  };

  return (
    <div className="navbar bg-base-100 sticky top-0 z-50 shadow-md">
      <div className="flex-1">
        <Link to="/dashboard" className="btn btn-ghost normal-case text-xl">
          <img className="h-full" src={Logo} alt="The logo of the website" />
          <p className="hidden lg:block">Bobbili Urban Development Authority</p>
        </Link>
      </div>

      <div className="me-3 flex flex-col">
        <p className="roboto-bold">{user?.name}</p>
        <small className="font-medium">({user?.role})</small>
      </div>
      <div className="dropdown dropdown-end me-5">
        <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
          <div className="w-10 rounded-full">
            <img src={UserImg} alt="An image of user icon" />
          </div>
        </label>
        <ul
          tabIndex={0}
          className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
        >
          <li>
            <a className="justify-between">
              Profile
              <span className="badge">New</span>
            </a>
          </li>
          <li>
            <a>Settings</a>
          </li>
          <li>
            <a onClick={handleLogOut}>Logout</a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
