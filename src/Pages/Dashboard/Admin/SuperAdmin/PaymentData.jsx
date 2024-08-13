import React, { useState } from "react";
import { BiDetail } from "react-icons/bi";

export default function PaymentData({
  serialNo,
  applicationData,
  tableComponentProps,
  screenSize,
}) {
  console.log(tableComponentProps, "table component props");
  console.log(applicationData, "applicationData");
  //   const { handleModal } = tableComponentProps;

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
            <p className="text-gray-900 break-words">
              {applicationData?.applicationNo}
            </p>
          </td>
          <td className="p-3 text-sm">
            <p className="text-gray-900 break-words">
              {applicationData?.billing_name ?? "N/A"}
            </p>
          </td>
          <td className="p-3 text-sm">
            <p className="text-gray-900 break-words">
              {applicationData?.billing_tel ?? "N/A"}
            </p>
          </td>
          <td className="p-3 text-sm">
            <p className="text-gray-900 break-words">
              {applicationData?.amount ?? "N/A"}
            </p>
          </td>

          <td className="p-3 text-sm">
            <p className="text-gray-900 break-words capitalize">
              {applicationData?.order_status ?? applicationData?.message}
            </p>
          </td>
          <td className="p-3 text-sm">
            <p className="text-gray-900 break-words">
              {applicationData?.trans_date ?? "N/A"}
            </p>
          </td>
          <td className="px-3 py-[7px] text-sm ">
            <button
              onClick={() => {
                console.log(
                  tableComponentProps,
                  "tableComponent props inside fun"
                );
                tableComponentProps?.handleModal(
                  applicationData?.applicationNo,
                  applicationData
                );
              }}
            >
              <BiDetail size={18} />
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
                <span className="font-semibold">Sl.No: </span>
                {serialNo + 1}
              </p>
            </div>
            <div className="py-3 border-b border-gray-200 text-sm">
              <p className="text-gray-900 break-words">
                <span className="font-semibold">Application no: </span>
                {applicationNo}
              </p>
            </div>
            <div className="p-3 border-b border-gray-200 bg-[#ffd7d7] hover:bg-[#f6c7c7] rounded-full text-sm flex">
              <button
                className={`text-red-400 hover:text-red-500 bg-transparent`}
                onClick={() =>
                  tableComponentProps?.handleModal(
                    applicationData?.applicationNo
                  )
                }
              >
                <BiDetail size={20} />
              </button>
            </div>
          </summary>

          <div className="ml-5">
            <div className="p-3 border-b border-gray-200 text-sm flex justify-start">
              <span className="font-semibold mr-2 text-gray-900">
                Billing name:{" "}
              </span>
              <p className="text-gray-900 break-words">
                {applicationData?.billing_name ?? "N/A"}
              </p>
            </div>

            <div className="p-3 border-b border-gray-200 text-sm flex justify-start">
              <span className="font-semibold mr-2 text-gray-900">
                Billing tel:{" "}
              </span>
              <p className="text-gray-900 break-words">
                {applicationData?.billing_tel ?? "N/A"}
              </p>
            </div>

            <div className="p-3 border-b border-gray-200 text-sm flex justify-start">
              <span className="font-semibold mr-2 text-gray-900">Amount: </span>
              <p className="text-gray-900 break-words">
                {applicationData?.amount ?? "N/A"}
              </p>
            </div>

            <div className="p-3 border-b border-gray-200 text-sm flex justify-start">
              <span className="font-semibold mr-2 text-gray-900">Status: </span>
              <p className="text-gray-900 break-words capitalize">
                {applicationData?.order_status ?? applicationData?.message}
              </p>
            </div>

            <div className="p-3 border-b border-gray-200 text-sm flex justify-start">
              <span className="font-semibold mr-2 text-gray-900">Date: </span>
              <p className="text-gray-900 break-words">
                {applicationData?.trans_date ?? "N/A"}
              </p>
            </div>
          </div>
        </details>
      )}
    </>
  );
}
