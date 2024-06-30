import React, { useContext, useState } from "react";
import { AiFillPlusCircle, AiOutlineMinusCircle } from "react-icons/ai";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { AuthContext } from "../../../../../AuthProvider/AuthProvider";
import DeleteIcon from "../../../../Components/DeleteIcon";

const AllDraftApplication = ({
  serialNo,
  applicationData,
  tableComponentProps,
  screenSize,
}) => {
  const { alertToConfirmDelete } = useContext(AuthContext);

  const { showPageBasedOnApplicationType, removeDraftApplication, navigate } =
    tableComponentProps;

  const { applicationNo, buildingInfo, applicantInfo, createdDate } =
    applicationData;

  const { generalInformation } = buildingInfo;
  const { applicantDetails } = applicantInfo;

  const [tableInfo, setTableInfo] = useState(false);
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
          <td className="p-3 text-sm">
            <button
              className="hover:underline"
              onClick={() =>
                showPageBasedOnApplicationType(applicationNo, navigate, "draft")
              }
            >
              <p className="text-gray-900 break-words">{applicationNo}</p>
            </button>
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
            <p className="text-gray-900 break-words">{createdDate ?? "N/A"}</p>
          </td>
          <td className="px-3 py-[7px] text-sm ">
            <button
              className={`delete-btn`}
              onClick={() =>
                alertToConfirmDelete(applicationNo, removeDraftApplication)
              }
            >
              <DeleteIcon />
            </button>
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
            <div className="p-3 border-b border-gray-200 bg-[#ffd7d7] hover:bg-[#f6c7c7] rounded-full text-sm flex">
              <button
                className={`text-red-400 hover:text-red-500 bg-transparent`}
                onClick={() =>
                  alertToConfirmDelete(applicationNo, removeDraftApplication)
                }
              >
                <RiDeleteBin5Fill size={19} />
              </button>
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
                Created date:{" "}
              </span>
              <p className="text-gray-900 break-words">
                {createdDate ?? "N/A"}
              </p>
            </div>
          </div>
        </details>
      )}
    </>
  );
};

export default AllDraftApplication;
