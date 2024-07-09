import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../AuthProvider/AuthProvider";
import { baseUrl } from "../../../../utils/api";
import TableLayout from "../../../Components/TableLayout";
import NoApplicationFound from "../../../Shared/NoApplicationFound";
import ShowAllRejectedApplications from "./ShowAllRejectedApplications";

const RejectedApplications = () => {
  const [tableData, setTableData] = useState([]);
  const [data, setData] = useState([]);

  const { userInfoFromCookie, fetchDataFromTheDb } = useContext(AuthContext);

  const id = userInfoFromCookie()?._id;

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
        `${baseUrl}/rejectedApp?userId=${id}`
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
      {data?.length === 0 && <NoApplicationFound />}
    </div>
  );
};

export default RejectedApplications;
