import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { IoMdCloseCircle } from "react-icons/io";

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
                className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 outline-none`}
                placeholder="Enter your ID"
              />
              {errors?.id && (
                <p className="text-red-500 font-bold my-2">
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
              <input
                type="password"
                id="password"
                {...register("password", { required: "Password is required" })}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 outline-none"
                placeholder="•••••••••"
              />
              {errors?.password && (
                <p className="text-red-500 font-bold my-2">
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
                  className="nm_Container font-bold bg-[#8980FD] py-2 px-8 text-white rounded-full cursor-pointer"
                />
              )}
            </div>
          </form>

          {error?.length > 0 && (
            <p className="mt-6 text-red-500 font-bold text-center">{error}</p>
          )}

          {/* modal actions  */}
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button, it will close the modal */}
              <button
                className="absolute top-2 right-2"
                onClick={() => setIsOpenForgotPassModal(false)}
              >
                <IoMdCloseCircle size={25} className="text-normalViolet" />
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}
