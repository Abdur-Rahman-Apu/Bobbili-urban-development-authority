import React, { useContext } from "react";
import { useNavigate, useLocation } from "react-router";
import { AuthContext } from "../../../../AuthProvider/AuthProvider";

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
}) => {
  let btnClass =
    "btn btn-md text-[#000000] hover:text-[#fff] rounded-lg transition-all duration-500 cursor-pointer hover:bg-emerald-400";

  // console.log(collectInputFieldData);
  const { userInfoFromLocalStorage } = useContext(AuthContext);

  const role = userInfoFromLocalStorage().role;

  const gradientColor = "bg-gradient-to-r from-violet-500 to-fuchsia-500";
  const location = useLocation();
  console.log(location, "Saved Data");

  const navigate = useNavigate();
  return (
    <>
      {isStepperVisible && ( // Render the stepper only when isStepperVisible is true
        <div className="flex justify-end my-8 px-10">
          {role === "LTP" &&
            (currentStep !== steps.length - 1 ? (
              <button
                className={`${btnClass} text-white ${gradientColor} font-roboto shadow-md shadow-violetDark border-none  `}
                type="submit"
                // onClick={() =>
                //   // currentStep < steps.length - 1 &&
                //   // handleStepClick(currentStep + 1)
                //   confirmAlert()
                // }
                onClick={() => confirmAlert(stepperData, collectInputFieldData)}
              >
                Save and Continue
              </button>
            ) : (
              <div>
                <button
                  className={`${btnClass} me-10 px-6 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-roboto shadow-md shadow-violetDark border-none hover:bg-violetDark`}
                  type="submit"
                  // onClick={() =>
                  //   // currentStep < steps.length - 1 &&
                  //   // handleStepClick(currentStep + 1)
                  //   confirmAlert()
                  // }
                  onClick={() => {
                    confirmAlert(undefined, collectInputFieldData, {
                      page: "payment",
                      setSentData,
                    });
                  }}
                >
                  Save
                </button>
                <button
                  className={`btn btn-md text-white rounded-lg shadow-md border-0 mt-6  transition-all duration-500 cursor-pointer ${
                    sentData === 1 && gradientColor
                  } ${sentData === 1 && "shadow-violetDark"}`}
                  disabled={sentData === 0}
                  onClick={() =>
                    sentToPS(
                      JSON.parse(localStorage.getItem("CurrentAppNo")),
                      navigate
                    )
                  }
                >
                  Sent to department
                </button>
              </div>
            ))}

          {/* role ===ps  */}

          {role === "PS" && (
            <>
              <button
                className={`btn btn-md ${gradientColor} text-sm text-white px-8 mt-10 ml-3 shadow-md hover:shadow-violetDark border-0 transition-all duration-500`}
                onClick={() => {
                  confirmAlert(undefined, collectInputFieldData);
                }}
              >
                Save
              </button>
              {location.pathname.includes("siteInspection") && (
                <button
                  className={`btn btn-md text-sm px-7 mt-10 ml-6 shadow-md hover:shadow-violetDark border-0 transition-all duration-500 bg-black hover:bg-black text-white`}
                  onClick={() => {
                    confirmAlert(undefined, sentData, {
                      page: "siteInspection",
                      navigate,
                    });
                  }}
                >
                  Submit
                </button>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
};

export default SaveData;
