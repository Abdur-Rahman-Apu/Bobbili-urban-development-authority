import Lottie from "lottie-react";
import React, { useContext, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../../AuthProvider/AuthProvider";
import ErrorAnimation from "../../../../assets/ServerError.json";
import { baseUrl } from "../../../../utils/api";
import TableLayout from "../../../Components/TableLayout";
import Loading from "../../../Shared/Loading";
import NoApplicationFound from "../../../Shared/NoApplicationFound";
import showSearchedApplication from "../SearchApplications/showSearchedApplication";

const Inward = () => {
  const {
    userInfoFromCookie,
    showPageBasedOnApplicationType,
    fetchDataFromTheDb,
  } = useContext(AuthContext);
  const [error, setError] = useState("");
  const [allData, setAllData] = useState([]);

  const [storeData, setStoreData] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const path = useLocation().pathname;

  // get all applications which are submitted already
  const { data, refetch, isLoading, isError, isSuccess } = useQuery(
    ["allInwardApplications"],
    async () => {
      const response = await fetch(
        `${baseUrl}/submitApp/getByPsInfo?userId=${
          userInfoFromCookie()?.userId
        }`
      );

      console.log(response, "response in inward");

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data);
      }
      return await response.json();
    }
  );

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    if (isError) {
      if (data) {
        setError(data);
      } else {
        setError("Failed to fetch");
      }
      setLoading(false);
    } else {
      setError("");
      setLoading(false);
    }

    setAllData(data);
    setStoreData(data);
  }, [isError, data]);

  console.log(isError, "Is error in inward");
  console.log(data, "data in inward");

  // TODO: owner name search pending

  const tableHeader = [
    "Sl.no.",
    "Application no.",
    "Owner name",
    "Phone no.",
    "Case type",
    "Village",
    "Mandal",
    "Submitted date",
    "Status",
  ];

  const [tableData, setTableData] = useState({});
  const [tableComponentProps, setTableComponentProps] = useState({});

  useEffect(() => {
    setTableData((prev) => {
      const newValue = {
        tableHeader,
        data: allData,
      };
      return { ...prev, ...newValue };
    });
  }, [isSuccess, allData]);

  useEffect(() => {
    setTableComponentProps((prev) => {
      const newValue = {
        showPageBasedOnApplicationType,
        navigate,
      };
      return { ...prev, ...newValue };
    });
  }, []);

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
          <p className="text-red-500 font-bold text-lg uppercase">{error}</p>
        </div>
      ) : (
        <div>
          <TableLayout
            tableData={tableData}
            Component={showSearchedApplication}
            tableComponentProps={tableComponentProps}
          />

          {(allData?.length === 0 || !allData) && <NoApplicationFound />}
        </div>
      )}
    </>
  );
};

export default Inward;
