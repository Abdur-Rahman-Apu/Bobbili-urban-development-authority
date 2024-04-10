import Lottie from "lottie-react";
import React from "react";
import LoadingAnimation from "../../assets/searchUser.json";
export default function SearchUserLoading() {
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
