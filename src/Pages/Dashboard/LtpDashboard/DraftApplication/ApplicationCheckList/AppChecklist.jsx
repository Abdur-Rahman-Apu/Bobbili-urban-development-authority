import { motion } from "framer-motion";
import React, { useContext, useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { AuthContext } from "../../../../../AuthProvider/AuthProvider";
import ChecklistQuestions from "../../../../../assets/AppChecklist.json";
import SaveData from "../SaveData";

function AppChecklist() {
  const [openApplication, setOpenApplication] = useState(false);
  const [questions, setQuestions] = useState([...ChecklistQuestions.Questions]);
  const stepperData = useOutletContext();
  const [isStepperVisible, currentStep, steps] = stepperData;
  const {
    confirmAlert,
    sendUserDataIntoDB,
    getApplicationData,
    userInfoFromLocalStorage,
    stepCompleted,
  } = useContext(AuthContext);

  // after select question firing here
  const handleAnswer = (event, questionNo) => {
    // toast.success(`Clicked: ${questionNo}, Value: ${event.target.value}`);
    const updatedQuestions = questions.map((question) => ({
      ...question,
      answer:
        (question.id || question.no) === questionNo
          ? event.target.value
          : question.answer,
    }));
    setQuestions(updatedQuestions);
  };
  const applicationNo = JSON.parse(localStorage.getItem("CurrentAppNo"));

  const cameFrom = JSON.parse(localStorage.getItem("page"));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const gettingData = async () => {
      const applicationData = await getApplicationData(applicationNo, cameFrom);
      const applicationCheckList = applicationData?.applicationCheckList;
      console.log(
        applicationCheckList,
        "applicationChecklist from yes filtering"
      );
      if (applicationCheckList.length) {
        setQuestions(applicationCheckList);
      }
    };
    gettingData();
  }, []);

  const sendAppChecklistData = async (url) => {
    console.log(questions, "Question_All");

    stepCompleted.current =
      stepCompleted.current > 3 ? stepCompleted.current : 3;

    return await sendUserDataIntoDB(url, "PATCH", {
      applicationNo: applicationNo,
      applicationCheckList: questions,
      prevSavedState: stepCompleted.current,
    });
  };
  const btn =
    "btn btn-md text-sm px-6 bg-Primary transition duration-700 hover:bg-btnHover hover:shadow-md";
  const role = userInfoFromLocalStorage().role;

  return (
    <div className="text-sm relative font-roboto">
      <div className="">
        {questions.map(({ id, question, answer }) => (
          <motion.div
            className="m-4 nm_Container"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0, transition: { duration: 1 } }}
            viewport={{ once: true }}
          >
            <div
              key={id}
              className="lg:flex items-center justify-center shadow-sm shadow-gray-100 rounded p-3"
            >
              <div className="flex-1 text-black rounded mb-5 text-base md:text-lg lg:mb-0 lg:pr-4">
                <div className="flex">
                  <span className="font-semibold mr-1">{id}.</span>
                  <span>{question}</span>
                </div>
              </div>
              <div className="space-x-10 mt-2 lg:pr-2 lg:mt-0 text-base md:text-lg">
                <div className="radio-button-container ml-3">
                  <div className="radio-button">
                    <input
                      type="radio"
                      className="radio-button__input"
                      id={`yes${id}`}
                      name={id}
                      value="yes"
                      checked={answer === "yes"}
                      onChange={(event) => handleAnswer(event, id)}
                      disabled={role === "PS" || cameFrom !== "draft"}
                    />
                    <label
                      className={`radio-button__label text-base ${
                        answer === "yes" ? "" : ""
                      }`}
                      htmlFor={`yes${id}`}
                    >
                      <span className="radio-button__custom"></span>
                      Yes
                    </label>
                  </div>
                  <div className="radio-button">
                    <input
                      type="radio"
                      id={`no${id}`}
                      className="radio-button__input"
                      name={id}
                      value="no"
                      checked={answer === "no"}
                      onChange={(event) => handleAnswer(event, id)}
                      disabled={role === "PS" || cameFrom !== "draft"}
                    />
                    <label
                      className="radio-button__label text-base"
                      htmlFor={`no${id}`}
                    >
                      <span className="radio-button__custom"></span>
                      No
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* save & continue  */}
      {/* navigation button  */}
      <div className="mx-4">
        <SaveData
          isStepperVisible={isStepperVisible}
          currentStep={currentStep}
          steps={steps}
          stepperData={stepperData}
          confirmAlert={confirmAlert}
          collectInputFieldData={sendAppChecklistData}
        />
      </div>
    </div>
  );
}

export default AppChecklist;
