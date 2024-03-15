import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../AuthProvider/AuthProvider";
import TableLayout from "../../../Components/TableLayout";
import ShowAllRejectedApplications from "./ShowAllRejectedApplications";

const RejectedApplications = () => {
  const [tableData, setTableData] = useState([]);
  const [data, setData] = useState([]);

  const { userInfoFromLocalStorage, fetchDataFromTheDb } =
    useContext(AuthContext);

  const id = userInfoFromLocalStorage()?._id;

  console.log(id, "ID");

  const tableHeader = [
    "Sl.no.",
    "Application no.",
    "Owner name",
    "Phone no.",
    "Case type",
    "Village",
    "Mandal",
    "File Rejected Date",
  ];

  useEffect(() => {
    (async function () {
      const applicationData = await fetchDataFromTheDb(
        `http://localhost:5000/getRejectedApplications?userId=${id}`
      );
      if (applicationData?.length) {
        setData(applicationData);
        console.log(applicationData);

        setTableData((prev) => {
          const newValue = {
            tableHeader,
            data: applicationData,
          };
          return { ...prev, ...newValue };
        });
      }
    })();
  }, []);

  console.log(tableData, "Data");

  return (
    <div>
      <TableLayout
        tableData={tableData}
        Component={ShowAllRejectedApplications}
      />
      {data?.length === 0 && (
        <p className="text-lg text-center my-4 font-bold text-error">
          No Application Found
        </p>
      )}
    </div>
  );
};

export default RejectedApplications;
