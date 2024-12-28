import { motion } from "framer-motion";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { BiSolidHide, BiSolidShow, BiSolidUser } from "react-icons/bi";
import { FaShieldAlt } from "react-icons/fa";
import { IoMdLogIn } from "react-icons/io";
import { MdReplay } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { useLocation, useNavigate } from "react-router";
import BeatLoader from "react-spinners/BeatLoader";
import logo from "../../../assets/images/home/279267565_320376033559878_7910645826457098899_n.jpg";
import LoginCSS from "../../../Style/Login.module.css";
import { baseUrl } from "../../../utils/api";
import { getCookie, setCookie } from "../../../utils/utils";

const Login = ({ onShowForgotPassModal }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const from = location?.state?.from?.pathName || "/dashboard";

  let cookieUserId, cookieUserPassword;
  cookieUserId = getCookie("userId");
  cookieUserPassword = getCookie("password");

  const { register, handleSubmit } = useForm();

  // handling login
  const onSubmit = async (data) => {
    setLoading(true);
    const { id, password, checkbox } = data;

    const userInfo = {
      id,
      password,
    };

    // fetch user information from the database
    try {
      const response = await fetch(
        `${baseUrl}/auth/login?credentials=${JSON.stringify(userInfo)}`,
        { method: "GET", credentials: "include" }
      );

      if (!response.ok) {
        const errorData = await response.json();

        throw new Error(JSON.stringify(errorData.message)); // Assuming the error message is in the 'error' field
      }

      const data = await response.json();

      if (data.status) {
        // store userinfo into cookie
        setCookie("loggedUser", JSON.stringify(data?.userInfo), 0.5);
        // handle user clicked on remember me checkbox
        if (checkbox) {
          document.cookie = "userId=" + id + ";path=/";
          document.cookie = "password=" + password + ";path=/";
        }

        setLoading(false);

        toast.success("Logged in successfully");
        navigate(from, { replace: true });
      }
    } catch (err) {
      setLoading(false);
      toast.error(err.message);
    }
  };

  //password hide and show functionality
  const handlePasswordShow = () => {
    show ? setShow(false) : setShow(true);
  };

  const overrideStyleForBeatLoader = {
    display: "block",
    width: "fit-content",
    margin: "0 auto",
    borderColor: "red",
  };

  return (
    <div className=" bg-green-50 rounded-lg border border-leaf">
      {/* support icon  */}
      {/* <div className="nm_Inset mt-[-65%] ml-[-20%] h-[330px] lg:w-[120%] bg-gradient-to-r from-[#cecbf5] via-[#BDB9F6] to-[#8980fd] rounded-full flex justify-center flex-col items-center">
        <p
          className={`text text-white font-medium text-4xl uppercase pt-[50%] pr-[15%]`}
        >
          Sign in
        </p>
        <p className="text-white font-base text-lg">Welcome back!</p>
      </div> */}

      <div className="flex flex-col items-center w-full p-2">
        <img
          src={logo}
          alt=""
          width={80}
          className="rounded-full object-cover"
        />
        <p className="text-3xl font-bold text-leaf">Sign In</p>
        <p className="text-base text-brown">Welcome Back!</p>
      </div>

      <div className="px-5 w-full shadow-lg">
        <form
          className="space-y-2 font-roboto "
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* <h1 className="text-3xl text-center font-bold text-gray-50">
              Sign in
            </h1> */}

          <div className={`${LoginCSS.formGroup} flex  pt-4 `}>
            <div className="w-12 h-12 flex justify-center items-center bg-leaf text-white rounded-tl-md rounded-bl-md">
              <BiSolidUser size={23} />
            </div>
            <div className="relative flex-1">
              <input
                type="text"
                {...register("id", { required: true })}
                id="userId"
                className={` input border border-leaf rounded-tl-none rounded-bl-none  block text-base w-full py-2 px-4 text-gray-900`}
                placeholder="Enter user id..."
                // defaultValue={cookieUserId}
                required
              />
              <label
                htmlFor="userId"
                className="text-leaf w-1/2 h-5 text-base font-semibold absolute top-0 left-4 pointer-events-none transform translate-y-3"
              >
                User ID
              </label>
            </div>
          </div>

          <div className={`${LoginCSS.formGroup} flex relative pt-4 `}>
            <div className="w-12 h-12 flex justify-center items-center bg-leaf text-white rounded-tl-md rounded-bl-md">
              <RiLockPasswordFill size={23} />
            </div>

            <div className="relative flex-1">
              <input
                type={`${show === true ? "text" : "password"}`}
                id="password"
                placeholder="Enter password..."
                // defaultValue={cookieUserPassword}
                className={` input border border-leaf rounded-md rounded-tl-none rounded-bl-none text-base w-full py-2 px-4 text-gray-900`}
                {...register("password", { required: true })}
                required
              />
              <label
                htmlFor="password"
                className="text-leaf w-1/2 h-5 text-base font-semibold absolute top-0 left-4 pointer-events-none transform translate-y-3"
              >
                Your password
              </label>
            </div>

            <div
              className="absolute top-[52%] right-3 w-fit dark:text-black"
              onClick={handlePasswordShow}
            >
              {show ? (
                <BiSolidShow size={20} className="text-leaf" />
              ) : (
                <BiSolidHide size={20} className="text-leaf" />
              )}
            </div>
          </div>

          {/* captcha  */}
          <div className={`${LoginCSS.formGroup} flex  pt-4 `}>
            <div className="w-12 h-12 flex justify-center items-center bg-leaf text-white rounded-tl-md rounded-bl-md">
              <FaShieldAlt size={23} />
            </div>
            <div className="relative flex-1">
              <input
                type="text"
                {...register("userCaptcha", { required: true })}
                id="user-captcha"
                className={` input border border-leaf rounded-tl-none rounded-bl-none  block text-base w-full py-2 px-4 text-gray-900`}
                placeholder="Enter captcha..."
                // defaultValue={cookieUserId}
                required
              />
              <label
                htmlFor="captcha"
                className="text-leaf w-3/4 h-5 text-base font-semibold absolute top-0 left-4 pointer-events-none transform translate-y-3"
              >
                Captcha
              </label>
            </div>

            {/* actual captcha  */}
            <div className="relative flex-1 flex ml-1">
              <input
                type="text"
                {...register("generatedCaptcha", { required: true })}
                id="generated-captcha"
                className={` input border border-leaf rounded-tr-none rounded-br-none  block  w-full p-1 captcha-bg font-captcha font-bold text-2xl`}
                value="A B C 2 I a"
                required
              />
              <label
                htmlFor="userId"
                className="text-leaf w-1/2 h-5 text-base font-semibold absolute top-0 left-4 pointer-events-none transform translate-y-3"
              >
                User ID
              </label>

              {/* reset button  */}
              <button
                className="p-2 bg-leaf text-white rounded-md rounded-tl-none rounded-bl-none"
                type="button"
              >
                <MdReplay size={20} />
              </button>
            </div>
          </div>

          <div className="flex justify-center pt-4 w-full">
            {loading ? (
              <BeatLoader
                color={"#149777"}
                loading={loading}
                cssOverride={overrideStyleForBeatLoader}
                size={15}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
            ) : (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full flex justify-center"
              >
                <button
                  type="submit"
                  className={`nm_Container flex justify-center items-center gap-2  font-bold bg-leaf py-2 w-9/12 text-lg text-white rounded-md cursor-pointer`}
                >
                  <IoMdLogIn size={20} />
                  Sign in
                </button>
              </motion.div>
            )}
          </div>

          <div className="flex justify-center items-center">
            {/* <div className="flex items-center pt-2 pb-3">
              <div className="flex items-center h-5">
                <input
                  id="remember"
                  type="checkbox"
                  {...register("checkbox")}
                  className="nm_Inset checkbox checked:border-none w-5 h-5 checked:checkbox-primary"
                />
              </div>
              <label
                htmlFor="remember"
                className={`ml-2 text-sm text-gray-900 font-bold font-sans`}
              >
                Remember me
              </label>
            </div> */}

            {/* forgot-pasword  */}
            <p
              className="pt-1 mb-7 text-sm font-bold text-leaf cursor-pointer hover:underline"
              onClick={onShowForgotPassModal}
            >
              Forgot password?
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
