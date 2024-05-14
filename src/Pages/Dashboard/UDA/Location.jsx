import React, { useContext, useEffect, useRef, useState } from "react";
import { useDownloadExcel } from "react-export-table-to-excel";
import { TfiExport } from "react-icons/tfi";
import { useLocation } from "react-router";
import { AuthContext } from "../../../AuthProvider/AuthProvider";
import { district } from "../../../assets/buildingInfo.json";

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
    setAllMandal([]);
    setAllPanchayat([]);
    setSelectedMandal("");
    setSelectedPanchayat("");
    setSelectedDate("");

    const chooseDistrict = e.target.value;
    console.log(chooseDistrict);
    setSelectedDistrict(chooseDistrict);

    // Reset the selected value of the Mandal dropdown to "select"
    const mandalSelect = document.getElementById("mandal");
    mandalSelect.value = "";

    const panchayatSelect = document.getElementById("panchayat");
    panchayatSelect.value = "";

    const dateSelected = document.getElementById("date");
    dateSelected.value = "";

    if (chooseDistrict === "Vizianagaram") {
      console.log(district[0]?.mandal);
      setAllMandal(district[0]?.mandal);
    }
    if (chooseDistrict === "Parvathipuram Manyam") {
      setAllMandal(district[1]?.mandal);
    }
  };

  const detectChangeOfMandals = (e) => {
    setAllPanchayat([]);
    setSelectedPanchayat("");
    setSelectedDate("");
    const panchayatSelect = document.getElementById("panchayat");
    panchayatSelect.value = "";
    const dateSelected = document.getElementById("date");
    dateSelected.value = "";
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
        `https://residential-building.onrender.com/filterApplications?search=${JSON.stringify(
          data
        )}`
      )
        .then((res) => res.json())
        .then((result) => {
          console.log(result);
          setServerData(result?.charges);
        });

      console.log(data, "Data");
    } else {
      console.log("all");
      fetch("https://residential-building.onrender.com/totalApplications")
        .then((res) => res.json())
        .then((result) => {
          console.log(result);
          setServerData(result?.charges);
        });
    }
  }, [selectedDistrict, selectedMandal, selectedPanchayat, selectedDate]);

  console.log(serverData, "Server Data");

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: "TotalApplication table",
    sheet: "TotalApplications",
  });
  return (
    <div className="text-black">
      <form className="flex justify-around items-center font-sans my-16">
        {/* district  */}
        <div className="basis-1/5">
          <label
            htmlFor="district"
            className="block mb-2 text-base font-bold text-gray-900"
          >
            District
          </label>
          <select
            id="district"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            defaultValue={selectedDistrict}
            onChange={(e) => detectSelectOfDistrict(e)}
          >
            <option value="" disabled>
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
            className="block mb-2 text-base font-bold text-gray-900"
          >
            Mandal
          </label>
          <select
            id="mandal"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            defaultValue={selectedMandal}
            onChange={(e) => detectChangeOfMandals(e)}
            disabled={allMandal?.length === 0}
          >
            <option value="" disabled>
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
            className="block mb-2 text-base font-bold text-gray-900"
          >
            Grama Panchayat
          </label>
          <select
            id="panchayat"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            defaultValue={selectedPanchayat}
            disabled={allPanchayat?.length === 0}
            onChange={(e) => detectChangeOfPanchayat(e)}
          >
            <option value="" disabled>
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
              className="block mb-2 text-base font-bold text-gray-900"
            >
              Date
            </label>
            <select
              id="date"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              defaultValue={selectedDate}
              disabled={selectedPanchayat?.length === 0}
              onChange={(e) => detectChangeOfDate(e)}
            >
              <option value="" disabled>
                Select an option
              </option>
              <option value="7 days">1 week</option>
              <option value="6 months">6 months</option>
              <option value="1 year">1 year</option>
            </select>
          </div>
        )}
      </form>

      <div
        className={`flex flex-col font-roboto w-[98%] mx-auto my-10 overflow-x-auto sm:rounded-lg `}
      >
        <button
          onClick={onDownload}
          className={`${gradientColor} transition-all duration-700 mb-8 font-roboto text-base text-white p-2 rounded-lg self-end flex items-center justify-center hover:shadow-lg hover:shadow-violetLight hover:bg-gradient-to-l`}
        >
          Export <TfiExport size={18} className="ms-2" />
        </button>

        <table
          ref={tableRef}
          className={`table border border-solid border-black text-center dark:text-black`}
        >
          <thead className="border border-solid border-black dark:text-black">
            <tr>
              <th rowSpan={2} className="border border-solid border-black">
                Sl. no.
              </th>
              <th rowSpan={2} className="border border-solid border-black">
                District
              </th>
              <th rowSpan={2} className="border border-solid border-black">
                Mandal
              </th>
              <th rowSpan={2} className="border border-solid border-black">
                Village
              </th>
              <th rowSpan={2} className="border border-solid border-black">
                Date
              </th>
              <th colSpan={4} className="border border-solid border-black">
                Prices
              </th>
            </tr>
            <tr>
              <th className="border border-solid border-black">UDA Charges</th>
              <th className="border border-solid border-black">
                Grama Panchayat Fee
              </th>
              <th className="border border-solid border-black">
                Labour Cess Charge
              </th>
              <th className="border border-solid border-black">
                Green Fee Charge
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="w-[35px] border border-solid border-black">1</td>
              <td className="border border-solid border-black">
                {selectedDistrict?.length === 0 ? "All" : selectedDistrict}
              </td>
              <td className="border border-solid border-black">
                {selectedMandal?.length === 0 ? "All" : selectedMandal}
              </td>
              <td className="border border-solid border-black">
                {selectedPanchayat?.length === 0 ? "All" : selectedPanchayat}
              </td>
              <td className="border border-solid border-black">
                {selectedDate?.length === 0 ? "All" : selectedDate}
              </td>
              <td className="border border-solid border-black">
                {serverData?.totalUdaCharge}
              </td>
              <td className="border border-solid border-black">
                {serverData?.totalPanchayatCharge}
              </td>
              <td className="border border-solid border-black">
                {serverData?.totalLabourCharge}
              </td>
              <td className="border border-solid border-black">
                {serverData?.totalGreenFee}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Location;
