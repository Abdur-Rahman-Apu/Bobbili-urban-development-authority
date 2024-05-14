import Lottie from "lottie-react";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useDownloadExcel } from "react-export-table-to-excel";
import { AuthContext } from "../../../../AuthProvider/AuthProvider";
import Style from "../../../../Style/TableDownloadBtn.module.css";
import ErrorAnimation from "../../../../assets/ServerError.json";
import MISReportTableLayout from "../../../Components/MISReportTableLayout";
import Loading from "../../../Shared/Loading";
import ShowRevenueReports from "./ShowRevenueReports";

const RevenueReport = () => {
  const { fetchDataFromTheDb } = useContext(AuthContext);
  const [tableData, setTableData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const revenueTableRef = useRef(null);

  const tableHeader = [
    "S.NO",
    "FILE NO",
    "DISTRICT",
    "MANDAL",
    "VILLAGE",
    "OWNER NAME",
    "OWNER NO",
    "OWNER ADDRESS",
    "LTP NAME",
    "LTP MOBILE",
    "MARKET VALUE",
    "APPROVED DATE",
    "SUBMISSION DATE",
    "PAYMENT DATE",
    "FY",
    "Year",
    "Status",
    "14% Open Space Charges",
    "33% Penalization charges",
    "Development Charges (Built Up Area)",
    "Development Charges (Vacant Land)",
    "Labour Cess Component 2",
    "User Charges",
    "Betterment Charges",
    "Building Permit Fees",
    "Site approval charges",
    "Paper Publication Charges",
    "Processing Fees",
    "Green Fee Charges",
    "Labour Cess Component 1",
    "TOTAL PAID",
  ];

  useEffect(() => {
    setLoading(true);
    setError("");
    (async function () {
      try {
        const applicationData = await fetchDataFromTheDb(
          "https://residential-building.onrender.com/totalApplications"
        );
        console.log(applicationData, "AD");
        if (Object.keys(applicationData)?.length) {
          setLoading(false);

          const approvedApplications =
            applicationData?.applications?.approvedApplications;
          const shortfallApplications =
            applicationData?.applications?.shortfallApplications;
          const submitApplications =
            applicationData?.applications?.submittedApplications;

          console.log(
            approvedApplications,
            shortfallApplications,
            submitApplications
          );

          const allApplications = [].concat(
            approvedApplications,
            shortfallApplications,
            submitApplications
          );
          setTableData((prev) => {
            const newValue = {
              tableHeader,
              data: allApplications,
            };
            return { ...prev, ...newValue };
          });
        } else {
          setLoading(false);
        }
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    })();
  }, []);

  const { onDownload } = useDownloadExcel({
    currentTableRef: revenueTableRef.current,
    filename: "RevenueReport",
    sheet: "RevenueReport",
  });

  console.log(tableData, "TABLE DATA");
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
            {error} data
          </p>
        </div>
      ) : (
        <>
          <div className="flex justify-end mt-9 mr-6">
            <button
              className={`${Style.Btn} nm_Container`}
              onClick={onDownload}
            >
              <svg
                className={`${Style.svgIcon} `}
                viewBox="0 0 384 512"
                height="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M169.4 470.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 370.8 224 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 306.7L54.6 265.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"></path>
              </svg>
              <span className={`${Style.icon2}`}></span>
              <span className={`${Style.tooltip} bg-normalViolet nm_Container`}>
                Download
              </span>
            </button>
          </div>
          <MISReportTableLayout
            tableData={tableData}
            Component={ShowRevenueReports}
            tableRef={revenueTableRef}
          />
        </>
      )}
    </>
  );
};

export default RevenueReport;
<p>REVENUE REPORT</p>;
