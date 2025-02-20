import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../../AuthProvider/AuthProvider";
import TableLayout from "../../../Components/TableLayout";
import useGetPageWiseApplication from "../../../CustomHook/useGetPageWiseApplication";
import NoApplicationFound from "../../../Shared/NoApplicationFound";
import ShowAllApprovedApplications from "./ShowAllApprovedApplications";

const Approved = () => {
  const { userInfoFromCookie, showPageBasedOnApplicationType } =
    useContext(AuthContext);

  const navigate = useNavigate();
  const [error, setError] = useState("");

  const [data, refetch, isError, isLoading, isSuccess] =
    useGetPageWiseApplication("Approved Applications");

  // console.log(data);

  useEffect(() => {
    if (isError) {
      console.log("ERROR");
      setError("No data found");
    } else {
      setError("");
    }
  }, [isError]);

  const tableHeader = [
    "Sl.no.",
    "Application no.",
    "Owner name",
    "Phone no.",
    "Case type",
    "Village",
    "Mandal",
    "Approved date",
  ];

  const [tableData, setTableData] = useState({});
  const [tableComponentProps, setTableComponentProps] = useState({});

  useEffect(() => {
    setError("");
    setTableData((prev) => {
      const newValue = {
        tableHeader,
        data,
      };
      return { ...prev, ...newValue };
    });
  }, [isSuccess, data]);

  useEffect(() => {
    setTableComponentProps((prev) => {
      const newValue = {
        showPageBasedOnApplicationType,
        navigate,
      };
      return { ...prev, ...newValue };
    });
  }, []);

  return (
    <>
      <TableLayout
        tableData={tableData}
        Component={ShowAllApprovedApplications}
        tableComponentProps={tableComponentProps}
      />

      {data?.length === 0 && <NoApplicationFound />}

      {error && (
        <p className="text-lg text-center my-4 font-bold text-error">{error}</p>
      )}

      {isLoading && <p>Loading...</p>}
    </>
  );
};

export default Approved;
