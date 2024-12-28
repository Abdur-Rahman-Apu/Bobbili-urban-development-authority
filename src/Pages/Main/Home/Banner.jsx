import React from "react";
import Slider from "react-slick";
import logo from "../../../assets/images/home/banner-final-1.png";
import logo2 from "../../../assets/images/home/banner-final-2.png";

export default function Banner() {
  const settings = {
    dots: false,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 5000,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  return (
    <div className="w-full h-full  ">
      <Slider {...settings} className="h-full ">
        <div className="w-full h-full">
          <img src={logo} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="w-full h-full">
          <img src={logo2} alt="" className="w-full h-full object-cover" />
        </div>
      </Slider>
      {/* <div className="flex items-center w-1/2 pl-2">
        <div className="bg-Primary  ">
          <strong>Sri Nara Chandrababu Naidu,</strong>
          <p>Hon'ble Chief Minister of AP.</p>
        </div>
        <img src={logo} alt="" width={300} className="" />
      </div> */}
      {/* <div className="w-1/2 h-full">
        <img src={logo2} alt="" className="w-full h-full object-contain" />
      </div> */}
      {/* <div className="absolute top-0 left-0 w-full h-full opacity-5">
        <img src={logo2} alt="" className="w-full h-full object-cover" />
      </div> */}
    </div>
  );
}
