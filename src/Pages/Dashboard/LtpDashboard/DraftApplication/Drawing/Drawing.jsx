import axios from "axios";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { TbSlideshow } from "react-icons/tb";
import { Link, useOutletContext } from "react-router-dom";
import { AuthContext } from "../../../../../AuthProvider/AuthProvider";
import { baseUrl } from "../../../../../utils/api";
import SaveData from "../SaveData";
import DrawingTable from "./DrawingTable";

const Drawing = () => {
  const [approvedConfirmation, setApprovedConfirmation] = useState("");
  const [recomendationMessage, setRecommendationMessage] = useState("");

  console.log({ approvedConfirmation, recomendationMessage });

  // const [openApplication, setOpenApplication] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState({
    AutoCAD: "",
    Drawing: "",
  });
  const [imageId, setImageId] = useState({
    AutoCAD: "",
    Drawing: "",
  });
  const [savedData, setSavedData] = useState([]);

  const [buildingInfoData, setBuildingInfoData] = useState([]);
  const {
    confirmAlert,
    sendUserDataIntoDB,
    getApplicationData,
    userInfoFromCookie,
    getSubmitApplicationData,
    stepCompleted,
  } = useContext(AuthContext);

  const applicationNo = JSON.parse(localStorage.getItem("CurrentAppNo"));
  const cameFrom = JSON.parse(localStorage.getItem("page"));
  const role = userInfoFromCookie().role;

  const [imageFromDB, setImageFromDB] = useState({});

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    localStorage.setItem("selectedFiles", JSON.stringify(["", ""]));
    getApplicationData(applicationNo, cameFrom).then((res) => {
      console.log(res, "res");
      setSavedData(res);
      setBuildingInfoData(res?.buildingInfo);
      if (Object.keys(res?.drawing)?.length) {
        const drawingDataFromDB = res?.drawing;
        setApprovedConfirmation(res?.psDrawingPageObservation?.approved);
        setRecommendationMessage(res?.psDrawingPageObservation?.message);
        setImageId(drawingDataFromDB);
      }
    });
  }, []);

  console.log(imageId, "DATA FROM DB");

  const stepperData = useOutletContext();

  const gradientColor = "bg-gradient-to-r from-violet-500 to-fuchsia-500";

  const [localFile, setLocalFile] = useState(
    JSON.parse(localStorage.getItem("selectedFiles"))
  );

  const [getSubmitData, setGetSubmitData] = useState([]);

  const [isStepperVisible, currentStep, steps, handleStepClick] = stepperData;

  const handleFileChange = (event, eventId) => {
    const file = event?.target.files[0];
    // formData.append(eventId, file);
    console.log(file, "FILE");
    if (file) {
      toast.success(`${file?.name.slice(0, 20)}... uploaded successfully!`);
      const localStoreDrawingData = JSON.parse(
        localStorage.getItem("selectedFiles")
      );

      if (eventId === "AutoCAD") {
        localStoreDrawingData[0] = file?.name;
        setLocalFile(localStoreDrawingData);
        localStorage.setItem(
          "selectedFiles",
          JSON.stringify(localStoreDrawingData)
        );
      }
      if (eventId === "Drawing") {
        localStoreDrawingData[1] = file?.name;
        setLocalFile(localStoreDrawingData);
        localStorage.setItem(
          "selectedFiles",
          JSON.stringify(localStoreDrawingData)
        );
      }
      // Set File Uploaded Data
      setSelectedFiles((prev) => {
        prev[eventId] = file;
        return prev;
      });
    }
  };

  const handleFileUpload = async (url) => {
    let fileUploadSuccess = 0;
    // uploadFileInCloudStorage(formData);
    console.log(selectedFiles, "Selected files");
    for (const file in selectedFiles) {
      console.log(selectedFiles[file]);

      if (selectedFiles[file] instanceof File) {
        const formData = new FormData();
        if (selectedFiles[file]) {
          formData.append("file", selectedFiles[file]);
          try {
            const response = await axios.post(
              `${baseUrl}/storage/upload?page=drawing`,
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data", // Important for file uploads
                },
              }
            );
            if (response?.data.msg === "Successfully uploaded") {
              const fileId = response.data.fileId;
              imageId[file] = fileId;
              fileUploadSuccess = 1;
            }
          } catch (error) {
            // Handle errors, e.g., show an error message to the user
            toast.error("Error to upload documents");
            fileUploadSuccess = 0;
          }
        }
      } else {
        fileUploadSuccess = 1;
      }
    }

    if (fileUploadSuccess) {
      console.log(fileUploadSuccess, imageId);
      const drawing = {
        AutoCAD: imageId["AutoCAD"],
        Drawing: imageId["Drawing"],
      };

      stepCompleted.current =
        stepCompleted.current > 5 ? stepCompleted.current : 5;
      return await sendUserDataIntoDB(url, "PATCH", {
        applicationNo,
        drawing,
        prevSavedState: stepCompleted.current,
      });
    }
  };
  // Apu vai send ps data from here

  const sentPsDecision = async (url) => {
    const proposedSiteObs = document.getElementById("proposedSiteObs")?.value;
    const accessRoadWidthObs =
      document.getElementById("accessRoadWidthObs")?.value;
    const scopeOfRoadWideningObs =
      document.getElementById("scopeRoadWideObs")?.value;
    const netPlotAreaObs = document.getElementById("netSiteObs")?.value;
    const buildingHeightObs =
      document.getElementById("buildingHeightObs")?.value;
    // const setBacksObs = document.getElementById("setBacksObs")?.value;
    const fontObs = document.getElementById("frontObs")?.value;
    const rareObs = document.getElementById("rareObs")?.value;
    const sideOneObs = document.getElementById("sideOneObs")?.value;
    const sideTwoObs = document.getElementById("sideTwoObs")?.value;
    const floorObs = document.getElementById("numberOfFloorsObs")?.value;
    const stiltFloorObs = document.getElementById("stiltFloorObs")?.value;
    const groundFloorObs = document.getElementById("groundFloorObs")?.value;
    const firstFloorObs = document.getElementById("firstFloorObs")?.value;
    const secondFloorObs = document.getElementById("secondFloorObs")?.value;
    const greenStripObs = document.getElementById("greenStripObs")?.value;
    const stairCaseWidthObs =
      document.getElementById("stairCaseWidthObs")?.value;
    const unitsObs = document.getElementById("unitObs")?.value;

    const psData = {
      approved: approvedConfirmation,
      message: recomendationMessage,
      drawingTableObs: {
        proposedSiteObs,
        accessRoadWidthObs,
        scopeOfRoadWideningObs,
        netPlotAreaObs,
        buildingHeightObs,
        fontObs,
        rareObs,
        sideOneObs,
        sideTwoObs,
        floorObs,
        stiltFloorObs,
        groundFloorObs,
        firstFloorObs,
        secondFloorObs,
        greenStripObs,
        stairCaseWidthObs,
        unitsObs,
      },
    };

    console.log(psData, "PSDATA");
    if (approvedConfirmation?.length) {
      return await sendUserDataIntoDB(url, "PATCH", {
        applicationNo,
        psDrawingPageObservation: psData,
      });
    } else {
      toast.error(
        "Please fill up the decision whether the application is approved or shortfall"
      );
      throw new Error(
        "Please fill up the decision whether the application is approved or shortfall"
      );
    }
  };

  useEffect(() => {
    // setLocalFile(JSON.parse(localStorage.getItem("selectedFiles")));

    const getSubmitAppData = async () => {
      const data = await getSubmitApplicationData(applicationNo);
      console.log(data, "SAD");
      setGetSubmitData(data);
    };

    console.log(cameFrom, "CameFrom");

    if (role === "PS" && cameFrom.toLowerCase() === "submit") {
      getSubmitAppData();
    }

    return () => {
      localStorage.removeItem("selectedFiles");
    };
  }, []);

  console.log(
    role == "PS" &&
      buildingInfoData?.length !== 0 &&
      getSubmitData?.length !== 0,
    "condition"
  );

  console.log(role == "PS");
  console.log(buildingInfoData);
  console.log(getSubmitData);

  return (
    <div className="text-black ml-4 mt-3">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          role === "LTP"
            ? confirmAlert(stepperData, handleFileUpload)
            : confirmAlert(stepperData, sentPsDecision);
        }}
        className="text-black mx-3"
      >
        {/* AutoCAD Drawing */}
        <div className="text-lg mb-10">
          <p className="pr-3 font-bold text-black">1. AutoCAD Drawing</p>
          <div className="flex items-center mt-3">
            {role === "LTP" && cameFrom === "draft" && (
              <label className="relative cursor-pointer mr-6">
                <input
                  type="file"
                  accept=".dwg, .zip, .pdf, .png, .jpg"
                  onChange={(event) => handleFileChange(event, "AutoCAD")}
                  className="file-input file-input-bordered file-input-md w-full max-w-xs text-gray-400 bg-white dark:text-black"
                />
              </label>
            )}
            {savedData?.drawing?.AutoCAD && (
              <Link
                to={`https://drive.google.com/file/d/${savedData?.drawing?.AutoCAD}/view?usp=sharing`}
                target="_blank"
                className={`${gradientColor} flex items-center text-white hover:underline py-2 px-5 rounded-full shadow-lg`}
              >
                <TbSlideshow size={20} className="me-1" />
                View
              </Link>
            )}
          </div>
        </div>

        {/* Drawing PDF */}
        <div className="text-lg mb-2">
          <p className="pr-3 font-bold text-black">2. Drawing PDF</p>
          <div className="flex items-center mt-5">
            {role === "LTP" && cameFrom === "draft" && (
              <label className="relative cursor-pointer mr-6">
                <input
                  type="file"
                  accept=".dwg, .zip, .pdf,.png,.jpg"
                  onChange={(event) => handleFileChange(event, "Drawing")}
                  className="file-input file-input-bordered file-input-md w-full max-w-xs text-gray-400 bg-white dark:text-black"
                />
              </label>
            )}

            {savedData?.drawing?.Drawing && (
              <Link
                to={`https://drive.google.com/file/d/${savedData?.drawing?.Drawing}/view?usp=sharing`}
                target="_blank"
                className={`${gradientColor} text-white hover:underline flex items-center py-2 px-5 rounded-full shadow-lg`}
              >
                <TbSlideshow size={20} className="me-1" />
                View
              </Link>
            )}
          </div>
          {role === "LTP" && cameFrom === "draft" && (
            <p className="text-red-500 mt-2 font-bold text-sm">
              Note: Upload A3 file
            </p>
          )}
        </div>

        {role == "PS" &&
          buildingInfoData?.length !== 0 &&
          getSubmitData?.length !== 0 && (
            <DrawingTable
              setApprovedConfirmation={setApprovedConfirmation}
              setRecommendationMessage={setRecommendationMessage}
              recomendationMessage={recomendationMessage}
              approvedConfirmation={approvedConfirmation}
              applicationData={buildingInfoData}
              submitData={getSubmitData?.psDrawingPageObservation}
            />
          )}
        {/* {openApplication && (
        <Application setOpenApplication={setOpenApplication} />
      )} */}

        {/* save & continue  */}
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

export default Drawing;
