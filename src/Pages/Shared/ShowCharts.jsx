import { CategoryScale } from "chart.js";
import Chart from "chart.js/auto";
import Lottie from "lottie-react";
import React, { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import BarChart from "./BarChart";
import PieChart from "./PieChart";
// import { district } from "../../assets/buildingInfo.json";
import { BsCalendar2DateFill, BsCalendar3 } from "react-icons/bs";
import { FaTreeCity } from "react-icons/fa6";
import { MdForest, MdLocationCity } from "react-icons/md";
import { AuthContext } from "../../AuthProvider/AuthProvider";
import ErrorAnimation from "../../assets/ServerError.json";
import Loading from "../Shared/Loading";

Chart.register(CategoryScale);

const ShowCharts = () => {
  const path = useLocation().pathname;

  const { userInfoFromLocalStorage, fetchDataFromTheDb } =
    useContext(AuthContext);

  const role = userInfoFromLocalStorage()?.role?.toLowerCase();

  const isLtpOrPs = role === "ltp" || role === "ps";

  // const role = userInfoFromLocalStorage().role;

  const [allLocationData, setAllLocationData] = useState([]);
  const [allDistricts, setAllDistricts] = useState([]);
  const [allMandal, setAllMandal] = useState([]);
  const [allPanchayat, setAllPanchayat] = useState([]);

  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedMandal, setSelectedMandal] = useState("");
  const [selectedPanchayat, setSelectedPanchayat] = useState("");
  const [serverData, setServerData] = useState({});

  const [selectedDate, setSelectedDate] = useState("");
  const [chartData, setChartData] = useState({});
  const [barChartData, setBarChartData] = useState({});
  const [pieChartData, setPieChartData] = useState({});

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async function () {
      setLoading(true);
      try {
        const locationData = await fetchDataFromTheDb(
          "http://localhost:5000/getDistricts"
        );
        console.log(locationData, "LOC");
        const extractsDataFromDB = locationData[0]?.district;
        setAllLocationData(extractsDataFromDB);
        const districts = extractsDataFromDB?.map((each) => each?.name);
        setAllDistricts(districts);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    })();
  }, []);

  console.log(allDistricts, "ALL DISTRICTS");

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
    if (dateSelected) {
      dateSelected.value = "";
    }

    allDistricts.forEach((eachDistrict, index) => {
      if (eachDistrict === chooseDistrict) {
        setAllMandal(allLocationData[index]?.mandal);
      }
    });
  };

  const detectChangeOfMandals = (e) => {
    setAllPanchayat([]);
    setSelectedPanchayat("");
    setSelectedDate("");
    const panchayatSelect = document.getElementById("panchayat");
    panchayatSelect.value = "";
    const dateSelected = document.getElementById("date");
    if (dateSelected) {
      dateSelected.value = "";
    }
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

  console.log(allMandal, allPanchayat, "ALL");

  useEffect(() => {
    if (isLtpOrPs && selectedDate.length) {
      console.log("ltp");
      fetch(
        `http://localhost:5000/filterApplications?search=${JSON.stringify({
          id: userInfoFromLocalStorage()._id,
          role,
          selectedDate,
        })}`
      )
        .then((res) => res.json())
        .then((result) => {
          setLoading(false);
          console.log(result, "LTP OR PS");
          setServerData(result);
        })
        .catch((err) => {
          setLoading(false);
          setError(err?.message);
        });
    } else if (selectedDistrict.length) {
      setLoading(true);
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
          setLoading(false);
          console.log(result);
          setServerData(result?.totalApplication);
        })
        .catch((err) => {
          setLoading(false);
          setError(err?.message);
        });

      console.log(data, "Data");
    } else {
      console.log("all");
      setLoading(true);

      fetch(
        `http://localhost:5000/totalApplications?data=${JSON.stringify(
          userInfoFromLocalStorage()
        )}`
      )
        .then((res) => res.json())
        .then((result) => {
          setServerData((prev) => {
            return result.totalApplication;
          });
          setLoading(false);
          console.log(result, "TOTLA APPLIC");
          console.log(serverData, "SVF");
        })
        .catch((err) => {
          setLoading(false);
          setError(err?.message);
        });
    }
  }, [selectedDistrict, selectedMandal, selectedPanchayat, selectedDate]);

  const canvas = document.createElement("canvas");

  // background-image: linear-gradient(to right, #f78ca0 0%, #f9748f 19%, #fd868c 60%, #fe9a8b 100%);;;

  const getData = (labels, data, isLtpOrPs) => {
    // const ctx = canvas.getContext("2d");
    // const gradient1 = ctx.createLinearGradient(0, 0, 300, 0);
    // gradient1.addColorStop(0, "#ffaf40");
    // gradient1.addColorStop(1, "#FAFAD2");
    // // gradient1.addColorStop(1, "rgb(107, 33, 168)");

    // const gradient2 = ctx.createLinearGradient(0, 0, 300, 0);
    // gradient2.addColorStop(0, "#d4fc79");
    // gradient2.addColorStop(1, "#2ed573");
    // // gradient2.addColorStop(1, "rgb(34, 197, 94)");
    // const gradient3 = ctx.createLinearGradient(0, 0, 300, 0);
    // gradient3.addColorStop(0, "#f78ca0");
    // gradient3.addColorStop(0.19, "#f9748f");
    // gradient3.addColorStop(0.5, "#fd868c");
    // gradient3.addColorStop(1, "#ff4757");

    if (isLtpOrPs) {
      console.log(labels, data, "chart");
      let bg = [];
      if (selectedDate?.length) {
        return {
          labels,
          datasets: [
            {
              label: "Chart",
              data,
              backgroundColor: [
                "#706fd3",
                "#34ace0",
                "#20bf6b",
                "#ffb142",
                "#ff5252",
                "#33d9b2",
                "#ffda79",
                "#487eb0",
                "#273c75",
                "#e84393",
                "#badc58",
                "#22a6b3",
              ],
              borderColor: "#000",
              borderWidth: 0.1,
            },
          ],
        };
      } else {
        console.log(labels, data, "else");

        if (role === "ltp") {
          bg = ["#8062D6", "#3498db", "#e74c3c", "#2ecc71", "#f1c40f"];
        } else {
          bg = ["#8062D6", "#e74c3c", "#2ecc71", "#f1c40f"];
        }
      }
      return {
        labels,
        datasets: [
          {
            label: "Chart",
            data,
            backgroundColor: bg,
            borderColor: "#000",
            borderWidth: 0.1,
          },
        ],
      };
    } else {
      return {
        labels,
        datasets: [
          {
            label: "Chart",
            data,
            backgroundColor: ["#8062D6", "#2ecc71", "#f1c40f", "#e74c3c"],
            borderColor: "#000",
            borderWidth: 0.1,
          },
        ],
      };
    }
  };
  console.log(serverData, "SD");
  useEffect(() => {
    console.log(serverData, "Server data ff");

    if (Object.keys(serverData)?.length && !isLtpOrPs) {
      console.log("inside server data");

      if (serverData?.total) {
        delete serverData["total"];
      }
      console.log(isLtpOrPs, "LTP OR PS");
      const labels = Object.keys(serverData);
      const data = Object.values(serverData);

      console.log(labels, data, "LABD");

      const chartValue = getData(labels, data, isLtpOrPs);
      console.log(chartValue, "Chartvalue");
      setChartData(chartValue);
    }

    if (isLtpOrPs && Object.keys(serverData)?.length) {
      if (selectedDate?.length) {
        console.log(serverData, "object");

        // set bar chart data
        const barChartDataFromDb = serverData?.result;
        const barChartLabels = Object.keys(barChartDataFromDb);
        const barChartData = Object.values(barChartDataFromDb);
        const barChartValue = getData(barChartLabels, barChartData, isLtpOrPs);
        setBarChartData(barChartValue);

        // set pieChartData
        const pieChartDataFromDb = serverData?.applicationWiseCount;
        const PieChartLabels = Object.keys(pieChartDataFromDb);
        const PieChartData = Object.values(pieChartDataFromDb);
        const pieChartValue = getData(PieChartLabels, PieChartData, isLtpOrPs);
        setPieChartData(pieChartValue);
      } else {
        if (serverData?.total) {
          delete serverData["total"];
        }
        console.log(isLtpOrPs, "LTP OR PS");
        const labels = Object.keys(serverData);
        const data = Object.values(serverData);

        console.log(labels, data, "LABD");

        const chartValue = getData(labels, data, isLtpOrPs);
        console.log(chartValue, "Chartvalue");
        setBarChartData(chartValue);
        setPieChartData(chartValue);
      }
    }

    // const filterData = {};

    // for (const key in serverData) {
    //   if (!Array.isArray(serverData[key])) {
    //     filterData[key] = serverData[key];
    //   }
    // }

    // if (serverData) {
    //   delete serverData["total"];

    // }
  }, [serverData]);

  // if (loading) {
  //   return <Loading />;
  // }

  const selectorBoxLabel =
    "bg-[#B67EEE] inline-flex justify-center items-center w-[40px] h-[40px] rounded-full mr-2";
  const selectorBox =
    "nm_Inset w-full px-3 py-2 border rounded-lg max-w-xs text-gray-600 bg-gray-50 border-violet-500 focus:outline-none focus:ring-2 ring-violet-200";

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
          {!isLtpOrPs && allDistricts?.length !== 0 && (
            <form
              className={`grid grid-cols-1 gap-5 md:grid-cols-2 ${
                path.includes("/dashboard")
                  ? "lg:grid-cols-4"
                  : "lg:grid-cols-3 gap-8"
              } font-roboto my-8 z-[10] px-3 text-gray-900`}
            >
              {/* district  */}
              <div className="nm_Container z-[10] p-7 flex flex-col justify-center rounded-lg">
                <label
                  htmlFor="district"
                  className="flex items-center mb-4 text-xl font-bold"
                >
                  <span className={selectorBoxLabel}>
                    <MdLocationCity color="white" size={25} />
                  </span>
                  <span className="">District</span>
                </label>
                <select
                  id="district"
                  className={selectorBox}
                  defaultValue={selectedDistrict}
                  onChange={(e) => detectSelectOfDistrict(e)}
                >
                  <option className="text-base" value="" disabled>
                    Select an option
                  </option>
                  {allDistricts?.map((eachDistrict) => {
                    return (
                      <option
                        className="text-base"
                        key={eachDistrict}
                        value={eachDistrict}
                      >
                        {eachDistrict}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* mandal */}
              <div className="nm_Container z-[10] p-7 flex flex-col justify-center rounded-lg">
                <label
                  htmlFor="mandal"
                  className="flex items-center mb-5 text-lg font-bold"
                >
                  <span className={selectorBoxLabel}>
                    <FaTreeCity color="white" size={25} />
                  </span>
                  <span>Mandal</span>
                </label>
                <select
                  id="mandal"
                  className={selectorBox}
                  defaultValue={selectedMandal}
                  onChange={(e) => detectChangeOfMandals(e)}
                  disabled={allMandal?.length === 0}
                >
                  <option className="text-base" value="" disabled>
                    Select an option
                  </option>
                  {allMandal?.map((eachMandal, index) => {
                    return (
                      <option
                        className="text-base"
                        key={index}
                        value={eachMandal?.name}
                      >
                        {eachMandal?.name}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* gram panchayat  */}
              <div className="nm_Container z-[10] p-7 flex flex-col justify-center rounded-lg">
                <label
                  htmlFor="panchayat"
                  className="flex items-center mb-5 text-lg font-bold"
                >
                  <span className={selectorBoxLabel}>
                    <MdForest color="white" size={20} />
                  </span>
                  <span>Grama Panchayat</span>
                </label>
                <select
                  id="panchayat"
                  className={selectorBox}
                  defaultValue={selectedPanchayat}
                  disabled={allPanchayat?.length === 0}
                  onChange={(e) => detectChangeOfPanchayat(e)}
                >
                  <option className="text-base" value="" disabled>
                    Select an option
                  </option>
                  {allPanchayat?.map((eachPanchayt, index) => {
                    return (
                      <option className="text-base" key={index}>
                        {eachPanchayt}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* week month year filter  */}
              {!path.includes("/statistics") && (
                <div className="nm_Container z-[10] p-7 flex flex-col justify-center rounded-lg">
                  <label
                    htmlFor="date"
                    className="flex items-center mb-5 text-lg font-bold"
                  >
                    <span className={selectorBoxLabel}>
                      <BsCalendar3 color="white" size={20} />
                    </span>
                    <span>Date</span>
                  </label>
                  <select
                    id="date"
                    className={selectorBox}
                    defaultValue={selectedDate}
                    disabled={selectedPanchayat?.length === 0}
                    onChange={(e) => detectChangeOfDate(e)}
                  >
                    <option className="text-base" value="" disabled>
                      Select an option
                    </option>
                    <option className="text-base" value="7 days">
                      1 week
                    </option>
                    <option
                      value="1 months"
                      className={`${!isLtpOrPs && "hidden text-base"}`}
                    >
                      1 months
                    </option>
                    <option className="text-base" value="6 months">
                      6 months
                    </option>
                    <option className="text-base" value="1 year">
                      1 year
                    </option>
                  </select>
                </div>
              )}
            </form>
          )}

          {isLtpOrPs && (
            <form className="p-5">
              <p className="text-lg font-bold flex items-center gap-3 fancy-button hover:scale-100">
                <BsCalendar2DateFill size={25} />
                Search Based On Date
              </p>
              <div className="radio-button-container justify-evenly my-10">
                <div className="radio-button">
                  <input
                    type="radio"
                    className="radio-button__input"
                    id="week"
                    name="radio-1"
                    value="1 Week"
                    // checked={
                    //   radio1 === "Private"
                    //     ? radio1 === "Private"
                    //     : applicationType === "Private"
                    // }
                    onChange={() => setSelectedDate("1 week")}
                    // disabled={isReadOnly}
                    required
                  />
                  <label className="radio-button__label" htmlFor="week">
                    <span className="radio-button__custom"></span>1 Week
                  </label>
                </div>
                <div className="radio-button">
                  <input
                    type="radio"
                    className="radio-button__input"
                    id="radio2"
                    name="radio-1"
                    value="1 month"
                    // checked={
                    //   radio1 === "Govt. Land"
                    //     ? radio1 === "Govt. Land"
                    //     : applicationType === "Govt. Land"
                    // }
                    onChange={() => setSelectedDate("1 month")}
                    // disabled={isReadOnly}
                  />
                  <label className="radio-button__label" htmlFor="radio2">
                    <span className="radio-button__custom"></span>1 month
                  </label>
                </div>
                <div className="radio-button">
                  <input
                    type="radio"
                    className="radio-button__input"
                    id="radio3"
                    name="radio-1"
                    value="6 months"
                    // checked={
                    //   radio1 === "Govt. Land"
                    //     ? radio1 === "Govt. Land"
                    //     : applicationType === "Govt. Land"
                    // }
                    onChange={() => setSelectedDate("6 months")}
                    // disabled={isReadOnly}
                  />
                  <label className="radio-button__label" htmlFor="radio3">
                    <span className="radio-button__custom"></span>6 Months
                  </label>
                </div>
                <div className="radio-button">
                  <input
                    type="radio"
                    className="radio-button__input"
                    id="radio4"
                    name="radio-1"
                    value="1 year"
                    // checked={
                    //   radio1 === "Govt. Land"
                    //     ? radio1 === "Govt. Land"
                    //     : applicationType === "Govt. Land"
                    // }
                    onChange={() => setSelectedDate("1 year")}
                    // disabled={isReadOnly}
                  />
                  <label className="radio-button__label" htmlFor="radio4">
                    <span className="radio-button__custom"></span>1 Year
                  </label>
                </div>
              </div>
            </form>
          )}
          {loading ? (
            <Loading />
          ) : (
            <>
              {serverData &&
                isLtpOrPs &&
                Object.keys(serverData)?.length !== 0 &&
                Object.keys(barChartData)?.length !== 0 &&
                Object.keys(pieChartData)?.length !== 0 && (
                  <div
                    className={`${
                      path.includes("/dashboard") && "px-4"
                    } block lg:flex lg:justify-evenly items-center p-0 z-[10]`}
                  >
                    {/* background: linear-gradient(to right, rgb(142, 45, 226), rgb(74, 0, 224)); */}
                    <div className="lg:w-[46%] mb-10 lg:mb-0 overflow-hidden z-[10]">
                      <BarChart chartData={barChartData} />
                    </div>

                    <div className="lg:w-[46%] mb-10 lg:mb-0 overflow-hidden  z-[10] ">
                      <PieChart chartData={pieChartData} />
                    </div>
                  </div>
                )}

              {
                // if others except ltp or ps
                serverData &&
                  !isLtpOrPs &&
                  Object.keys(serverData)?.length !== 0 &&
                  Object.keys(chartData)?.length !== 0 && (
                    <div
                      className={`${
                        path.includes("/dashboard") && "px-4"
                      } flex justify-evenly items-center p-0 z-[10]`}
                    >
                      {/* background: linear-gradient(to right, rgb(142, 45, 226), rgb(74, 0, 224)); */}
                      <div className="w-[46%] overflow-hidden z-[10]">
                        <BarChart chartData={chartData} />
                      </div>

                      <div className=" w-[46%] overflow-hidden  z-[10] ">
                        <PieChart chartData={chartData} />
                      </div>
                    </div>
                  )
              }
            </>
          )}
        </>
      )}
    </>
  );
};

export default ShowCharts;
