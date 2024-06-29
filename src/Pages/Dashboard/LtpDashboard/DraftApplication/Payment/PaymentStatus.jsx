import axios from "axios";
import Lottie from "lottie-react";
import React, { useEffect, useRef, useState } from "react";
import { RiArrowGoBackFill } from "react-icons/ri";
import {
  useLoaderData,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import Swal from "sweetalert2";
import errorAnimation from "../../../../../assets/Payment/Payment-Error.json";
import pendingAnimation from "../../../../../assets/Payment/Payment-Pending.json";
import successAnimation from "../../../../../assets/Payment/Payment-Success.json";

export default function PaymentStatus() {
  const params = useParams();
  const ref = useRef(null);
  const navigate = useNavigate();
  const pathName = useLocation()?.pathname;
  console.log(pathName, "pathName");
  const [data, setData] = useState([]);
  console.log(params, "params");
  const loader = useLoaderData();

  console.log(loader, "loader");

  useEffect(() => {
    setData(loader?.onlinePaymentStatus);
  }, [loader]);

  // Function to fetch order status
  async function fetchOrderStatus() {
    try {
      const response = await axios.get(
        `https://residential-building.onrender.com/paymentStatus?orderId=${params?.orderId}`
      );
      // const response = await axios.get(
      //   `http://localhost:5000/paymentStatus?orderId=${params?.orderId}`
      // );

      setData(response?.data?.onlinePaymentStatus);

      console.log(response?.data, "response");
      const status = response?.data?.onlinePaymentStatus?.status;

      console.log(`Order status for order ${params.orderId}: ${status}`);

      if (
        status.toLowerCase().includes("charged") ||
        status.toLowerCase().includes("failed")
      ) {
        clearInterval(ref.current); // Stop polling if terminal status is received
        console.log("Polling stopped.");
      }
    } catch (error) {
      console.error("Error fetching order status:", error);
    }
  }

  // TODO: If pending then recall after 15 sec
  useEffect(() => {
    clearInterval(ref.current);
    // Start polling at specified intervals
    ref.current = setInterval(fetchOrderStatus, 3000);

    console.log("Polling stopped after order fulfillment window.");

    return () => {
      clearInterval(ref.current);
    };
  }, []);

  // TODO: GET payment status

  const paymentStatus = data?.status?.toLowerCase()?.includes("pending")
    ? pendingAnimation
    : data?.status?.toLowerCase()?.includes("failed")
    ? errorAnimation
    : successAnimation;

  const getPaymentDate = (date) => {
    if (date) {
      return date?.split("T")[0]?.split("-")?.reverse()?.join("-");
    }
    return date;
  };

  const goBack = () => {
    if (pathName.includes("onlinePayment")) {
      navigate("/onlinePayment");
    } else {
      navigate("/dashboard/draftApplication/payment");
    }
  };

  const isEligibleForRetry =
    data?.status === "AUTHENTICATION_FAILED" ||
    data?.status === "AUTHORIZATION_FAILED";

  const [loadingPayment, setLoadingPayment] = useState(false);
  const retryPayment = () => {
    Swal.fire({
      title: "Do you want to pay?",
      showCancelButton: true,
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        // make a order

        setLoadingPayment(true);
        const data = {
          amount: data?.onlinePaymentStatus?.amount,
          customer_email: data?.onlinePaymentStatus?.customer_email,
          customer_phone: data?.onlinePaymentStatus?.customer_phone,
          first_name: data?.applicantInfo?.ltpDetails?.name,
          description: `Pay UDA fees`,
          applicationNo: data?.applicationNo,
          userId: data?._id,
          page: "dashboard",
        };

        fetch(
          "https://residential-building.onrender.com/storePaymentInfo",
          // "http://localhost:5000/storePaymentInfo",
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              authorization: localStorage.getItem("jwToken"),
            },
            body: JSON.stringify({
              applicationNo: data.applicationNo,
              amount: data?.onlinePaymentStatus?.amount,
              customer_email: data?.onlinePaymentStatus?.customer_email,
              customer_phone: data?.onlinePaymentStatus?.customer_phone,
            }),
          }
        )
          .then((res) => res.json())
          .then((storeResult) => {
            console.log(storeResult, "Store payment");

            if (storeResult.acknowledged) {
              fetch(
                "https://residential-building.onrender.com/initiateJuspayPayment",
                // "http://localhost:5000/initiateJuspayPayment",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    authorization: localStorage.getItem("jwToken"),
                  },
                  body: JSON.stringify(data),
                }
              )
                .then((response) => {
                  if (!response.ok) {
                    setLoadingPayment(false);
                    throw new Error(`HTTP status code: ${response.status}`);
                  }
                  return response.json();
                })
                .then((paymentResponse) => {
                  console.log(paymentResponse, "DATA");
                  if (paymentResponse.status === "NEW") {
                    const url = paymentResponse.payment_links.web;
                    window.location.href = url;
                  } else {
                    toast.error(paymentResponse.message);
                  }
                  setLoadingPayment(false);
                })
                .catch((error) => {
                  toast.error(error.message);
                });
            } else {
              setLoadingPayment(false);
              toast.error("Failed to make payment");
            }
          })
          .catch((err) => {
            setLoadingPayment(false);
            toast.error("Failed to make payment");
          });
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
          <p className="text-lg mt-4 break-words">{data?.order_id}</p>

          {/* TXN id  */}
          <p className="text-lg mt-4 font-bold">TXN Id:</p>
          <p className="text-lg mt-4 break-words">{data?.txn_id}</p>

          {/* Email  */}
          <p className="text-lg mt-4 font-bold">Email:</p>
          <p className="text-lg mt-4 break-words">{data?.customer_email}</p>

          {/* Phone  */}
          <p className="text-lg mt-4 font-bold">Phone:</p>
          <p className="text-lg mt-4 break-words">{data?.customer_phone}</p>

          {/* Amount  */}
          <p className="text-lg mt-4 font-bold">Amount:</p>
          <p className="text-lg mt-4 break-words">₹{data?.amount}</p>

          {/* Payment method  */}
          <p className="text-lg mt-4 font-bold">Payment method:</p>
          <p className="text-lg mt-4 break-words">{data?.payment_method}</p>

          {/* Payment date  */}

          <p className="text-lg mt-4 font-bold">Payment Date:</p>
          <p className="text-lg mt-4 break-words">
            {getPaymentDate(data?.date_created)}
          </p>
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
            {data?.message}
          </p>
        </div>
      </div>

      <div className="flex justify-center items-center gap-5 mt-6">
        {isEligibleForRetry && (
          <button
            onClick={retryPayment}
            className="rounded-full px-4 fancy-button my-3"
          >
            {loadingPayment ? "Paying..." : "Try again ⟳"}
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
