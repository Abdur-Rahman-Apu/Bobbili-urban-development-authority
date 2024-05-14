import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useOutletContext } from "react-router-dom";
import { AuthContext } from "../../../../AuthProvider/AuthProvider";
import DefaultDocumentData from "../../../../assets/DefaultDocument.json";
import DynamicDocuments from "../../../../assets/DynamicDocument.json";
import DefaultDocument from "./DefaultDocument";
import DocumentFooter from "./DocumentFooter";
import DynamicDocument from "./DynamicDocument";
import SaveData from "./SaveData";

const DocumentUpload = () => {
  const [UpdatedDefaultData, setUpdatedDefaultData] = useState([
    ...DefaultDocumentData,
  ]);
  const [DynamicAppChecklistDocument, setDynamicAppChecklistDocument] =
    useState([]);

  const [imageId, setImageId] = useState({});
  const [approvedConfirmation, setApprovedConfirmation] = useState("");
  const [recommendationMessage, setRecommendationMessage] = useState("");
  const stepperData = useOutletContext();
  const [isStepperVisible, currentStep, steps, handleStepClick] = stepperData;
  const [psSendingDocument, setPsSendingDocument] = useState({
    dynamic: [],
    default: [],
  });
  const [sendingDocument, setSendingDocument] = useState({
    dynamic: [],
    default: [],
  });
  const [defaultData, setDefaultData] = useState([]);
  const [dynamicData, setDynamicData] = useState([]);
  const {
    confirmAlert,
    sendUserDataIntoDB,
    getApplicationData,
    userInfoFromLocalStorage,
    stepCompleted,
  } = useContext(AuthContext);
  const applicationNo = JSON.parse(localStorage.getItem("CurrentAppNo"));
  const cameFrom = JSON.parse(localStorage.getItem("page"));
  const role = userInfoFromLocalStorage().role;
  const gradientColor = "bg-gradient-to-r from-violet-500 to-fuchsia-500";
  const [defaultImageData, setDefaultImageData] = useState([]);
  const [dynamicImageData, setDynamicImageData] = useState([]);
  const [sendingImageId, setSendingImageId] = useState({
    dynamic: [],
    default: [],
  });
  const [imageIdFromDB, setImageIdFromDB] = useState({
    default: [],
    dynamic: [],
  });
  const [remarkText, setRemarkText] = useState([]);

  // Ltp File uploading Data handeling
  const handleFileChange = (event, id, uploadedFile, type, uploadId) => {
    const { files, name } = event.target;
    const file = files[0];

    if (file) {
      toast.success(`${file.name.slice(0, 20)}... Uploaded Successfully`);
    }

    if (type === "dynamic") {
      const data = { id, uploadId, file };
      setDynamicData((prev) => [...prev, data]);
      const dynamicImage = { id, uploadId, imageId: "" };
      setDynamicImageData((prev) => [...prev, dynamicImage]);
    } else {
      const data = { id, file };
      setDefaultData((prev) => [...prev, data]);
      const defaultImage = { id, imageId: "" };
      setDefaultImageData((prev) => [...prev, defaultImage]);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // LTP Sending Document Updating when handleChange
  useEffect(() => {
    setSendingDocument({ default: defaultData, dynamic: dynamicData });
    setSendingImageId({ default: defaultImageData, dynamic: dynamicImageData });
  }, [defaultData, dynamicData, defaultImageData, dynamicImageData]);

  // PS Sending Document Updating when handleChange
  useEffect(() => {
    setPsSendingDocument({
      default: UpdatedDefaultData,
      dynamic: DynamicAppChecklistDocument,
    });
  }, [UpdatedDefaultData, DynamicAppChecklistDocument]);

  // Adding checklist Data to Document from server data && Updating Data from server Data
  useEffect(() => {
    const gettingData = async () => {
      let CombinedChecklistData = [];
      const applicationData = await getApplicationData(applicationNo, cameFrom);
      const applicationCheckList = applicationData?.applicationCheckList;

      role === "PS" &&
        setApprovedConfirmation(
          applicationData?.psDocumentPageObservation?.approved
        );
      role === "PS" &&
        setRecommendationMessage(
          applicationData?.psDocumentPageObservation?.message
        );
      role === "PS" &&
        setRemarkText(
          applicationData?.psDocumentPageObservation?.remarkText ?? []
        );

      // Checklist "yes" Data integrating to Dynamic Document
      if (applicationCheckList?.length) {
        const documents = applicationData?.documents;
        setImageIdFromDB({ ...documents });

        DynamicDocuments.forEach((data, index) => {
          applicationCheckList.forEach((CheckListData) => {
            const condition01 =
              data.question.toLowerCase() ===
              CheckListData.question.toLowerCase();
            const condition02 = CheckListData.answer === "yes";
            if (condition01 && condition02) {
              CombinedChecklistData.push(data);
            }
          });
        });
      }

      const PreviousDynamicData =
        applicationData?.psDocumentPageObservation?.data?.dynamic;
      const PreviousDefaultData =
        applicationData?.psDocumentPageObservation?.data?.default;

      // Default document Combinding, set & update useState
      if (role === "LTP") {
        setUpdatedDefaultData([...DefaultDocumentData]);
      } else {
        const combinedArray = [
          ...(PreviousDefaultData || []),
          ...DefaultDocumentData,
        ];
        const uniqueCombinedArray = [];
        combinedArray.forEach((item) => {
          const exists = uniqueCombinedArray.some(
            (existingItem) => existingItem.id === item.id
          );
          if (!exists) {
            uniqueCombinedArray.push(item);
          }
        });
        // Default document Combinding Updated
        setUpdatedDefaultData(uniqueCombinedArray);
      }

      // Dynamic document combinding, set & updating UseState
      if (role === "LTP") {
        setDynamicAppChecklistDocument(CombinedChecklistData);
      } else {
        // Dynamic document Combinding
        if (role === "PS" && CombinedChecklistData.length > 0) {
          const combinedArray = [
            ...(PreviousDynamicData || []),
            ...CombinedChecklistData,
          ];
          const uniqueCombinedArray = [];

          combinedArray.forEach((item) => {
            const exists = uniqueCombinedArray.some(
              (existingItem) => existingItem.id === item.id
            );
            if (!exists) {
              uniqueCombinedArray.push(item);
            }
          });
          // Dynamic document Combinding Updated
          setDynamicAppChecklistDocument(uniqueCombinedArray);
        }
      }
    };
    gettingData();
  }, []);

  // file send into the database
  const handleFileUpload = async (url) => {
    // append data to formData so that the file data can be sent into the database
    let fileCheckToUpload = 0;

    const defaultImages = sendingDocument?.default;
    const dynamicImages = sendingDocument?.dynamic;

    const loopTimes = [defaultImages, dynamicImages];

    for (let lt = 0; lt < loopTimes.length; lt++) {
      // another loop

      for (let i = 0; i < loopTimes[lt].length; i++) {
        const formData = new FormData();

        formData.append("file", loopTimes[lt][i].file);
        try {
          const response = await axios.post(
            "https://residential-building.onrender.com/upload?page=document",
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

            if (lt === 0) {
              // console.log(sendingImageId.default[i].imageId, "File");
              sendingImageId.default[i].imageId = documentImageId;
            } else if (lt === 1) {
              // console.log(sendingImageId.dynamic[i].imageId, "File");
              sendingImageId.dynamic[i].imageId = documentImageId;
            }
          }
        } catch (error) {
          toast.error("Error to upload documents");
        }
      }

      fileCheckToUpload++;
    }

    if (fileCheckToUpload === loopTimes.length) {
      const documents = {
        default: [],
        dynamic: [],
      };

      const sendingDefault = sendingImageId?.default;
      const dbDefault = imageIdFromDB?.default;

      if (sendingDefault?.length) {
        sendingDefault?.forEach((sendImg, sendIndx) => {
          dbDefault?.forEach((dbImg, dbIndx) => {
            if (dbImg.id === sendImg.id) {
              // delete dbDefault[dbIndx];
              dbDefault.splice(dbIndx, 1);
            }
          });
        });

        documents.default = [...dbDefault, ...sendingDefault];
      } else {
        documents.default = [...dbDefault];
      }

      const sendingDynamic = sendingImageId?.dynamic;
      const dbDynamic = imageIdFromDB?.dynamic;

      if (sendingDynamic?.length) {
        sendingDynamic?.forEach((sendImg, sendIndx) => {
          dbDynamic?.forEach((dbImg, dbIndx) => {
            if (
              dbImg.id === sendImg.id &&
              dbImg.uploadId === sendImg.uploadId
            ) {
              // delete dbDynamic[dbIndx];
              dbDynamic.splice(dbIndx, 1);
            }
          });
        });

        documents.dynamic = [...dbDynamic, ...sendingDynamic];
      } else {
        documents.dynamic = [...dbDynamic];
      }

      console.log(documents, "Documents");
      stepCompleted.current =
        stepCompleted.current > 4 ? stepCompleted.current : 4;
      return await sendUserDataIntoDB(url, "PATCH", {
        applicationNo,
        documents,
        prevSavedState: stepCompleted.current,
      });
    }
  };

  // send data to PS DB
  const sentPsDecision = async (url) => {
    const PSData = {
      data: psSendingDocument,
      approved: approvedConfirmation ?? "",
      message: recommendationMessage ?? "",
      remarkText,
    };

    return await sendUserDataIntoDB(url, "PATCH", {
      psDocumentPageObservation: PSData,
    });
  };

  return (
    <div className="text-black ml-4 mt-3">
      <form
        onSubmit={(e) => {
          e.preventDefault();

          confirmAlert(
            stepperData,
            role === "LTP" ? handleFileUpload : sentPsDecision
          );
        }}
        className="text-black font-roboto dark:text-black mx-3"
      >
        <div className="w-full text-[17px] rounded">
          <DefaultDocument
            role={role}
            UpdatedDefaultData={UpdatedDefaultData}
            setUpdatedDefaultData={setUpdatedDefaultData}
            handleFileChange={handleFileChange}
            gradientColor={gradientColor}
            defaultImageFromDB={imageIdFromDB?.default}
            setRemarkText={setRemarkText}
            remarkText={remarkText ?? []}
            // DefaultDocumentSelectedFiles={DefaultDocumentSelectedFiles}
          />
          <DynamicDocument
            role={role}
            DynamicAppChecklistDocument={DynamicAppChecklistDocument}
            setDynamicAppChecklistDocument={setDynamicAppChecklistDocument}
            handleFileChange={handleFileChange}
            gradientColor={gradientColor}
            dynamicImageFromDB={imageIdFromDB?.dynamic}
            setRemarkText={setRemarkText}
            remarkText={remarkText ?? []}
            // DynamicDocumentSelectedFiles={DynamicDocumentSelectedFiles}
          />
        </div>

        {role === "PS" ? (
          <DocumentFooter
            approvedConfirmation={approvedConfirmation}
            setApprovedConfirmation={setApprovedConfirmation}
            setRecommendationMessage={setRecommendationMessage}
            recommendationMessage={recommendationMessage}
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
      </form>
    </div>
  );
};

export default DocumentUpload;
