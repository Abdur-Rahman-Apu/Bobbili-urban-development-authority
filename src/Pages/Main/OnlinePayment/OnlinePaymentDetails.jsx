import { motion } from "framer-motion";
import React, { useState } from "react";
import { FaReceipt } from "react-icons/fa";
import { IoIosSend } from "react-icons/io";
import { Link } from "react-router-dom";
import { handlePaymentProcess } from "../../../services/paymentService";
import MainPageInput from "../MainPageInput";
export default function OnlinePaymentDetails({
  totalApplications,
  applicationData,
  textTypingAnimation,
}) {
  const { applicationNo, applicantInfo, userId, payment } = applicationData;
  const [loadingPayment, setLoadingPayment] = useState(false);

  const confirmMessageForPayment = () => {
    const amount = payment?.udaCharge?.UDATotalCharged;
    handlePaymentProcess(amount, setLoadingPayment, applicationData, "home");
    // Swal.fire({
    //   title: "Do you want to pay?",
    //   showCancelButton: true,
    //   confirmButtonText: "Yes",
    // }).then((result) => {
    //   if (result.isConfirmed) {
    //     // make a order

    //     console.log(amount, "amount");
    //     if (amount > 0) {
    //       const data = {
    //         amount: amount,
    //         customer_email: applicantInfo?.ltpDetails?.email,
    //         customer_phone: applicantInfo?.ltpDetails?.phoneNo,
    //         first_name: applicantInfo?.ltpDetails?.name,
    //         description: `Pay UDA fees`,
    //         applicationNo,
    //         userId,
    //         page: "home",
    //       };
    //       fetch(
    //         `${baseUrl}/initiateJuspayPayment`,
    //         // "http://localhost:5000/initiateJuspayPayment",
    //         {
    //           method: "POST",
    //           headers: {
    //             "Content-Type": "application/json",
    //           },
    //           body: JSON.stringify(data),
    //         }
    //       )
    //         .then((response) => {
    //           if (!response.ok) {
    //             throw new Error(`HTTP status code: ${response.status}`);
    //           }
    //           return response.json();
    //         })
    //         .then((data) => {
    //           console.log(data, "DATA");
    //           if (data.status === "NEW") {
    //             const url = data.payment_links.web;
    //             window.location.href = url;
    //           } else {
    //             toast.error(data.message);
    //           }
    //         })
    //         .catch((error) => {
    //           toast.error(error.message);
    //         });
    //     } else {
    //       toast.error("Please enter a valid amount");
    //     }
    //   }
    // });
  };

  return (
    <div>
      <div
        className={`flex ${
          totalApplications > 1 ? "justify-between" : "justify-end"
        } items-center`}
      >
        {totalApplications > 1 && (
          <p className="mt-7 mb-8 ml-3 font-bold text-lg text-black ">
            Application no :{" "}
            <span className="text-normalViolet">
              {applicationData?.applicationNo}
            </span>
          </p>
        )}

        {totalApplications > 0 && (
          <div>
            <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
              <span
                aria-hidden
                className={`absolute inset-0 bg-violet-400 opacity-50 rounded-full nm_Container`}
              ></span>
              <span className="relative capitalize text-sm">
                {payment?.udaCharge?.paymentId ? "paid" : "unpaid"}
              </span>
            </span>
          </div>
        )}
      </div>
      {/* Application details  */}
      <div className="mt-7">
        <div className="-mb-3">
          <motion.h3
            className="w-fit basis-[50%] text-black text-lg  pl-3 font-semibold"
            initial={{ opacity: 0, x: -70 }}
            whileInView={{ opacity: 1, x: 0, transition: { duration: 0.5 } }}
            viewport={{ once: true }}
          >
            Application details:
          </motion.h3>
        </div>

        <div className="px-2">
          <hr className="w-full h-[1px] inline-block bg-gray-400" />
        </div>

        <div className="flex -mt-2">
          <div className="basis-[50%]">
            <MainPageInput
              label="File no :"
              id="fileNo"
              type="text"
              placeholder="xxxxxxx"
              value={applicationNo}
              readOnly={true}
            />
            <MainPageInput
              label="Owner name :"
              id="applicantName"
              type="text"
              placeholder="xxxxxxx"
              value={applicantInfo?.applicantDetails?.[0].name}
              readOnly={true}
            />
            <MainPageInput
              label="Mandal :"
              id="mandal2"
              type="text"
              placeholder="xxxxxxx"
              value={applicationData?.buildingInfo?.generalInformation?.mandal}
              readOnly={true}
            />
          </div>

          <div className="basis-[50%]">
            <MainPageInput
              label="Case Type :"
              id="caseType"
              type="text"
              placeholder="xxxxxxx"
              value={
                applicationData?.buildingInfo?.generalInformation?.caseType
              }
              readOnly={true}
            />
            <MainPageInput
              label="Village name :"
              id="villageName"
              type="text"
              placeholder="xxxxxxx"
              value={applicationData?.buildingInfo?.generalInformation?.village}
              readOnly={true}
            />
            <MainPageInput
              label="District :"
              id="district2"
              type="text"
              placeholder="xxxxxxx"
              value={
                applicationData?.buildingInfo?.generalInformation?.district
              }
              readOnly={true}
            />
          </div>
        </div>
      </div>

      {/* Fees details  */}
      <div className="mt-12">
        <div className="flex -mb-3">
          <motion.h3
            className="basis-[50%] text-lg pl-3 font-semibold text-gray-900"
            initial={{ opacity: 0, x: -70 }}
            whileInView={{ opacity: 1, x: 0, transition: { duration: 0.5 } }}
            viewport={{ once: true }}
          >
            Fees details:
          </motion.h3>
        </div>

        <div className="px-2">
          <hr className="w-full h-[1px] inline-block bg-gray-400" />
        </div>

        <div className="flex -mt-2">
          <div className="basis-[70%]">
            <MainPageInput
              label="UDA charges :"
              id="udaCharges"
              type="text"
              placeholder="xxxxxxx"
              value={payment?.udaCharge?.UDATotalCharged}
              readOnly={true}
            />
            <MainPageInput
              label="Grama Panchayat fee :"
              id="gramaPanchayatFee"
              type="text"
              placeholder="xxxxxxx"
              value={payment?.gramaPanchayatFee?.GramaPanchayetTotalCharged}
              readOnly={true}
            />
            <MainPageInput
              label="Labour cess charge :"
              id="labourCessCharge"
              type="text"
              placeholder="xxxxxxx"
              value={payment?.labourCessCharge?.labourCessOne}
              readOnly={true}
            />
            <MainPageInput
              label="Green fee charge :"
              id="greenFeeCharge"
              type="text"
              placeholder="xxxxxxx"
              value={payment?.greenFeeCharge?.greenFee}
              readOnly={true}
            />
            {/* <MainPageInput
              label="Online Pay :"
              id={`OnlinePay`}
              type="number"
              placeholder="xxxxxxx"
              // value={applicationData?.payment?.greenFeeCharge?.greenFee}
            /> */}
          </div>
        </div>
      </div>

      <div className="flex justify-center items-center px-3 mt-5 text-gray-600">
        <motion.h3
          className="text-base font-semibold"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0, transition: { duration: 1 } }}
          viewport={{ once: true }}
        >
          {textTypingAnimation(
            `For UDA charge you can pay only Rs.
          ${
            payment?.udaCharge?.UDATotalCharged
              ? payment?.udaCharge?.UDATotalCharged
              : "xxxxxxx"
          }
          /= fee online, remaining all fee DD/Challan can be attached in LTP
          login only.`.split(" ")
          )}
        </motion.h3>
      </div>

      {payment?.udaCharge?.paymentId ? (
        <div className="flex justify-end">
          <Link
            className={`save-btn bg-[#8980FD] px-3 py-2 rounded-full nm_Container text-sm flex justify-center items-center mt-3 mb-3 gap-2`}
            to={`/onlinePayment/paymentStatus/${payment?.udaCharge?.paymentId}`}
          >
            <span className="ml-1 ">Receipt</span>
            <FaReceipt size={16} />
          </Link>
        </div>
      ) : (
        <motion.div
          className="flex justify-end px-3 pb-6"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0, transition: { duration: 1 } }}
          viewport={{ once: true }}
        >
          <button
            className={`save-btn bg-[#8980FD] px-3 py-2 rounded-full nm_Container text-sm flex justify-center items-center`}
            onClick={confirmMessageForPayment}
            disabled={applicationData?.length === 0}
          >
            <IoIosSend size={20} />
            <span className="ml-1 ">
              {loadingPayment ? "paying" : "pay now"}
            </span>
          </button>
        </motion.div>
      )}
    </div>
  );
}
