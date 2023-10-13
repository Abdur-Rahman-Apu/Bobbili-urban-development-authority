import React, { useEffect, useState, useRef, useContext } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useDownloadExcel } from "react-export-table-to-excel";
import { TfiExport } from "react-icons/tfi";
import { district } from "../../../assets/buildingInfo.json";
import { AuthContext } from "../../../AuthProvider/AuthProvider";
import { useLocation } from "react-router";
import Table from "./tableStyle.module.css";

const Location = () => {
  const path = useLocation().pathname;

  const { userInfoFromLocalStorage } = useContext(AuthContext);
  const gradientColor = "bg-gradient-to-r from-violet-500 to-fuchsia-500";

  const [applicationNumbers, setApplicationNumbers] = useState(null);

  const tableRef = useRef(null);

  const [allDistricts, setAllDistricts] = useState([]);
  const [allMandal, setAllMandal] = useState([]);
  const [allPanchayat, setAllPanchayat] = useState([]);

  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedMandal, setSelectedMandal] = useState("");
  const [selectedPanchayat, setSelectedPanchayat] = useState("");
  const [serverData, setServerData] = useState([]);

  const [selectedDate, setSelectedDate] = useState("");

  console.log(district, "District");

  useEffect(() => {
    const districts = district.map((each) => each?.name);
    setAllDistricts(districts);
  }, []);

  const detectSelectOfDistrict = (e) => {
    const chooseDistrict = e.target.value;
    console.log(chooseDistrict);
    setSelectedDistrict(chooseDistrict);

    if (chooseDistrict === "Vijayanagaram") {
      console.log(district[0]?.mandal);
      setAllMandal(district[0]?.mandal);
    }
    if (chooseDistrict === "Parvathipuram Manyam") {
      setAllMandal(district[1]?.mandal);
    }
  };

  const detectChangeOfMandals = (e) => {
    const value = e.target.value;
    setSelectedMandal(value);

    console.log(value);

    console.log(allMandal, "DCM");

    const mandalWiseVillage = allMandal.find(
      (eachMandal) => eachMandal?.name === value
    )?.village;

    console.log(mandalWiseVillage);
    setAllPanchayat(mandalWiseVillage);
  };

  const detectChangeOfPanchayat = (e) => {
    setSelectedPanchayat(e.target.value);
  };

  const detectChangeOfDate = (e) => {
    console.log(e.target.value);
    setSelectedDate(e.target.value);
  };

  console.log(
    selectedDistrict,
    selectedMandal,
    selectedPanchayat,
    selectedDate,
    "All"
  );

  useEffect(() => {
    if (selectedDistrict.length) {
      const data = { district: "", mandal: "", panchayat: "", date: "" };

      selectedDistrict?.length && (data["district"] = selectedDistrict);
      selectedMandal?.length && (data["mandal"] = selectedMandal);
      selectedPanchayat?.length && (data["panchayat"] = selectedPanchayat);
      selectedDate?.length && (data["date"] = selectedDate);

      console.log(data);
      fetch(
        `http://localhost:5000/filterApplications?search=${JSON.stringify(
          data
        )}`
      )
        .then((res) => res.json())
        .then((result) => {
          console.log(result);
          setServerData(result);
        });

      console.log(data, "Data");
    } else {
      console.log("all");
      fetch("http://localhost:5000/totalApplications")
        .then((res) => res.json())
        .then((result) => {
          console.log(result);
          setServerData(result);
        });
    }
  }, [selectedDistrict, selectedMandal, selectedPanchayat, selectedDate]);

  //   useEffect(() => {
  //     axios
  //       .get("http://localhost:5000/totalApplications")
  //       .then((response) => {
  //         // handle success
  //         console.log(response);

  //         const { data } = response;

  //         setApplicationNumbers(data);
  //       })
  //       .catch((error) => {
  //         // handle error
  //         toast.error("Server error");
  //       });
  //   }, []);

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: "TotalApplication table",
    sheet: "TotalApplications",
  });
  return (
    <>
      <form className="flex justify-around items-center font-sans my-16">
        {/* district  */}
        <div className="basis-1/5">
          <label
            htmlFor="district"
            className="block mb-2 text-base font-bold text-gray-900 dark:text-white"
          >
            District
          </label>
          <select
            id="district"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            defaultValue="select"
            onChange={(e) => detectSelectOfDistrict(e)}
          >
            <option value="select" disabled>
              Select an option
            </option>
            {allDistricts.map((eachDistrict) => {
              return (
                <option key={eachDistrict} value={eachDistrict}>
                  {eachDistrict}
                </option>
              );
            })}
          </select>
        </div>

        {/* mandal */}

        <div className="basis-1/5">
          <label
            htmlFor="mandal"
            className="block mb-2 text-base font-bold text-gray-900 dark:text-white"
          >
            Mandal
          </label>
          <select
            id="mandal"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            defaultValue="select"
            onChange={(e) => detectChangeOfMandals(e)}
            disabled={allMandal?.length === 0}
          >
            <option value="select" disabled>
              Select an option
            </option>
            {allMandal?.map((eachMandal, index) => {
              return (
                <option key={index} value={eachMandal?.name}>
                  {eachMandal?.name}
                </option>
              );
            })}
          </select>
        </div>
        {/* gram panchayat  */}
        <div className="basis-1/5">
          <label
            htmlFor="panchayat"
            className="block mb-2 text-base font-bold text-gray-900 dark:text-white"
          >
            Grama Panchayat
          </label>
          <select
            id="panchayat"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            defaultValue="select"
            disabled={allPanchayat?.length === 0}
            onChange={(e) => detectChangeOfPanchayat(e)}
          >
            <option value="select" disabled>
              Select an option
            </option>
            {allPanchayat?.map((eachPanchayt, index) => {
              return <option key={index}>{eachPanchayt}</option>;
            })}
          </select>
        </div>

        {/* week month year filter  */}
        {!path.includes("/statistics") && (
          <div className="basis-1/5">
            <label
              htmlFor="date"
              className="block mb-2 text-base font-bold text-gray-900 dark:text-white"
            >
              Date
            </label>
            <select
              id="date"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              defaultValue="select"
              disabled={selectedPanchayat?.length === 0}
              onChange={(e) => detectChangeOfDate(e)}
            >
              <option value="select" disabled>
                Select an option
              </option>
              <option value="7 days">1 week</option>
              <option value="6 months">6 months</option>
              <option value="1 year">1 year</option>
            </select>
          </div>
        )}
      </form>

      <div className="flex flex-col font-roboto w-[98%] mx-auto my-10 overflow-x-auto sm:rounded-lg ">
        <button
          onClick={onDownload}
          className={`${gradientColor} transition-all duration-700 mb-8 font-roboto text-base text-white p-2 rounded-lg self-end flex items-center justify-center hover:shadow-lg hover:shadow-violetLight hover:bg-gradient-to-l`}
        >
          Export <TfiExport size={18} className="ms-2" />
        </button>
        {/* <table
          className={`w-full border border-black table-auto text-sm text-left`}
          ref={tableRef}
        >
          <thead
            className={`text-sm border border-black text-center uppercase`}
          >
            <tr>
              <th rowSpan={2} className="border border-black">
                Sl. no.
              </th>
              <th rowSpan={2} className="px-6 py-3 border border-black">
                Village
              </th>
              <th rowSpan={2} className="px-6 py-3 border border-black">
                Mandal
              </th>
              <th rowSpan={2} className="px-6 py-3  border border-black">
                District
              </th>
              <th rowSpan={2} className="border border-black">
                Date
              </th>
              <th className="px-6 py-3 border border-black">Prices</th>
            </tr>
          </thead>
          <tbody className="text-center text-base">
            <tr className="border border-black">
              <td className="px-6 py-4 border border-black">
                {applicationNumbers?.submitted}
              </td>
              <td className="px-6 py-4 border border-black">
                {applicationNumbers?.approved}
              </td>
              <td className="px-6 py-4 border border-black">
                {applicationNumbers?.shortfall}
              </td>
              <td className="px-6 py-4 border border-black">
                {applicationNumbers?.total}
              </td>
              <td className="px-6 py-4 border border-black">
                {applicationNumbers?.total}
              </td>
            </tr>
          </tbody>
        </table> */}

        <table border="1px" className={`${Table}`}>
          <thead>
            <tr>
              <th rowSpan={2}>Sl. no.</th>
              <th rowSpan={2}>Village</th>
              <th rowSpan={2}>Mandal</th>
              <th rowSpan={2}>District</th>
              <th rowSpan={2}>Date</th>
              <th colSpan={4}>Prices</th>
            </tr>
            <tr>
              <th>UDA Charges</th>
              <th>Grama Panchayat Fee</th>
              <th>Labour Cess Charge</th>
              <th>Green Fee Charge</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="w-[35px]">1</td>
              <td>{selectedPanchayat}</td>
              <td>{selectedMandal}</td>
              <td>{selectedDistrict}</td>
              <td>{selectedDate}</td>
              <td>6</td>
              <td>7</td>
              <td>8</td>
              <td>9</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Location;
