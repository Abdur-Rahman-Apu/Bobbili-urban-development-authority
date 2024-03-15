import React, { useContext, useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { AuthContext } from "../../AuthProvider/AuthProvider";
import DefaultDocuments from "../../assets/DefaultDocument.json";
import DynamicDocuments from "../../assets/DynamicDocument.json";

const EndorsementModal = ({ modalEndorsement }) => {
  const { openEndorsement, setOpenEndorsement } = modalEndorsement;
  const { getApplicationData, ownerNamePattern, fetchDataFromTheDb } =
    useContext(AuthContext);

  const applicationNo = JSON.parse(localStorage.getItem("CurrentAppNo"));
  const cameFrom = JSON.parse(localStorage.getItem("page"));

  const [gramaPanchayat, setGramaPanchayat] = useState("");
  const [applicationNumber, setApplicationNumber] = useState("");
  const [surveyNo, setSurveyNo] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [dataFromDb, setDataFromDb] = useState({});
  const [psInfo, setPsInfo] = useState({});

  const [shortfallDocuments, setShortfallDocuments] = useState([]);

  useEffect(() => {
    const modal = document.getElementById("endorsementModal");
    if (openEndorsement) {
      modal.showModal();
    }
  }, []);

  useEffect(() => {
    const getData = async () => {
      const applicationData = await getApplicationData(applicationNo, cameFrom);
      // console.log(applicationData, "All info ApplicationData");
      setDataFromDb(applicationData);
      setGramaPanchayat(
        applicationData?.buildingInfo?.generalInformation?.gramaPanchayat
      );
      setApplicationNumber(applicationData?.applicationNo);
      setSurveyNo(applicationData?.buildingInfo?.generalInformation?.surveyNo);
      setOwnerName(applicationData?.applicantInfo?.applicantDetails[0]?.name);

      if (Object.keys(applicationData)?.length) {
        console.log("asci");
        setShortfallDocuments((prev) => {
          const shortfallRemarks =
            applicationData?.psDocumentPageObservation?.remarkText;

          const extractIdQuestionWithRemarks = shortfallRemarks?.map((item) => {
            if (item.hasOwnProperty("default")) {
              const getQuestion = collectShortfallDocumentNameWithRemark(
                item?.default?.id,
                undefined,
                "default"
              );

              console.log(getQuestion, "Default");
              return {
                id: item?.default?.id,
                question: getQuestion,
                remark: item?.default?.value,
              };
            } else if (item.hasOwnProperty("dynamic")) {
              const getQuestion = collectShortfallDocumentNameWithRemark(
                item?.dynamic?.id,
                item?.dynamic?.uploadId,
                "dynamic"
              );
              console.log(getQuestion, "dynamic");
              return {
                id: item?.dynamic?.id,
                question: getQuestion,
                remark: item?.dynamic?.value,
              };
            }
          });

          return [...extractIdQuestionWithRemarks];
        });
      }
    };
    getData();
  }, []);

  const collectShortfallDocumentNameWithRemark = (
    id,
    uploadId,
    documentType
  ) => {
    let findQuestion;
    // [...DefaultDocuments, ...DynamicDocuments]?.forEach((document) => {
    //   console.log(document, "Document", document?.id, id, document?.id === id);
    //   if (document?.id === id) {
    //     console.log(document?.question, "Question");
    //     findQuestion = document?.question;
    //   }
    // });

    switch (documentType) {
      case "default":
        DefaultDocuments?.forEach((document) => {
          if (document?.id === id) {
            console.log(document?.question, "Question");
            findQuestion = document?.question;
          }
        });
        break;

      case "dynamic":
        DynamicDocuments?.forEach((document) => {
          if (document?.id === id) {
            document?.requirements?.forEach((item) => {
              if (item?.uploadId === uploadId) {
                findQuestion = item?.requirement;
              }
            });
          }
        });
    }

    return findQuestion;
  };

  useEffect(() => {
    if (dataFromDb && Object.keys(dataFromDb)?.length) {
      fetchDataFromTheDb(
        `http://localhost:5000/userInformation?id=${dataFromDb?.psId}`
      ).then((result) => {
        console.log(result, "PS");
        setPsInfo(result);
      });
    }
  }, [dataFromDb]);

  console.log(dataFromDb, "GDD");
  console.log(shortfallDocuments, "SD");
  console.log(psInfo, "Ps info");
  const date = new Date();
  const currentDate = date
    .toISOString()
    .split("T")[0]
    .split("-")
    .reverse()
    .join("-");

  return (
    <div className="dark:bg-white">
      <dialog id="endorsementModal" className="modal">
        {/* divide-y-2 divide-gray-200 */}
        <div
          className={`ScrollingHidden relative overflow-hidden overflow-y-auto rounded-lg modal-box py-10 px-12 bg-white text-gray-900 w-full max-w-4xl`}
        >
          <form method="dialog" className="absolute top-6 right-6 z-50">
            {/* if there is a button in form, it will close the modal */}
            <button
              onClick={() => setOpenEndorsement(false)}
              className={`outline outline-red-500 outline-offset-4 text-red-500 rounded-full hover:bg-red-500 hover:text-white hover:outline-offset-0 p-[1px] transition-all duration-1000`}
            >
              <RxCross2 className="text-2xl" />
            </button>
          </form>

          <div className="pt-4">
            <h3 className="font-bold text-2xl text-center mb-8">
              ENDORSEMENT!
            </h3>
            <div className="flex justify-between font-semibold text-lg">
              <h4>Letter No: {dataFromDb?.shortfallSerialNo}</h4>
              <h4>Date: {currentDate}</h4>
            </div>
            <div className="flex flex-col pt-3 text-base">
              <p className="text-start">
                <span className="font-bold">Sub:</span> BUILDINGS -{" "}
                <span className="underline">{gramaPanchayat}</span>{" "}
                <span className="font-bold">Grama panchayat</span> - required
                compliances - Endorsement issued - Regarding.
              </p>
              <p>
                <span className="font-bold">Ref:</span> Application of
                Sri/Smt/Kum{" "}
                <span className="underline">
                  {ownerNamePattern(
                    dataFromDb?.applicantInfo?.applicantDetails
                  ) ?? "N/A"}
                </span>
                .
              </p>
              <p className="indent-10 mt-3">
                With reference to your application for building permission vide
                B.A.No <span className="underline">{applicationNumber}</span>{" "}
                for construction of{" "}
                <span className="font-bold me-1">
                  Residential/ Individual Residential Building
                </span>
                building in Survey .No.{" "}
                <span className="underline">{surveyNo}</span>.
              </p>
              <p className="font-semibold text-center text-xl mt-8 mb-3">
                Objections Found in Primary Document
              </p>
            </div>
            <div className="mt-1">
              <p className="font-bold text-base">
                You are requested to comply the shortfalls raised in documents:
              </p>
              <div className="container mx-auto px-4 font-roboto ">
                <div className="py-2">
                  <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 ">
                    <div className="inline-block min-w-full nm_Container rounded-lg overflow-hidden">
                      <table className="min-w-full leading-normal text-center">
                        <thead className="bg-normalViolet">
                          <tr className="text-base">
                            <th
                              scope="col"
                              className="p-3 border-b-2 border-gray-200 text-sm text-white font-semibold uppercase tracking-wider"
                            >
                              #
                            </th>
                            <th
                              scope="col"
                              className="p-3 border-b-2 border-gray-200 text-sm text-white font-semibold uppercase tracking-wider"
                            >
                              Name of the Document
                            </th>
                            <th
                              scope="col"
                              className="p-3 border-b-2 border-gray-200 text-sm text-white font-semibold uppercase tracking-wider"
                            >
                              Remarks
                            </th>
                          </tr>
                        </thead>
                        <tbody className="text-[15px]">
                          {/* Ground Position  */}
                          {shortfallDocuments?.length !== 0 &&
                            shortfallDocuments?.map((document, index) => {
                              return (
                                <tr className="text-start ">
                                  <td
                                    rowSpan=""
                                    className="break-words border-r px-6 py-4 border-neutral-300"
                                  >
                                    {index + 1}
                                  </td>
                                  <td
                                    className={`break-words border-r px-6 py-4 border-neutral-300`}
                                  >
                                    {document?.question}
                                  </td>
                                  <td
                                    className={`break-words  px-6 py-4 border-neutral-500`}
                                  >
                                    {document?.remark}
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="my-6">
              <p className="font-bold">
                Drawing Plan Remarks and Recommendation: Shortfall
              </p>
              <table className="min-w-full border text-base font-light border-neutral-500">
                <td
                  scope="col"
                  className="border-r h-[100px] p-2 border-neutral-500"
                >
                  {dataFromDb?.psDrawingPageObservation?.message}
                </td>
              </table>
            </div>

            <div className="my-6">
              <p className="font-bold">
                Documents Remarks and Recommendation: Shortfall
              </p>
              <table className="min-w-full border text-base font-light border-neutral-500">
                <td
                  scope="col"
                  className="border-r h-[100px] p-2 border-neutral-500"
                >
                  {dataFromDb?.psDocumentPageObservation?.message}
                </td>
              </table>
            </div>

            <div className="mt-3">
              <p className="font-bold">
                Inspection Remarks and Recommendation : Shortfall
              </p>
              <table className="min-w-full border text-base font-light border-neutral-500">
                <td
                  scope="col"
                  className="border-r h-[100px] p-2 border-neutral-500"
                >
                  {dataFromDb?.siteInspection?.recommendations}
                </td>
              </table>
            </div>

            <div className="mt-20 flex flex-col items-end">
              <p className="font-semibold">Panchayat Secretary</p>
              <p>{psInfo?.gramaPanchayat}___________ Grama Panchayat</p>
              <p>{psInfo?.mandal}__________Mandal</p>
              <p>{psInfo?.district}______________ District</p>
            </div>
          </div>
        </div>

        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setOpenEndorsement(false)}>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default EndorsementModal;
