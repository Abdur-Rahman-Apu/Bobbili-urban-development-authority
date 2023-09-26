import React from "react";

const SaveData = ({
  isStepperVisible,
  currentStep,
  steps,
  confirmAlert,
  stepperData,
  collectInputFieldData,
  sentToPS,
}) => {
  let btnClass =
    "btn btn-md text-[#000000] hover:text-[#fff] rounded-lg transition-all duration-500 cursor-pointer hover:bg-emerald-400";

  console.log(collectInputFieldData);
  return (
    <>
      {isStepperVisible && ( // Render the stepper only when isStepperVisible is true
        <div className="flex justify-end my-8 px-10">
          {currentStep !== steps.length - 1 ? (
            <button
              className={`${btnClass} bg-yellow-300 hover:shadow-md hover:bg-yellow-300 hover:text-black`}
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
                className={`${btnClass} me-10 px-6 bg-yellow-300 hover:shadow-md hover:bg-yellow-300 hover:text-black`}
                type="submit"
                // onClick={() =>
                //   // currentStep < steps.length - 1 &&
                //   // handleStepClick(currentStep + 1)
                //   confirmAlert()
                // }
                onClick={() => confirmAlert(undefined, collectInputFieldData)}
              >
                Save
              </button>
              <button
                className={`btn btn-md text-[#000000] hover:text-[#fff] rounded-lg shadow-lg transition-all duration-500 cursor-pointer bg-yellow-300 hover:shadow-md hover:bg-yellow-300`}
                onClick={() =>
                  sentToPS(JSON.parse(localStorage.getItem("CurrentAppNo")))
                }
              >
                Sent to department
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default SaveData;
