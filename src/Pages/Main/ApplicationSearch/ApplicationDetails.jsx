import { motion } from "framer-motion";
import React, { useState } from "react";
import { AiOutlineFileDone } from "react-icons/ai";
import { BsHouses } from "react-icons/bs";
import { VscDebugContinue } from "react-icons/vsc";
import Application from "../../Dashboard/LtpDashboard/DraftApplication/Application";
import DrawingFileShowed from "../../Shared/DrawingFileShowed";
import ProceedingModalShowPdf from "../../Shared/ProceedingModalShowPdf";
import MainPageInput from "../MainPageInput";
export default function ApplicationDetails({
  totalApplications,
  applicationData,
}) {
  const [openApplication, setOpenApplication] = useState(false);
  const [openProceeding, setOpenProceeding] = useState(false);
  const [openDrawing, setOpenDrawing] = useState(false);

  console.log(applicationData);
  const titleClass = "basis-[50%] text-lg pl-3 font-semibold text-gray-900";
  return (
    <>
      <div className="flex justify-between items-center">
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
                className={`absolute inset-0  ${
                  ((applicationData?.status
                    ?.toLowerCase()
                    ?.includes("pending") ||
                    applicationData?.status === undefined) &&
                    "bg-violet-400") ||
                  (applicationData?.status
                    ?.toLowerCase()
                    ?.includes("approved") &&
                    "bg-green-400") ||
                  (applicationData?.status
                    ?.toLowerCase()
                    ?.includes("shortfall") &&
                    "bg-[#fad390]") ||
                  (applicationData?.status
                    ?.toLowerCase()
                    ?.includes("rejected") &&
                    "bg-red-400")
                } opacity-50 rounded-full nm_Container`}
              ></span>
              <span className="relative capitalize text-sm">
                {applicationData?.status?.split(" ")[0] ?? "Pending"}
              </span>
            </span>
          </div>
        )}
      </div>
      {/* Location details  */}
      <div className="mt-7">
        <div className="flex -mb-3">
          <motion.h3
            className={titleClass}
            initial={{ opacity: 0, x: -70 }}
            whileInView={{ opacity: 1, x: 0, transition: { duration: 0.5 } }}
            viewport={{ once: true }}
          >
            Location details
          </motion.h3>
          <motion.h3
            className={titleClass}
            initial={{ opacity: 0, x: 70 }}
            whileInView={{ opacity: 1, x: 0, transition: { duration: 0.5 } }}
            viewport={{ once: true }}
          >
            Building info
          </motion.h3>
        </div>

        <div className="px-2">
          <hr className="w-full h-[1px] inline-block bg-gray-400" />
        </div>

        <div className="flex -mt-2">
          <div className="basis-[50%]">
            <MainPageInput
              label="Survey no :"
              id="surveyNo"
              type="text"
              placeholder="xxxxxxx"
              ltpDetails={
                applicationData?.buildingInfo?.generalInformation?.surveyNo
              }
            />
            <MainPageInput
              label="Village :"
              id="village"
              type="text"
              placeholder="xxxxxxx"
              ltpDetails={
                applicationData?.buildingInfo?.generalInformation?.village
              }
            />
            <MainPageInput
              label="Mandal :"
              id="mandal"
              type="text"
              placeholder="xxxxxxx"
              ltpDetails={
                applicationData?.buildingInfo?.generalInformation?.mandal
              }
            />
            <MainPageInput
              label="District :"
              id="district"
              type="text"
              placeholder="xxxxxxx"
              ltpDetails={
                applicationData?.buildingInfo?.generalInformation?.district
              }
            />
          </div>

          <div className="basis-[50%]">
            <MainPageInput
              label="Net plot area :"
              id="netPlotArea"
              type="text"
              placeholder="xxxxxxx"
              ltpDetails={
                applicationData?.buildingInfo?.plotDetails?.netPlotAreaCal
              }
            />
            <MainPageInput
              label="No. of floors :"
              id="noOfFloors"
              type="text"
              placeholder="xxxxxxx"
              ltpDetails={
                applicationData?.buildingInfo?.plotDetails?.floorDetails?.length
              }
            />
            <MainPageInput
              label="N0. of units :"
              id="noOfUnits"
              type="text"
              placeholder="xxxxxxx"
              ltpDetails={applicationData?.buildingInfo?.plotDetails?.noOfUnits}
            />
            <MainPageInput
              label="Total built up area :"
              id="totalBuiltUpArea"
              type="text"
              placeholder="xxxxxxx"
              ltpDetails={
                applicationData?.buildingInfo?.plotDetails?.totalBuiltUpArea
              }
            />
          </div>
        </div>
      </div>

      {/* Owner details  */}
      <div className="mt-12">
        <div className="flex -mb-3">
          <motion.h3
            className={titleClass}
            initial={{ opacity: 0, x: -70 }}
            whileInView={{ opacity: 1, x: 0, transition: { duration: 0.5 } }}
            viewport={{ once: true }}
          >
            Owner details
          </motion.h3>
          <motion.h3
            className={titleClass}
            initial={{ opacity: 0, x: 70 }}
            whileInView={{ opacity: 1, x: 0, transition: { duration: 0.5 } }}
            viewport={{ once: true }}
          >
            LTP Details
          </motion.h3>
        </div>

        <div className="px-2">
          <hr className="w-full h-[1px] inline-block bg-gray-400" />
        </div>

        <div className="flex -mt-2">
          <div className="basis-[50%]">
            <MainPageInput
              label="Name :"
              id="name1"
              type="text"
              placeholder="xxxxxxx"
              ltpDetails={
                applicationData?.applicantInfo?.applicantDetails?.[0]?.name
              }
            />
            <MainPageInput
              label="Door no :"
              id="ownerDoorNo"
              type="text"
              placeholder="xxxxxxx"
              ltpDetails={
                applicationData?.applicantInfo?.applicantDetails?.[0]
                  ?.ownerDoorNo
              }
            />
            <MainPageInput
              label="Street name :"
              id="ownerStreetNo"
              type="text"
              placeholder="xxxxxxx"
              ltpDetails={
                applicationData?.applicantInfo?.applicantDetails?.[0]
                  ?.ownerStreetNo
              }
            />
          </div>

          <div className="basis-[50%]">
            <MainPageInput
              label="Name :"
              id="name2"
              type="text"
              placeholder="xxxxxxx"
              ltpDetails={applicationData?.applicantInfo?.ltpDetails?.name}
            />
            <MainPageInput
              label="Address :"
              id="address2"
              type="text"
              placeholder="xxxxxxx"
              ltpDetails={applicationData?.applicantInfo?.ltpDetails?.address}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-center items-center font-roboto mt-14 pb-9 space-x-10 dark:text-gray-600">
        <motion.button
          className="btn3D w-[100px] h-[75px] flex flex-col justify-center items-center"
          onClick={() => setOpenApplication(true)}
          disabled={applicationData === null}
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0, transition: { duration: 1 } }}
          viewport={{ once: true }}
        >
          <span className="grid justify-center items-center">
            <AiOutlineFileDone className="text-violet-500" size={25} />
          </span>
          <h4 className="text-base font-bold font-roboto">Application</h4>
        </motion.button>

        <motion.button
          className="btn3D w-[100px] h-[75px] flex flex-col justify-center items-center"
          onClick={() => setOpenDrawing(true)}
          disabled={
            applicationData === null ||
            applicationData?.status?.toLowerCase() !== "approved"
          }
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0, transition: { duration: 1 } }}
          viewport={{ once: true }}
        >
          <span className="grid justify-center items-center">
            <BsHouses className="text-violet-500" size={25} />
          </span>
          <h4 className="text-base font-bold font-roboto">Drawing</h4>
        </motion.button>

        <motion.button
          className="btn3D w-[100px] h-[75px] flex flex-col justify-center items-center"
          onClick={() => {
            setOpenProceeding(true);
          }}
          disabled={
            applicationData === null ||
            applicationData?.status?.toLowerCase() !== "approved"
          }
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0, transition: { duration: 1 } }}
          viewport={{ once: true }}
        >
          <span className="grid justify-center items-center">
            <VscDebugContinue className="text-violet-500" size={25} />
          </span>
          <h4 className="text-base font-bold font-roboto">Proceeding</h4>
        </motion.button>
      </div>

      {/* Application Modal */}
      {openApplication && applicationData ? (
        <Application
          key={applicationData?._id}
          setOpenApplication={setOpenApplication}
          filteredData={applicationData}
        />
      ) : (
        ""
      )}

      {/* proceedingModal modal info  */}
      {openProceeding && applicationData ? (
        <ProceedingModalShowPdf
          key={applicationData?._id}
          modalProceeding={{
            setOpenProceeding,
            openProceeding,
          }}
          searchAppData={applicationData}
        />
      ) : null}

      {/* drawing modal  */}
      {openDrawing && applicationData && (
        <DrawingFileShowed
          key={applicationData?._id}
          modalStates={{ openDrawing, setOpenDrawing }}
          searchAppData={applicationData}
        />
      )}
    </>
  );
}
