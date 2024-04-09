import Lottie from "lottie-react";
import React from "react";
import ServerError from "../../assets/Err.json";
export default function NetworkError({ errMsg }) {
  return (
    <div className="flex flex-col items-center">
      <Lottie animationData={ServerError} loop={true} className="w-[70%]" />
      <p className="font-bold text-red-500 text-lg">{errMsg}</p>
    </div>
  );
}
