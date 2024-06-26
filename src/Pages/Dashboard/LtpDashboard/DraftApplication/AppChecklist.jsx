import React, { useContext, useEffect, useState } from "react";
import ChecklistQuestions from "../../../../assets/AppChecklist.json";
import { Link } from "react-router-dom";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import Application from "./Application";
import { useOutletContext } from "react-router-dom";
import { AuthContext } from "../../../../AuthProvider/AuthProvider";
import SaveData from "./SaveData";
import toast from "react-hot-toast";

function AppChecklist() {
  const [openApplication, setOpenApplication] = useState(false);
  const [questions, setQuestions] = useState(ChecklistQuestions.Questions);
  const stepperData = useOutletContext();
  const [isStepperVisible, currentStep, steps, handleStepClick] = stepperData;
  const { confirmAlert, sendUserDataIntoDB, getApplicationData } =
    useContext(AuthContext);
  // after select question firing here
  const handleAnswer = (event, questionNo) => {
    const updatedQuestions = questions.map((question) => ({
      ...question,
      answer: question.no === questionNo ? event.target.value : question.answer,
    }));
    setQuestions(updatedQuestions);
  };
  const applicationNo = JSON.parse(localStorage.getItem("CurrentAppNo"));

  useEffect(() => {
    const gettingData = async () => {
      const applicationData = await getApplicationData(applicationNo);
      console.log(applicationData);
      const applicationCheckList = applicationData.applicationCheckList;
      if (applicationCheckList.length) {
        setQuestions(applicationCheckList);
      }
    };
    gettingData();
  }, []);

  console.log({ appChecklist: questions }); // data send format
  // Sending data to Backend

  const sendAppChecklistData = async (url) => {
    return await sendUserDataIntoDB(url, "PATCH", {
      applicationNo: applicationNo,
      applicationCheckList: questions,
    });
  };
  const btn =
    "btn btn-md text-sm px-6 bg-Primary transition duration-700 hover:bg-btnHover hover:shadow-md";
  return (
    <div className="px-3 text-sm py-1 relative font-roboto">
      <div className="space-y-5">
        {questions.map(({ no, question, answer }) => (
          <div
            key={no}
            className="lg:flex items-center justify-center shadow-sm shadow-gray-100 rounded p-3"
          >
            <p className="flex-1 text-black rounded mb-5 text-base md:text-lg lg:mb-0 lg:pr-4 dark:text-gray-100">
              {no}. {question}
            </p>
            <div className="space-x-10 mt-2 lg:pr-2 text-base md:text-lg">
              <label
                className={`ml-2 inline-flex items-center space-x-1 text-black ${
                  answer === "yes" && "font-extrabold text-violetDark"
                } dark:text-white`}
              >
                <input
                  type="radio"
                  name={no}
                  value="yes"
                  className="radio radio-sm checked:bg-violetDark border-violetLight mr-3 lg:mr-0 dark:text-white"
                  checked={answer === "yes"}
                  onChange={(event) => handleAnswer(event, no)}
                />
                <span>Yes</span>
              </label>
              <label
                className={`ml-2 inline-flex items-center space-x-1 text-black ${
                  answer === "no" && "font-extrabold text-violetDark"
                } dark:text-white`}
              >
                <input
                  type="radio"
                  name={no}
                  value="no"
                  className="radio radio-sm border checked:bg-violetDark border-violetLight mr-3 lg:mr-0 dark:text-white"
                  checked={answer === "no"}
                  onChange={(event) => handleAnswer(event, no)}
                />
                <span>No</span>
              </label>
            </div>
          </div>
        ))}
      </div>

      {/* save & continue  */}
      {/* navigation button  */}
      <SaveData
        isStepperVisible={isStepperVisible}
        currentStep={currentStep}
        steps={steps}
        stepperData={stepperData}
        confirmAlert={confirmAlert}
        collectInputFieldData={sendAppChecklistData}
      />
    </div>
  );
}

export default AppChecklist;
