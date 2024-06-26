import React, { useContext, useEffect, useState } from "react";
import Documents from "../../../../assets/Documents.json";
import { Link, useLocation, useOutletContext } from "react-router-dom";
import toast from "react-hot-toast";
import SaveData from "./SaveData";
import axios from "axios";
import { AuthContext } from "../../../../AuthProvider/AuthProvider";
import Application from "./Application";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import DocumentFooter from "./DocumentFooter";

const DocumentUpload = () => {
  const [openApplication, setOpenApplication] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [UpdatedDocuments, setUpdatedDocuments] = useState([...Documents.Data]);
  const [imageId, setImageId] = useState([]);
  const [approvedConfirmation, setApprovedConfirmation] = useState("");
  const [recomendationMessage, setRecomendationMessage] = useState("");
  const stepperData = useOutletContext();
  const [isStepperVisible, currentStep, steps, handleStepClick] = stepperData;
  const {
    confirmAlert,
    sendUserDataIntoDB,
    getApplicationData,
    userInfoFromLocalStorage,
  } = useContext(AuthContext);

  const applicationNo = JSON.parse(localStorage.getItem("CurrentAppNo"));
  const role = userInfoFromLocalStorage().role;
  const gradientColor = "bg-gradient-to-r from-violet-500 to-fuchsia-500";

  const handleFileChange = (event, index) => {
    const file = event?.target?.files[0];
    file &&
      toast.success(`${file?.name.slice(0, 20)}... uploaded successfully!`);
    selectedFiles[index] = file;
  };

  // Updating documnets when Approved btn clicked (PS)
  const handleAnswer = (event, index) => {
    toast.success(`${event?.target?.value}`);
    selectedFiles[index] = event?.target?.value;
    const updatedApproved = UpdatedDocuments.map((file) => ({
      ...file,
      approved: file.id === index ? event.target.value : file.approved,
    }));
    setUpdatedDocuments(updatedApproved);
  };

  // Adding checklist Data to Document from server data && Updating Data from server Data
  useEffect(() => {
    const gettingData = async () => {
      let updatedDocumentsToAdd = [];
      let updateNewSelectDocument = [];
      const applicationData = await getApplicationData(applicationNo);
      const applicationCheckList = applicationData.applicationCheckList;
      const documents = applicationData.documents;

      let increaseDocument = UpdatedDocuments.length;

      // Adding checklist Data to Document from server data
      if (applicationCheckList.length) {
        // Declare the array here
        applicationCheckList?.forEach((data, index) => {
          const already = UpdatedDocuments.find(
            (document) => document.question === data.question
          );
          if (already) {
            return null;
          }
          if (index >= 8 && data.answer === "yes") {
            increaseDocument++;
            const newDocument = {
              id: increaseDocument.toString(),
              question: data.question,
              upload: "",
              approved: "",
            };
            updatedDocumentsToAdd.push(newDocument);
          }
        });
      }

      setUpdatedDocuments([...UpdatedDocuments, ...updatedDocumentsToAdd]);

      // Updating Data from server Data
      // RECEIVED DOCUMENT DATA FROM THE DB & STORE THEM IN THE UPDATED DOCUMENT STATE
      if (Object.keys(documents).length) {
        setUpdatedDocuments((prev) => {
          prev.forEach((document, index) => {
            prev[index].upload = documents[index];
          });
          return prev;
        });
        setApprovedConfirmation(documents.approved);
        setRecomendationMessage(documents.message);
      }
    };
    gettingData();
  }, []);

  useEffect(() => {
    const emptyArray = Array.from({ length: UpdatedDocuments.length });
    setSelectedFiles(emptyArray);
    setImageId(emptyArray);
  }, [UpdatedDocuments]);

  // handle file upload
  const handleFileUpload = async (url) => {
    // append data to formData so that the file data can be sent into the database
    let fileCheckToUpload = 0;

    for (let i = 0; i < selectedFiles.length; i++) {
      const formData = new FormData();

      if (selectedFiles[i]) {
        formData.append("file", selectedFiles[i]);
        try {
          const response = await axios.post(
            "https://residential-building.vercel.app/upload?page=document",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data", // Important for file uploads
              },
            }
          );
          // Handle success or display a success message to the user
          if (response?.data.msg === "Successfully uploaded") {
            const documentImageId = response?.data?.fileId;

            imageId[i] = documentImageId;
          }
        } catch (error) {
          console.log(error, "ERROR");
          // Handle errors, e.g., show an error message to the user
          toast.error("Error to upload documents");
        }
      } else {
        console.log("ELSE OF FILE");
        imageId[i] = UpdatedDocuments[i]?.upload?.length
          ? UpdatedDocuments[i]?.upload
          : "";

        console.log(imageId[i]);
      }
      fileCheckToUpload++;
    }

    if (fileCheckToUpload === selectedFiles.length) {
      return await sendUserDataIntoDB(url, "PATCH", {
        applicationNo,
        documents: imageId,
        approved: approvedConfirmation,
        message: recomendationMessage,
      });
    }
  };

  //  send data to ps db (Apu vai send ps data from here)

  // ps data get

  const sentPsDecision = async (url) => {
    // PS data select and Send data
    const PSKeys = ["id", "approved"];
    const PSArray = UpdatedDocuments.map(({ ...obj }) =>
      PSKeys.reduce((acc, key) => ((acc[key] = obj[key]), acc), {})
    );
    const PSData = {
      documentsObservation: { ...PSArray },
      approved: approvedConfirmation ?? "",
      message: recomendationMessage ?? "",
    };

    console.log(PSData, "PSDATA");

    return await sendUserDataIntoDB(url, "PATCH", {
      applicationNo,
      psDocumentPageObservation: PSData,
    });
  };

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
        className="text-black p-4 font-roboto dark:text-gray-100"
      >
        {UpdatedDocuments?.map((document, index) => {
          const { id, question, upload, approved } = document;
          return (
            <>
              <div key={id} className="w-full px-2 mb-5 py-5 rounded">
                <p className="text-[17px] font-bold text-lg md:text-xl">
                  {id}. {question}
                </p>

                <div className="flex items-center mt-6">
                  {/* Approved Button */}
                  {role === "LTP" && (
                    <input
                      name={id}
                      type="file"
                      accept=".pdf, image/*"
                      onChange={(event) => handleFileChange(event, index)}
                      className="file-input file-input-bordered w-full max-w-xs dark:text-black dark:border-none"
                    />
                  )}

                  {upload !== "" && (
                    <Link
                      to={`https://drive.google.com/file/d/${upload}/view?usp=sharing`}
                      target="_blank"
                      className={`${gradientColor} text-white hover:underline ms-5 py-2 px-5 rounded-full`}
                    >
                      View
                    </Link>
                  )}

                  {role === "PS" && (
                    <div className="space-x-10 mt-2 ms-4 lg:pr-2 ">
                      <label
                        className={`ml-2 inline-flex items-center space-x-1 text-black 
                          ${approved === "approved" && "font-extrabold"}`}
                      >
                        <input
                          type="radio"
                          name={id}
                          value="approved"
                          className="radio radio-sm radio-success mr-3 lg:mr-0"
                          // checked={approved === "approved"}
                          onChange={(event) => handleAnswer(event, id)}
                        />
                        <span>Approve</span>
                      </label>
                      <label
                        className={`ml-2 inline-flex items-center space-x-1 text-black 
                          ${approved === "shortfall" && "font-extrabold"}`}
                      >
                        <input
                          type="radio"
                          name={id}
                          value="shortfall"
                          className="radio radio-sm radio-success mr-3 lg:mr-0"
                          // checked={shortfall === "shortfall"}
                          onChange={(event) => handleAnswer(event, id)}
                        />
                        <span>Shortfall</span>
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </>
          );
        })}
      </form>
      {role === "PS" ? (
        <DocumentFooter
          approvedConfirmation={approvedConfirmation}
          setApprovedConfirmation={setApprovedConfirmation}
          setRecomendationMessage={setRecomendationMessage}
        />
      ) : (
        ""
      )}

      <SaveData
        isStepperVisible={isStepperVisible}
        currentStep={currentStep}
        steps={steps}
        stepperData={stepperData}
        confirmAlert={confirmAlert}
        collectInputFieldData={
          role === "LTP" ? handleFileUpload : sentPsDecision
        }
      />
    </div>
  );
};

export default DocumentUpload;
