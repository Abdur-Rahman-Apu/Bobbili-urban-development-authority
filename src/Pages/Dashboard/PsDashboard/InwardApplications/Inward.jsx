import Lottie from "lottie-react";
import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../../AuthProvider/AuthProvider";
import ErrorAnimation from "../../../../assets/ServerError.json";
import TableLayout from "../../../Components/TableLayout";
import Loading from "../../../Shared/Loading";
import ShowSubmittedApplication from "../../LtpDashboard/Submitted/ShowSubmittedApplication";

const Inward = () => {
  const { userInfoFromLocalStorage, showPageBasedOnApplicationType } =
    useContext(AuthContext);
  const [error, setError] = useState("");
  const [allData, setAllData] = useState([]);

  const [storeData, setStoreData] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const path = useLocation().pathname;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  // get all applications which are submitted already
  const { data, refetch, isLoading, isError, isSuccess } = useQuery(
    ["allInwardApplications"],
    async () => {
      const response = await fetch(
        `https://residential-building.onrender.com/submitApplications?userId=${userInfoFromLocalStorage()?._id
        }`
      );
      return await response.json();
    }
  );

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    if (isError) {
      setError("Failed to fetch");
      setLoading(false);
    } else {
      setError("");
      setLoading(false);
    }

    setAllData(data);
    setStoreData(data);
  }, [isError, data]);


  const onSubmit = (data) => {
    const { search } = data;

    if (search?.includes("BUDA/2023")) {
      //  search by application No
      setAllData(
        storeData?.filter((application) => application?.applicationNo === search)
      );
    } else {
      setAllData(
        storeData?.filter((application) => application?.applicantInfo?.applicantDetails[0]?.name?.toLowerCase() === search?.toLowerCase()
        )
      );
    }
  };

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

  const detectChange = (e) => {
    if (!e.target.value.length) {
      setAllData(storeData);
    }
  };

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
        <div>
          {path.includes("searchApplication") && (
            <form
              className="max-w-lg mt-10 ml-6 mb-[-10px] px-3"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="search-box">
                <button
                  className="btn-search bg-normalViolet flex justify-center items-center"
                  type="submit"
                >
                  <svg
                    className="w-4 h-4 text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                    />
                  </svg>
                </button>
                <input
                  type="text"
                  // className="input-search"
                  id="default-search"
                  {...register("search")}
                  onChange={detectChange}
                  className="input-search font-roboto"
                  placeholder="Application no. or owner name"
                  required
                />
              </div>
            </form>
          )}

          <>
            <TableLayout
              tableData={tableData}
              Component={ShowSubmittedApplication}
              tableComponentProps={tableComponentProps}
            />

            {allData?.length === 0 && (
              <p className="text-center font-bold text-xl text-black">
                No application Found
              </p>
            )}
          </>
        </div>
      )}
    </>
  );
};

export default Inward;
