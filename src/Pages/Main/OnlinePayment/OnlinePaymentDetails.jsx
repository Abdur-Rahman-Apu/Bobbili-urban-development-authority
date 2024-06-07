import { motion } from "framer-motion";
import React from "react";
import toast from "react-hot-toast";
import { IoIosSend } from "react-icons/io";
import Swal from "sweetalert2";
import MainPageInput from "../MainPageInput";
export default function OnlinePaymentDetails({
  totalApplications,
  applicationData,
  textTypingAnimation,
}) {
  const { applicationNo, applicantInfo, userId } = applicationData;

  const confirmMessageForPayment = () => {
    Swal.fire({
      title: "Do you want to pay?",
      showCancelButton: true,
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        // make a order

        const amount = document.getElementById("OnlinePay")?.value;
        console.log(amount, "amount");
        if (amount > 0) {
          const data = {
            amount: amount,
            customer_email: applicantInfo?.ltpDetails?.email,
            customer_phone: applicantInfo?.ltpDetails?.phoneNo,
            first_name: applicantInfo?.ltpDetails?.name,
            description: `Pay UDA fees`,
            applicationNo,
            userId,
            page: "home",
          };
          fetch(
            "https://residential-building.onrender.com/initiateJuspayPayment",
            // "http://localhost:5000/initiateJuspayPayment",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(data),
            }
          )
            .then((response) => {
              if (!response.ok) {
                throw new Error(`HTTP status code: ${response.status}`);
              }
              return response.json();
            })
            .then((data) => {
              console.log(data, "DATA");
              if (data.status === "NEW") {
                const url = data.payment_links.web;
                window.location.href = url;
              } else {
                toast.error(data.message);
              }
            })
            .catch((error) => {
              toast.error(error.message);
            });
        } else {
          toast.error("Please enter a valid amount");
        }
      }
    });
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
              <span className="relative capitalize text-sm">pending</span>
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
              ltpDetails={applicationData?.applicationNo}
            />
            <MainPageInput
              label="Owner name :"
              id="applicantName"
              type="text"
              placeholder="xxxxxxx"
              ltpDetails={
                applicationData?.applicantInfo?.applicantDetails?.[0].name
              }
            />
            <MainPageInput
              label="Mandal :"
              id="mandal2"
              type="text"
              placeholder="xxxxxxx"
              ltpDetails={
                applicationData?.buildingInfo?.generalInformation?.mandal
              }
            />
          </div>

          <div className="basis-[50%]">
            <MainPageInput
              label="Case Type :"
              id="caseType"
              type="text"
              placeholder="xxxxxxx"
              ltpDetails={
                applicationData?.buildingInfo?.generalInformation?.caseType
              }
            />
            <MainPageInput
              label="Village name :"
              id="villageName"
              type="text"
              placeholder="xxxxxxx"
              ltpDetails={
                applicationData?.buildingInfo?.generalInformation?.village
              }
            />
            <MainPageInput
              label="District :"
              id="district2"
              type="text"
              placeholder="xxxxxxx"
              ltpDetails={
                applicationData?.buildingInfo?.generalInformation?.district
              }
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
              ltpDetails={applicationData?.payment?.udaCharge?.UDATotalCharged}
            />
            <MainPageInput
              label="Grama Panchayat fee :"
              id="gramaPanchayatFee"
              type="text"
              placeholder="xxxxxxx"
              ltpDetails={
                applicationData?.payment?.gramaPanchayatFee
                  ?.GramaPanchayetTotalCharged
              }
            />
            <MainPageInput
              label="Labour cess charge :"
              id="labourCessCharge"
              type="text"
              placeholder="xxxxxxx"
              ltpDetails={
                applicationData?.payment?.labourCessCharge?.labourCessOne
              }
            />
            <MainPageInput
              label="Green fee charge :"
              id="greenFeeCharge"
              type="text"
              placeholder="xxxxxxx"
              ltpDetails={applicationData?.payment?.greenFeeCharge?.greenFee}
            />
            <MainPageInput
              label="Online Pay :"
              id={`OnlinePay`}
              type="number"
              placeholder="xxxxxxx"
              // ltpDetails={applicationData?.payment?.greenFeeCharge?.greenFee}
            />
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
            applicationData?.payment?.udaCharge?.UDATotalCharged
              ? applicationData?.payment?.udaCharge?.UDATotalCharged
              : "xxxxxxx"
          }
          /= fee online, remaining all fee DD/Challan can be attached in LTP
          login only.`.split(" ")
          )}
        </motion.h3>
      </div>

      {applicationData?.onlinePaymentStatus?.order_id ? (
        <div className="flex justify-end">
          <button
            className={`save-btn bg-[#8980FD] px-3 py-2 rounded-full nm_Container text-sm flex justify-center items-center mt-3 mb-3`}
          >
            <IoIosSend size={20} />
            <span className="ml-1 ">
              {applicationData?.onlinePaymentStatus?.status}
            </span>
          </button>
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
            <span className="ml-1 ">pay now</span>
          </button>
        </motion.div>
      )}
    </div>
  );
}
