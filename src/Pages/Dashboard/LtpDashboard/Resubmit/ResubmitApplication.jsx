import axios from "axios";
import _ from "lodash";
import Lottie from "lottie-react";
import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { VscReferences } from "react-icons/vsc";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../../AuthProvider/AuthProvider";
import DefaultDocuments from "../../../../assets/DefaultDocument.json";
import DynamicDocuments from "../../../../assets/DynamicDocument.json";
import ErrorAnimation from "../../../../assets/ServerError.json";
import EndorsementModal from "../../../Shared/EndorsementModal";
import Loading from "../../../Shared/Loading";

const ResubmitApplication = () => {
  const { appNo } = useLocation()?.state;

  const { fetchDataFromTheDb, ownerNamePattern, sendUserDataIntoDB } =
    useContext(AuthContext);

  console.log(appNo);

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [remarkValue, setRemarkValue] = useState("");
  const [data, setData] = useState({});
  const [documentObs, setDocumentObs] = useState([]);
  const [openEndorsement, setOpenEndorsement] = useState(false);
  const [drawingFiles, setDrawingFiles] = useState({
    AutoCAD: "",
    Drawing: "",
  });

  const [documentImageFiles, setDocumentImageFiles] = useState({
    default: [],
    dynamic: [],
  });

  useEffect(() => {
    // window.scrollTo(0, 0);
    setLoading(true);
    setError("");
    fetchDataFromTheDb(
      `http://localhost:5000/getSpecificShortfallApplication?appNo=${JSON.stringify(
        appNo
      )}`
    )
      .then((result) => {
        setLoading(false);
        console.log(result, "result");
        setData(result);
        const remarkTexts = result?.psDocumentPageObservation?.remarkText;
        setDocumentObs(remarkTexts);
      })
      .catch((err) => {
        setLoading(false);
        setError(err.message);
      });
  }, []);

  let i = 0;

  useEffect(() => {
    if (documentObs?.length) {
      setDocumentImageFiles((prev) => {
        const newItem = { default: [], dynamic: [] };
        documentObs?.forEach((eachRemark) => {
          if (eachRemark.hasOwnProperty("default")) {
            newItem.default.push({
              id: eachRemark?.default?.id,
              imageId: "",
            });
          }

          if (eachRemark.hasOwnProperty("dynamic")) {
            newItem.dynamic.push({
              id: eachRemark?.dynamic?.id,
              uploadId: eachRemark?.dynamic?.uploadId,
              imageId: "",
            });
          }
        });

        return newItem;
      });
    }
  }, [documentObs]);

  const handleDrawingFileChange = (event, eventId) => {
    const file = event?.target.files[0];
    // formData.append(eventId, file);
    console.log(file, "FILE");
    if (file) {
      toast.success(`${file?.name.slice(0, 20)}... uploaded successfully!`);

      // Set File Uploaded Data
      setDrawingFiles((prev) => {
        prev[eventId] = file;
        return prev;
      });
    }

    console.log(drawingFiles, "SF");
  };

  console.log(data, "data");

  const findQuestionName = (document) => {
    let questionName;
    console.log(document, "DOCUMENT");
    if (document.hasOwnProperty("default")) {
      console.log("default");
      DefaultDocuments.forEach((item) => {
        if (item?.id === document?.default?.id) {
          questionName = item?.question;
        }
      });
    }

    if (document.hasOwnProperty("dynamic")) {
      console.log("dynamic");
      DynamicDocuments?.forEach((item) => {
        if (item?.id === document?.dynamic?.id) {
          item?.requirements?.forEach((eachRequirement) => {
            if (eachRequirement?.uploadId === document?.dynamic?.uploadId) {
              questionName = eachRequirement?.requirement;
            }
          });
        }
      });
    }

    return questionName;
  };

  // document file change detect
  const handleDocumentFileChange = (event, document) => {
    console.log(event.target.files[0], "event");
    const file = event.target.files[0];
    if (document?.hasOwnProperty("default")) {
      const id = document?.default?.id;
      const index = documentImageFiles["default"].findIndex(
        (item) => item.id === id
      );
      documentImageFiles["default"][index] = { id, imageId: file };
    }

    if (document?.hasOwnProperty("dynamic")) {
      const id = document.dynamic.id;
      const uploadId = document.dynamic.uploadId;
      const index = documentImageFiles["dynamic"].findIndex(
        (item) => item.id === id && item.uploadId === uploadId
      );
      documentImageFiles["dynamic"][index] = {
        id,
        uploadId,
        imageId: file,
      };
    }
    toast.success(`${file?.name?.slice(0, 20)} uploaded successfully`);
    console.log(documentImageFiles, "Document image files update");
  };

  // sent data into database

  const sentApplication = async () => {
    console.log("clicked");
    setLoading(true);

    // get all old image files id
    let oldImageFilesId = [data?.drawing?.AutoCAD, data?.drawing?.Drawing];

    const documentsUploadByLtp = data?.documents;

    documentImageFiles["default"].forEach((eachFile) => {
      const index = documentsUploadByLtp?.default?.findIndex(
        (item) => item?.id === eachFile?.id
      );
      if (index !== -1) {
        oldImageFilesId = [
          ...oldImageFilesId,
          documentsUploadByLtp["default"][index]["imageId"],
        ];
      }
    });

    documentImageFiles["dynamic"].forEach((eachFile) => {
      const index = documentsUploadByLtp?.dynamic?.findIndex(
        (item) =>
          item?.id === eachFile?.id && item?.uploadId === eachFile?.uploadId
      );
      if (index !== -1) {
        oldImageFilesId = [
          ...oldImageFilesId,
          documentsUploadByLtp["dynamic"][index]["imageId"],
        ];
      }
    });

    console.log(oldImageFilesId, "old image files id");

    // successfully get old image files id, upload drawing, documents and store image id and apply deep merge using loadash

    // get drawing file image id
    let drawingFileUploadSuccess = 0;
    for (const file in drawingFiles) {
      console.log(file, "file");
      if (drawingFiles[file] instanceof File) {
        const formData = new FormData();
        if (drawingFiles[file]) {
          formData.append("file", drawingFiles[file]);
          try {
            const response = await axios.post(
              "http://localhost:5000/upload?page=drawing",
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data", // Important for file uploads
                },
              }
            );
            if (response?.data.msg === "Successfully uploaded") {
              const fileId = response.data.fileId;
              drawingFiles[file] = fileId;
              drawingFileUploadSuccess = 1;
            }
          } catch (error) {
            // Handle errors, e.g., show an error message to the user
            toast.error("Error to upload documents");
            drawingFileUploadSuccess = 0;
          }
        }
      } else {
        drawingFileUploadSuccess = 1;
      }
    }

    //get document file image id

    let documentFileUploadSuccess = 0;
    if (drawingFileUploadSuccess) {
      const defaultImages = documentImageFiles?.default;
      const dynamicImages = documentImageFiles?.dynamic;

      const loopTimes = [defaultImages, dynamicImages];

      for (let lt = 0; lt < loopTimes.length; lt++) {
        // another loop

        for (let i = 0; i < loopTimes[lt].length; i++) {
          console.log(loopTimes[lt][i].imageId, "File");
          const formData = new FormData();

          formData.append("file", loopTimes[lt][i].imageId);
          try {
            const response = await axios.post(
              "http://localhost:5000/upload?page=document",
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
                documentImageFiles.default[i].imageId = documentImageId;
              } else if (lt === 1) {
                // console.log(sendingImageId.dynamic[i].imageId, "File");
                documentImageFiles.dynamic[i].imageId = documentImageId;
              }
            }
          } catch (error) {
            toast.error("Error to upload documents");
          }
        }

        documentFileUploadSuccess++;
      }
    }

    if (documentFileUploadSuccess === 2) {
      const submitDate = new Date()
        .toISOString()
        .split("T")[0]
        .split("-")
        .reverse()
        .join("-");

      // A function to check duplicate id and remove that id

      const deepMerge = (type, oldArr, newArr) => {
        const newUniqueArr = oldArr.filter((oldItem) => {
          let matchItem = 0;
          newArr.forEach((newItem) => {
            if (type === "default" && oldItem?.id === newItem?.id) {
              matchItem = 1;
            }

            if (
              type === "dynamic" &&
              oldItem?.id === newItem?.id &&
              oldItem?.uploadId === newItem?.uploadId
            ) {
              matchItem = 1;
            }
          });

          if (matchItem === 0) {
            return oldItem;
          }
        });

        return [...newUniqueArr, ...newArr];
      };

      // issue with merge documents value
      const defaultDocuments = deepMerge(
        "default",
        data?.documents?.default,
        documentImageFiles?.default
      );
      const dynamicDocuments = deepMerge(
        "dynamic",
        data?.documents?.dynamic,
        documentImageFiles?.dynamic
      );

      const newUpdatedData = {
        documents: {
          default: [...defaultDocuments],
          dynamic: [...dynamicDocuments],
        },
        drawing: { ...drawingFiles },
        remarkTextByLtp: remarkValue,
        submitDate,
        status: "Pending at PS",
      };

      // delete unnecessary properties from the old data

      delete data["_id"];
      delete data["psDocumentPageObservation"];
      delete data["psDrawingPageObservation"];
      delete data["siteInspection"];
      delete data["psId"];
      delete data["psSubmitDate"];
      delete data["shortfallSerialNo"];

      console.log(newUpdatedData, "new updated data");

      const mergedData = _.merge({}, data, newUpdatedData);

      console.log(mergedData);

      const url = `http://localhost:5000/storeResubmitApplication?data=${JSON.stringify(
        { appNo, oldImageFiles: oldImageFilesId }
      )}`;

      const result = await sendUserDataIntoDB(url, "PATCH", mergedData);

      console.log(result, "result");
      if (result?.acknowledged) {
        setLoading(false);
        toast.success("Your application submitted successfully");
        navigate("/dashboard/submitApplication");
      } else {
        setLoading(false);
        toast.error("Failed to store data");
      }
    }
    setLoading(false);
  };

  // get remark field value

  const detectChangeOfRemarkValue = (event) => {
    const value = event.target.value;
    setRemarkValue(value);
  };

  console.log(documentObs, "DocumentObs");
  console.log(documentImageFiles, "Document image files");
  console.log(drawingFiles, "Drawing");

  if (loading) {
    return <Loading />;
  }
  return (
    <>
      {error?.length !== 0 ? (
        <div className="flex flex-col justify-center items-center min-h-[calc(100vh - 10%)]">
          <Lottie
            animationData={ErrorAnimation}
            loop={true}
            className="w-[40%] h-[40%]"
          />
          <p className="text-red-500 font-bold text-lg uppercase">
            {error?.length === 0 ? "Failed to fetch " : error + " "} data
          </p>
        </div>
      ) : (
        <>
          <div>
            {/* header part  */}
            <div className="flex justify-between items-center m-5">
              <p className="nm_Container p-3 font-bold text-xl">
                Application no:{" "}
                <span className="text-normalViolet">{appNo}</span>
              </p>

              <button
                // Open the modal using document.getElementById('ID').showModal() method
                onClick={() => {
                  // document.getElementById("my_modal_2").showModal();
                  setOpenEndorsement(true);
                }}
                className={`btn btn-sm text-xs nm_Container bg-normalViolet hover:text-[#510BC4] hover:bg-bgColor transition-all duration-700 text-white border-none`}
              >
                <VscReferences className="text-lg" />{" "}
                <span className="text-xs uppercase">Endorsement</span>
              </button>
            </div>

            {/* owner information  */}
            <div className="grid grid-cols-2 p-10 border-image-frame nm_Container mt-10 mx-5 text-[18px]">
              {/* 1st row  */}
              <div>
                <p>
                  <span className="font-bold mr-3 text-violetDark">
                    Owner name:
                  </span>
                  {ownerNamePattern(data?.applicantInfo?.applicantDetails)}
                </p>
              </div>
              <div className="mb-6">
                <p>
                  <span className="font-bold mr-3 text-violetDark">
                    Site location:
                  </span>{" "}
                  {data?.buildingInfo?.generalInformation?.surveyNo},
                  {data?.buildingInfo?.generalInformation?.village},
                  {data?.buildingInfo?.generalInformation?.mandal}
                </p>
              </div>

              {/* 2nd row  */}
              <div>
                <p>
                  <span className="font-bold mr-4 text-violetDark">
                    Contact no:
                  </span>{" "}
                  {data?.applicantInfo?.applicantDetails?.[0]?.phone}
                </p>
              </div>
              <div>
                <p>
                  <span className="font-bold mr-3 text-violetDark">
                    Owner Email:
                  </span>{" "}
                  {data?.applicantInfo?.applicantDetails?.[0]?.email}
                </p>
              </div>
            </div>

            {/* drawing  */}
            <div className="my-10 nm_Container mx-6">
              <p className="font-bold pt-5 text-violetDark text-xl ml-8">
                Drawing
              </p>
              <hr className="w-[90%] h-[1.5px] inline-block ml-8 bg-gray-400" />
              <form
                onSubmit={(e) => e.preventDefault()}
                className="text-black p-5 my-3 ml-3 flex justify-evenly"
              >
                {/* AutoCAD Drawing */}
                <div className="text-lg  mb-8">
                  <p className="pr-3 font-bold text-black">
                    1. AutoCAD Drawing
                  </p>
                  <div className="flex items-center mt-5">
                    <label className="relative cursor-pointer mr-6">
                      <input
                        type="file"
                        accept=".dwg, .zip, .pdf, .png, .jpg"
                        onChange={(event) =>
                          handleDrawingFileChange(event, "AutoCAD")
                        }
                        className="file-input file-input-bordered file-input-md w-full max-w-xs text-gray-400 bg-white dark:text-black"
                      />
                    </label>
                  </div>
                </div>

                {/* Drawing PDF */}
                <div className="text-lg mb-5">
                  <p className="pr-3 font-bold text-black">2. Drawing PDF</p>
                  <div className="flex items-center mt-5">
                    <label className="relative cursor-pointer mr-6">
                      <input
                        type="file"
                        accept=".dwg, .zip, .pdf,.png,.jpg"
                        onChange={(event) =>
                          handleDrawingFileChange(event, "Drawing")
                        }
                        className="file-input file-input-bordered file-input-md w-full max-w-xs text-gray-400 bg-white dark:text-black"
                      />
                    </label>
                  </div>

                  <p className="text-red-500 mt-2 font-bold text-sm">
                    Note: Upload A3 file
                  </p>
                </div>
              </form>
            </div>

            {/* documents  */}
            <div className="my-6 nm_Container mx-6">
              <p className="font-bold pt-5 text-violetDark text-xl ml-8">
                Documents
              </p>
              <hr className="w-[90%] h-[1.5px] inline-block ml-8 bg-gray-400" />

              {documentObs?.map((document, index) => {
                return (
                  <div key={index} className="p-6">
                    <p className="font-bold text-[18px]">
                      {index + 1}. {findQuestionName(document)}
                    </p>

                    <input
                      type="file"
                      accept="*"
                      onChange={(event) =>
                        handleDocumentFileChange(event, document)
                      }
                      className="file-input file-input-bordered file-input-md w-full max-w-xs text-gray-400 bg-white mt-5 dark:text-black"
                    />
                  </div>
                );
              })}
            </div>

            {/* remarks */}
            <div className="nm_Container mx-6 p-7 rounded-t-lg dark:bg-gray-800">
              <label
                className="inline-block font-bold mb-4 text-xl text-violetDark"
                htmlFor="remarks"
              >
                Remarks
              </label>
              {/* <hr className="w-[98%] h-[1.5px] inline-block  bg-gray-400" /> */}
              <div>
                <textarea
                  id="remarks"
                  rows="4"
                  className="w-[70%] p-3 rounded-lg text-base text-gray-900 bg-white border-0 dark:bg-gray-800 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400"
                  placeholder="Write a comment..."
                  onChange={(event) => detectChangeOfRemarkValue(event)}
                  required
                ></textarea>
              </div>
            </div>

            {/* submit btns  */}
            <div className="flex justify-between my-10 mx-6">
              <button
                className="nm_Container overflow-hidden w-24 p-2 h-12 bg-normalViolet text-white border-none rounded-md text-base uppercase font-bold cursor-pointer relative z-10 group"
                onClick={() => navigate(-1)}
              >
                Go
                <span className="absolute w-36 h-32 -top-8 -left-2 bg-white rotate-12 transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-500 duration-1000 origin-left"></span>
                <span className="absolute w-36 h-32 -top-8 -left-2 bg-[#8F85F6] rotate-12 transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-700 duration-700 origin-left"></span>
                <span className="absolute w-36 h-32 -top-8 -left-2 bg-[#8F85F6] rotate-12 transform scale-x-0 group-hover:scale-x-50 transition-transform group-hover:duration-1000 duration-500 origin-left"></span>
                <span className="group-hover:opacity-100 group-hover:duration-1000 duration-100 opacity-0 absolute top-4.5 left-6 z-10">
                  Back!
                </span>
              </button>
              <button className="fancy-button" onClick={sentApplication}>
                Submit
              </button>
            </div>
          </div>
          {openEndorsement && (
            <EndorsementModal
              modalEndorsement={{ openEndorsement, setOpenEndorsement }}
            />
          )}
        </>
      )}
    </>
  );
};

export default ResubmitApplication;
