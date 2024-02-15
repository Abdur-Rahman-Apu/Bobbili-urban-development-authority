import React, { useContext, useEffect, useState } from "react";
import MainPageInput from "../MainPageInput";
import { GiMoneyStack } from "react-icons/gi";
import { IoIosSend, IoMdSend } from "react-icons/io";
import { AuthContext } from "../../../AuthProvider/AuthProvider";
import HomeCss from "../../../Style/Home.module.css";
import { motion } from "framer-motion";

const OnlinePayment = () => {
  const [applicationData, setApplicationData] = useState([]);
  const [filteredData, setFilteredData] = useState(null);

  const { getAllDraftApplicationData, textTypingAnimation } =
    useContext(AuthContext);

  useEffect(() => {
    getAllDraftApplicationData().then((data) => {
      console.log(data);
      setApplicationData(data);
    });
  }, []);

  //   console.log(applicationData, "APPLICATION DATA");
  const searchApplicationData = (e) => {
    const value = e.target.value;

    console.log(value, "FILTER DATA");

    if (value.includes("BUDA/2023")) {
      //  search by application No
      setFilteredData(
        applicationData.find((data) => data.applicationNo === value)
      );
    } else {
      console.log("Asci");

      setFilteredData(
        applicationData.find(
          (data) =>
            data?.applicantInfo?.applicantDetails[0]?.name.toLowerCase() ===
            value.toLowerCase()
        )
      );

      console.log(
        applicationData.find(
          (data) => data?.applicantInfo?.applicantDetails[0]?.name === value
        )
      );
    }
  };

  // const textTypingAnimation = (text) => {
  //   return text.map((el, i) => (
  //     <motion.span
  //       initial={{ opacity: 0 }}
  //       animate={{ opacity: 1 }}
  //       transition={{
  //         duration: 0.25,
  //         delay: i / 6,
  //       }}
  //       key={i}
  //     >
  //       {el}{" "}
  //     </motion.span>
  //   ));
  // };
  console.log(filteredData, "FILTERED DATA");


  return (
    <div className="h-full font-roboto w-full px-2 mt-5 bg-[#E8EAEC]">
      <motion.div className={`${HomeCss.searchInputContainer} mx-2`}
        // initial={{ opacity: 0, x: -40, y: -40 }}
        // whileInView={{ opacity: 1, x: 0, y: 0, transition: { duration: 0.5 } }}
        // viewport={{ once: true }}
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 1, scale: 1.0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <input
          placeholder="Application no. or owner name"
          className={`${HomeCss.searchInput} text-gray-900 focus:border-violet-500 focus:outline-none focus:ring-2 ring-violet-100`}
          name="text"
          type="text"
          onChange={(e) => searchApplicationData(e)}
          required
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className={`${HomeCss.searchIcon}`}
        >
          <g strokeWidth="0" id="SVGRepo_bgCarrier"></g>
          <g
            strokeLinejoin="round"
            strokeLinecap="round"
            id="SVGRepo_tracerCarrier"
          ></g>
          <g id="SVGRepo_iconCarrier">
            {" "}
            <rect fill="white"></rect>{" "}
            <path
              d="M7.25007 2.38782C8.54878 2.0992 10.1243 2 12 2C13.8757 2 15.4512 2.0992 16.7499 2.38782C18.06 2.67897 19.1488 3.176 19.9864 4.01358C20.824 4.85116 21.321 5.94002 21.6122 7.25007C21.9008 8.54878 22 10.1243 22 12C22 13.8757 21.9008 15.4512 21.6122 16.7499C21.321 18.06 20.824 19.1488 19.9864 19.9864C19.1488 20.824 18.06 21.321 16.7499 21.6122C15.4512 21.9008 13.8757 22 12 22C10.1243 22 8.54878 21.9008 7.25007 21.6122C5.94002 21.321 4.85116 20.824 4.01358 19.9864C3.176 19.1488 2.67897 18.06 2.38782 16.7499C2.0992 15.4512 2 13.8757 2 12C2 10.1243 2.0992 8.54878 2.38782 7.25007C2.67897 5.94002 3.176 4.85116 4.01358 4.01358C4.85116 3.176 5.94002 2.67897 7.25007 2.38782ZM9 11.5C9 10.1193 10.1193 9 11.5 9C12.8807 9 14 10.1193 14 11.5C14 12.8807 12.8807 14 11.5 14C10.1193 14 9 12.8807 9 11.5ZM11.5 7C9.01472 7 7 9.01472 7 11.5C7 13.9853 9.01472 16 11.5 16C12.3805 16 13.202 15.7471 13.8957 15.31L15.2929 16.7071C15.6834 17.0976 16.3166 17.0976 16.7071 16.7071C17.0976 16.3166 17.0976 15.6834 16.7071 15.2929L15.31 13.8957C15.7471 13.202 16 12.3805 16 11.5C16 9.01472 13.9853 7 11.5 7Z"
              clipRule="evenodd"
              fillRule="evenodd"
            ></path>{" "}
          </g>
        </svg>
      </motion.div>

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
              ltpDetails={filteredData?.applicationNo}
            />
            <MainPageInput
              label="Owner name :"
              id="applicantName"
              type="text"
              placeholder="xxxxxxx"
              ltpDetails={
                filteredData?.applicantInfo?.applicantDetails?.[0].name
              }
            />
            <MainPageInput
              label="Mandal :"
              id="mandal2"
              type="text"
              placeholder="xxxxxxx"
              ltpDetails={
                filteredData?.buildingInfo?.generalInformation?.mandal
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
                filteredData?.buildingInfo?.generalInformation?.caseType
              }
            />
            <MainPageInput
              label="Village name :"
              id="villageName"
              type="text"
              placeholder="xxxxxxx"
              ltpDetails={
                filteredData?.buildingInfo?.generalInformation?.village
              }
            />
            <MainPageInput
              label="District :"
              id="district2"
              type="text"
              placeholder="xxxxxxx"
              ltpDetails={
                filteredData?.buildingInfo?.generalInformation?.district
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
              ltpDetails={filteredData?.payment?.udaCharge?.UDATotalCharged}
            />
            <MainPageInput
              label="Grama Panchayat fee :"
              id="gramaPanchayatFee"
              type="text"
              placeholder="xxxxxxx"
              ltpDetails={
                filteredData?.payment?.gramaPanchayatFee
                  ?.GramaPanchayetTotalCharged
              }
            />
            <MainPageInput
              label="Labour cess charge :"
              id="labourCessCharge"
              type="text"
              placeholder="xxxxxxx"
              ltpDetails={
                filteredData?.payment?.labourCessCharge?.labourCessOne
              }
            />
            <MainPageInput
              label="Green fee charge :"
              id="greenFeeCharge"
              type="text"
              placeholder="xxxxxxx"
              ltpDetails={filteredData?.payment?.greenFeeCharge?.greenFee}
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
          ${filteredData?.payment?.udaCharge?.UDATotalCharged
                ? filteredData?.payment?.udaCharge?.UDATotalCharged
                : "xxxxxxx"
              }
          /= fee online, remaining all fee DD/Challan can be attached in LTP
          login only.`.split(" ")
          )}
        </motion.h3>
      </div>

      <motion.div
        className="flex justify-end px-3 pb-6"
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0, transition: { duration: 1 } }}
        viewport={{ once: true }}
      >
        <button
          className={`save-btn bg-[#8980FD] px-3 py-2 rounded-full nm_Container text-sm flex justify-center items-center`}
        >
          <IoIosSend size={20} />
          <span className="ml-1 ">pay now</span>
        </button>
      </motion.div>
    </div>
  );
};

export default OnlinePayment;
