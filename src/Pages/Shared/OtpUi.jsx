import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Loading from "./Loading";
export default function OtpUi({ handleOtpMatching }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = (data) => {
    setError("");
    handleOtpMatching(Object.values(data).join(""), setLoading, setError);
  };
  return (
    <div className="relative font-inter antialiased">
      <main className="relative flex flex-col justify-center bg-slate-50 overflow-hidden">
        <div className="w-full mx-auto">
          <div className="w-full">
            {loading ? (
              <div className="px-4 py-10">
                <Loading />
              </div>
            ) : (
              <div className="text-center bg-white px-4 sm:px-8 py-10 rounded-xl shadow">
                <header className="mb-8">
                  <h1 className="text-2xl font-bold mb-1">
                    Mobile Phone Verification
                  </h1>
                  <p className="text-[15px] text-slate-500">
                    Enter the 4-digit verification code that was sent to your
                    phone number.
                  </p>
                </header>
                <form id="otp-form" onSubmit={handleSubmit(onSubmit)}>
                  <div className="flex items-center justify-center gap-3">
                    <input
                      type="text"
                      {...register("firstDigit", {
                        required: true,
                      })}
                      className={`w-14 h-14 text-center text-2xl font-extrabold text-slate-900 bg-slate-100 border border-transparent hover:border-slate-200 appearance-none rounded p-4 outline-none focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 ${
                        errors?.firstDigit && "focus:ring-red-300"
                      }`}
                      // pattern="[0-9]+"
                      maxLength="1"
                    />
                    <input
                      type="text"
                      {...register("secondDigit", { required: true })}
                      className={`w-14 h-14 text-center text-2xl font-extrabold text-slate-900 bg-slate-100 border border-transparent hover:border-slate-200 appearance-none rounded p-4 outline-none focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 ${
                        errors?.secondDigit && "focus:ring-red-300"
                      }`}
                      maxlength="1"
                    />
                    <input
                      type="text"
                      {...register("thirdDigit", { required: true })}
                      className={`w-14 h-14 text-center text-2xl font-extrabold text-slate-900 bg-slate-100 border border-transparent hover:border-slate-200 appearance-none rounded p-4 outline-none focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 ${
                        errors?.thirdDigit && "focus:ring-red-300"
                      }`}
                      maxlength="1"
                    />
                    <input
                      type="text"
                      {...register("fourthDigit", { required: true })}
                      className={`w-14 h-14 text-center text-2xl font-extrabold text-slate-900 bg-slate-100 border border-transparent hover:border-slate-200 appearance-none rounded p-4 outline-none focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 ${
                        errors?.fourthDigit && "focus:ring-red-300"
                      }`}
                      maxlength="1"
                    />
                  </div>
                  <div className="max-w-[260px] mx-auto mt-4">
                    <button
                      type="submit"
                      className="w-full inline-flex justify-center whitespace-nowrap rounded-lg bg-violet-500 px-3.5 py-2.5 text-sm font-medium text-white shadow-sm shadow-indigo-950/10 hover:bg-violet-600 focus:outline-none focus:ring focus:ring-indigo-300 focus-visible:outline-none focus-visible:ring focus-visible:ring-indigo-300 transition-colors duration-150"
                    >
                      Verify Account
                    </button>
                  </div>
                </form>
                {error?.length > 0 && (
                  <p className="text-red-500 mt-4 font-bold">{error}</p>
                )}
                <div className="text-sm text-slate-500 mt-4">
                  Didn't receive code?{" "}
                  <a
                    className="font-medium text-indigo-500 hover:text-indigo-600"
                    href="#0"
                  >
                    Resend
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
