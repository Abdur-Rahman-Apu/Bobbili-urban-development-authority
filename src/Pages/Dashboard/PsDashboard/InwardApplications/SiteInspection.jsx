import axios from "axios";
import { motion } from "framer-motion";
// import html2pdf from "html2pdf.js";
// import html2canvas from "html2canvas";
import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useQuery } from "react-query";
import { useNavigate, useOutletContext } from "react-router-dom";
import { AuthContext } from "../../../../AuthProvider/AuthProvider";
import Loading from "../../../Shared/Loading";
import ProceedingModal from "../../../Shared/ProceedingModal";
import SaveData from "../../LtpDashboard/DraftApplication/SaveData";
import ApprovedDecisionModal from "./ApprovedDecisionModal";
import ImageUploadInput from "./ImageUploadInput";
const SiteInspection = () => {
  const {
    confirmAlert,
    sendUserDataIntoDB,
    getApplicationData,
    userInfoFromLocalStorage,
  } = useContext(AuthContext);

  const applicationNo = JSON.parse(localStorage.getItem("CurrentAppNo"));
  const cameFrom = JSON.parse(localStorage.getItem("page"));

  const [isSavedData, setIsSavedData] = useState(0);

  const navigate = useNavigate();
  const stepperData = useOutletContext();

  const [isStepperVisible, currentStep, steps] = stepperData;

  const [groundPosition, setGroundPosition] = useState("");
  const [siteBoundaries, setSiteBoundaries] = useState("");
  const [accessRoad, setAccessRoad] = useState("");
  const [landUse, setLandUse] = useState("");
  const [decision, setDecision] = useState("");
  const [recommendations, setRecommendations] = useState("");

  const [showApprovedModal, setShowApprovedModal] = useState(false);
  const [showShortfallModal, setShowShortfallModal] = useState(false);
  const [whichDecisionButtonClicked, setWhichDecisionButtonClicked] =
    useState(null);

  // Selector field in site inspection page
  const [approachRoadApp, setApproachRoadApp] = useState("Public");

  const handleApproachRoadApp = (e) => {
    setApproachRoadApp(e.target.value);
  };

  const [approachRoadObs, setApproachRoadObs] = useState("Select option");

  console.log(approachRoadObs, "approachRoadObs");

  const handleApproachRoadObs = (e) => {
    setApproachRoadObs(e.target.value);
  };

  const [siteBoundariesImageFilesId, setSiteBoundariesImageFilesId] = useState({
    northApp: "",
    northObs: "",
    southApp: "",
    southObs: "",
    eastApp: "",
    eastObs: "",
    westApp: "",
    westObs: "",
  });

  const [siteBoundariesImageFiles, setSiteBoundariesImageFiles] = useState({});
  const [isApproved, setIsApproved] = useState(-1);
  const [downloading, setDownloading] = useState(false);
  const [wantToSend, setWantToSend] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitSignedFiles, setSubmitSignedFiles] = useState(null);

  console.log(siteBoundariesImageFiles, "siteBoundariesImageFiles");

  const { data, refetch, isLoading, isSuccess } = useQuery(
    ["sitInspectionData"],
    async () => {
      const query = JSON.stringify({
        appNo: applicationNo,
        userId: userInfoFromLocalStorage()._id,
        role: userInfoFromLocalStorage().role,
        page: cameFrom,
      });

      console.log(query, "query");

      const response = await fetch(
        `http://localhost:5000/getApplicationData?data=${query}`
      );

      return await response.json();
    }
  );

  // console.log(data, "DATA");

  useEffect(() => {
    console.log(data, "DATA");

    const documentDecision = data?.psDocumentPageObservation?.approved;
    const drawingDecision = data?.psDrawingPageObservation?.approved;
    const siteInspectionDecision = data?.siteInspection?.decision;

    console.log(documentDecision, drawingDecision, siteInspectionDecision);

    if (
      documentDecision?.length &&
      drawingDecision?.length &&
      siteInspectionDecision?.length
    ) {
      if (
        documentDecision.toLowerCase() === "true" &&
        drawingDecision.toLowerCase() === "true" &&
        siteInspectionDecision.toLowerCase() === "approved"
      ) {
        console.log("APPROVED COND");
        setIsApproved(1);
      }
      if (
        documentDecision.toLowerCase() === "false" ||
        drawingDecision.toLowerCase() === "false" ||
        siteInspectionDecision.toLowerCase() === "shortfall"
      ) {
        console.log("SHORTFALL COND");
        setIsApproved(0);
      }
    }

    const applicationData = data;
    const groundPosition = applicationData?.siteInspection?.groundPosition;
    const siteBoundaries = applicationData?.siteInspection?.siteBoundaries;
    const accessRoad = applicationData?.siteInspection?.accessRoad;
    const landUse = applicationData?.siteInspection?.landUse;
    const decision = applicationData?.siteInspection?.decision;
    const recommendations = applicationData?.siteInspection?.recommendations;
    console.log(decision, "DECISION");
    setGroundPosition(groundPosition);
    setSiteBoundaries(siteBoundaries);
    setApproachRoadApp(siteBoundaries?.accessRoad?.approachRoad?.[0]);
    setApproachRoadObs(siteBoundaries?.accessRoad?.approachRoad?.[1]);
    setAccessRoad(accessRoad);
    setLandUse(landUse);
    // setDecision(decision);
    setRadioPs(decision);
    setRecommendations(recommendations);

    if (siteBoundaries) {
      setSiteBoundariesImageFilesId((prev) => {
        return siteBoundaries?.siteBoundariesImageFilesId;
      });
    }
  }, [isSuccess, data]);

  // useEffect(() => {
  //   console.log(isSavedData, "IS SAVED DATA");
  //   refetch();
  // }, [isSavedData]);

  console.log(siteBoundariesImageFilesId, "IMAGE FILES ID");
  console.log(isApproved, "APPROVED SITE");

  // Decision :
  const [radioPs, setRadioPs] = useState("");
  const handleRadioPs = (e) => {
    setRadioPs(e.target.value);
  };

  const handleFileChange = (id, file) => {
    setSiteBoundariesImageFiles((prevFiles) => ({
      ...prevFiles,
      [id]: file,
    }));
  };

  const collectInputFieldData = async (url) => {
    if (radioPs?.length || decision?.length) {
      let fileUploadSuccess = 1;

      // uploadFileInCloudStorage(formData);
      for (const file in siteBoundariesImageFiles) {
        console.log(file, "File");
        const formData = new FormData();
        if (siteBoundariesImageFiles[file]) {
          console.log(siteBoundariesImageFiles[file], "INSIDE");
          formData.append("file", siteBoundariesImageFiles[file]);

          console.log(...formData, "FORM DATA");
          try {
            const response = await axios.post(
              "http://localhost:5000/upload?page=siteInspection",
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data", // Important for file uploads
                },
              }
            );

            console.log(response, "RESPONSE");
            if (response?.data.msg === "Successfully uploaded") {
              const fileId = response.data.fileId;
              siteBoundariesImageFilesId[file] = fileId;
              fileUploadSuccess = 1;
            }
          } catch (error) {
            // Handle errors, e.g., show an error message to the user
            toast.error("Error to upload documents");
            fileUploadSuccess = 0;
          }
        }
      }

      console.log(fileUploadSuccess, "FILEUPLOAD SUCCESS");

      if (fileUploadSuccess) {
        // Ground Position :
        const natureOfSiteApp =
          document.getElementById("natureOfSiteApp").value;
        const natureOfSiteObs =
          document.getElementById("natureOfSiteObs").value;
        const siteLevelApp = document.getElementById("siteLevelApp").value;
        const siteLevelObs = document.getElementById("siteLevelObs").value;
        const totalAreaAsOnGroundApp = document.getElementById(
          "totalAreaAsOnGroundApp"
        ).value;
        const totalAreaAsOnGroundObs = document.getElementById(
          "totalAreaAsOnGroundObs"
        ).value;
        const workCommentedApp =
          document.getElementById("workCommentedApp").value;
        const workCommentedObs =
          document.getElementById("workCommentedObs").value;
        // Site Boundaries :
        const northApp = document.getElementById("northApp").files[0];
        const northObs = document.getElementById("northObs").files[0];
        const southApp = document.getElementById("southApp").files[0];
        const southObs = document.getElementById("southObs").files[0];
        const eastApp = document.getElementById("eastApp").files[0];
        const eastObs = document.getElementById("eastObs").files[0];
        const westApp = document.getElementById("westApp").files[0];
        const westObs = document.getElementById("westObs").files[0];
        const scheduleOfTheDocumentsApp = document.getElementById(
          "scheduleOfTheDocumentsApp"
        ).value;
        const scheduleOfTheDocumentsObs = document.getElementById(
          "scheduleOfTheDocumentsObs"
        ).value;
        // Access Road :
        const natureOfRoadApp =
          document.getElementById("natureOfRoadApp").value;
        const natureOfRoadObs =
          document.getElementById("natureOfRoadObs").value;
        const approachRoadApp =
          document.getElementById("approachRoadApp").value;
        const approachRoadObs =
          document.getElementById("approachRoadObs").value;
        const roadWidthApp = document.getElementById("roadWidthApp").value;
        const roadWidthObs = document.getElementById("roadWidthObs").value;
        const scopeOfRoadApp = document.getElementById("scopeOfRoadApp").value;
        const scopeOfRoadObs = document.getElementById("scopeOfRoadObs").value;
        // Land Use :
        const landUseApp = document.getElementById("landUseApp").value;
        const landUseObs = document.getElementById("landUseObs").value;
        const proposedActivityApp = document.getElementById(
          "proposedActivityApp"
        ).value;
        const proposedActivityObs = document.getElementById(
          "proposedActivityObs"
        ).value;
        const landRoadWidthApp =
          document.getElementById("landRoadWidthApp").value;
        const landRoadWidthObs =
          document.getElementById("landRoadWidthApp").value;
        const whetherPermissionApp = document.getElementById(
          "whetherPermissionApp"
        ).value;
        const whetherPermissionObs = document.getElementById(
          "whetherPermissionObs"
        ).value;
        // Comments
        const recommendations =
          document.getElementById("recommendations").value;

        const groundPosition = {
          natureOfSite: [natureOfSiteApp, natureOfSiteObs],
          siteLevel: [siteLevelApp, siteLevelObs],
          totalAreaAsOnGround: [totalAreaAsOnGroundApp, totalAreaAsOnGroundObs],
          workCommented: [workCommentedApp, workCommentedObs],
        };

        const siteBoundaries = {
          siteBoundariesImageFilesId,
          scheduleOfTheDocuments: [
            scheduleOfTheDocumentsApp,
            scheduleOfTheDocumentsObs,
          ],
        };

        console.log(siteBoundaries, "siteBoundaries");

        const accessRoad = {
          natureOfRoad: [natureOfRoadApp, natureOfRoadObs],
          approachRoad: [approachRoadApp, approachRoadObs],
          accessRoadWidth: [roadWidthApp, roadWidthObs],
          scopeOfRoad: [scopeOfRoadApp, scopeOfRoadObs],
        };

        const landUse = {
          landUse: [landUseApp, landUseObs],
          proposedActivity: [proposedActivityApp, proposedActivityObs],
          landRoadWidth: [landRoadWidthApp, landRoadWidthObs],
          whetherPermission: [whetherPermissionApp, whetherPermissionObs],
        };

        // All Information :
        const siteInspection = {
          groundPosition,
          siteBoundaries,
          accessRoad,
          landUse,
          decision: radioPs,
          recommendations,
        };

        console.log(siteInspection, "SITE INSPECTION");

        // fetch(`http://localhost:5000/recommendDataOfPs?appNo=${applicationNo}`, {
        //     method: "PATCH",
        //     headers: {
        //         "content-type": "application/json",
        //     },
        //     body: JSON.stringify({ siteInspection }),
        // })
        //     .then((res) => res.json())
        //     .then((result) => {
        //         console.log(result);
        //         if (result.acknowledged) {
        //             toast.success("Saved data successfully");
        //         } else {
        //             toast.error("Server Error");
        //         }
        //     });

        return await sendUserDataIntoDB(url, "PATCH", {
          applicationNo,
          siteInspection,
        });
      }
    } else {
      toast.error(
        "Please fill up the decision whether the application is approved or shortfall"
      );
      throw new Error(
        "Please fill up the decision whether the application is approved or shortfall"
      );
    }
  };

  // const [signedFilesId, setSignedFilesId] = useState(
  //   submitSignedFiles ? { ...submitSignedFiles } : null
  // );

  const sentPsDecision = async (url) => {
    setSubmitting(true);
    let fileUploadSuccess = 0;
    // uploadFileInCloudStorage(formData);
    console.log(submitSignedFiles, "Selected files");

    const singedFilesId = {};
    for (const file in submitSignedFiles) {
      console.log(submitSignedFiles[file]);

      if (submitSignedFiles[file] instanceof File) {
        const formData = new FormData();
        if (submitSignedFiles[file]) {
          formData.append("file", submitSignedFiles[file]);
          try {
            const response = await axios.post(
              "http://localhost:5000/upload?page=approvedDocSignedPS",
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data", // Important for file uploads
                },
              }
            );
            if (response?.data.msg === "Successfully uploaded") {
              const fileId = response.data.fileId;

              singedFilesId[file] = fileId;
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

    console.log(fileUploadSuccess, "File upload success");
    if (fileUploadSuccess) {
      console.log(fileUploadSuccess);
      const psSignedPdf = {
        proceeding: singedFilesId["proceeding"],
        drawing: singedFilesId["drawing"],
      };

      console.log(psSignedPdf, "psSignedPdf");

      const trackPSAction = JSON.parse(localStorage.getItem("PSDecision"));

      const data = {
        psId: userInfoFromLocalStorage()?._id,
        applicationNo,
        trackPSAction,
        psSignedFiles: psSignedPdf,
      };
      url = `http://localhost:5000/decisionOfPs?data=${JSON.stringify(data)}`;
      console.log(url);

      const config = {
        method: "DELETE",
      };

      try {
        const response = await fetch(url, config);
        const result = await response.json();

        console.log(result, "result");
        if (result?.acknowledged) {
          setSubmitting(false);
          toast.success("Your file is saved");
          localStorage.removeItem("PSDecision");
          navigate("/dashboard/outWard");
        } else {
          setSubmitting(false);
          toast.error("Server Error");
        }
      } catch (err) {
        setSubmitting(false);
        toast.error("Server Error");
      }
      // return await sendUserDataIntoDB(url, "PATCH", {
      //   applicationNo,
      //   drawing,
      //   prevSavedState: stepCompleted,
      // });
    }
  };

  // const containerRef = useRef(null);

  // const downloadPDF = () => {
  //   const container = containerRef.current;

  //   console.log(container);

  //   //  const capture = document.querySelector(".actual-receipt");
  //   // setLoader(true);
  //   // html2canvas(document.getElementById("target")).then((canvas) => {
  //   //   const imgData = canvas.toDataURL("img/png");
  //   //   const doc = new jsPDF("p", "mm", "a4");
  //   //   const componentWidth = doc.internal.pageSize.getWidth();
  //   //   const componentHeight = doc.internal.pageSize.getHeight();
  //   //   doc.addImage(imgData, "PNG", 0, 0, componentWidth, componentHeight);
  //   //   // setLoader(false);
  //   //   doc.save("receipt.pdf");
  //   // });

  //   // htmlToImage
  //   //   .toPng(document.getElementById("proceedingModal"))
  //   //   .then(function (dataUrl) {
  //   //     console.log(dataUrl);
  //   //     const pdf = new jsPDF("p", "mm", "a4");
  //   //     const componentWidth = pdf.internal.pageSize.getWidth();
  //   //     const componentHeight = pdf.internal.pageSize.getHeight();

  //   //     pdf.addImage(dataUrl, "PNG", 0, 0, componentWidth, componentHeight);
  //   //     pdf.save("download.pdf");
  //   //   })
  //   //   .catch(function (error) {
  //   //     console.error("oops, something went wrong!", error);
  //   //   });

  //   let jsPdf = new jsPDF("p", "pt", "letter");
  //   var htmlElement = document.getElementById("proceedingModal");
  //   // you need to load html2canvas (and dompurify if you pass a string to html)
  //   const opt = {
  //     callback: function (jsPdf) {
  //       jsPdf.save("Test.pdf");
  //       // to open the generated PDF in browser window
  //       // window.open(jsPdf.output('bloburl'));
  //     },
  //     margin: [72, 72, 72, 72],
  //     autoPaging: "text",
  //     html2canvas: {
  //       allowTaint: true,
  //       dpi: 300,
  //       letterRendering: true,
  //       logging: false,
  //       scale: 0.8,
  //     },
  //   };

  //   jsPdf.html(htmlElement, opt);

  //   // Render your component inside the off-screen container
  //   // using the data passed as a prop

  //   // ReactDOM.render(<ProceedingPdf />, container);

  //   // Configuration options for html2pdf
  //   // const pdfOptions = {
  //   //   margin: 10,
  //   //   filename: "document.pdf",
  //   //   image: { type: "jpeg", quality: 0.98 },
  //   //   html2canvas: { scale: 2 },
  //   //   jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  //   // };

  //   // Generate and download the PDF
  //   // html2pdf()
  //   //   .from(container)
  //   //   .set(pdfOptions)
  //   //   .outputPdf((pdf) => {
  //   //     const blob = new Blob([pdf], { type: "application/pdf" });
  //   //     const link = document.createElement("a");
  //   //     link.href = window.URL.createObjectURL(blob);
  //   //     link.download = options.filename;
  //   //     link.click();
  //   //   });

  //   // Clear the content from the off-screen container
  //   // ReactDOM.unmountComponentAtNode(container);
  // };

  // const handleGeneratePDF = async () => {
  //   const pdfBuffer = await generatePDF(<ProceedingPdf />);

  //   // You can now save the PDF buffer or send it to the user as needed
  //   console.log(pdfBuffer);
  // };

  const tableDataClass =
    "break-words border bg-[#E8EAEC] px-6 py-4 border-neutral-500";
  const inputClass =
    "block w-full h-12 bg-white hover:bg-white pl-4 focus:outline-0";
  const inputTableDataClass = "break-words border-r border-neutral-500";

  const convertToPdf = () => {
    setDownloading(true);
    const element = document.getElementById("proceedingModal");

    var opt = {
      margin: [0.3, 0, 0.3, 0],
      filename: `proceeding-${applicationNo}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      pagebreak: { before: ".beforeClass", after: ["#after1", "#after2"] },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    const fileInfo = JSON.stringify({
      fileName: "Drawing.pdf",
      fileId: data?.drawing?.Drawing,
    });

    fetch(`http://localhost:5000/downloadFile?data=${fileInfo}`)
      .then((res) => {
        if (res.ok) {
          // If the response status is OK, it means the file download is successful
          return res.blob();
        } else {
          // If there's an error response, handle it accordingly
          throw new Error(`Error: ${res.status} - ${res.statusText}`);
        }
      })
      .then((blob) => {
        // Create a URL for the blob and trigger a download
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `Drawing-${applicationNo}.pdf`; // Set the desired file name and extension
        document.body.appendChild(a);
        a.click();

        // drawing file download
        window.URL.revokeObjectURL(url);
        // New Promise-based usage:

        // proceeding file download
        html2pdf().set(opt).from(element).save();
        setDownloading(false);
      })
      .catch((err) => {
        console.log(err, "err");
        // setLoading(<i className="fa fa-life-saver" aria-hidden="true"></i>);
        setDownloading(false);
        toast.error("Server Error");
      });
  };

  const handleSignedFileChange = (e, fileName) => {
    const file = e.target.files[0];
    setSubmitSignedFiles((prev) => {
      const cloneObj = { ...prev };
      cloneObj[fileName] = file;

      return cloneObj;
    });
  };

  console.log(submitSignedFiles, "submitSignedFiles");

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <div className="hidden">
        <ProceedingModal />
      </div>

      {showApprovedModal && (
        <ApprovedDecisionModal
          showApprovedModal={showApprovedModal}
          setShowApprovedModal={setShowApprovedModal}
          downloadFiles={convertToPdf}
          downloading={downloading}
          setWantToSend={setWantToSend}
          wantToSend={wantToSend}
          submitSignedFiles={submitSignedFiles}
          setSubmitSignedFiles={setSubmitSignedFiles}
          submitting={submitting}
          setSubmitting={setSubmitting}
          handleFileChange={handleSignedFileChange}
          sentPsDecision={sentPsDecision}
        />
      )}
      {/* {showShortfallModal && (
        <ShortfallDecisionModal
          showShortfallModal={showShortfallModal}
          setShowShortfallModal={setShowShortfallModal}
        />
      )} */}

      <div
        className="flex flex-col mx-4 mt-4 text-gray-900"
        // targetRef={targetRef}
      >
        <div className="container mx-auto font-roboto">
          <div className="nm_Container inline-block min-w-full rounded-lg overflow-hidden">
            <table className="min-w-full leading-normal text-center">
              <thead className="bg-gradient-to-b from-[#a29bfe] to-[#6c5ce7]">
                <tr className="text-white uppercase tracking-wider">
                  <th scope="col" className="border-r p-3 border-white">
                    {" "}
                    Sl. No.
                  </th>
                  <th scope="col" className="border-r border-white">
                    Description
                  </th>
                  <th scope="col" className="border-r border-white">
                    As per Application
                  </th>
                  <th scope="col">Observation</th>
                </tr>
              </thead>
              <tbody>
                {/* Ground Position  */}
                <tr className="border-b border-neutral-500">
                  <td
                    rowSpan="5"
                    className={`${tableDataClass}  border-l-0 font-bold`}
                  >
                    1
                  </td>
                  <td
                    colSpan="3"
                    className={`${tableDataClass} border-r-0 text-center text-base font-semibold bg-gray-200`}
                  >
                    Ground Position
                  </td>
                </tr>
                <tr className="border-b border-neutral-500">
                  <td className={`${tableDataClass} font-bold bg-white`}>
                    Nature of Site
                  </td>
                  <td className={`${inputTableDataClass} p-0 bg-white`}>
                    <input
                      type="text"
                      id="natureOfSiteApp"
                      defaultValue={groundPosition?.natureOfSite?.[0]}
                      placeholder="Yes/No"
                      className={`${inputClass} focus:border-0`}
                    />
                  </td>
                  <td
                    className={`${inputTableDataClass} p-0 bg-white border-r-0`}
                  >
                    <input
                      id="natureOfSiteObs"
                      defaultValue={groundPosition?.natureOfSite?.[1]}
                      type="text"
                      placeholder="Yes/No"
                      className={`${inputClass} focus:border-0`}
                    />
                  </td>
                </tr>
                <tr className="border-b border-neutral-500">
                  <td className={`${tableDataClass} font-bold bg-white`}>
                    Site Level
                  </td>
                  <td className={`${inputTableDataClass} p-0 bg-white`}>
                    <input
                      id="siteLevelApp"
                      type="text"
                      defaultValue={groundPosition?.siteLevel?.[0]}
                      placeholder="Yes/No"
                      className={`${inputClass} focus:border-0 `}
                    />
                  </td>
                  <td
                    className={`${inputTableDataClass} p-0 bg-white border-r-0`}
                  >
                    <input
                      id="siteLevelObs"
                      type="text"
                      defaultValue={groundPosition?.siteLevel?.[1]}
                      placeholder="Yes/No"
                      className={`${inputClass} focus:border-0`}
                    />
                  </td>
                </tr>
                <tr className="border-b border-neutral-500">
                  <td className={`${tableDataClass} font-bold bg-white`}>
                    Total Area as on Ground in Sq.M.
                  </td>
                  <td className={`${inputTableDataClass} p-0 bg-white`}>
                    <input
                      id="totalAreaAsOnGroundApp"
                      type="text"
                      defaultValue={groundPosition?.totalAreaAsOnGround?.[0]}
                      placeholder="Yes/No"
                      className={`${inputClass} focus:border-0 `}
                    />
                  </td>
                  <td
                    className={`${inputTableDataClass} p-0 bg-white border-r-0`}
                  >
                    <input
                      id="totalAreaAsOnGroundObs"
                      type="text"
                      defaultValue={groundPosition?.totalAreaAsOnGround?.[1]}
                      placeholder="Yes/No"
                      className={`${inputClass} focus:border-0 `}
                    />
                  </td>
                </tr>
                <tr className="border-b border-neutral-500">
                  <td className={`${tableDataClass} font-bold bg-white`}>
                    Work commented
                  </td>
                  <td className={`${inputTableDataClass} p-0 bg-white`}>
                    <input
                      id="workCommentedApp"
                      type="text"
                      defaultValue={groundPosition?.workCommented?.[0]}
                      placeholder="Yes/No"
                      className={`${inputClass} focus:border-0 `}
                    />
                  </td>
                  <td
                    className={`${inputTableDataClass} p-0 bg-white border-r-0`}
                  >
                    <input
                      id="workCommentedObs"
                      type="text"
                      defaultValue={groundPosition?.workCommented?.[1]}
                      placeholder="Yes/No"
                      className={`${inputClass} focus:border-0 `}
                    />
                  </td>
                </tr>

                {/* Site Boundaries  */}
                <tr className="border-b border-neutral-500">
                  <td
                    rowSpan="6"
                    className={`${tableDataClass} border-l-0 font-bold`}
                  >
                    2
                  </td>
                  <td
                    colSpan="3"
                    className={`${tableDataClass} text-center text-base font-semibold bg-gray-200 border-r-0`}
                  >
                    Site Boundaries
                  </td>
                </tr>
                <tr className="border-b border-neutral-500">
                  <td className={`${tableDataClass} font-bold bg-white`}>
                    North
                  </td>
                  <td className="border-r border-neutral-500 bg-white">
                    <ImageUploadInput
                      id="northApp"
                      onFileChange={handleFileChange}
                      siteBoundariesImageFiles={siteBoundariesImageFiles}
                      imageId={siteBoundariesImageFilesId?.northApp}
                    />
                  </td>
                  <td
                    className={`${inputTableDataClass} p-0 bg-white border-r-0`}
                  >
                    <ImageUploadInput
                      id="northObs"
                      onFileChange={handleFileChange}
                      siteBoundariesImageFiles={siteBoundariesImageFiles}
                      imageId={siteBoundariesImageFilesId?.northObs}
                    />
                  </td>
                </tr>
                <tr className="border-b border-neutral-500">
                  <td className={`${tableDataClass} font-bold bg-white`}>
                    South
                  </td>
                  <td className={`${inputTableDataClass} p-0 bg-white`}>
                    <ImageUploadInput
                      id="southApp"
                      onFileChange={handleFileChange}
                      siteBoundariesImageFiles={siteBoundariesImageFiles}
                      imageId={siteBoundariesImageFilesId?.southApp}
                    />
                  </td>
                  <td
                    className={`${inputTableDataClass} p-0 bg-white border-r-0`}
                  >
                    <ImageUploadInput
                      id="southObs"
                      onFileChange={handleFileChange}
                      siteBoundariesImageFiles={siteBoundariesImageFiles}
                      imageId={siteBoundariesImageFilesId?.southObs}
                    />
                  </td>
                </tr>
                <tr className="border-b border-neutral-500">
                  <td className={`${tableDataClass} font-bold bg-white`}>
                    East
                  </td>
                  <td className={`${inputTableDataClass} p-0 bg-white`}>
                    <ImageUploadInput
                      id="eastApp"
                      onFileChange={handleFileChange}
                      siteBoundariesImageFiles={siteBoundariesImageFiles}
                      imageId={siteBoundariesImageFilesId?.eastApp}
                    />
                  </td>
                  <td
                    className={`${inputTableDataClass} p-0 bg-white border-r-0`}
                  >
                    <ImageUploadInput
                      id="eastObs"
                      onFileChange={handleFileChange}
                      siteBoundariesImageFiles={siteBoundariesImageFiles}
                      imageId={siteBoundariesImageFilesId?.eastObs}
                    />
                  </td>
                </tr>
                <tr className="border-b border-neutral-500">
                  <td className={`${tableDataClass} font-bold bg-white`}>
                    West
                  </td>
                  <td className={`${inputTableDataClass} p-0 bg-white`}>
                    <ImageUploadInput
                      id="westApp"
                      onFileChange={handleFileChange}
                      siteBoundariesImageFiles={siteBoundariesImageFiles}
                      imageId={siteBoundariesImageFilesId?.westApp}
                    />
                  </td>
                  <td
                    className={`${inputTableDataClass} p-0 bg-white border-r-0`}
                  >
                    <ImageUploadInput
                      id="westObs"
                      onFileChange={handleFileChange}
                      siteBoundariesImageFiles={siteBoundariesImageFiles}
                      imageId={siteBoundariesImageFilesId?.westObs}
                    />
                  </td>
                </tr>
                <tr className="border-b border-neutral-500">
                  <td className={`${tableDataClass}  font-bold bg-white`}>
                    Whether the above physical feature are
                    <br />
                    talking / Not talking with the schedule of
                    <br />
                    the Documents.
                  </td>
                  <td
                    className={`${inputTableDataClass} p-0 bg-white hover:bg-white`}
                  >
                    <input
                      id="scheduleOfTheDocumentsApp"
                      type="text"
                      defaultValue={siteBoundaries?.scheduleOfTheDocuments?.[0]}
                      placeholder="Yes/No"
                      className="h-[105px] px-4 rounded-none w-full focus:outline-none bg-white hover:bg-white"
                    />
                  </td>
                  <td
                    className={`${inputTableDataClass} p-0 bg-white hover:bg-white border-r-0`}
                  >
                    <input
                      id="scheduleOfTheDocumentsObs"
                      type="text"
                      defaultValue={siteBoundaries?.scheduleOfTheDocuments?.[1]}
                      placeholder="Yes/No"
                      className="h-[105px] px-4 rounded-none w-full focus:outline-none bg-white hover:bg-white"
                    />
                  </td>
                </tr>

                {/* Access Road  */}
                <tr className="border-b border-neutral-500">
                  <td rowSpan="5" className={`${tableDataClass} border-l-0`}>
                    3
                  </td>
                  <td
                    colSpan="3"
                    className={`${tableDataClass} text-center text-base font-semibold bg-gray-200 border-r-0`}
                  >
                    Access Road
                  </td>
                </tr>
                <tr className="border-b border-neutral-500">
                  <td className={`${tableDataClass} font-bold bg-white`}>
                    Nature of Road
                  </td>
                  <td className={`${inputTableDataClass} p-0 bg-white`}>
                    <input
                      id="natureOfRoadApp"
                      type="text"
                      defaultValue={accessRoad?.natureOfRoad?.[0]}
                      placeholder="Yes/No"
                      className={`${inputClass} focus:border-0 `}
                    />
                  </td>
                  <td
                    className={`${inputTableDataClass} p-0 bg-white border-r-0`}
                  >
                    <input
                      id="natureOfRoadObs"
                      type="text"
                      defaultValue={accessRoad?.natureOfRoad?.[1]}
                      placeholder="Yes/No"
                      className={`${inputClass} focus:border-0 `}
                    />
                  </td>
                </tr>
                <tr className="border-b border-neutral-500">
                  <td className={`${tableDataClass} font-bold bg-white`}>
                    Status of Approach Road
                  </td>
                  <td className={`${inputTableDataClass} p-0 bg-white`}>
                    <div className="flex flex-col justify-center">
                      <select
                        id="approachRoadApp"
                        className="input rounded-none w-full bg-white focus:outline-none"
                        value={
                          approachRoadApp
                            ? approachRoadApp
                            : accessRoad?.approachRoad?.[0]
                        }
                        onChange={handleApproachRoadApp}
                      >
                        <option value="Public">Public</option>
                        <option value="Private">Private</option>
                      </select>
                    </div>
                  </td>
                  <td
                    className={`${inputTableDataClass} p-0 bg-white border-r-0`}
                  >
                    <div className="flex flex-col justify-center">
                      <select
                        id="approachRoadObs"
                        className="input bg-white rounded-none w-full focus:outline-none"
                        value={
                          approachRoadObs
                            ? approachRoadObs
                            : accessRoad?.approachRoad?.[1]
                        }
                        onChange={handleApproachRoadObs}
                      >
                        <option value="Select option" disabled>
                          Select option
                        </option>
                        <option value="Public">Public</option>
                        <option value="Private">Private</option>
                      </select>
                    </div>
                  </td>
                </tr>
                <tr className="border-b border-neutral-500">
                  <td className={`${tableDataClass} font-bold bg-white`}>
                    Road Width
                  </td>
                  <td className={`${inputTableDataClass} p-0 bg-white`}>
                    <input
                      id="roadWidthApp"
                      type="text"
                      defaultValue={accessRoad?.accessRoadWidth?.[0]}
                      placeholder="Yes/No"
                      className={`${inputClass} focus:border-0 `}
                    />
                  </td>
                  <td
                    className={`${inputTableDataClass} p-0 bg-white border-r-0`}
                  >
                    <input
                      id="roadWidthObs"
                      type="text"
                      defaultValue={accessRoad?.accessRoadWidth?.[1]}
                      placeholder="Yes/No"
                      className={`${inputClass} focus:border-0 `}
                    />
                  </td>
                </tr>
                <tr className="border-b border-neutral-500">
                  <td className={`${tableDataClass} font-bold bg-white`}>
                    Scope of Road Widening in Mts.
                  </td>
                  <td className={`${inputTableDataClass} p-0 bg-white`}>
                    <input
                      id="scopeOfRoadApp"
                      type="text"
                      defaultValue={accessRoad?.scopeOfRoad?.[0]}
                      placeholder="0"
                      className={`${inputClass} focus:border-0 `}
                    />
                  </td>
                  <td
                    className={`${inputTableDataClass} p-0 bg-white border-r-0`}
                  >
                    <input
                      id="scopeOfRoadObs"
                      defaultValue={accessRoad?.scopeOfRoad?.[1]}
                      type="text"
                      placeholder="0"
                      className={`${inputClass} focus:border-0 `}
                    />
                  </td>
                </tr>

                {/* Land Use  */}
                <tr className="">
                  <td
                    rowSpan="5"
                    className={`${tableDataClass} border-l-0 border-b-0`}
                  >
                    4
                  </td>
                  <td
                    colSpan="3"
                    className={`${tableDataClass} text-center text-base font-semibold bg-gray-200 border-r-0`}
                  >
                    Land Use
                  </td>
                </tr>
                <tr className="border-b border-neutral-500">
                  <td className={`${tableDataClass} font-bold bg-white`}>
                    Land Use as per Master Plan
                  </td>
                  <td className={`${inputTableDataClass} p-0 bg-white`}>
                    <input
                      id="landUseApp"
                      type="text"
                      defaultValue={landUse?.landUse?.[0]}
                      placeholder="Yes/No"
                      className={`${inputClass} focus:border-0 `}
                    />
                  </td>
                  <td
                    className={`${inputTableDataClass} p-0 bg-white border-r-0`}
                  >
                    <input
                      id="landUseObs"
                      type="text"
                      defaultValue={landUse?.landUse?.[1]}
                      placeholder="Yes/No"
                      className={`${inputClass} focus:border-0 `}
                    />
                  </td>
                </tr>
                <tr className="border-b border-neutral-500">
                  <td className={`${tableDataClass} font-bold bg-white`}>
                    Proposed activity
                  </td>
                  <td className={`${inputTableDataClass} p-0 bg-white`}>
                    <input
                      id="proposedActivityApp"
                      type="text"
                      defaultValue={landUse?.proposedActivity?.[0]}
                      placeholder="Yes/No"
                      className={`${inputClass} focus:border-0 `}
                    />
                  </td>
                  <td
                    className={`${inputTableDataClass} p-0 bg-white border-r-0`}
                  >
                    <input
                      id="proposedActivityObs"
                      type="text"
                      defaultValue={landUse?.proposedActivity?.[1]}
                      placeholder="Yes/No"
                      className={`${inputClass} focus:border-0 `}
                    />
                  </td>
                </tr>
                <tr className="border-b border-neutral-500">
                  <td className={`${tableDataClass} font-bold bg-white`}>
                    Road Width
                  </td>
                  <td className={`${inputTableDataClass} p-0 bg-white`}>
                    <input
                      id="landRoadWidthApp"
                      type="text"
                      defaultValue={landUse?.landRoadWidth?.[0]}
                      placeholder="Yes/No"
                      className={`${inputClass} focus:border-0 `}
                    />
                  </td>
                  <td
                    className={`${inputTableDataClass} p-0 bg-white border-r-0`}
                  >
                    <input
                      id="landRoadWidthObs"
                      type="text"
                      defaultValue={landUse?.landRoadWidth?.[1]}
                      placeholder="Yes/No"
                      className={`${inputClass} focus:border-0 `}
                    />
                  </td>
                </tr>
                <tr>
                  <td
                    className={`${tableDataClass} font-bold bg-white border-b-0`}
                  >
                    Whether permission as per Zoning Regulations
                  </td>
                  <td className={`${inputTableDataClass} p-0 bg-white`}>
                    <input
                      id="whetherPermissionApp"
                      type="text"
                      defaultValue={landUse?.whetherPermission?.[0]}
                      placeholder="Yes/No"
                      className={`${inputClass} focus:border-0 `}
                    />
                  </td>
                  <td
                    className={`${inputTableDataClass} p-0 bg-white border-r-0`}
                  >
                    <input
                      id="whetherPermissionObs"
                      type="text"
                      defaultValue={landUse?.whetherPermission?.[1]}
                      placeholder="Yes/No"
                      className={`${inputClass} focus:border-0 `}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <motion.div
          className="nm_Container p-7 mt-10"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0, transition: { duration: 2 } }}
          viewport={{ once: true }}
        >
          <p className="font-bold text-xl text-center mb-4">
            Submit Your Final Decision
          </p>

          {/* Radio Button  */}
          <div className="grid-cols-1 lg:grid-cols-2 items-center mb-4">
            <div className="radio-button-container">
              <div className="radio-button">
                <input
                  type="radio"
                  className="radio-button__input"
                  id="approved"
                  value="Approved"
                  checked={radioPs === "Approved"}
                  onChange={handleRadioPs}
                />
                <label className="radio-button__label" htmlFor="approved">
                  <span className="radio-button__custom"></span>
                  Approved
                </label>
              </div>
              <div className="radio-button">
                <input
                  type="radio"
                  className="radio-button__input"
                  id="shortfall"
                  value="Shortfall"
                  checked={radioPs === "Shortfall"}
                  onChange={handleRadioPs}
                />
                <label className="radio-button__label" htmlFor="shortfall">
                  <span className="radio-button__custom"></span>
                  Shortfall
                </label>
              </div>
            </div>
          </div>
          {/* Comment Box  */}
          <div className="flex items-center">
            <div className="basis-[60%]">
              <label
                htmlFor="ltpAddress"
                className="block mb-1 font-semibold text-black"
              >
                Recommendations
              </label>
              <textarea
                id="recommendations"
                name="Recommendations"
                rows="5"
                defaultValue={recommendations}
                className="w-full px-3 py-2 border rounded-lg border-gray-300 text-black bg-gray-50 focus:border-gray-400 focus:outline-none focus:ring-2 ring-gray-200"
                placeholder="Comments"
              ></textarea>
            </div>
          </div>
        </motion.div>

        {/* save & continue  */}
        <SaveData
          isStepperVisible={isStepperVisible}
          currentStep={currentStep}
          steps={steps}
          stepperData={stepperData}
          confirmAlert={confirmAlert}
          collectInputFieldData={collectInputFieldData}
          sentData={sentPsDecision}
          isApproved={isApproved}
          refetch={refetch}
          setShowApprovedModal={setShowApprovedModal}
        />
      </div>
    </>
  );
};

export default SiteInspection;
