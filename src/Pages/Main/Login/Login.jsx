import { motion } from "framer-motion";
import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { BsFillHouseCheckFill, BsFillHouseLockFill } from "react-icons/bs";
import { useLocation, useNavigate } from "react-router";
import BeatLoader from "react-spinners/BeatLoader";
import { AuthContext } from "../../../AuthProvider/AuthProvider";
import LoginCSS from "../../../Style/Login.module.css";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { getUserData } = useContext(AuthContext);

  // get Cookie data
  const getCookie = (searchData) => {
    // Split cookie string and get all individual name=value pairs in an array
    var cookieArr = document.cookie.split(";");

    // Loop through the array elements
    for (var i = 0; i < cookieArr.length; i++) {
      var cookiePair = cookieArr[i].split("=");

      /* Removing whitespace at the beginning of the cookie name
        and compare it with the given string */
      if (searchData == cookiePair[0].trim()) {
        // Decode the cookie value and return
        return decodeURIComponent(cookiePair[1]);
      }
    }

    // Return null if not found
    return null;
  };

  let cookieUserId, cookieUserPassword;

  cookieUserId = getCookie("userId");
  cookieUserPassword = getCookie("password");

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const location = useLocation();

  const from = location?.state?.from?.pathName || "/dashboard";

  const onSubmit = (data) => {
    console.log(data);
    setLoading(true);
    const { id, password, checkbox } = data;
    console.log(data);

    const userInfo = {
      id,
      password,
    };

    console.log(userInfo);

    // fetch user information from the databaase
    getUserData(id)
      .then((result) => {
        if (result?.status) {
          console.log(1);
          const { userInfo } = result;

          console.log(userInfo, "userInfo");

          // checking whether password is matching or not
          if (userInfo?.isLoggedIn) {
            setLoading(false);
            toast.error("User already active");
          } else {
            if (
              userInfo?.role?.toLowerCase() === "ps" &&
              userInfo?.handOver === "true"
            ) {
              setLoading(false);
              toast.error("You handOvered your credentials");
            } else {
              if (userInfo.password === password) {
                console.log("1");

                console.log(userInfo, "LOGIN");
                // set information to localstorage to stay logged in
                localStorage.setItem("loggedUser", JSON.stringify(userInfo));

                console.log(localStorage.getItem("loggedUser"));

                // axios.post("http://localhost:5000/jwt",userInfo,{
                //   withCredentials: true,
                //   headers: {
                //       'Access-Control-Allow-Origin': '*',
                //       'Content-Type': 'application/json'
                //   }).then(result=>{

                //   })

                fetch("http://localhost:5000/jwt", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(userInfo),
                })
                  .then((res) => res.json())
                  .then((result) => {
                    console.log(result);

                    if (result?.success) {
                      // set information to cookie to implement remember me functionality

                      localStorage.setItem("jwToken", result?.token);
                      if (checkbox) {
                        console.log(checkbox);
                        document.cookie =
                          "userId=" + id + ";path=http://localhost:5173/";
                        document.cookie =
                          "password=" +
                          password +
                          ";path=http://localhost:5173/";
                      }

                      fetch(
                        `http://localhost:5000/updateWithLoggedIn?userId=${JSON.stringify(
                          userInfo?._id
                        )}`,
                        {
                          method: "PATCH",
                        }
                      )
                        .then((res) => res.json())
                        .then((result) => {
                          console.log(result, "Result");
                          if (result?.acknowledged) {
                            setLoading(false);
                            localStorage.setItem("theme", "light");
                            toast.success("Login successfully");
                            navigate(from, { replace: true });
                          } else {
                            setLoading(false);
                            toast.error("Server Error");
                          }
                        })
                        .catch((err) => {
                          setLoading(false);
                          toast.error("Server Error");
                        });
                    }
                  });
              } else {
                setLoading(false);
                toast.error("Password is wrong");
              }
            }
          }
        } else {
          setLoading(false);
          toast.error("No information found!");
        }
      })
      .catch((err) => {
        setLoading(false);
        toast.error("Server Failed");
      });
  };

  //password hide and show functionality
  const [show, setShow] = useState(false);
  const handlePasswordShow = () => {
    show ? setShow(false) : setShow(true);
  };

  // if (loading) {
  //   return "Loading...";
  // }
  let [color, setColor] = useState("#a36ee0");
  const override = {
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
              defaultValue={cookieUserId}
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
              defaultValue={cookieUserPassword}
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

          <div className="flex justify-center">
            {loading ? (
              <BeatLoader
                color={color}
                loading={loading}
                cssOverride={override}
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
