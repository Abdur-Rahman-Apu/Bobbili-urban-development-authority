import React from "react";

const ShowPlotDetails = ({ serialNo, applicationData }) => {
  const {
    applicationNo,
    buildingInfo,
    applicantInfo,
    createdDate,
    submitDate,
    psSubmitDate,
    status,
  } = applicationData;

  const { generalInformation, plotDetails } = buildingInfo;
  const { applicantDetails, ltpDetails } = applicantInfo;

  return (
    <tr className="border-b border-gray-200 dark:text-black hidden md:table-row">
      <td className="p-3 text-sm">
        <p className="text-gray-900 ">{serialNo + 1}</p>
      </td>
      <td className="p-3 text-sm">
        <p className="text-gray-900 ">{applicationNo}</p>
      </td>
      <td className="p-3 text-sm">
        <p className="text-gray-900 ">{generalInformation?.district}</p>
      </td>
      <td className="p-3 text-sm">
        <p className="text-gray-900 ">{generalInformation?.mandal}</p>
      </td>
      <td className="p-3 text-sm">
        <p className="text-gray-900 ">{generalInformation?.village}</p>
      </td>
      <td className="p-3 text-sm">
        <p className="text-gray-900 ">
          {applicantDetails.length ? applicantDetails[0].name : "N/A"}
        </p>
      </td>
      <td className="p-3 text-sm">
        <p className="text-gray-900 ">
          {applicantDetails.length ? applicantDetails[0].address : "N/A"}
        </p>
      </td>
      <td className="p-3 text-sm">
        <p className="text-gray-900 ">{ltpDetails?.name ?? "N/A"}</p>
      </td>
      <td className="p-3 text-sm">
        <p className="text-gray-900 ">{ltpDetails?.phoneNo ?? "N/A"}</p>
      </td>
      <td className="p-3 text-sm">
        <p className="text-gray-900 ">
          {plotDetails?.marketValueSqym ?? "N/A"}
        </p>
      </td>
      <td className="p-3 text-sm">
        <p className="text-gray-900 ">{createdDate ?? "N/A"}</p>
      </td>
      <td className="p-3 text-sm">
        <p className="text-gray-900 ">
          {plotDetails?.proposedPlotAreaCal ?? "N/A"}
        </p>
      </td>
      <td className="p-3 text-sm">
        <p className="text-gray-900 ">
          {plotDetails?.roadWideningAreaCal ?? "N/A"}
        </p>
      </td>
      <td className="p-3 text-sm">
        <p className="text-gray-900 ">{plotDetails?.netPlotAreaCal ?? "N/A"}</p>
      </td>
      <td className="p-3 text-sm">
        <p className="text-gray-900 ">
          {plotDetails?.floorDetails?.length ?? "0"}
        </p>
      </td>
      <td className="p-3 text-sm">
        <p className="text-gray-900 ">
          {plotDetails?.totalBuiltUpArea ?? "N/A"}
        </p>
      </td>
      <td className="p-3 text-sm ">
        <p className="text-gray-900">{plotDetails?.noOfUnits ?? "N/A"}</p>
      </td>
      <td className="p-3 text-sm">
        <p className="text-gray-900 ">{submitDate ?? "N/A"}</p>
      </td>
      <td className="p-3 text-sm">
        <p className="text-gray-900 ">{submitDate ?? "N/A"}</p>
      </td>
      <td className="p-3 text-sm">
        <p className="text-gray-900 ">{submitDate ?? "N/A"}</p>
      </td>
      <td className="p-3  border-b border-gray-200 text-xs">
        <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
          <span
            aria-hidden
            className={`absolute inset-0  ${
              (status?.toLowerCase()?.includes("pending") && "bg-orange-200") ||
              (status?.toLowerCase()?.includes("approved") && "bg-green-200") ||
              (status?.toLowerCase()?.includes("shortfall") &&
                "bg-[#fad390]") ||
              (status?.toLowerCase()?.includes("rejected") && "bg-red-200")
            } opacity-50 rounded-full`}
          ></span>
          <span className="relative capitalize">{status ?? "N/A"}</span>
        </span>
      </td>
    </tr>
  );
};

export default ShowPlotDetails;