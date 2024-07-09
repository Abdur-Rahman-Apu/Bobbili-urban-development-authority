import React, { useContext, useState } from "react";
import toast from "react-hot-toast";
import { Link, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../../../AuthProvider/AuthProvider";
import { baseUrl } from "../../../utils/api";
import OtpModal from "../../Shared/OtpModal";
import Login from "../Login/Login";
import ForgotPasswordModal from "./ForgotPasswordModal";

const Home = () => {
  const { userInfoFromCookie } = useContext(AuthContext);
  const path = useLocation().pathname;
  const [isOpenForgotPassModal, setIsOpenForgotPassModal] = useState(false);
  // console.log(path);
  const hoverGradientColor = "hover:bg-[#8B5BF6] hover:text-white";
  const active = "nm_Container font-bold bg-[#8B5BF6] text-white";
  const menu = (
    <>
      <Link
        to="/"
        type="button"
        className={`relative inline-flex items-center w-full h-full px-4 py-2 text-base border-b border-gray-200 rounded-t-lg ${hoverGradientColor} ${
          path.length === 1 && path.includes("/") ? active : ""
        }`}
      >
        Application Search
      </Link>
      <Link
        to="/onlinePayment"
        type="button"
        className={`relative inline-flex items-center w-full h-full px-4 py-2 text-base border-b border-gray-200  ${hoverGradientColor} ${
          path.includes("onlinePayment") ? active : ""
        }`}
      >
        Online Payment
      </Link>
      <Link
        to="/listOfLTP"
        type="button"
        className={`relative inline-flex items-center w-full h-full px-4 py-2 text-base  border-b border-gray-200 ${hoverGradientColor} ${
          path.includes("listOfLTP") ? active : ""
        }`}
      >
        List of LTP's
      </Link>
      <Link
        to="/demoVideos"
        type="button"
        className={`relative inline-flex items-center w-full h-full px-4 py-2 text-base border-b ${hoverGradientColor} ${
          path.includes("demoVideos") ? active : ""
        }`}
      >
        Demo Videos
      </Link>
      <Link
        to="/privacyPolicy"
        type="button"
        className={`relative inline-flex items-center w-full h-full px-4 py-2 text-base  border-b ${hoverGradientColor} ${
          path.includes("privacyPolicy") ? active : ""
        }`}
      >
        Privacy Policy
      </Link>
      <Link
        to="/defaultDrawingFormat"
        type="button"
        className={`relative inline-flex items-center w-full h-full px-4 py-2 text-base border-b ${hoverGradientColor} ${
          path.includes("defaultDrawingFormat") ? active : ""
        }`}
      >
        Default Drawing Format
      </Link>
    </>
  );

  const [loading, setLoading] = useState(false);
  const [resetPassFormData, setResetPassFormData] = useState({});
  const [showOtpModal, setShowOtpModal] = useState(false);

  const handleShowOtpModal = () => {
    setShowOtpModal(!showOtpModal);
  };

  const handleOtpStoreInDb = (resetData, setOtpStoreError) => {
    console.log(resetData);
    setLoading(true);
    setOtpStoreError("");
    setResetPassFormData({ ...resetData });
    // const otp=otpGenerator()
    const otp = "1235";
    const data = {
      userId: resetData?.id,
      otp,
    };
    fetch(`${baseUrl}/forgotPassOtp/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result, "result");
        if (result?.acknowledged) {
          setLoading(false);
          setIsOpenForgotPassModal(false);
          handleShowOtpModal();
        }
      })
      .catch((err) => {
        setLoading(false);
        setOtpStoreError("Something went wrong");
      });
  };

  const handleOtpMatching = (otp, setOtpLoading, setOtpError) => {
    setOtpLoading(true);
    setOtpError("");
    console.log(otp, "OTP");
    const data = {
      userId: resetPassFormData?.id,
      otp,
      password: resetPassFormData?.password,
    };
    fetch(`${baseUrl}/forgotPassOtp/matchOtp?data=${JSON.stringify(data)}`)
      .then((res) => res.json())
      .then((result) => {
        console.log(result, "OTP match");
        if (result?.otpMatched) {
          handleShowOtpModal();
          toast.success("Your Password reset successfully");
        } else {
          setOtpLoading(false);
          setOtpError("Your otp is not matched");
        }
      })
      .catch((err) => {
        setOtpLoading(false);
        setOtpError("Server Error");
      });
  };

  return (
    <>
      {/* forgot password modal  */}

      {isOpenForgotPassModal && (
        <ForgotPasswordModal
          modalStates={{
            isOpenForgotPassModal,
            setIsOpenForgotPassModal,
            loading,
            handleOtpStoreInDb,
          }}
        />
      )}

      {/* otp ui  */}
      {showOtpModal && (
        <OtpModal
          showOtpModal={showOtpModal}
          setShowOtpModal={setShowOtpModal}
          handleOtpMatching={handleOtpMatching}
        />
      )}
      <div className="w-full grid lg:grid-cols-[200px_minmax(700px,_1fr)_284px] pt-6">
        {/* sidebar menus  */}
        <div className="nm_Container hidden lg:flex lg:flex-col z-[10] w-full text-base justify-between bg-[#E8EAEC] text-black border border-gray-200 rounded-lg">
          {menu}
        </div>

        {/* Scrollable content */}
        <div
          className={`overflow-hidden relative overflow-y-auto nm_Container hidden lg:flex lg:h-[410px] rounded-lg mx-4 z-[10] items-center bg-[#E8EAEC]`}
        >
          <Outlet />
        </div>

        <div className="nm_Container z-[10]  overflow-hidden bg-[#E8EAEC]">
          <Login onShowForgotPassModal={() => setIsOpenForgotPassModal(true)} />
        </div>
      </div>
    </>
  );
};

export default Home;
