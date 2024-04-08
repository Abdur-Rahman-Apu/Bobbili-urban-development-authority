import Lottie from "lottie-react";
import React from "react";
import NoDataFoundAnimation from "../../assets/noDataFoundAnimation.json";
export default function NoApplicationFound() {
  return (
    <div className="flex justify-center items-center">
      <Lottie
        className="h-full w-1/2 "
        animationData={NoDataFoundAnimation}
        loop={true}
      />
    </div>
  );
}
