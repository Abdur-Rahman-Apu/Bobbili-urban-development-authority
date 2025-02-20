import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../../AuthProvider/AuthProvider";
import TableLayout from "../../../Components/TableLayout";
import useGetPageWiseApplication from "../../../CustomHook/useGetPageWiseApplication";
import NoApplicationFound from "../../../Shared/NoApplicationFound";
import ShowAllShortfallApplications from "./ShowAllShortfallApplications";

const Shortfall = () => {
  const { userInfoFromCookie, showPageBasedOnApplicationType } =
    useContext(AuthContext);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [data, refetch, isError, isLoading, isSuccess] =
    useGetPageWiseApplication("Shortfall Applications");

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
    "Shortfall issued date",
  ];

  const [tableData, setTableData] = useState({});
  const [tableComponentProps, setTableComponentProps] = useState({});

  useEffect(() => {
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
        Component={ShowAllShortfallApplications}
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

export default Shortfall;
