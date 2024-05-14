import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FaRegFaceSadTear } from "react-icons/fa6";
import { IoMdStar } from "react-icons/io";
import { TfiEmail } from "react-icons/tfi";
import LoginCSS from "../../../Style/Login.module.css";
import lineSvg from "../../../assets/images/line.svg";
import stairLikeLine from "../../../assets/images/stairLikeLine.png";
import triangle from "../../../assets/images/triangle.png";
import isBetweenWorkingHours from "../../Common/CheckWorkingHours";
import TextEditor from "../../Components/TextEditor";

const RequestPage = ({ props }) => {
  const { setRequestSent, setUserInfo } = props;
  const {
    register,

    handleSubmit,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);

  // if the user want to send message in between working hours
  const onSubmit = async (dataFromUser) => {
    setLoading(true);
    console.log(dataFromUser);

    setUserInfo(dataFromUser);

    const { data } = await axios.get(
      `https://api.genderize.io?name=${dataFromUser.name.split(" ")[0]}`
    );

    console.log(data, "GENDER DATA");

    const messageRequest = {
      userId: `Help-${dataFromUser.name}-${dataFromUser.mobileNo}`,
      name: dataFromUser.name,
      mobile: dataFromUser.mobileNo,
      gender: data?.gender,
    };

    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };

    try {
      const { data } = await axios.post(
        "https://residential-building.onrender.com/messageRequest",
        messageRequest,
        config
      );

      console.log(data, "DATA");

      if (data.acknowledged) {
        setRequestSent(true);
        setUserInfo((prev) => {
          return { ...prev, uniqueId: data.insertedId };
        });
      } else {
        toast.error("Server failed");
      }
    } catch (error) {
      toast.error("Server down");
    }
    setLoading(true);
  };

  // editor configuration

  const [editorContent, setEditorContent] = useState("");

  // if the user want to message after working hours
  const submitQuery = async (query) => {
    setLoading(true);
    if (editorContent === "<p><br></p>") {
      toast.error("Please enter your queries");
    } else {
      const { data } = await axios.get(
        `https://api.genderize.io?name=${query.name.split(" ")[0]}`
      );

      console.log(data, "GENDER DATA");

      const messageRequest = {
        userId: `Help-${query.name}-${query.mobileNo}`,
        name: query.name,
        mobile: query.mobileNo,
        gender: data?.gender,
        noResponse: { condition: true, query: editorContent },
      };

      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      try {
        const { data } = await axios.post(
          "https://residential-building.onrender.com/messageRequest",
          messageRequest,
          config
        );

        console.log(data, "DATA");

        if (data.acknowledged) {
          toast.success("Your message sent");
        } else {
          toast.error("Server failed");
        }
      } catch (error) {
        toast.error("Server down");
      }
    }
    console.log(query, editorContent);
    setLoading(false);
  };

  const workingHours = isBetweenWorkingHours();

  const [mobileValue, setMobileValue] = useState("");

  const handleInputPhone = (e) => {
    console.log("Aslam");
    // Remove non-numeric characters
    const inputValue = e.target.value.replace(/[^0-9]/g, "");

    console.log(inputValue, "INPUT VALUE");
    setMobileValue(inputValue);
    // Limit the input to 10 characters
    const truncatedValue = inputValue.slice(0, 10);
    // Update the input field with the sanitized value
    e.target.value = truncatedValue;

    if (truncatedValue.length < 10) {
      console.log("Came here");
      e.target.setCustomValidity("Must be 10 digits.");
      // e.target.classList.add('errorAdd');
    } else {
      console.log("Came here");
      // Reset the error message
      e.target.setCustomValidity("");
    }
  };

  // isBetweenWorkingHours();
  return (
    <div className="relative overflow-hidden h-full shadow-2xl ">
      {workingHours.result ? (
        <div className="text-gray-600 h-full flex flex-col justify-evenly rounded-md shadow-lg relative overflow-hidden">
          <div className="flex flex-col items-center">
            <button className="logo-btn" data-text="Awesome">
              <span className="actual-text text-4xl">&nbsp;BUDA&nbsp;</span>
              <span aria-hidden="true" className="hover-text text-4xl">
                &nbsp;BUDA&nbsp;
              </span>
            </button>

            {/* <LuMessagesSquare
          size={80}
          className="nm_Container text-[#6c5ce7] mt-4 p-2"
        />  */}

            <div className="message-icon-container ">
              <blockquote className="oval-thought">
                <TfiEmail size={50} />
              </blockquote>
            </div>
          </div>
          <form
            className="flex flex-col items-center space-y-5 "
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className={`${LoginCSS.formGroup} w-2/3`}>
              <div className="indicator">
                <span className="indicator-item border-none badge badge-xs text-red-500 bg-[#FFFFFF]">
                  <IoMdStar />
                </span>
                <label htmlFor="name" className="inline-block font-bold">
                  Your Name
                </label>
              </div>
              <input
                className={`input input-bordered border-2 focus:border-violet-400 w-full max-w-xs rounded-full focus:outline-none bg-gray-100 ${LoginCSS.loginInput}`}
                placeholder="Enter your name ..."
                type="text"
                id="name"
                {...register("name", { required: true })}
              />
              {/* errors will return when field validation fails  */}
              {/* {errors?.name && (
              <p className="text-normalViolet font-bold">
                This field is required
              </p>
            )} */}
            </div>

            <div className={`${LoginCSS.formGroup} w-2/3`}>
              <div className="indicator ">
                <span className="indicator-item border-none badge badge-xs text-red-500 bg-[#FFFFFF]">
                  <IoMdStar />
                </span>
                <label htmlFor="mobile" className="inline-block font-bold">
                  Mobile No
                </label>
              </div>
              <input
                type="text"
                maxLength="10"
                pattern="\d"
                className={`input input-bordered w-full max-w-xs border-2 focus:border-violet-400 rounded-full focus:outline-none  bg-gray-100 ${LoginCSS.loginInput} focus:nm_Inset`}
                placeholder="Enter your mobile no..."
                // onChange={(e) => {
                //   console.log("IJ");
                // }}
                defaultValue={mobileValue}
                // pattern="[0-9]+"
                {...register("mobileNo", {
                  onChange: (e) => handleInputPhone(e),
                  required: true,
                })}
              />
              {/* errors will return when field validation fails */}
              {/* {errors?.mobileNo && (
              <p className="text-normalViolet text-center font-bold">
                This field is required
              </p>
            )} */}
            </div>

            {loading ? (
              <span className="loading loading-dots loading-lg text-normalViolet"></span>
            ) : (
              <input
                className="nm_Container capitalize p-2 px-8 text-lg rounded-full text-white bg-gradient-to-r from-[#8b69be] to-[#7642C2] cursor-pointer transition-all duration-700 hover:bg-gradient-to-l"
                type="submit"
                value={"Submit"}
              />
            )}
          </form>
          {/* <div className="absolute flex justify-center items-center text-white h-10 w-10 rounded-full top-3 left-3">
        <GiSensuousness size={30} />
      </div>
      <div className="absolute flex justify-center items-center text-white h-10 w-10 rounded-full bottom-3 right-3">
        <GiSensuousness size={30} />
      </div>

      <div className="absolute flex justify-center items-center text-normalViolet h-10 w-10 rounded-full top-5 right-5 ">
        {" "}
        <FaStar size={30} />
      </div>
      <div className="absolute flex justify-center items-center text-normalViolet h-10 w-10 rounded-full bottom-5 left-5 ">
        {" "}
        <FaStar size={30} />
      </div> */}
        </div>
      ) : (
        <div className="h-full flex flex-col justify-center items-center z-[1000]">
          {/* upper part  */}
          <div className="flex flex-col justify-center items-center">
            <div>
              <button className="logo-btn" data-text="Awesome">
                <span className="actual-text text-4xl">&nbsp;BUDA&nbsp;</span>
                <span aria-hidden="true" className="hover-text text-4xl">
                  &nbsp;BUDA&nbsp;
                </span>
              </button>
            </div>
            <p className="text-lg font-bold text-normalViolet mb-4 flex items-center gap-1">
              <FaRegFaceSadTear size={20} />{" "}
              <span>{workingHours.message}!</span>
              <FaRegFaceSadTear size={20} />
            </p>
          </div>

          {/* message part  */}
          <form
            className="flex flex-col items-center space-y-5 px-5 py-1 z-[1000]  overflow-hidden"
            onSubmit={handleSubmit(submitQuery)}
          >
            <div className="flex gap-3">
              <div className={`${LoginCSS.formGroup} w-3/4`}>
                <div className="indicator">
                  <span className="indicator-item badge badge-xs text-red-500 bg-[#FFFFFF]">
                    <IoMdStar />
                  </span>
                  <label htmlFor="name" className="inline-block font-bold">
                    Your Name
                  </label>
                </div>
                <input
                  className={`input input-bordered border-2 focus:border-violet-400 w-full max-w-xs  focus:outline-none bg-gray-100 ${LoginCSS.loginInput}`}
                  placeholder="John Doe"
                  type="text"
                  id="name"
                  {...register("name", { required: true })}
                />
                {/* errors will return when field validation fails  */}
                {/* {errors?.name && (
              <p className="text-normalViolet font-bold">
                This field is required
              </p>
            )} */}
              </div>

              <div className={`${LoginCSS.formGroup} `}>
                <div className="indicator">
                  <span className="indicator-item badge badge-xs text-red-500 bg-[#FFFFFF]">
                    <IoMdStar />
                  </span>
                  <label htmlFor="mobile" className="inline-block font-bold">
                    Mobile No
                  </label>
                </div>
                <input
                  type="number"
                  className={`input input-bordered w-full max-w-xs border-2 focus:border-violet-400 focus:outline-none bg-gray-100 ${LoginCSS.loginInput} focus:nm_Inset`}
                  placeholder="0983762839"
                  pattern="[0-9]+"
                  {...register("mobileNo", { required: true })}
                />
                {/* errors will return when field validation fails */}
                {/* {errors?.mobileNo && (
              <p className="text-normalViolet text-center font-bold">
                This field is required
              </p>
            )} */}
              </div>
            </div>

            {/* editor  */}
            <div className="w-full h-full">
              <div className="indicator">
                <span className="indicator-item badge badge-xs text-red-500 bg-[#FFFFFF]">
                  <IoMdStar />
                </span>
                <label htmlFor="mobile" className="inline-block font-bold">
                  Queries
                </label>
              </div>

              <TextEditor
                editorContent={editorContent}
                setEditorContent={setEditorContent}
              />
            </div>

            {loading ? (
              <button className="btn bg-black text-lg rounded-full border-none text-white hover:bg-black">
                <span className="loading loading-spinner"></span>
                loading
              </button>
            ) : (
              <input
                className="capitalize p-2 px-8 text-lg rounded-full text-white bg-black cursor-pointer transition-all duration-700"
                type="submit"
                value={`Submit`}
              />
            )}
          </form>

          <div className="absolute top-0 left-0 h-full w-full">
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 1000 1000"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              overflow="auto"
              shapeRendering="auto"
              fill="#ffffff"
            >
              <defs>
                <path
                  id="wavepath"
                  d="M 0 2000 0 500 Q 150 440 300 500 t 300 0 300 0 300 0 300 0 300 0  v1000 z"
                />
                <path id="motionpath" d="M -600 0 0 0" />
              </defs>
              <g>
                <use xlinkHref="#wavepath" y="415" fill="#7871e1">
                  <animateMotion dur="5s" repeatCount="indefinite">
                    <mpath xlinkHref="#motionpath" />
                  </animateMotion>
                </use>
              </g>
            </svg>
          </div>
        </div>
      )}

      {/* circle  */}
      <div className="absolute w-6 h-6 rounded-full -top-2 left-2/3 bg-blue-400 bg-gradient-to-r from-[#FF2967] to-[#ffab40]"></div>
      {workingHours.result && (
        <div className="absolute w-12 h-12 rounded-full top-[18%] -right-4 bg-white border-4 border-[#7945C5]"></div>
      )}
      <div className="absolute w-8 h-8 rounded-full top-[60%] -left-4 bg-gradient-to-br from-[#6e3bba] to-[#b478ff]"></div>
      <div className="absolute w-10 h-10 rounded-full top-2/3 -right-4 bg-gradient-to-tr from-[#ffb23c] to-[#ffc935]"></div>

      {/* triangle  */}
      {workingHours.result && (
        <div className=" absolute w-24 h-24 top-0 left-0 -rotate-90">
          <img src={triangle} alt="A triangle image" />
        </div>
      )}

      {workingHours.result && (
        <>
          {" "}
          {/* stair like line  */}
          <div className=" absolute w-28 h-28 bottom-0 -left-14 rotate-[170deg]">
            <img src={stairLikeLine} alt="A stair like line image" />
          </div>
          {/* // shape line draw */}
          <div className="absolute -bottom-16 -right-10 w-36 h-36">
            <img src={lineSvg} alt="svg image" />
          </div>
        </>
      )}
    </div>
  );
};

export default RequestPage;
