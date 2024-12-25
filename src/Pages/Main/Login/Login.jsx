import { motion } from "framer-motion";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { BsFillHouseCheckFill, BsFillHouseLockFill } from "react-icons/bs";
import { useLocation, useNavigate } from "react-router";
import BeatLoader from "react-spinners/BeatLoader";
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
    <div className="relative overflow-hidden">
      {/* support icon  */}
      <div className="nm_Inset mt-[-65%] ml-[-20%] h-[330px] lg:w-[120%] bg-gradient-to-r from-[#cecbf5] via-[#BDB9F6] to-[#8980fd] rounded-full flex justify-center flex-col items-center">
        <p
          className={`text text-white font-medium text-4xl uppercase pt-[50%] pr-[15%]`}
        >
          Sign in
        </p>
        <p className="text-white font-base text-lg">Welcome back!</p>
      </div>

      <div className="p-4 sm:p-6 md:px-5 md:pt-3 shadow-lg rounded-b-lg">
        <form
          className="space-y-2 font-roboto"
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* <h1 className="text-3xl text-center font-bold text-gray-50">
              Sign in
            </h1> */}

          <div className={`${LoginCSS.formGroup} relative pt-[20px] max-w-xs`}>
            <input
              type="text"
              {...register("id", { required: true })}
              id="userId"
              className={`${LoginCSS.loginInput} rounded-full block text-base w-full py-2 px-4 text-gray-900`}
              // defaultValue={cookieUserId}
              autoFocus
              required
            />
            <label
              htmlFor="userId"
              className="text-violet-400 h-5 text-base font-semibold absolute top-0 left-[16px] pointer-events-none transform translate-y-7"
            >
              Your Id
            </label>
          </div>

          <div className={`${LoginCSS.formGroup} relative pt-[20px] max-w-xs`}>
            <input
              type={`${show === true ? "text" : "password"}`}
              id="password"
              // placeholder="••••••••"
              // defaultValue={cookieUserPassword}
              className={`${LoginCSS.loginInput} rounded-full block text-base w-full py-2 px-4 text-gray-900`}
              {...register("password", { required: true })}
              required
            />
            <label
              htmlFor="password"
              className="text-violet-400 h-5 text-base font-semibold absolute top-0 left-[20px] pointer-events-none transform translate-y-7"
            >
              Your password
            </label>

            <div
              className="absolute top-[55%] right-3 w-fit dark:text-black"
              onClick={handlePasswordShow}
            >
              {show ? (
                <BsFillHouseCheckFill className="text-violet-400" />
              ) : (
                <BsFillHouseLockFill className="text-violet-400" />
              )}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center pt-2 pb-3">
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
            </div>
            <p
              className="text-sm font-bold text-normalViolet cursor-pointer hover:underline"
              onClick={onShowForgotPassModal}
            >
              Forgot password?
            </p>
          </div>
          <div className="flex justify-center">
            {loading ? (
              <BeatLoader
                color={"#a36ee0"}
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
              >
                <input
                  type="submit"
                  value="Sign in"
                  className={`nm_Container font-bold bg-[#8980FD] py-2 px-8 text-white rounded-full cursor-pointer`}
                />
              </motion.div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
