import React, { useContext, useEffect, useState } from "react";
import { AiFillPieChart } from "react-icons/ai";
import { BsHouseCheck, BsInfoCircle } from "react-icons/bs";
import { FaBuildingColumns } from "react-icons/fa6";
import { FiRefreshCcw } from "react-icons/fi";
import { GoChecklist } from "react-icons/go";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import { RiSecurePaymentLine } from "react-icons/ri";
import { VscDebugContinue, VscReferences } from "react-icons/vsc";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../../AuthProvider/AuthProvider";
import DrawingFileShowed from "../../../Shared/DrawingFileShowed";
import EndorsementFileShowed from "../../../Shared/EndorsementFileShow";
import ProceedingModalShowPdf from "../../../Shared/ProceedingModalShowPdf";
import Application from "./ApplicationModal/Application";

const DraftApplication = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(0);
  const [openApplication, setOpenApplication] = useState(false);
  const [openProceeding, setOpenProceeding] = useState(false);
  const [openEndorsement, setOpenEndorsement] = useState(false);
  const [openDrawing, setOpenDrawing] = useState(false);

  const { userInfoFromLocalStorage, stepCompleted } = useContext(AuthContext);

  const state = location?.state;
  console.log(state, "location");

  // if (state !== null) {
  //   if (state.hasOwnProperty("prevSavedState")) {
  //     localStorage.setItem(
  //       "steepCompleted",
  //       JSON.stringify(state.prevSavedState)
  //     );
  //   }
  // }

  const cameFrom = JSON.parse(localStorage.getItem("page"));
  const applicationNo = JSON.parse(localStorage.getItem("CurrentAppNo"));
  const getIndex = JSON.parse(localStorage.getItem("stepIndex"));
  // const steepCompleted = JSON.parse(localStorage.getItem("steepCompleted"));

  console.log(stepCompleted.current, "STEEP");

  const role = userInfoFromLocalStorage()?.role;

  useEffect(() => {
    if (stepCompleted.current === 6) {
      localStorage.setItem("PPS", JSON.stringify(1));
    } else {
      localStorage.setItem("PPS", JSON.stringify(0));
    }
    setCurrentStep(getIndex);
  }, []);

  const steps = [
    "/buildingInfo",
    "/applicantInfo",
    "/applicationChecklist",
    "/documents",
    "/drawing",
    "/payment",
  ];

  const stepsContent = [
    "Building Info",
    "Applicant Info",
    "App. Checklist",
    "Documents",
    "Drawing",
    "Payment",
  ];

  if (role === "PS") {
    steps.push("/siteInspection");
    stepsContent.push("Site Inspection");
  }

  // Use localStorage to store and retrieve the current step
  useEffect(() => {
    const savedStep = localStorage.getItem("currentStep");

    if (location.pathname === "/dashboard/draftApplication") {
      setCurrentStep(0);
    } else if (savedStep !== null) {
      setCurrentStep(parseInt(savedStep, 10));
    }

    return () => {
      localStorage.removeItem("currentStep");
      localStorage.removeItem("PPS");
      // stepCompleted.current = null;
    };
  }, [location.pathname]);

  console.log(stepCompleted, "Steep completed dfa");

  const handleStepClick = (index) => {
    setCurrentStep(index);
    localStorage.setItem("stepIndex", JSON.stringify(index));
    // Store the current step in localStorage

    console.log(index, stepCompleted, "STPES");

    if (stepCompleted.current === null || stepCompleted.current < index) {
      // localStorage.setItem("steepCompleted", JSON.stringify(index));
      // setStepCompleted(index);
      stepCompleted.current = index;
    }
    navigate(`/dashboard/draftApplication${steps[index]}`);
  };

  const additionalSteps = [
    "/dashboard/draftApplication/buildingInfo",
    "/dashboard/draftApplication/applicantInfo",
    "/dashboard/draftApplication/applicationChecklist",
    "/dashboard/draftApplication/documents",
    "/dashboard/draftApplication/drawing",
    "/dashboard/draftApplication/payment",
    "/dashboard/draftApplication/siteInspection",
  ];

  const allSteps = [...steps, ...additionalSteps];

  // Check if current route is in the list of routes with the stepper
  const isStepperVisible = allSteps.includes(location.pathname);

  const stepClasses = (index) => {
    if (index === currentStep) {
      return "step step-primary";
    } else if (index < currentStep) {
      return "step step-primary";
    } else {
      return "";
    }
  };

  const completeBtn = (index) => {
    if (index === currentStep) {
      return `bg-gradient-to-b from-[#a29bfe] to-[#6c5ce7] shadow-none text-white border-0`;
    } else if (index < currentStep) {
      return `bg-gradient-to-b from-[#a29bfe] to-[#6c5ce7] shadow-none text-white border-0`;
    } else {
      return ``;
    }
  };

  const icons = [
    <FaBuildingColumns size={15} />,
    <BsInfoCircle size={17} />,
    <GoChecklist size={18} />,
    <HiOutlineClipboardDocumentList size={19} />,
    <BsHouseCheck size={17} />,
    <RiSecurePaymentLine size={19} />,
  ];

  const path = useLocation()?.pathname;

  // check the page name to show the building info and other pages application value
  const applicationButtonForDraftApplication =
    (path.includes("applicationChecklist") ||
      path.includes("documents") ||
      path.includes("drawing") ||
      path.includes("payment")) &&
    (cameFrom === "draft" || cameFrom === "submit");

  const applicationButtonForApprovedOrShortfallApplication =
    !path.includes("siteInspection") &&
    (cameFrom === "approved" || cameFrom === "shortfall");

  const navigateToResubmitPage = () => {
    const appNo = JSON.parse(localStorage.getItem("CurrentAppNo"));
    navigate("/dashboard/resubmitApplication", { state: { appNo } });
  };

  let btnClass = `nm_Container btn-md text-black transition-all duration-500   bg-bgColor`;
  const gradientColor = "bg-gradient-to-r from-violet-500 to-fuchsia-500";

  return (
    <>
      {isStepperVisible && ( // Render the stepper only when isStepperVisible is true
        <>
          <div className="lg:flex justify-between items-center mx-2 lg:mx-5">
            <p
              className={`nm_Container w-fit p-2 my-8 font-roboto font-semibold text-lg ${gradientColor} text-transparent bg-clip-text`}
            >
              <span className="text-black">Application No:</span>{" "}
              {applicationNo}
            </p>

            <div className="flex justify-end">
              {cameFrom === "approved" && (
                <>
                  <button
                    onClick={() => {
                      setOpenProceeding(true);
                    }}
                    className={`flex justify-center items-center gap-1 btn-sm nm_Container text-sm bg-normalViolet hover:text-[#510BC4] hover:bg-bgColor transition-all duration-700 text-white me-2 lg:me-5 border-none`}
                  >
                    <VscDebugContinue className="text-lg" />{" "}
                    <span>Proceeding</span>
                  </button>

                  <button
                    className={`flex justify-center items-center gap-1 btn-sm text-sm nm_Container bg-normalViolet hover:text-[#510BC4] hover:bg-bgColor transition-all duration-700 text-white me-2 lg:me-5 border-none`}
                    onClick={() => setOpenDrawing(true)}
                  >
                    <AiFillPieChart className="text-lg" /> <span>Drawing</span>
                  </button>
                </>
              )}

              {cameFrom === "shortfall" && (
                <>
                  <button
                    className={`flex justify-center items-center gap-1 btn-sm text-sm nm_Container bg-normalViolet hover:text-[#510BC4] hover:bg-bgColor transition-all duration-700 text-white me-2 lg:me-5  border-none`}
                    onClick={navigateToResubmitPage}
                  >
                    <FiRefreshCcw className="text-lg" /> <span>Resubmit</span>
                  </button>
                  <button
                    onClick={() => {
                      setOpenEndorsement(true);
                    }}
                    className={`flex justify-center items-center gap-1 btn-sm me-2 lg:me-5 text-sm nm_Container bg-normalViolet hover:text-[#510BC4] hover:bg-bgColor transition-all duration-700 text-white border-none`}
                  >
                    <VscReferences className="text-lg" />{" "}
                    <span className="text-xs uppercase">Endorsement</span>
                  </button>
                </>
              )}

              {(applicationButtonForDraftApplication ||
                applicationButtonForApprovedOrShortfallApplication) && (
                <button
                  onClick={() => setOpenApplication(true)}
                  className={`flex justify-center items-center gap-1 btn-sm text-sm nm_Container bg-normalViolet  hover:text-[#510BC4] hover:bg-bgColor transition-all duration-700 text-white border-none`}
                >
                  <HiOutlineClipboardDocumentList className="text-lg" />{" "}
                  <span>Application</span>
                </button>
              )}
            </div>
          </div>

          <div className="w-full steps steps-vertical lg:steps-horizontal rounded-lg py-4 lg:relative font-roboto px-4 lg:px-0">
            {stepsContent.map((step, index) => (
              <button
                key={index}
                data-content={index + 1}
                className={`${stepClasses(index)}`}
                onClick={() => handleStepClick(index)}
                disabled={
                  index > stepCompleted.current &&
                  cameFrom?.toLowerCase() === "draft"
                }
              >
                <span
                  className={`${btnClass} ${completeBtn(index)} ${
                    cameFrom?.toLowerCase() === "draft"
                      ? index <= stepCompleted.current
                        ? "hover:bg-gradient-to-b hover:from-[#a29bfe] hover:to-[#6c5ce7] hover:shadow-none hover:text-white hover:border-0 bg-[#e4e1ff]"
                        : "cursor-not-allowed text-gray-500"
                      : ""
                  } ${
                    role !== "PS"
                      ? "w-[70%] lg:w-[15.3%]"
                      : "w-[50%] lg:w-[13%]"
                  } text-[15px] font-bold gap-1 border-0 flex justify-center items-center lg:absolute top-3 z-10`}
                  // disabled={index > steepCompleted}
                >
                  {role !== "PS" && icons[index]}
                  {step}
                </span>
              </button>
            ))}
          </div>
        </>
      )}

      {/* ========================<<<content>>>  */}
      <Outlet
        context={[isStepperVisible, currentStep, steps, handleStepClick]}
      />

      {/* proceedingModal modal info  */}
      {openProceeding ? (
        <ProceedingModalShowPdf
          modalProceeding={{ setOpenProceeding, openProceeding }}
        />
      ) : (
        ""
      )}
      {/* my_modal_2 modal info : */}
      {openEndorsement ? (
        <EndorsementFileShowed
          modalEndorsement={{ setOpenEndorsement, openEndorsement }}
        />
      ) : (
        ""
      )}
      {/* Application Modal */}
      {openApplication ? (
        <Application setOpenApplication={setOpenApplication} />
      ) : (
        ""
      )}
      {openDrawing && (
        <DrawingFileShowed modalStates={{ openDrawing, setOpenDrawing }} />
      )}
    </>
  );
};

export default DraftApplication;
