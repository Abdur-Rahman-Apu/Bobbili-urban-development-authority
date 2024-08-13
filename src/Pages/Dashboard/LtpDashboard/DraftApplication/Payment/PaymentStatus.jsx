import Lottie from "lottie-react";
import React, { useState } from "react";
import { RiArrowGoBackFill } from "react-icons/ri";
import {
  useLoaderData,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import Swal from "sweetalert2";
import errorAnimation from "../../../../../assets/Payment/Payment-Error.json";
import successAnimation from "../../../../../assets/Payment/Payment-Success.json";
import { handlePaymentRequest } from "../../../../../services/paymentService";

export default function PaymentStatus() {
  const params = useParams();
  const navigate = useNavigate();
  const pathName = useLocation()?.pathname;
  const [loadingPayment, setLoadingPayment] = useState(false);

  console.log(pathName, "pathName");

  console.log(params, "params");
  const loader = useLoaderData();

  console.log(loader, "loader");

  const paymentStatus = loader?.order_status?.toLowerCase()?.includes("success")
    ? successAnimation
    : errorAnimation;

  const goBack = () => {
    if (pathName.includes("onlinePayment")) {
      navigate("/onlinePayment");
    } else {
      navigate("/dashboard/draftApplication/payment");
    }
  };

  const isEligibleForRetry = loader?.order_status?.toLowerCase() !== "success";

  const retryPayment = () => {
    console.log(loader, "Data in retry payment");
    Swal.fire({
      title: "Do you want to pay?",
      showCancelButton: true,
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        // make a order
        console.log(loader, "Data in payment status");

        setLoadingPayment(true);

        const initialData = {
          applicationNo: loader?.applicationNo,
          amount: loader?.amount,
          billing_name: loader?.billing_name,
          billing_email: loader?.billing_email,
          billing_tel: loader?.billing_tel,
        };

        const pageName = pathName?.includes("dashboard") ? "dashboard" : "home";

        const finalData = {
          ...initialData,
          page: pageName,
        };

        console.log(finalData, "payment data");

        handlePaymentRequest(initialData, finalData, setLoadingPayment);
      }
    });
  };

  return (
    <div className="h-full font-roboto w-full px-5 mt-5">
      <p className="fancy-button w-full text-center">Payment Status</p>
      <div className="flex justify-between items-center mt-4 flex-wrap">
        <div
          className={`grid grid-cols-2 ${
            pathName.includes("onlinePayment") ? "basis-full" : "basis-[45%]"
          }`}
        >
          {/* Order id  */}
          <p className="text-lg mt-4 font-bold">Order Id:</p>
          <p className="text-lg mt-4 break-words">{loader?.order_id}</p>

          {/* TXN id  */}
          <p className="text-lg mt-4 font-bold">Tracking Id:</p>
          <p className="text-lg mt-4 break-words">{loader?.tracking_id}</p>

          {/* Name  */}
          <p className="text-lg mt-4 font-bold">Name:</p>
          <p className="text-lg mt-4 break-words">{loader?.billing_name}</p>

          {/* Email  */}
          <p className="text-lg mt-4 font-bold">Email:</p>
          <p className="text-lg mt-4 break-words">{loader?.billing_email}</p>

          {/* Phone  */}
          <p className="text-lg mt-4 font-bold">Phone:</p>
          <p className="text-lg mt-4 break-words">{loader?.billing_tel}</p>

          {/* Amount  */}
          <p className="text-lg mt-4 font-bold">Amount:</p>
          <p className="text-lg mt-4 break-words">₹{loader?.amount}</p>

          {/* Payment method  */}
          {loader?.payment_mode && (
            <>
              <p className="text-lg mt-4 font-bold">Payment method:</p>
              <p className="text-lg mt-4 break-words">{loader?.payment_mode}</p>
            </>
          )}

          {/* Payment date  */}

          <p className="text-lg mt-4 font-bold">Payment Date:</p>
          <p className="text-lg mt-4 break-words">{loader?.trans_date}</p>

          {/* payment status  */}
          <p className="text-lg mt-4 font-bold">Status:</p>
          <p className="text-lg mt-4 break-words">{loader?.order_status}</p>
        </div>

        <div
          className={`${
            pathName.includes("onlinePayment") ? "basis-full" : "basis-[45%]"
          }`}
        >
          <Lottie
            animationData={paymentStatus}
            loop={true}
            className="w-[50%] lg:w-[70%] mx-auto"
          />

          <p className="text-center text-lg font-bold text-normalViolet capitalize">
            {loader?.status_message}
          </p>
        </div>
      </div>

      <div className="flex justify-center items-center gap-5 mt-6">
        {isEligibleForRetry && (
          <button
            onClick={retryPayment}
            className="rounded-full px-4 fancy-button my-3"
          >
            {loadingPayment ? "Paying ⏱" : "Try again ⟳"}
          </button>
        )}
        <button
          onClick={goBack}
          className=" flex justify-center items-center gap-1 rounded-full bg-black text-white p-3 my-3 nm_Container hover:scale-110 transition-transform"
        >
          Go Back <RiArrowGoBackFill />
        </button>
      </div>
    </div>
  );
}
