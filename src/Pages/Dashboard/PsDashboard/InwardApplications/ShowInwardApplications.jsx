import React, { useState } from "react";

export default function ShowInwardApplications({
  serialNo,
  applicationData,
  tableComponentProps,
  screenSize,
}) {
  const [tableInfo, setTableInfo] = useState(false);
  const { showPageBasedOnApplicationType, navigate } = tableComponentProps;

  const { applicationNo, buildingInfo, applicantInfo, submitDate, status } =
    applicationData;

  const { generalInformation } = buildingInfo;
  const { applicantDetails } = applicantInfo;

  const handleTableInfo = () => {
    tableInfo ? setTableInfo(false) : setTableInfo(true);
  };
  return (
    <>
      {screenSize > 1024 ? (
        <tr className="border-b border-gray-200 dark:text-black">
          <td className="p-3 text-sm">
            <p className="text-gray-900 break-words">{serialNo + 1}</p>
          </td>
          <td
            className="hover:underline cursor-pointer border-b border-gray-200 text-sm"
            onClick={() =>
              showPageBasedOnApplicationType(applicationNo, navigate, "submit")
            }
          >
            <p className="text-gray-900 break-words">{applicationNo}</p>
          </td>
          <td className="p-3 text-sm">
            <p className="text-gray-900 break-words">
              {applicantDetails.length ? applicantDetails[0].name : "N/A"}
            </p>
          </td>
          <td className="p-3 text-sm">
            <p className="text-gray-900 break-words">
              {applicantDetails.length ? applicantDetails[0].phone : "N/A"}
            </p>
          </td>
          <td className="p-3 text-sm">
            <p className="text-gray-900 break-words">
              {generalInformation.caseType !== ""
                ? generalInformation.caseType
                : "N/A"}
            </p>
          </td>
          <td className="p-3 text-sm">
            <p className="text-gray-900 break-words">
              {generalInformation.village !== ""
                ? generalInformation.village
                : "N/A"}
            </p>
          </td>
          <td className="p-3 text-sm">
            <p className="text-gray-900 break-words">
              {generalInformation.mandal !== ""
                ? generalInformation.mandal
                : "N/A"}
            </p>
          </td>
          <td className="p-3 text-sm">
            <p className="text-gray-900 break-words">{submitDate ?? "N/A"}</p>
          </td>
          <td className="p-3 border-b border-gray-200 text-sm">
            <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
              <span
                aria-hidden
                className={`absolute inset-0  ${
                  ((status?.toLowerCase()?.includes("pending") ||
                    status === undefined) &&
                    "bg-violet-400") ||
                  (status?.toLowerCase()?.includes("approved") &&
                    "bg-green-400") ||
                  (status?.toLowerCase()?.includes("shortfall") &&
                    "bg-[#fad390]") ||
                  (status?.toLowerCase()?.includes("rejected") && "bg-red-400")
                } opacity-50 rounded-full nm_Container`}
              ></span>
              <span className="relative ">{status.split(" ")[0] ?? "N/A"}</span>
            </span>
          </td>
        </tr>
      ) : (
        <details className="flex flex-coll px-2 bg-gray-100 dark:text-black m-2 rounded-md">
          <summary
            className="flex items-center justify-between"
            onClick={handleTableInfo}
          >
            <div className="text-[#8B5BF6]">
              {
                tableInfo ? (
                  <AiOutlineMinusCircle size={25} />
                ) : (
                  <AiFillPlusCircle size={25} />
                )
                // tableInfo ? <BiSolidDownArrow size={19} /> : <BiSolidRightArrow size={19} />
              }
            </div>
            <div className="p-3 border-b border-gray-200 text-sm">
              <p className="text-gray-900 break-words">
                <span className="font-semibold">Si.No: </span>
                {serialNo + 1}
              </p>
            </div>
            <div className="py-3 border-b border-gray-200 text-sm">
              <button
                className="hover:underline"
                onClick={() =>
                  showPageBasedOnApplicationType(
                    applicationNo,
                    navigate,
                    "draft"
                  )
                }
              >
                <p className="text-gray-900 break-words">
                  <span className="font-semibold">Application no: </span>
                  {applicationNo}
                </p>
              </button>
            </div>
            <div className="p-3 border-b border-gray-200 text-sm flex justify-start">
              <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                <span
                  aria-hidden
                  className={`absolute inset-0 bg-violet-400 font-white opacity-50 rounded-full nm_Container`}
                ></span>
                <span className="relative ">
                  {status.split(" ")[0] ?? "N/A"}
                </span>
              </span>
            </div>
          </summary>

          <div className="ml-5">
            <div className="p-3 border-b border-gray-200 text-sm flex justify-start">
              <span className="font-semibold mr-2 text-gray-900">
                Owner name:{" "}
              </span>
              <p className="text-gray-900 break-words">
                {applicantDetails.length ? applicantDetails[0].name : "N/A"}
              </p>
            </div>

            <div className="p-3 border-b border-gray-200 text-sm flex justify-start">
              <span className="font-semibold mr-2 text-gray-900">
                Phone no:{" "}
              </span>
              <p className="text-gray-900 break-words">
                {applicantDetails.length ? applicantDetails[0].phone : "N/A"}
              </p>
            </div>

            <div className="p-3 border-b border-gray-200 text-sm flex justify-start">
              <span className="font-semibold mr-2 text-gray-900">
                Case type:{" "}
              </span>
              <p className="text-gray-900 break-words">
                {generalInformation.caseType !== ""
                  ? generalInformation.caseType
                  : "N/A"}
              </p>
            </div>

            <div className="p-3 border-b border-gray-200 text-sm flex justify-start">
              <span className="font-semibold mr-2 text-gray-900">
                Village:{" "}
              </span>
              <p className="text-gray-900 break-words">
                {generalInformation.village !== ""
                  ? generalInformation.village
                  : "N/A"}
              </p>
            </div>

            <div className="p-3 border-b border-gray-200 text-sm flex justify-start">
              <span className="font-semibold mr-2 text-gray-900">Mandal: </span>
              <p className="text-gray-900 break-words">
                {generalInformation.mandal !== ""
                  ? generalInformation.mandal
                  : "N/A"}
              </p>
            </div>

            <div className="p-3 border-b border-gray-200 text-sm flex justify-start">
              <span className="font-semibold mr-2 text-gray-900">
                Submitted date:{" "}
              </span>
              <p className="text-gray-900 break-words">{submitDate ?? "N/A"}</p>
            </div>
          </div>
        </details>
      )}
    </>
  );
}
