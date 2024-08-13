import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { BsFillHouseLockFill } from "react-icons/bs";
import { FaHouse } from "react-icons/fa6";
import { IoMdRemove } from "react-icons/io";
import resetImg from "../../../assets/images/home/resetPassword.jpg";
export default function ForgotPasswordModal({
  modalStates: {
    isOpenForgotPassModal,
    setIsOpenForgotPassModal,
    loading,
    handleOtpStoreInDb,
  },
}) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [error, setError] = useState("");

  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    if (isOpenForgotPassModal) {
      document.getElementById("forgotPasswordModal").showModal();
    }
  }, []);

  const onSubmit = (data) => {
    console.log(data);
    handleOtpStoreInDb(data, setError);
  };
  return (
    <div>
      {/* You can open the modal using document.getElementById('ID').showModal() method */}

      <dialog id="forgotPasswordModal" className="modal">
        <div className="modal-box w-2/5 max-w-5xl">
          <h3 className="font-bold text-2xl text-center">Reset Password</h3>

          <div className="flex flex-wrap items-center">
            {/* left side  */}
            <div className="w-full md:w-1/2">
              {/* input to get info  */}
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mt-6">
                  <label
                    htmlFor="id"
                    className="block mb-2 text-sm font-bold text-gray-900 dark:text-white "
                  >
                    User ID
                  </label>
                  <input
                    type="text"
                    id="id"
                    {...register("id", { required: "ID is required" })}
                    className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 outline-none`}
                    placeholder="Enter your ID"
                  />

                  {errors?.id && (
                    <p className="text-sm text-red-500 font-bold my-2">
                      {errors?.id?.message}
                    </p>
                  )}
                </div>
                <div className="my-6">
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-bold text-gray-900 dark:text-white"
                  >
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPass ? "text" : "password"}
                      id="password"
                      {...register("password", {
                        required: "Password is required",
                      })}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 outline-none"
                      placeholder="•••••••••"
                    />
                    <div
                      className="absolute top-1/3 right-2 cursor-pointer text-normalViolet"
                      onClick={() => setShowPass(!showPass)}
                    >
                      {showPass ? <BsFillHouseLockFill /> : <FaHouse />}
                    </div>
                  </div>
                  {errors?.password && (
                    <p className="text-sm text-red-500 font-bold my-2">
                      {errors?.password?.message}
                    </p>
                  )}
                </div>

                <div className="flex justify-center items-center">
                  {loading ? (
                    <span className="loading loading-dots loading-lg text-normalViolet"></span>
                  ) : (
                    <input
                      type="submit"
                      className="nm_Container text-sm font-bold bg-[#8980FD] py-2 px-5 text-white rounded-full cursor-pointer hover:scale-105"
                    />
                  )}
                </div>
              </form>

              {error?.length > 0 && (
                <p className="mt-6 text-red-500 font-bold text-center">
                  {error}
                </p>
              )}
            </div>

            {/* right side  */}
            <div className="w-full md:w-1/2">
              <img
                src={resetImg}
                alt="An image to represent reset password"
                className="object-fit"
              />
            </div>
          </div>

          {/* modal actions  */}
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button, it will close the modal */}
              <button
                className="absolute top-2 right-2"
                onClick={() => setIsOpenForgotPassModal(false)}
              >
                <IoMdRemove
                  size={25}
                  className="text-white bg-error rounded-full"
                />
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}
