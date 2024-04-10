import Lottie from "lottie-react";
import React from "react";
import LoadingAnimation from "../../assets/searchApplication.json";
export default function SearchApplicationLoading() {
  return (
    <div className="flex flex-col justify-center items-center">
      <Lottie
        animationData={LoadingAnimation}
        loop={true}
        className="w-[50%] lg:w-[30%]"
      />
      <p className="text-xl lg:text-2xl font-bold text-normalViolet">
        Searching...
      </p>
    </div>
  );
}
