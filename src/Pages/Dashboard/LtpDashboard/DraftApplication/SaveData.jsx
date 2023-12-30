import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { AuthContext } from "../../../../AuthProvider/AuthProvider";
import { MdOutlineSaveAs } from "react-icons/md";
import ArrowIcon from "../../../Components/ArrowIcon";
import BtnStyle from "../../../../Style/SaveBtnStyle.module.css";
import { BsFillSaveFill } from "react-icons/bs";
import { TbFileLike } from "react-icons/tb";
import { TiCancel } from "react-icons/ti";
import toast from "react-hot-toast";

const SaveData = ({
  isStepperVisible,
  currentStep,
  steps,
  confirmAlert,
  stepperData,
  collectInputFieldData,
  sentToPS,
  setSentData,
  sentData,
  isApproved,
  refetch,
}) => {

  const {
    userInfoFromLocalStorage,
    needToHideElementBasedOnPage,
  } = useContext(AuthContext);

  const role = userInfoFromLocalStorage().role;

  const location = useLocation();

  // const [isApproved, setIsApproved] = useState(null);

  // const [isUpdate, setIsUpdate] = useState(0);

  const navigate = useNavigate();

  const [textOfSentDepartment, setTextOfSentDepartment] =
    useState("Click on Save");

  // useEffect(() => {
  //   if (location.pathname.includes("siteInspection")) {
  //     console.log("INSIDE");
  //     const applicationNo = JSON.parse(localStorage.getItem("CurrentAppNo"));
  //     console.log(applicationNo, "AppNo");

  //     const getSubmitAppData = async () => {
  //       const data = await getSubmitApplicationData(applicationNo);
  //       console.log(data, "SAD");
  //       // setGetSubmitData(data);

  //       const documentDecision = data?.psDocumentPageObservation?.approved;
  //       const drawingDecision = data?.psDrawingPageObservation?.approved;
  //       const siteInspectionDecision = data?.siteInspection?.decision;

  //       console.log(documentDecision, drawingDecision, siteInspectionDecision);

  //       if (
  //         documentDecision?.length &&
  //         drawingDecision?.length &&
  //         siteInspectionDecision?.length
  //       ) {
  //         if (
  //           documentDecision.toLowerCase() === "true" &&
  //           drawingDecision.toLowerCase() === "true" &&
  //           siteInspectionDecision.toLowerCase() === "approved"
  //         ) {
  //           setIsApproved(1);
  //         }
  //         if (
  //           documentDecision.toLowerCase() === "false" &&
  //           drawingDecision.toLowerCase() === "false" &&
  //           siteInspectionDecision.toLowerCase() === "shortfall"
  //         ) {
  //           setIsApproved(0);
  //         }
  //       }
  //     };

  //     getSubmitAppData();
  //   }
  // }, []);

  const path = location.pathname;
  const hiddenSaveButtonForPS =
    (path.includes("buildingInfo") ||
      path.includes("applicantInfo") ||
      path.includes("applicationChecklist") ||
      path.includes("payment")) &&
    "hidden";

  return (
    <>
      {isStepperVisible && ( // Render the stepper only when isStepperVisible is true
        <div className="flex justify-end mt-10 mb-7">
          {role === "LTP" &&
            (currentStep !== steps.length - 1 ? (
              <button
                className={`fancy-button mt-8 ${needToHideElementBasedOnPage() && "hidden"
                  }`}
                onClick={() => {
                  path.includes("applicationChecklist") &&
                    confirmAlert(stepperData, collectInputFieldData);
                }}
              >
                Save and Continue
              </button>
            ) : (
              <div
                className={`${needToHideElementBasedOnPage() && "hidden"
                  } flex justify-between items-center w-full mt-10`}
              >
                <button
                  className={`save-btn bg-gradient-to-b from-[#a29bfe] to-[#6c5ce7] mr-4`}
                  onClick={() => {
                    confirmAlert(undefined, collectInputFieldData, {
                      page: "payment",
                      setSentData,
                    });
                    setTextOfSentDepartment("Sent to department");
                  }}
                >
                  <span className="flex justify-center items-center">
                    {" "}
                    <MdOutlineSaveAs size={20} className="mr-2" />
                    Save
                  </span>
                </button>

                <button
                  className="sent-department"
                  // disabled={sentData === 0}
                  onClick={() => {
                    if (sentData === 0) {
                      toast.error("Click on save");
                    } else {
                      sentToPS(
                        JSON.parse(localStorage.getItem("CurrentAppNo")),
                        navigate
                      );
                    }
                  }}
                >
                  <span className="span">{textOfSentDepartment}</span>
                  <span className="second">
                    <ArrowIcon />
                  </span>
                </button>
              </div>
            ))}

          {/* role ===ps  */}
          {role === "PS" && (
            <>
              <button
                className={`save-btn flex items-center nm_Container bg-[#7465EA] ${hiddenSaveButtonForPS} text-sm text-white px-7  hover:bg-bgColor hover:text-normalViolet border-0 uppercase transition-all duration-500 `}
                onClick={() => {
                  confirmAlert(undefined, collectInputFieldData, {
                    page: "PS site inspection data save",
                    refetch,
                  });
                }}
              >
                <BsFillSaveFill size={16} className="mr-2" />
                Save
              </button>
              {location.pathname.includes("siteInspection") &&
                isApproved === 1 && (
                  <button
                    className={`fancy-button text-sm px-7 ml-6 border-0 transition-all duration-500 text-white`}
                    onClick={() => {
                      localStorage.setItem(
                        "PSDecision",
                        JSON.stringify("approved")
                      );
                      confirmAlert(undefined, sentData, {
                        page: "siteInspection",
                        navigate,
                      });
                    }}
                  >
                    <span>Proceeding Issued</span>
                  </button>
                )}
              {location.pathname.includes("siteInspection") &&
                isApproved === 0 && (
                  <>
                    <button
                      className={`${BtnStyle.customBtnForProceeding} ${BtnStyle.publishEndorseBtn} text-[17px] px-7 ml-6`}
                      onClick={() => {
                        localStorage.setItem(
                          "PSDecision",
                          JSON.stringify("shortfall")
                        );
                        confirmAlert(undefined, sentData, {
                          page: "siteInspection",
                          navigate,
                        });
                      }}
                    >
                      <TbFileLike size={25} className="me-1" />
                      Publish Endorsement
                    </button>
                    <button
                      className={`${BtnStyle.rejectBtn} flex items-center font-bold text-base ml-6 px-5 border-3 transition-all duration-1000 nm_Container border-red-500 bg-[#f53844] text-white`}
                      onClick={() => {
                        localStorage.setItem(
                          "PSDecision",
                          JSON.stringify("reject")
                        );
                        confirmAlert(undefined, sentData, {
                          page: "siteInspection",
                          navigate,
                        });
                      }}
                    >
                      Reject
                      <TiCancel size={20} className="ms-1" />
                    </button>
                  </>
                )}
            </>
          )}
        </div>
      )}
    </>
  );
};

export default SaveData;
