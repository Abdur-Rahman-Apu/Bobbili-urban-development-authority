import Lottie from "lottie-react";
import React from "react";
import ComingSoonAnimation from "../../assets/ComingSoon.json";

export default function ComingSoon() {
  return (
    <div className="flex flex-col justify-center items-center">
      <Lottie
        animationData={ComingSoonAnimation}
        loop={true}
        className="w-[50%] lg:w-[30%]"
      />
    </div>
  );
}
