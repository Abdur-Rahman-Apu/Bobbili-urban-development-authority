import { motion } from "framer-motion";
import React, { useContext, useEffect, useState } from "react";
import { AiOutlineAreaChart } from "react-icons/ai";
import { FaHandPointRight } from "react-icons/fa";
import { HiInformationCircle } from "react-icons/hi";
import { PiWall } from "react-icons/pi";
import { useOutletContext } from "react-router";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../../../../AuthProvider/AuthProvider";
import InputField from "../../../Components/InputField";
import FloorDetails from "./FloorDetails";
import SaveData from "./SaveData";
import PreviousFileModal from "./PreviousFileModal";
import useGetPageWiseApplication from "../../../CustomHook/useGetPageWiseApplication";

const BuildingInfo = () => {
  const stepperData = useOutletContext();

  const location = useLocation()?.state;
  // console.log(location, "location");

  // if (location !== null) {
  //   if (location.hasOwnProperty("prevSavedState")) {
  //     localStorage.setItem(
  //       "steepCompleted",
  //       JSON.stringify(location.prevSavedState)
  //     );
  //   }
  // }

  const [isStepperVisible, currentStep, steps] = stepperData;

  const {
    confirmAlert,
    sendUserDataIntoDB,
    userInfoFromLocalStorage,
    getApplicationData,
    fetchDataFromTheDb,
    stepCompleted,
  } = useContext(AuthContext);

  // console.log(getApplicationData, 'getApplicationData');

  const applicationNo = JSON.parse(localStorage.getItem("CurrentAppNo"));
  const cameFrom = JSON.parse(localStorage.getItem("page"));

  // const { _id: id } = userInfoFromLocalStorage();

  const role = userInfoFromLocalStorage()?.role;

  const page = JSON.parse(localStorage.getItem("page"));

  const isReadOnly =
    role === "PS" ||
    page === "submit" ||
    page === "approved" ||
    page === "shortfall";

  // Here declared all variables initial value in the use state

  // general information sections all variable initialization

  const [dataFromDB, setDataFromDB] = useState({});

  const [generalInformation, setGeneralInformation] = useState("");
  // Case Type
  const [selectedOptionCase, setSelectedOptionCase] = useState("");
  const [selectedOptionPermission, setSelectedOptionPermission] =
    useState("General");
  const [selectedNatureOfTheSite, setSelectedNatureOfTheSite] = useState("");

  const [districtData, setDistrictData] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedMandal, setSelectedMandal] = useState("");
  const [selectedGrama, setSelectedGrama] = useState("");
  const [selectedVillage, setSelectedVillage] = useState("");

  // HERE PLOT DETAIL SECTIONS VARIABLES ARE INITIALIZED
  const [plotDetails, setPlotDetails] = useState("");
  const [plotDetailsFloor, setPlotDetailsFloor] = useState("");
  const [scheduleBoundaries, setScheduleBoundaries] = useState("");

  const [totalFloor, setTotalFloor] = useState(["Floor1"]);

  const [builtUpAreaSum, setBuiltUpAreaSum] = useState(0);
  const [parkingAreaSum, setParkingAreaSum] = useState(0);

  const [builtUpArea, setBuiltUpArea] = useState([0, 0, 0, 0]);
  const [parkingArea, setParkingArea] = useState([0, 0, 0, 0]);

  const [proposedPlotArea, setProposedPlotArea] = useState("");
  const [roadWideningArea, setRoadWideningArea] = useState("");
  const [netPlotArea, setNetPlotArea] = useState("");

  // HERE SCHEDULE BOUNDARIES SECTIONS VARIABLES ARE INITIALIZED
  // Selector Get Data from server:
  const [natureOfRoadValue, setNatureOfRoadValue] = useState("");
  const [northValue, setNorthValue] = useState("");
  const [southValue, setSouthValue] = useState("");
  const [eastValue, setEastValue] = useState("");
  const [westValue, setWestValue] = useState("");

  // options

  const [individualFloorSelected, setIndividualFloorSelected] = useState([
    "",
    "",
    "",
    "",
  ]);

  const [floorOptions, setFloorOptions] = useState([
    "Stilt / Parking Floor",
    "Ground Floor",
    "First Floor",
    "Second Floor",
  ]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // const [floorTrack, setFloorTrack] = useState([
  //   "Stilt / Parking Floor",
  //   "Ground Floor",
  //   "First Floor",
  //   "Second Floor",
  // ]);

  // SIDE EFFECT HANDLED

  // HERE TOTAL BUILTUP AREA AND TOTAL PARKING AREA IS CALCULATED
  useEffect(() => {
    const totalBuiltUpArea = builtUpArea.reduce((accumulator, currentValue) => {
      return accumulator + currentValue;
    });

    setBuiltUpAreaSum(totalBuiltUpArea === 0 ? "" : totalBuiltUpArea);

    const totalParkingArea = parkingArea.reduce(
      (acc, currentValue) => acc + currentValue,
      0
    );

    setParkingAreaSum(totalParkingArea === 0 ? "" : totalParkingArea);
  }, [builtUpArea, parkingArea]);

  // HERE NET PLOTAREA CALCULATED
  useEffect(() => {
    const plot = proposedPlotArea === "" ? 0 : proposedPlotArea;
    const roadWide = roadWideningArea === "" ? 0 : roadWideningArea;
    calculateNetPlotArea(plot, roadWide);
  }, [proposedPlotArea, roadWideningArea]);

  // HERE DATA IS GETTING FROM THE DATABASE AS WELL AS UPDATING THE USE STATES  AND  ALL DISTRICTS ARE FETCHED
  useEffect(() => {
    const getData = async () => {
      const applicationData = await getApplicationData(applicationNo, cameFrom);
      console.log(applicationData, "All info ApplicationData");
      if (Object.keys(applicationData)?.length) {
        setDataFromDB(applicationData);
      }
    };
    getData();

    // const districtData = getLocationInfo();

    // console.log(districtData, 'districtData');

    // const apiUrl = "../../src/assets/buildingInfo.json";
    // fetch('https://residential-building.onrender.com/getDistricts')
    //   .then((response) => response.json())
    //   .then((result) => {
    //     console.log(result[0], 'result.district');
    //   })
    //   .catch((error) => {
    //     console.error("Error:", error);
    //   });

    // setDistrictData(allDistrictData.district);
  }, []);

  useEffect(() => {
    (async function () {
      const locationData = await fetchDataFromTheDb(
        "https://residential-building.onrender.com/getDistricts"
      );
      console.log(locationData, "LOC");
      const extractsDataFromDB = locationData[0]?.district;
      // setAllLocationData(extractsDataFromDB);
      // const districts = extractsDataFromDB?.map((each) => each?.name);
      setDistrictData(extractsDataFromDB);
    })();
  }, []);

  useEffect(() => {
    if (Object.keys(dataFromDB).length) {
      const generalInformation = dataFromDB?.buildingInfo?.generalInformation;

      const plotDetails = dataFromDB?.buildingInfo?.plotDetails;

      const scheduleBoundaries = dataFromDB?.buildingInfo?.scheduleBoundaries;

      if (Object.keys(generalInformation).length) {
        setGeneralInformation(generalInformation);
        setSelectedOptionCase(generalInformation?.caseType);
        setSelectedOptionPermission(generalInformation?.natureOfPermission);
        setSelectedNatureOfTheSite(generalInformation?.natureOfTheSite);
        setSelectedDistrict(generalInformation?.district);
        setSelectedMandal(generalInformation?.mandal);
        setSelectedGrama(generalInformation?.gramaPanchayat);
        setSelectedVillage(generalInformation?.village);
      }

      if (Object.keys(plotDetails).length) {
        const plotDetailsFloor =
          dataFromDB?.buildingInfo?.plotDetails?.floorDetails;

        setRadio2(plotDetails?.existingRoad);
        setRadio3(plotDetails?.statusOfRoad);
        setRadio4(plotDetails?.compoundingWallProposed);
        setRadio5(plotDetails?.siteRegistered);
        // update floor details as well as builtup area and parking area
        plotDetails?.floorDetails?.map((floor, index) => {
          if (
            index > 0 &&
            totalFloor?.length < plotDetails?.floorDetails?.length
          ) {
            console.log(index, "INDEX");
            setTotalFloor((prev) => {
              return [...prev, `Floor${index + 1}`];
            });
          }
          setBuiltUpArea((prev) => {
            const oldData = [...prev];
            oldData[index] = parseFloat(floor?.builtUpArea);

            return oldData;
          });
          setParkingArea((prev) => {
            const oldData = [...prev];
            oldData[index] = parseFloat(floor?.parkingArea);

            return oldData;
          });
        });

        plotDetailsFloor?.forEach((eachFloor, floorPosition) => {
          setIndividualFloorSelected((prev) => {
            const oldValue = [...prev];
            oldValue[floorPosition] = eachFloor?.name;
            return oldValue;
          });
        });

        setPlotDetails(plotDetails);
        setPlotDetailsFloor(plotDetailsFloor);
        setProposedPlotArea(plotDetails?.proposedPlotAreaCal);
        setRoadWideningArea(plotDetails?.roadWideningAreaCal);
        setNetPlotArea(plotDetails?.netPlotAreaCal);
        setBuiltUpAreaSum(plotDetails?.totalBuiltUpArea);
        setParkingAreaSum(plotDetails?.totalParkingArea);
        setNatureOfRoadValue(plotDetails?.natureOfRoad);
      }

      if (Object.keys(scheduleBoundaries).length) {
        setWestValue(scheduleBoundaries?.west);
        setEastValue(scheduleBoundaries?.east);
        setSouthValue(scheduleBoundaries?.south);
        setNorthValue(scheduleBoundaries?.north);

        setScheduleBoundaries(scheduleBoundaries);
      }
    }
  }, [dataFromDB]);

  // useEffect(() => {

  // }, [plotDetails]);

  // Case Type
  const handleCaseTypeChange = (e) => {
    setSelectedOptionCase(e.target.value);
  };
  const handlePermissionChange = (e) => {
    setSelectedOptionPermission(e.target.value);
  };

  // Nature of the site
  const handleNatureChange = (e) => {
    setSelectedNatureOfTheSite(e.target.value);
  };

  // ========================(Calculation part start)
  const handleProposedPlotAreaChange = (e) => {
    let newValue = e.target.value;
    // Check if the entered value is a valid number and less than or equal to 300

    const roadWideValue = roadWideningArea !== "" ? roadWideningArea : 0;
    if (newValue > 300) {
      e.target.value = 300;
      newValue = 300;
    }
    if (newValue < 0) {
      e.target.value = 0;
      newValue = 0;
    }
    setProposedPlotArea(newValue);
  };

  const handleRoadWideningAreaChange = (e) => {
    let newValue = e.target.value;
    // Check if the entered value is a valid number and less than or equal to 300
    if (newValue > 300) {
      e.target.value = 300;
      newValue = 300;
    }
    if (newValue < 0) {
      e.target.value = 0;
      newValue = 0;
    }
    setRoadWideningArea(newValue);
  };

  const calculateNetPlotArea = (proposed, widening) => {
    const proposedArea = parseFloat(proposed);
    const wideningArea = parseFloat(widening);

    if (!isNaN(proposedArea) && !isNaN(wideningArea)) {
      const netArea = proposedArea - wideningArea;
      setNetPlotArea(netArea.toFixed(2)); // Format to 2 decimal places
    } else {
      setNetPlotArea("");
    }
  };
  // ========================<<<(Calculation part End)>>>...

  // handleBuiltUpArea
  const handleBuiltUpArea = (value, index) => {
    const newBuiltUpArea = parseFloat(value) || 0;
    const updateArea = [...builtUpArea];
    updateArea[index] = newBuiltUpArea;
    setBuiltUpArea(updateArea);
  };

  const increaseFloorNo = () => {
    const newFloor = `Floor${totalFloor.length + 1}`;
    setTotalFloor((prev) => [...prev, newFloor]);
  };

  const decreaseFloorNo = () => {
    totalFloor.pop();
    setTotalFloor([...totalFloor]);
  };

  const handleParkingArea = (value, index) => {
    const newParkingArea = parseFloat(value) || 0;
    const updateArea = [...parkingArea];
    updateArea[index] = newParkingArea;
    setParkingArea(updateArea);
  };
  // =========================================<<<(Built Up Area Calculation End)>>>>...

  //=========================================<<<<<(District, Mandal & Village Start)>>>>> :
  const handleDistrictChange = (event) => {
    setSelectedDistrict(event.target.value);
    // Reset selected mandal and village when district changes
    setSelectedMandal("");
    setSelectedGrama("");
    setSelectedVillage("");
  };

  const handleMandalChange = (event) => {
    setSelectedMandal(event.target.value);
    // Reset selected village when mandal changes
    setSelectedGrama("");
    setSelectedVillage("");
  };
  //==============================<<<<<(District, Mandal & Village End)>>>>> :

  const handleNatureOfRoad = (event) => {
    setNatureOfRoadValue(event.target.value);
  };

  const handleNorthChange = (event) => {
    setNorthValue(event.target.value);
  };

  const handleSouthChange = (event) => {
    setSouthValue(event.target.value);
  };

  const handleEastChange = (event) => {
    setEastValue(event.target.value);
  };

  const handleWestChange = (event) => {
    setWestValue(event.target.value);
  };

  // Radio Button Get Data from server:
  const [radio1, setRadio1] = useState("");
  const [radio2, setRadio2] = useState("");
  const [radio3, setRadio3] = useState("");
  const [radio4, setRadio4] = useState("");
  const [radio5, setRadio5] = useState("");

  const handleRadio1 = (e) => {
    setRadio1(e.target.value);
  };

  const handleRadio2 = (e) => {
    console.log(e.target.value, "Radio2");
    setRadio2(e.target.value);
  };

  const handleRadio3 = (e) => {
    setRadio3(e.target.value);
  };

  const handleRadio4 = (e) => {
    setRadio4(e.target.value);
  };

  const handleRadio5 = (e) => {
    setRadio5(e.target.value);
  };

  // get data from input field :
  const collectInputFieldData = async (url) => {
    // ======================================<<<(General Information)>>>:
    const caseTypeData = document.getElementById("caseType").value;
    // Get selected radio input's value
    const selectedApplicationType =
      document.querySelector('input[name="radio-1"]:checked')?.value || "";
    const natureOfPermission =
      document.getElementById("natureOfPermission").value;
    const natureOfTheSite = document.getElementById("natureOfTheSite").value;
    const surveyNo = document.getElementById("SurveyNo").value;
    const district = document.getElementById("district").value;
    const mandal = document.getElementById("mandal").value;
    const gramaPanchayat = document.getElementById("gramaPanchayat").value;
    const village = document.getElementById("village").value;

    const bpsApprovedElement = document.getElementById("BpsApprovedNo");
    const bpsApprovedNo = bpsApprovedElement ? bpsApprovedElement.value : "";

    const previewsApprovedFileElement = document.getElementById("PreviewsApprovedFileNo");
    const previewsApprovedFileNo = previewsApprovedFileElement ? previewsApprovedFileElement.value : "";

    const FileNoElement = document.getElementById("FileNo");
    const FileNo = FileNoElement ? FileNoElement.value : "";

    const lpNoElement = document.getElementById("LpNo");
    const lpNo = lpNoElement ? lpNoElement.value : "";

    const plotNoElement = document.getElementById("PlotNo");
    const plotNo = plotNoElement ? plotNoElement.value : "";

    const lrsNoElement = document.getElementById("LrsNo");
    const lrsNo = lrsNoElement ? lrsNoElement.value : "";

    const plotNo2Element = document.getElementById("PlotNo2");
    const plotNo2 = plotNo2Element ? plotNo2Element.value : "";

    const iplpNoElement = document.getElementById("IplpNo");
    const iplpNo = iplpNoElement ? iplpNoElement.value : "";

    // ================================================<<<(Plot Details)>>>:
    const totalPlotDocument =
      document.getElementById("TotalPlotDocument").value;
    const totalPlotGround = document.getElementById("TotalPlotGround").value;
    const proposedPlotAreaValue =
      document.getElementById("proposedPlotArea").value;
    const roadWideningAreaValue =
      document.getElementById("roadWideningArea").value;
    const netPlotAreaValue = document.getElementById("netPlotArea").value;

    const natureOfRoad = document.getElementById("natureOfRoad").value;
    const existingRoadMts = document.getElementById("existingRoadMts").value;
    const proposedRoadMts = document.getElementById("proposedRoadMts").value;
    const marketValueSqym = document.getElementById("marketValueSqym").value;
    const vacantLand = document.getElementById("vacantLand").value;
    const noOfUnits = document.getElementById("noOfUnits").value;

    const floorDetails = totalFloor.map((floor, index) => {
      const builtUpArea = document.getElementById(`builtUpArea${index}`).value;
      const parkingArea = document.getElementById(`parkingArea${index}`).value;

      return {
        name: document.getElementById(`floorName${index}`).value,
        builtUpArea: builtUpArea === "" ? 0 : builtUpArea,
        parkingArea: parkingArea === "" ? 0 : parkingArea,
      };
    });

    const totalBuiltUpArea = document.getElementById("totalBuiltUpArea").value;
    const totalParkingArea = document.getElementById("totalParkingArea").value;
    const frontSetback = document.getElementById("frontSetback").value;
    const rareSetback = document.getElementById("rareSetback").value;
    const side1Setback = document.getElementById("side1Setback").value;
    const side2Setback = document.getElementById("side2Setback").value;
    const buildingExcludeStilt = document.getElementById(
      "buildingExcludeStilt"
    ).value;

    // runningMeter
    const runningMeterData = document.getElementById("runningMeter");
    const runningMeter = runningMeterData ? runningMeterData.value : "";

    // ==========================<<<(Schedule of Boundaries)>>>:
    const north = document.getElementById("north").value;
    const south = document.getElementById("south").value;
    const east = document.getElementById("east").value;
    const west = document.getElementById("west").value;

    const generalInformation = {
      caseType: caseTypeData,
      applicationType: selectedApplicationType,
      natureOfPermission,
      natureOfTheSite,
      surveyNo,
      district,
      mandal,
      gramaPanchayat,
      village,
      bpsApprovedNoServer: bpsApprovedNo,
      previewsApprovedFileNo,
      FileNo,
      lpNo,
      plotNo,
      lrsNo,
      plotNo2,
      iplpNo,
    };

    const plotDetails = {
      totalPlotDocument,
      totalPlotGround,
      proposedPlotAreaCal: proposedPlotAreaValue,
      roadWideningAreaCal: roadWideningAreaValue,
      netPlotAreaCal: netPlotAreaValue,
      existingRoad: radio2,
      statusOfRoad: radio3,
      natureOfRoad,
      existingRoadMts,
      proposedRoadMts,
      marketValueSqym,
      vacantLand,
      noOfUnits,
      floorDetails,
      totalBuiltUpArea: totalBuiltUpArea === "" ? 0 : totalBuiltUpArea,
      totalParkingArea: totalParkingArea === "" ? 0 : totalParkingArea,
      frontSetback,
      rareSetback,
      side1Setback,
      side2Setback,
      buildingExcludeStilt,
      compoundingWallProposed: radio4,
      runningMeter,
      siteRegistered: radio5,
    };

    const scheduleBoundaries = {
      north,
      south,
      east,
      west,
    };

    const buildingInfo = {
      generalInformation,
      plotDetails,
      scheduleBoundaries,
    };

    const splitApplicationNo = applicationNo.split("/");

    splitApplicationNo[2] = village?.length ? village.slice(0, 3) : "XX";
    splitApplicationNo[3] = mandal?.length ? mandal.slice(0, 3) : "XX";

    const newApplicationNo = splitApplicationNo.join("/");

    localStorage.setItem("CurrentAppNo", JSON.stringify(newApplicationNo));

    stepCompleted.current =
      stepCompleted.current > 1 ? stepCompleted.current : 1;

    return await sendUserDataIntoDB(url, "PATCH", {
      applicationNo: newApplicationNo,
      buildingInfo,
      prevSavedState: stepCompleted.current,
    });
  };

  const {
    applicationType,
    bpsApprovedNoServer,
    caseType,
    district,
    // gramaPanchayat,
    iplpNo,
    lpNo,
    lrsNo,
    mandal,
    natureOfPermission,
    natureOfTheSite,
    plotNo,
    plotNo2,
    previewsApprovedFileNo,
    FileNo,
    surveyNo,
    gramaPanchayat,
    village,
  } = generalInformation ?? {};

  const {
    proposedPlotAreaCal,
    roadWideningAreaCal,
    netPlotAreaCal,
    buildingExcludeStilt,
    compoundingWallProposed,
    existingRoad,
    existingRoadMts,
    frontSetback,
    marketValueSqym,
    vacantLand,
    noOfUnits,
    natureOfRoad,
    proposedRoadMts,
    rareSetback,
    side1Setback,
    side2Setback,
    siteRegistered,
    statusOfRoad,
    totalBuiltUpArea,
    totalParkingArea,
    totalPlotDocument,
    totalPlotGround,
    runningMeter,
  } = plotDetails ?? {};

  // const { east, west, north, south } = scheduleBoundaries ?? {};



  // File No Input Focus Modal:
  const [isModalOpen, setIsModalOpen] = useState(false);


  const [data, refetch, isError, isLoading, isSuccess] = useGetPageWiseApplication("Approved Applications");

  const handleClickModal = () => {
    setIsModalOpen(true);
    // Fetch data when the user clicks on the motion.div
    refetch();


    console.log(data, 'useGetPageWiseApplication');
  };


  // classes for this component:
  const labelClass = "block mb-1 font-semibold text-gray-600";
  const inputClass =
    "w-full px-3 py-[10px] border rounded-lg max-w-xs text-gray-600 bg-gray-50 border-gray-400 focus:border-gray-600 focus:outline-none focus:ring-2 ring-violet-200";

  return (
    <>
      <div className="grid m-4 lg:my-0 text-gray-900">
        <form
          action=""
          onSubmit={(e) => {
            e.preventDefault();
            confirmAlert(stepperData, collectInputFieldData);
          }}
          id="formId"
        >
          {/* general information */}
          <motion.div
            className="nm_Container mt-3 px-2 py-5 mb-10"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0, transition: { duration: 2 } }}
            viewport={{ once: true }}
          >
            <motion.div
              className="pl-2 flex items-center -mb-2"
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0, transition: { duration: 1 } }}
              viewport={{ once: true }}
            >
              <div className=" text-normalViolet">
                <HiInformationCircle size={30} />
              </div>
              <h3 className="font-bold text-xl ml-2">General Information</h3>
            </motion.div>

            <div className="px-2">
              <hr className="w-full h-[1.5px] inline-block bg-gray-400" />
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 -mt-2">
              <motion.div
                className="flex flex-col justify-center my-4 px-3"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0, transition: { duration: 1 } }}
                viewport={{ once: true }}
              >
                <label htmlFor="nature" className={labelClass}>
                  Case Type
                </label>
                <select
                  id="caseType"
                  className={inputClass}
                  value={selectedOptionCase}
                  onChange={handleCaseTypeChange}
                  disabled={isReadOnly}
                  required
                >
                  <option disabled value="">
                    Select Case type
                  </option>
                  <option value="New">New</option>
                  <option value="Demolition and Reconstruction">
                    Demolition and Reconstruction
                  </option>
                  <option value="Alteration Addition Existing">
                    Alteration Addition Existing
                  </option>
                  <option value="Revision">Revision</option>
                </select>
              </motion.div>

              {/* radio button  */}
              <motion.div
                className="grid grid-cols-1 font-medium  lg:justify-items-center my-4 mx-3"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0, transition: { duration: 1 } }}
                viewport={{ once: true }}
              >
                <p className="flex items-center font-semibold text-gray-600">
                  Application Type?
                </p>

                <div className="radio-button-container">
                  <div className="radio-button">
                    <input
                      type="radio"
                      className="radio-button__input"
                      id="private"
                      name="radio-1"
                      value="Private"
                      checked={
                        radio1 === "Private"
                          ? radio1 === "Private"
                          : applicationType === "Private"
                      }
                      onChange={handleRadio1}
                      disabled={isReadOnly}
                      required
                    />
                    <label className="radio-button__label" htmlFor="private">
                      <span className="radio-button__custom"></span>
                      Private
                    </label>
                  </div>
                  <div className="radio-button">
                    <input
                      type="radio"
                      className="radio-button__input"
                      id="radio2"
                      name="radio-1"
                      value="Govt. Land"
                      checked={
                        radio1 === "Govt. Land"
                          ? radio1 === "Govt. Land"
                          : applicationType === "Govt. Land"
                      }
                      onChange={handleRadio1}
                      disabled={isReadOnly}
                    />
                    <label className="radio-button__label" htmlFor="radio2">
                      <span className="radio-button__custom"></span>
                      Govt. Land
                    </label>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="flex flex-col justify-center my-4 mx-3"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0, transition: { duration: 1 } }}
                viewport={{ once: true }}
              >
                <label className="block text-gray-600 mb-1 font-semibold">
                  <span>Nature of permission</span>
                </label>
                <select
                  id="natureOfPermission"
                  className={inputClass}
                  value={selectedOptionPermission}
                  onChange={handlePermissionChange}
                  disabled={isReadOnly}
                  required
                >
                  <option value="General">General</option>
                  <option value="Regularised under BPS">
                    Regularised under BPS
                  </option>
                  <option value="Housing Scheme">Housing Scheme</option>
                </select>
              </motion.div>

              <motion.div
                className="my-4 mx-3"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0, transition: { duration: 1 } }}
                viewport={{ once: true }}
              >
                <label htmlFor="nature" className={labelClass}>
                  <span>Nature of the site</span>
                </label>
                <select
                  id="natureOfTheSite"
                  className={inputClass}
                  value={selectedNatureOfTheSite}
                  onChange={handleNatureChange}
                  disabled={isReadOnly}
                  required
                >
                  <option disabled value="">
                    Select Nature of the site
                  </option>
                  <option value="Approved Layout">Approved Layout</option>

                  {selectedOptionCase === "Alteration Addition Existing" ? (
                    <option value="Regularised under LRS">
                      Regularised under LRS
                    </option>
                  ) : null}

                  <option value="Plot port of RLP/IPLP but not regularised">
                    Plot port of RLP/IPLP but not regularised
                  </option>
                  <option value="Congested/ Gramakanta/ Old Built-up area">
                    Gramakanta
                  </option>
                  <option value="Newly Developed/ Built up area">
                    Newly Developed/ Built up area
                  </option>
                </select>
              </motion.div>

              <InputField
                id="SurveyNo"
                name="Survey no."
                label="Survey no."
                placeholder="Survey no."
                type="text"
                ltpDetails={surveyNo}
              />

              <motion.div
                className="flex flex-col justify-center my-4 mx-3"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0, transition: { duration: 1 } }}
                viewport={{ once: true }}
              >
                <label className={labelClass}>
                  <span>District</span>
                </label>
                <select
                  id="district"
                  name="District"
                  className={`${inputClass}`}
                  onChange={handleDistrictChange}
                  value={selectedDistrict}
                  disabled={isReadOnly}
                  required
                >
                  <option value="" disabled>
                    Select District
                  </option>
                  {districtData.map((district) => (
                    <option key={district.name} value={district.name}>
                      {district.name}
                    </option>
                  ))}
                </select>
              </motion.div>

              <motion.div
                className="flex flex-col justify-center my-4 mx-3"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0, transition: { duration: 1 } }}
                viewport={{ once: true }}
              >
                <label className={labelClass}>
                  <span>Mandal</span>
                </label>
                <select
                  id="mandal"
                  name="mandal"
                  className={inputClass}
                  onChange={handleMandalChange}
                  value={selectedMandal}
                  disabled={!selectedDistrict || isReadOnly}
                  required
                >
                  <option value="" disabled>
                    Select Mandal
                  </option>
                  {selectedDistrict &&
                    districtData
                      .find((district) => district.name === selectedDistrict)
                      ?.mandal.map((mandal) => (
                        <option key={mandal.name} value={mandal.name}>
                          {mandal.name}
                        </option>
                      ))}
                </select>
              </motion.div>

              <motion.div
                className="flex flex-col justify-center my-4 mx-3"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0, transition: { duration: 1 } }}
                viewport={{ once: true }}
              >
                <label className={labelClass}>
                  <span>Village</span>
                </label>
                <select
                  id="village"
                  name="village"
                  className={inputClass}
                  value={selectedVillage}
                  onChange={(e) => setSelectedVillage(e.target.value)}
                  disabled={!selectedMandal || isReadOnly}
                  required
                >
                  <option value="" disabled>
                    Select Village
                  </option>
                  {selectedMandal &&
                    districtData
                      .find((district) => district.name === selectedDistrict)
                      ?.mandal.find((mandal) => mandal.name === selectedMandal)
                      ?.village.map((village) => (
                        <option key={village} value={village}>
                          {village}
                        </option>
                      ))}
                </select>
              </motion.div>

              <motion.div
                className="flex flex-col justify-center my-4 mx-3"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0, transition: { duration: 1 } }}
                viewport={{ once: true }}
              >
                <label className={labelClass}>
                  <span>Grama Panchayat</span>
                </label>
                <select
                  id="gramaPanchayat"
                  name="gramaPanchayat"
                  className={inputClass}
                  value={selectedGrama}
                  onChange={(e) => setSelectedGrama(e.target.value)}
                  disabled={!selectedMandal || isReadOnly}
                  required
                >
                  <option value="" disabled>
                    Select Grama Panchayat
                  </option>
                  {selectedMandal &&
                    districtData
                      .find((district) => district.name === selectedDistrict)
                      ?.mandal.find((mandal) => mandal.name === selectedMandal)
                      ?.village.map((village) => (
                        <option key={village} value={village}>
                          {village}
                        </option>
                      ))}
                </select>
              </motion.div>

              {/*===================== Conditionally render input fields based on Case Type  =====================*/}
              {selectedOptionCase === "Alteration Addition Existing" &&
                selectedOptionPermission === "Regularised under BPS" && (
                  <motion.div
                    initial={{ x: "-100vw" }}
                    animate={{ x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <InputField
                      id="BpsApprovedNo"
                      name="BpsApprovedNo"
                      label="BPS approved no."
                      placeholder="BPS approved no."
                      ltpDetails={bpsApprovedNoServer}
                      type="number"
                    />
                  </motion.div>
                )}

              {selectedOptionCase === "Alteration Addition Existing" &&
                selectedOptionPermission !== "Regularised under BPS" && (
                  <motion.div
                    initial={{ x: "-100vw" }}
                    animate={{ x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <InputField
                      id="PreviewsApprovedFileNo"
                      name="PreviewsApprovedFileNo"
                      label="Previews approved file no."
                      placeholder="Previews approved file no."
                      type="number"
                      ltpDetails={previewsApprovedFileNo}
                    />
                  </motion.div>
                )}

              {/* Conditionally render input fields based on Nature of the site */}
              {selectedNatureOfTheSite === "Approved Layout" && (
                <>
                  <motion.div
                    initial={{ x: "-100vw" }}
                    animate={{ x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <InputField
                      id="LpNo"
                      name="LpNo"
                      label="L.P. no."
                      placeholder="L.P. no."
                      type="Test"
                      ltpDetails={lpNo}
                    />
                  </motion.div>
                  <motion.div
                    initial={{ x: "-100vw" }}
                    animate={{ x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <InputField
                      id="PlotNo"
                      name="PlotNo"
                      label="Plot no."
                      placeholder="Plot no."
                      type="number"
                      ltpDetails={plotNo}
                    />
                  </motion.div>
                </>
              )}

              {selectedNatureOfTheSite === "Regularised under LRS" && (
                <>
                  <motion.div
                    initial={{ x: "-100vw" }}
                    animate={{ x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <InputField
                      id="LrsNo"
                      name=""
                      label="LRS no"
                      placeholder="LRS no."
                      type="text"
                      ltpDetails={lrsNo}
                    />
                  </motion.div>
                  <motion.div
                    initial={{ x: "-100vw" }}
                    animate={{ x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <InputField
                      id="PlotNo2"
                      name=""
                      label="Plot no"
                      placeholder="Plot no."
                      type="number"
                      ltpDetails={plotNo2}
                    />
                  </motion.div>
                </>
              )}

              {selectedNatureOfTheSite ===
                "Plot port of RLP/IPLP but not regularised" && (
                  <motion.div
                    initial={{ x: "-100vw" }}
                    animate={{ x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <InputField
                      id="IplpNo"
                      name="IplpNo"
                      label="RLP/IPLP no."
                      placeholder="RLP/IPLP no."
                      type="number"
                      ltpDetails={iplpNo}
                    />
                  </motion.div>
                )}
              {/*===================== Conditional Input Field End =====================*/}
            </div>

            {selectedOptionCase === "Revision" && (
              <motion.div
                // initial={{ x: "-100vw" }}
                // animate={{ x: 0 }}
                // transition={{ delay: 0.2 }}
                onClick={handleClickModal}
              >
                <InputField
                  id="FileNo"
                  name="FileNo"
                  label="File no."
                  placeholder="Enter your file no."
                  type="number"
                // ltpDetails={FileNo}
                />
              </motion.div>
            )}
          </motion.div>

          {isModalOpen ? (
            <PreviousFileModal
              FileModal={{ setIsModalOpen, isModalOpen, setDataFromDB }}
            />
          ) : null}


          {/* plot details  */}
          <motion.div
            className="nm_Container mt-3 px-2 py-5 mb-10"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0, transition: { duration: 2 } }}
            viewport={{ once: true }}
          >
            <motion.div
              className="pl-2 flex items-center -mb-2"
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0, transition: { duration: 1 } }}
              viewport={{ once: true }}
            >
              <AiOutlineAreaChart size={30} className="text-normalViolet" />
              <h3 className="font-bold text-xl ml-2">Plot Details</h3>
            </motion.div>

            <div className="px-2">
              <hr className="w-full h-[1.5px] inline-block bg-gray-400" />
            </div>

            <div className="-mt-2">
              <div className="grid grid-cols-2 lg:grid-cols-4">
                <InputField
                  type="number"
                  id="TotalPlotDocument"
                  name="TotalPlotDocument"
                  label="Total Plot are as per document"
                  placeholder="in Sq.Mts."
                  ltpDetails={totalPlotDocument}
                />
                <InputField
                  type="number"
                  id="TotalPlotGround"
                  name="TotalPlotGround"
                  label="Total Plot are as on ground"
                  placeholder="in Sq.Mts."
                  ltpDetails={totalPlotGround}
                />

                <motion.div
                  className="my-4 mx-3 flex flex-col justify-between"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                    transition: { duration: 1 },
                  }}
                  viewport={{ once: true }}
                >
                  <label htmlFor="" className={labelClass}>
                    Proposed Plot area
                  </label>
                  <input
                    type="number"
                    id="proposedPlotArea"
                    name="proposedPlotArea"
                    placeholder="in Sq.Mts."
                    className="w-full px-3 py-2 border rounded-lg max-w-xs text-gray-600 bg-gray-50 border-gray-400 focus:border-gray-600 focus:outline-none focus:ring-2 ring-violet-200"
                    defaultValue={proposedPlotArea ?? ""}
                    onChange={handleProposedPlotAreaChange}
                    readOnly={isReadOnly}
                    required
                  />
                </motion.div>

                <motion.div
                  className="my-4 mx-3 flex flex-col justify-between"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                    transition: { duration: 1 },
                  }}
                  viewport={{ once: true }}
                >
                  <label htmlFor="" className={labelClass}>
                    Road Widening Area
                  </label>
                  <input
                    id="roadWideningArea"
                    type="roadWideningArea"
                    placeholder="in Sq.Mts."
                    className="w-full px-3 py-2 border rounded-lg max-w-xs text-gray-600 bg-gray-50 border-gray-400 focus:border-gray-600 focus:outline-none focus:ring-2 ring-violet-200"
                    defaultValue={roadWideningArea ?? ""}
                    onChange={handleRoadWideningAreaChange}
                    disabled={isReadOnly}
                    required
                  />
                </motion.div>

                {/* Automatically calculated Plot Details  */}
                <motion.div
                  className="my-4 mx-3"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                    transition: { duration: 1 },
                  }}
                  viewport={{ once: true }}
                >
                  <label htmlFor="disabled-input" className={labelClass}>
                    Net Plot Area (in Sq.Mts.)
                  </label>
                  <input
                    type="text"
                    id="netPlotArea"
                    name="netPlotArea"
                    placeholder="Automatically calculated"
                    className="w-full px-3 py-2 border rounded-lg max-w-xs text-gray-600 bg-gray-200 border-gray-600 focus:outline-none"
                    value={netPlotArea ?? ""}
                    readOnly
                  />
                </motion.div>
              </div>

              <div className="grid grid-cols-1 mx-5 md:mx-10 lg:mx-14 my-10">
                {selectedNatureOfTheSite ===
                  "Newly Developed/ Built up area" && (
                    <motion.div
                      className="flex flex-col md:flex-row font-medium mb-4 text-lg"
                      initial={{ x: "100vw" }}
                      animate={{ x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <div className="flex items-center mb-3 md:mb-0">
                        <FaHandPointRight className="me-3 w-5 lg:w-auto text-violetLight" />
                        <p className="font-bold text-lg">
                          Whether site abuts any Existing Road?
                        </p>
                      </div>

                      <div className="radio-button-container ml-3">
                        <div className="radio-button">
                          <input
                            type="radio"
                            className="radio-button__input"
                            id="yesRoadExist"
                            name="yesRoadExist"
                            value="yes"
                            checked={radio2 === "yes"}
                            onChange={handleRadio2}
                            disabled={isReadOnly}
                            required
                          />
                          <label
                            className="radio-button__label"
                            htmlFor="yesRoadExist"
                          >
                            <span className="radio-button__custom"></span>
                            Yes
                          </label>
                        </div>
                        <div className="radio-button">
                          <input
                            type="radio"
                            className="radio-button__input"
                            id="noRoadExist"
                            name="yesRoadExist"
                            value="no"
                            checked={radio2 === "no"}
                            onChange={handleRadio2}
                            disabled={isReadOnly}
                          />
                          <label
                            className="radio-button__label"
                            htmlFor="noRoadExist"
                          >
                            <span className="radio-button__custom"></span>
                            No
                          </label>
                        </div>
                      </div>
                    </motion.div>
                  )}

                <motion.div
                  className="flex flex-col md:flex-row font-medium mb-4 text-lg mt-4"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                    transition: { duration: 1 },
                  }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-center mb-3 md:mb-0">
                    <FaHandPointRight className="me-3 w-5 lg:w-auto text-violetLight" />
                    <p className="font-bold text-lg">Status of Road?</p>
                  </div>

                  <div className="radio-button-container ml-3">
                    <div className="radio-button">
                      <input
                        type="radio"
                        id="publicStatusRoad"
                        className="radio-button__input"
                        name="publicStatusRoad"
                        value="Public"
                        checked={radio3 === "Public"}
                        onChange={handleRadio3}
                        disabled={isReadOnly}
                        required
                      />
                      <label
                        className="radio-button__label"
                        htmlFor="publicStatusRoad"
                      >
                        <span className="radio-button__custom"></span>
                        Public
                      </label>
                    </div>
                    <div className="radio-button">
                      <input
                        type="radio"
                        className="radio-button__input"
                        id="privateStatusRoad"
                        name="publicStatusRoad"
                        value="Private"
                        checked={radio3 === "Private"}
                        onChange={handleRadio3}
                        disabled={isReadOnly}
                      />
                      <label
                        className="radio-button__label"
                        htmlFor="privateStatusRoad"
                      >
                        <span className="radio-button__custom"></span>
                        Private
                      </label>
                    </div>
                  </div>
                </motion.div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 mt-3">
                <motion.div
                  className="flex flex-col justify-center mx-3"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                    transition: { duration: 1 },
                  }}
                  viewport={{ once: true }}
                >
                  <label className={labelClass}>
                    <span>Nature of Road</span>
                  </label>
                  <select
                    id="natureOfRoad"
                    className={inputClass}
                    value={natureOfRoadValue}
                    onChange={handleNatureOfRoad}
                    disabled={isReadOnly}
                    required
                  >
                    <option disabled value="">
                      Select Nature of Road
                    </option>
                    <option>BT Road</option>
                    <option>CC Road</option>
                    <option>WBM</option>
                    <option>Kutchha/ Graval</option>
                  </select>
                </motion.div>

                <InputField
                  id="existingRoadMts"
                  name="name1"
                  label="Existing road (in Mts.)"
                  placeholder="in Sq.Mts."
                  ltpDetails={existingRoadMts}
                />
                <InputField
                  id="proposedRoadMts"
                  name="name1"
                  label="Proposed road (in Mts.)"
                  placeholder="in Sq.Mts."
                  ltpDetails={proposedRoadMts}
                />
                <InputField
                  id="marketValueSqym"
                  name="name1"
                  label="Market Value (per Sq.Yd.)"
                  placeholder="per Sq.Yd."
                  ltpDetails={marketValueSqym}
                />
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4">
                {totalFloor.map((floor, index) => (
                  <FloorDetails
                    key={index}
                    floor={floor}
                    index={index}
                    length={totalFloor.length}
                    increaseFloorNo={increaseFloorNo}
                    decreaseFloorNo={decreaseFloorNo}
                    handleBuiltUpArea={handleBuiltUpArea}
                    handleParkingArea={handleParkingArea}
                    parkingAreaValue={parkingArea[index]}
                    builtUpAreaValue={builtUpArea[index]}
                    plotDetailsFloor={
                      plotDetailsFloor ? plotDetailsFloor[index] : undefined
                    }
                    floorOptions={floorOptions}
                    setFloorOptions={setFloorOptions}
                    setIndividualFloorSelected={setIndividualFloorSelected}
                    individualFloorSelected={individualFloorSelected}
                    isReadOnly={isReadOnly}
                  />
                ))}
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 mt-5">
                <div className="hidden lg:grid"></div>
                <motion.div
                  className="my-4 mx-3 grid"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                    transition: { duration: 1 },
                  }}
                  viewport={{ once: true }}
                >
                  <label htmlFor="disabled-input" className={labelClass}>
                    Total Built up area
                  </label>
                  <input
                    type="text"
                    id="totalBuiltUpArea"
                    name="name1"
                    placeholder="Automatically calculated"
                    className="w-full px-3 py-2 border rounded-lg max-w-xs text-gray-600 bg-gray-200 border-gray-600 focus:outline-none"
                    value={builtUpAreaSum}
                    readOnly
                  />
                </motion.div>

                <motion.div
                  className="my-4 mx-3"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                    transition: { duration: 1 },
                  }}
                  viewport={{ once: true }}
                >
                  <label htmlFor="disabled-input2" className={labelClass}>
                    Total Parking area
                  </label>
                  <input
                    id="totalParkingArea"
                    name="name1"
                    placeholder="Automatically calculated"
                    className="w-full px-3 py-2 border rounded-lg max-w-xs text-gray-600 bg-gray-200 border-gray-600 focus:outline-none"
                    value={parkingAreaSum}
                    readOnly
                  />
                </motion.div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4">
                <InputField
                  id="frontSetback"
                  name="name72"
                  label="Front setback (in Mts.)"
                  placeholder="in Mts."
                  ltpDetails={frontSetback}
                />
                <InputField
                  id="rareSetback"
                  name="name1"
                  label="Rare setback (in Mts.)"
                  placeholder="in Mts."
                  ltpDetails={rareSetback}
                />
                <InputField
                  id="side1Setback"
                  name="name1"
                  label="Side1 setback (in Mts.)"
                  placeholder="in Mts."
                  ltpDetails={side1Setback}
                />
                <InputField
                  id="side2Setback"
                  name="name1"
                  label="Side 2 setback (in Mts.)"
                  placeholder="in Mts."
                  ltpDetails={side2Setback}
                />
                <InputField
                  id="buildingExcludeStilt"
                  name="name1"
                  label="Total Height of The Building Exclude Stilt (in Mts.)"
                  placeholder="in Mts."
                  ltpDetails={buildingExcludeStilt}
                />
                <InputField
                  id="vacantLand"
                  name="vacantLand"
                  label="Vacant land area"
                  placeholder="in Sq.Mts."
                  ltpDetails={vacantLand}
                />
                <InputField
                  id="noOfUnits"
                  name="noOfUnits"
                  label="No of units"
                  placeholder="No of units"
                  ltpDetails={noOfUnits}
                />
              </div>

              <div className="grid grid-cols-1 mx-5 md:mx-10 lg:mx-14">
                <div className="lg:flex">
                  <motion.div
                    className="flex flex-col md:flex-row basis-[70%] font-medium text-lg my-10"
                    initial={{ opacity: 0, x: 100 }}
                    whileInView={{
                      opacity: 1,
                      x: 0,
                      transition: { duration: 1 },
                    }}
                    viewport={{ once: true }}
                  >
                    <div className="flex items-center mb-3 md:mb-0">
                      <FaHandPointRight className="me-3 w-7 lg:w-auto text-violetLight" />
                      <p className="font-bold text-lg">
                        Compounding wall proposed?
                      </p>
                    </div>

                    <div className="radio-button-container ml-3">
                      <div className="radio-button">
                        <input
                          type="radio"
                          className="radio-button__input"
                          id="yesWallProposed"
                          name="yesWallProposed"
                          value="yes"
                          checked={radio4 === "yes"}
                          onChange={handleRadio4}
                          disabled={isReadOnly}
                          required
                        />
                        <label
                          className="radio-button__label"
                          htmlFor="yesWallProposed"
                        >
                          <span className="radio-button__custom"></span>
                          Yes
                        </label>
                      </div>
                      <div className="radio-button">
                        <input
                          type="radio"
                          className="radio-button__input"
                          id="noWallProposed"
                          value="no"
                          name="yesWallProposed"
                          checked={radio4 === "no"}
                          onChange={handleRadio4}
                          disabled={isReadOnly}
                        />
                        <label
                          className="radio-button__label"
                          htmlFor="noWallProposed"
                        >
                          <span className="radio-button__custom"></span>
                          No
                        </label>
                      </div>
                    </div>
                  </motion.div>
                  <div className="basis-[30%]">
                    {radio4 === "yes" ? (
                      <motion.div
                        initial={{ x: "-100vw" }}
                        animate={{ x: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <InputField
                          id="runningMeter"
                          name="runningMeter"
                          label="Running meter"
                          placeholder="Running meter"
                          ltpDetails={runningMeter}
                        />
                      </motion.div>
                    ) : null}
                  </div>
                </div>

                <motion.div
                  className="flex flex-col md:flex-row font-medium mb-3 text-lg"
                  initial={{ opacity: 0, x: 100 }}
                  whileInView={{
                    opacity: 1,
                    x: 0,
                    transition: { duration: 1 },
                  }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-center mb-3 md:mb-0">
                    <FaHandPointRight className="me-3 w-7 lg:w-auto text-violetLight" />
                    <p className="font-bold text-lg">
                      Whether site Registered as house plot/ Building prior to
                      18-01-2006?
                    </p>
                  </div>

                  <div className="radio-button-container ml-3">
                    <div className="radio-button">
                      <input
                        type="radio"
                        className="radio-button__input"
                        id="yesSiteRegistered"
                        name="yesSiteRegistered"
                        value="yes"
                        checked={radio5 === "yes"}
                        onChange={handleRadio5}
                        disabled={isReadOnly}
                        required
                      />
                      <label
                        className="radio-button__label"
                        htmlFor="yesSiteRegistered"
                      >
                        <span className="radio-button__custom"></span>
                        Yes
                      </label>
                    </div>
                    <div className="radio-button">
                      <input
                        type="radio"
                        className="radio-button__input"
                        id="noSiteRegistered"
                        name="yesSiteRegistered"
                        value="no"
                        checked={radio5 === "no"}
                        onChange={handleRadio5}
                        disabled={isReadOnly}
                      />
                      <label
                        className="radio-button__label"
                        htmlFor="noSiteRegistered"
                      >
                        <span className="radio-button__custom"></span>
                        No
                      </label>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* schedule boundaries  */}
          <motion.div
            className="nm_Container mt-3 px-2 py-5"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0, transition: { duration: 2 } }}
            viewport={{ once: true }}
          >
            <motion.div
              className="pl-2 flex items-center -mb-2"
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0, transition: { duration: 1 } }}
              viewport={{ once: true }}
            >
              <PiWall size={30} className="text-normalViolet" />
              <h3 className="font-bold text-xl ml-3">Schedule of Boundaries</h3>
            </motion.div>

            <div className="px-2">
              <hr className="w-full h-[1.5px] inline-block bg-gray-400" />
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 items-center -mt-2">
              <motion.div
                className="flex flex-col my-4 justify-center mx-3"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0, transition: { duration: 1 } }}
                viewport={{ once: true }}
              >
                <label className={labelClass}>
                  <span>North</span>
                </label>
                <select
                  id="north"
                  className={`${inputClass}`}
                  value={northValue}
                  onChange={handleNorthChange}
                  disabled={isReadOnly}
                  required
                >
                  <option disabled value="">
                    Select North
                  </option>
                  <option value="Road">Road</option>
                  <option value="Plot">Plot</option>
                  <option value="Vacant land">Vacant land</option>
                  <option value="Water body">Water body</option>
                  <option value="Existing building">Existing building</option>
                </select>
              </motion.div>

              <motion.div
                className="flex flex-col my-4 justify-center mx-3"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0, transition: { duration: 1 } }}
                viewport={{ once: true }}
              >
                <label className={labelClass}>
                  <span>South</span>
                </label>
                <select
                  id="south"
                  className={inputClass}
                  value={southValue}
                  onChange={handleSouthChange}
                  disabled={isReadOnly}
                  required
                >
                  <option disabled value="">
                    Select South
                  </option>
                  <option value="Road">Road</option>
                  <option value="Plot">Plot</option>
                  <option value="Vacant land">Vacant land</option>
                  <option value="Water body">Water body</option>
                  <option value="Existing building">Existing building</option>
                </select>
              </motion.div>

              <motion.div
                className="flex flex-col my-4 justify-center mx-3"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0, transition: { duration: 1 } }}
                viewport={{ once: true }}
              >
                <label className={labelClass}>
                  <span>East</span>
                </label>
                <select
                  id="east"
                  className={inputClass}
                  value={eastValue}
                  onChange={handleEastChange}
                  disabled={isReadOnly}
                  required
                >
                  <option disabled value="">
                    Select East
                  </option>
                  <option value="Road">Road</option>
                  <option value="Plot">Plot</option>
                  <option value="Vacant land">Vacant land</option>
                  <option value="Water body">Water body</option>
                  <option value="Existing building">Existing building</option>
                </select>
              </motion.div>

              <motion.div
                className="flex flex-col my-4 justify-center mx-3"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0, transition: { duration: 1 } }}
                viewport={{ once: true }}
              >
                <label className={labelClass}>
                  <span>West</span>
                </label>
                <select
                  id="west"
                  className={inputClass}
                  value={westValue}
                  onChange={handleWestChange}
                  disabled={isReadOnly}
                  required
                >
                  <option disabled value="">
                    Select West
                  </option>
                  <option value="Road">Road</option>
                  <option value="Plot">Plot</option>
                  <option value="Vacant land">Vacant land</option>
                  <option value="Water body">Water body</option>
                  <option value="Existing building">Existing building</option>
                </select>
              </motion.div>
            </div>
          </motion.div>

          {/* save & continue  */}
          <SaveData
            isStepperVisible={isStepperVisible}
            currentStep={currentStep}
            steps={steps}
            stepperData={stepperData}
            confirmAlert={confirmAlert}
            collectInputFieldData={collectInputFieldData}
          />
        </form>
      </div>
    </>
  );
};

export default BuildingInfo;
