import axios from "axios";
import Lottie from "lottie-react";
import React, { useEffect, useRef, useState } from "react";
import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import errorAnimation from "../../../../../assets/Payment/Payment-Error.json";
import pendingAnimation from "../../../../../assets/Payment/Payment-Pending.json";
import successAnimation from "../../../../../assets/Payment/Payment-Success.json";
export default function PaymentStatus() {
  const params = useParams();
  const ref = useRef(null);
  const navigate = useNavigate();
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
        `http://localhost:5000/paymentStatus?orderId=${params?.orderId}`
      );

      setData(response?.data?.onlinePaymentStatus);

      console.log(response?.data, "response");
      const status = response?.data?.onlinePaymentStatus?.status;

      console.log(`Order status for order ${params.orderId}: ${status}`);

      if (status === "Charged" || status === "Failed") {
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

  return (
    <div className="p-5">
      <p className="fancy-button w-full text-center">Payment Status</p>
      <div className="flex justify-between items-center mt-4">
        <div className="grid grid-cols-2 basis-[45%]">
          {/* Order id  */}
          <p className="text-lg mt-4 font-bold">Order Id:</p>
          <p className="text-lg mt-4">{data?.order_id}</p>

          {/* TXN id  */}
          <p className="text-lg mt-4 font-bold">TXN Id:</p>
          <p className="text-lg mt-4">{data?.txn_detail?.txn_id}</p>

          {/* Email  */}
          <p className="text-lg mt-4 font-bold">Email:</p>
          <p className="text-lg mt-4">{data?.customer_email}</p>

          {/* Phone  */}
          <p className="text-lg mt-4 font-bold">Phone:</p>
          <p className="text-lg mt-4">{data?.customer_phone}</p>

          {/* Amount  */}
          <p className="text-lg mt-4 font-bold">Amount:</p>
          <p className="text-lg mt-4">{data?.amount}</p>

          {/* Payment method  */}
          <p className="text-lg mt-4 font-bold">Payment method:</p>
          <p className="text-lg mt-4">{data?.payment_method}</p>

          {/* Payment date  */}

          <p className="text-lg mt-4 font-bold">Payment Date:</p>
          <p className="text-lg mt-4">{getPaymentDate(data?.date_created)}</p>
        </div>

        <div className="basis-[45%]">
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

      <div className="flex justify-center mt-6">
        <button
          onClick={() => navigate("/dashboard/draftApplication/payment")}
          className="rounded-full p-3 fancy-button mt-3"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}
