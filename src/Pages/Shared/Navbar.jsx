import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useQueryClient } from "react-query";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { AuthContext } from "../../AuthProvider/AuthProvider";
import UserImg from "../../assets/images//man.png";

const Navbar = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { setIsDark, userInfoFromLocalStorage, handleLogOut } =
    useContext(AuthContext);

  const [theme, setTheme] = useState(localStorage.getItem("theme"));
  // const data = undefined;

  // const [data, refetch] = useGetUser();

  // console.log(data, "GET USER");

  const { register, reset, handleSubmit } = useForm({});

  const [showModal, setShowModal] = useState(true);

  console.log(showModal, "SHOW MODAL");

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
      localStorage.setItem("stepIndex", 0);
      queryClient.removeQueries();
    };
  }, [theme]);

  const onSubmit = (formValue) => {
    fetch(
      `http://localhost:5000/updateUserInfo/${userInfoFromLocalStorage()._id}`,
      {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(formValue),
      }
    )
      .then((res) => res.json())
      .then(async (result) => {
        console.log(result);
        if (result.acknowledged) {
          refetch();
          setShowModal(false);
          toast.success("Update successfully");
        } else {
          toast.error("Failed to update");
        }
      })
      .catch(() => {
        toast.error("Server error");
      });
  };

  useEffect(() => {
    setShowModal(true);
  }, [showModal]);

  const user = JSON.parse(localStorage.getItem("loggedUser"));

  return (
    <div className="navbar nm_Container sticky top-0 z-50 shadow-md bg-bgColor">
      <div className="flex-1 ">
        <Link to="/dashboard" className="font-bold normal-case text-xl">
          {/* <img className="h-full" src={Logo} alt="The logo of the website" /> */}
          <p className="hidden text-gray-600 lg:block css-3d-text font-sofadi">
            Bobbili Urban Development Authority
          </p>
        </Link>
      </div>

      <div className="me-3 flex flex-col font-roboto">
        <p className="font-semibold md:text-lg text-black">{user?.name}</p>
        <small className="font-medium md:text-base text-[#9FA4A6]">
          ({user?.role})
        </small>
      </div>

      <div className="dropdown dropdown-end me-5">
        <label
          tabIndex={0}
          className="btn btn-ghost btn-circle avatar shadow-sm"
        >
          <div className="w-10 flex justify-center items-center rounded-full nm_Container">
            <img src={UserImg} alt="An image of user icon" />
            {/* <LuSettings size={30} className="text-black cursor-pointer" /> */}
          </div>
        </label>
        <ul
          tabIndex={0}
          className="nm_Container bg-bgColor menu menu-sm dropdown-content mt-3 z-[1] p-2 rounded-box w-52"
        >
          <li>
            <Link
              className="justify-between dark:text-black"
              to="/dashboard/profile"
            >
              Profile
            </Link>
          </li>
          <li>
            <a
              className="dark:text-black"
              onClick={() => handleLogOut(navigate)}
            >
              Logout
            </a>
          </li>
        </ul>
      </div>

      {/* <div className="mx-4">
        {theme === "dark" ? (
          <FiSun
            size={25}
            onClick={() => {
              setTheme("light");
              setIsDark(0);
            }}
          />
        ) : (
          <MdOutlineDarkMode
            size={25}
            onClick={() => {
              setTheme("dark");
              setIsDark(1);
            }}
          />
        )}
      </div> */}

      {/* You can open the modal using document.getElementById('ID').showModal() method */}
    </div>
  );
};

export default Navbar;
