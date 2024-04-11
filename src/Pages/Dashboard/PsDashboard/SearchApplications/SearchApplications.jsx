import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../../AuthProvider/AuthProvider";
import TableLayout from "../../../Components/TableLayout";
import NoApplicationFound from "../../../Shared/NoApplicationFound";
import showSearchedApplication from "./showSearchedApplication";

function SearchApplications() {
  localStorage.setItem("page", JSON.stringify("searchApplicationByPs"));
  const navigate = useNavigate();
  const { userInfoFromLocalStorage, showPageBasedOnApplicationType } =
    useContext(AuthContext);
  const [filteredData, setFilteredData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState({});
  const [tableComponentProps, setTableComponentProps] = useState({});
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

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
  useEffect(() => {
    setLoading(true);
    fetch(
      `http://localhost:5000/getPsApplications?gramaPanchayat=${JSON.stringify(
        userInfoFromLocalStorage()?.gramaPanchayat
      )}`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "Search application");
        setLoading(false);
        setAllData(data?.result);
        setFilteredData(data?.result);
        setTableData((prev) => {
          const newValue = {
            tableHeader,
            data: data?.result,
          };
          return { ...prev, ...newValue };
        });
        setTableComponentProps((prev) => {
          const newValue = {
            showPageBasedOnApplicationType,
            navigate,
          };
          return { ...prev, ...newValue };
        });
      })
      .catch((err) => {
        setLoading(false);
      });
  }, []);

  const onSubmit = (data) => {
    const { search } = data;

    console.log(search, "Search");

    // fetchDataFromTheDb(
    //   `http://localhost:5000/getSearchedApplication?search=${search}`
    // ).then((data) => {
    //   console.log(data);
    //   setAllData(data?.result);
    // });

    // if (search?.includes("BUDA/2023")) {
    //   //  search by application No
    //   setAllData(
    //     storeData?.filter(
    //       (application) => application?.applicationNo === search
    //     )
    //   );
    // } else {
    //   setAllData(
    //     storeData?.filter(
    //       (application) =>
    //         application?.applicantInfo?.applicantDetails[0]?.name?.toLowerCase() ===
    //         search?.toLowerCase()
    //     )
    //   );
    // }
  };

  const detectChange = (e) => {
    if (!e.target.value.length) {
      setAllData(storeData);
    }
  };
  return (
    <>
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
      <TableLayout
        tableData={tableData}
        Component={showSearchedApplication}
        tableComponentProps={tableComponentProps}
      />

      {(allData?.length === 0 || !allData) && <NoApplicationFound />}
    </>
  );
}

export default SearchApplications;
