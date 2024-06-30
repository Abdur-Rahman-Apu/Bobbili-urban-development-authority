import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../../AuthProvider/AuthProvider";
import DocumentFooter from "../Documents/DocumentFooter";

function DrawingTable({
  setApprovedConfirmation,
  setRecommendationMessage,
  recomendationMessage,
  approvedConfirmation,
  applicationData,
  submitData,
}) {
  console.log(applicationData, "Application data");

  const { calculateNoOfFloors } = useContext(AuthContext);

  const plotDetails = applicationData?.plotDetails;

  // const numberOfFloors = plotDetails?.floorDetails?.length ?? 0;

  const [floorValue, setFloorValue] = useState({
    "Stilt / Parking Floor": "",
    "Ground Floor": "",
    "First Floor": "",
    "Second Floor": "",
  });

  // plotDetails?.floorDetails?.forEach((value, index) => {
  //   setFloorValue
  // });

  console.log(plotDetails, "Plot details");

  const [preDeterminedValue, setPreDeterminedValue] = useState({
    front: "",
    rare: "",
    side1: "",
    side2: "",
  });

  // const netPlotAreaCal = 201;
  // const buildingExcludeStilt = 6;
  // const proposedRoadMts = 31;

  // const netPlotAreaValue = netPlotAreaCal;
  // const buildingHeight = buildingExcludeStilt;
  // const proposedRoadValue = proposedRoadMts;

  const netPlotAreaValue = plotDetails?.netPlotAreaCal;
  const buildingHeight = plotDetails?.buildingExcludeStilt;
  const proposedRoadValue = plotDetails?.proposedRoadMts;

  const decideSetBackValue = (roadValue, serial) => {
    const setBackValue = [
      [1.5, 1.5, 3, 3, 3, "-"],
      [1.5, 1.5, 3, 3, 3, "-"],
      [1.5, 1.5, 3, 3, 3, 0.5],
      [1.5, 1.5, 3, 3, 3, 1.0],
      [2, 3, 3, 4, 5, 1.0],
      [2, 3, 3, 5, 6, 1.5],
    ];

    const setBackValueIndex = serial;

    console.log(
      setBackValue,
      setBackValueIndex,
      setBackValue[setBackValueIndex],
      "ddsfsdfds"
    );

    const matchArrLength = setBackValue[setBackValueIndex].length;

    console.log(matchArrLength);

    if (roadValue <= 12) {
      console.log(setBackValue[setBackValueIndex], "VALUE", serial);
      setPreDeterminedValue((prev) => {
        prev["front"] = setBackValue[setBackValueIndex][0];
        prev["rare"] = setBackValue[setBackValueIndex][matchArrLength - 1];
        prev["side1"] = setBackValue[setBackValueIndex][matchArrLength - 1];
        prev["side2"] = setBackValue[setBackValueIndex][matchArrLength - 1];
        return prev;
      });
    }

    if (roadValue > 12 && roadValue <= 18) {
      console.log(setBackValue[setBackValueIndex][1]);
      setPreDeterminedValue((prev) => {
        prev["front"] = setBackValue[setBackValueIndex][1];
        prev["rare"] = setBackValue[setBackValueIndex][matchArrLength - 1];
        prev["side1"] = setBackValue[setBackValueIndex][matchArrLength - 1];
        prev["side2"] = setBackValue[setBackValueIndex][matchArrLength - 1];
        return prev;
      });
    }

    if (roadValue > 18 && roadValue <= 24) {
      setPreDeterminedValue((prev) => {
        prev["front"] = setBackValue[setBackValueIndex][2];
        prev["rare"] = setBackValue[setBackValueIndex][matchArrLength - 1];
        prev["side1"] = setBackValue[setBackValueIndex][matchArrLength - 1];
        prev["side2"] = setBackValue[setBackValueIndex][matchArrLength - 1];
        return prev;
      });
    }

    if (roadValue > 24 && roadValue <= 30) {
      setPreDeterminedValue((prev) => {
        prev["front"] = setBackValue[setBackValueIndex][3];
        prev["rare"] = setBackValue[setBackValueIndex][matchArrLength - 1];
        prev["side1"] = setBackValue[setBackValueIndex][matchArrLength - 1];
        prev["side2"] = setBackValue[setBackValueIndex][matchArrLength - 1];
        return prev;
      });
    }
    if (roadValue > 30) {
      setPreDeterminedValue((prev) => {
        prev["front"] = setBackValue[setBackValueIndex][4];
        prev["rare"] = setBackValue[setBackValueIndex][matchArrLength - 1];
        prev["side1"] = setBackValue[setBackValueIndex][matchArrLength - 1];
        prev["side2"] = setBackValue[setBackValueIndex][matchArrLength - 1];
        return prev;
      });
    }
  };

  useEffect(() => {
    // table first condition
    if (netPlotAreaValue <= 50 && buildingHeight <= 7) {
      decideSetBackValue(proposedRoadValue, 0);
    }

    // table 2nd condition
    if (netPlotAreaValue > 50 && netPlotAreaValue <= 100) {
      if (buildingHeight <= 7) {
        decideSetBackValue(proposedRoadValue, 1);
      }
      if (buildingHeight > 7 && buildingHeight <= 10) {
        decideSetBackValue(proposedRoadValue, 2);
      }
    }

    // table 3rd condition
    if (
      netPlotAreaValue > 100 &&
      netPlotAreaValue <= 200 &&
      buildingHeight <= 10
    ) {
      decideSetBackValue(proposedRoadValue, 3);
    }

    // table 4th conditin
    if (netPlotAreaValue > 200 && netPlotAreaValue <= 300) {
      if (buildingHeight <= 7) {
        decideSetBackValue(proposedRoadValue, 4);
      }
      if (buildingHeight > 7 && buildingHeight <= 10) {
        decideSetBackValue(proposedRoadValue, 5);
      }
    }
  }, []);

  // const TrData = [
  //   { "Proposed Site Area": ["", "", ""] },
  //   { "Access Road Width": ["", "", ""] },
  //   { "Scope of Road Windering": ["", "", ""] },
  //   { Setbacks: ["", "", ""] },
  //   { North: ["", "", ""] },
  //   { South: ["", "", "Hello"] },
  //   { East: ["", "", ""] },
  //   { West: ["", "", ""] },
  //   { "Number of floors": ["", "", ""] },
  //   { "No. of Units": ["", "", ""] },
  //   { "Green Strip": ["Yes", "Yes", "Yes/No"] },
  //   { "Staircase Width": ["", "", ""] },
  // ];
  // const skipNumber = [5, 6, 7, 8];

  console.log(submitData?.drawingTableObs?.proposedSitObs, "ADK");

  return (
    <>
      <div className=" mb-3 w-full">
        <p className="font-bold text-lg mb-3">Drawing Scrutiny report</p>
        <div className="nm_Container mb-5 inline-block min-w-full rounded-lg overflow-hidden">
          <table className="min-w-full leading-normal text-center">
            {/* Table Header */}
            <thead className="bg-gradient-to-b from-[#a29bfe] to-[#6c5ce7]">
              <tr className="text-white uppercase tracking-wider">
                <th className="border-r p-3 border-white">Sl. No.</th>
                <th className="border-r border-white">Description</th>
                <th className="border-r border-white">As per G.O.</th>
                <th className="border-r border-white">As on Plan</th>
                <th className="">Observation</th>
              </tr>
            </thead>
            <tbody className="text-gray-900">
              {/* 1st row  */}
              <tr className="bg-gray-200">
                <td className="p-3  border border-l-0 border-black  text-base bg-gray-200">
                  <p className="text-gray-900 break-words font-bold">1</p>
                </td>
                <td className="p-3  border border-black  text-base bg-gray-200">
                  <p className="text-gray-900 break-words font-bold">
                    Proposed Site / Plot area
                  </p>
                </td>
                <td className="p-3  border border-black  text-base bg-gray-200"></td>
                <td className="p-3  border border-black  text-base bg-gray-200">
                  <p className="text-gray-900 break-words font-bold">
                    {plotDetails?.proposedPlotAreaCal ?? ""}
                  </p>
                </td>
                <td className="border border-r-0 border-black  text-base bg-white">
                  <input
                    id="proposedSiteObs"
                    type="text"
                    className="w-full h-14 px-3 py-2 dark:text-black focus:outline-none bg-gray-50"
                    defaultValue={submitData?.drawingTableObs?.proposedSiteObs}
                    placeholder="Write Your Observation"
                    // onChange={handleRoadWideningAreaChange}
                  />
                </td>
              </tr>

              <tr>
                <td className="p-3 border border-l-0 border-black  text-base bg-gray-200">
                  <p className="text-gray-900 break-words font-bold">2</p>
                </td>
                <td className="p-3  border border-black  text-base bg-gray-200">
                  <p className="text-gray-900 break-words font-bold">
                    Access Road Width
                  </p>
                </td>
                <td className="p-3  border border-black  text-base bg-gray-200"></td>
                <td className="p-3  border border-black  text-base bg-gray-200">
                  <p className="text-gray-900 break-words font-bold">
                    {plotDetails?.roadWideningAreaCal ?? ""}
                  </p>
                </td>
                <td className="border border-r-0 border-black  text-base bg-white">
                  <input
                    id="accessRoadWidthObs"
                    type="text"
                    className="w-full px-3 py-2 h-14 dark:text-black focus:outline-none bg-gray-50"
                    defaultValue={
                      submitData?.drawingTableObs?.accessRoadWidthObs
                    }
                    placeholder="Write Your Observation"
                    // onChange={handleRoadWideningAreaChange}
                  />
                </td>
              </tr>
              <tr>
                <td className="p-3 border border-l-0 border-black  text-base bg-gray-200">
                  <p className="text-gray-900 break-words font-bold">3</p>
                </td>
                <td className="p-3  border border-black  text-base bg-gray-200">
                  <p className="text-gray-900 break-words font-bold">
                    Scope of Road windening
                  </p>
                </td>
                <td className="p-3  border border-black  text-base bg-gray-200"></td>
                <td className="p-3  border border-black  text-base bg-gray-200">
                  <p className="text-gray-900 break-words font-bold">
                    {plotDetails?.roadWideningAreaCal ?? ""}
                  </p>
                </td>
                <td className=" border border-r-0 border-black  text-base bg-white">
                  <input
                    id="scopeRoadWideObs"
                    type="text"
                    className="w-full px-3 py-2 h-14 dark:text-black focus:outline-none bg-gray-50"
                    defaultValue={
                      submitData?.drawingTableObs?.scopeOfRoadWideningObs
                    }
                    placeholder="Write Your Observation"
                    // onChange={handleRoadWideningAreaChange}
                  />
                </td>
              </tr>
              <tr>
                <td className="p-3 border border-l-0 border-black text-base bg-gray-200">
                  <p className="text-gray-900 break-words font-bold">4</p>
                </td>
                <td className="p-3  border border-black  text-base bg-gray-200">
                  <p className="text-gray-900 break-words font-bold">
                    Net Site / Plot area
                  </p>
                </td>
                <td className="p-3  border border-black  text-base bg-gray-200"></td>
                <td className="p-3  border border-black  text-base bg-gray-200">
                  <p className="text-gray-900 break-words font-bold">
                    {plotDetails?.netPlotAreaCal ?? ""}
                  </p>
                </td>
                <td className="border border-r-0 border-black text-base bg-white">
                  <input
                    id="netSiteObs"
                    type="text"
                    className="w-full h-14 px-3 py-2  rounded-lg dark:text-black focus:outline-none bg-gray-50"
                    defaultValue={submitData?.drawingTableObs?.netPlotAreaObs}
                    placeholder="Write Your Observation"
                    // onChange={handleRoadWideningAreaChange}
                  />
                </td>
              </tr>
              <tr>
                <td className="p-3 border border-black border-l-0 text-base bg-gray-200">
                  <p className="text-gray-900 break-words font-bold">5</p>
                </td>
                <td className="p-3  border border-black  text-base bg-gray-200">
                  <p className="text-gray-900 break-words font-bold">
                    Building Height
                  </p>
                </td>
                <td className="p-3  border border-black  text-base bg-gray-200"></td>
                <td className="p-3  border border-black  text-base bg-gray-200">
                  <p className="text-gray-900 break-words font-bold">
                    {plotDetails?.buildingExcludeStilt ?? ""}
                  </p>
                </td>
                <td className="border border-black border-r-0 text-base bg-gray-200">
                  <input
                    id="buildingHeightObs"
                    type="text"
                    className="w-full px-3 h-14 dark:text-black focus:outline-none bg-gray-50"
                    defaultValue={
                      submitData?.drawingTableObs?.buildingHeightObs
                    }
                    placeholder="Write Your Observation"
                    // onChange={handleRoadWideningAreaChange}
                  />
                </td>
              </tr>
              <tr>
                <td
                  className="p-3  border border-black border-l-0 text-base bg-gray-200"
                  rowSpan={5}
                >
                  <p className="text-gray-900 break-words font-bold">6</p>
                </td>
                <td
                  className="p-3 border border-black border-r-0 text-base bg-gray-200"
                  colSpan={4}
                >
                  <p className="text-gray-900 break-words font-bold">
                    Setbacks
                  </p>
                </td>
                {/* <td className="p-3  border border-black  text-base bg-gray-200"></td>
                      <td className="p-3  border border-black  text-base bg-gray-200"></td>
                      <td className="border border-black  text-base bg-gray-200">
                        <input
                          id="setBacksObs"
                          type="text"
                          className="w-full px-3 h-14 dark:text-black focus:outline-none bg-gray-50"
                          defaultValue={
                            submitData?.drawingTableObs?.setBacksObs
                          }
                          placeholder="Write Your Observation"
                          // onChange={handleRoadWideningAreaChange}
                        />
                      </td> */}
              </tr>
              <tr>
                <td className="p-3  border border-black  text-base bg-gray-200">
                  <p className="text-gray-900 break-words font-bold">Front</p>
                </td>
                <td className="p-3  border border-black  text-base bg-gray-200">
                  <p className="text-gray-900 break-words font-bold">
                    {preDeterminedValue?.front}
                  </p>
                </td>
                <td className="p-3  border border-black  text-base bg-gray-200">
                  <p className="text-gray-900 break-words font-bold">
                    {plotDetails?.frontSetback ?? ""}
                  </p>
                </td>
                <td className="border border-black border-r-0 text-base bg-gray-200">
                  <input
                    id="frontObs"
                    type="text"
                    className="w-full px-3 h-14 dark:text-black focus:outline-none bg-gray-50"
                    defaultValue={submitData?.drawingTableObs?.fontObs}
                    placeholder="Write Your Observation"
                    // onChange={handleRoadWideningAreaChange}
                  />
                </td>
              </tr>
              <tr>
                {/* <td className="p-3  border border-black  text-base bg-gray-200"></td> */}
                <td className="p-3  border border-black  text-base bg-gray-200">
                  <p className="text-gray-900 break-words font-bold">Rare</p>
                </td>
                <td className="p-3  border border-black  text-base bg-gray-200">
                  <p className="text-gray-900 break-words font-bold">
                    {preDeterminedValue?.rare}
                  </p>
                </td>
                <td className="p-3  border border-black  text-base bg-gray-200">
                  <p className="text-gray-900 break-words font-bold">
                    {plotDetails?.rareSetback ?? ""}
                  </p>
                </td>
                <td className="border border-black border-r-0 text-base bg-gray-200">
                  <input
                    id="rareObs"
                    type="text"
                    className="w-full px-3 h-14 dark:text-black focus:outline-none bg-gray-50"
                    defaultValue={submitData?.drawingTableObs?.rareObs}
                    placeholder="Write Your Observation"
                    // onChange={handleRoadWideningAreaChange}
                  />
                </td>
              </tr>
              <tr>
                {/* <td className="p-3  border border-black  text-base bg-gray-200"></td> */}
                <td className="p-3  border border-black  text-base bg-gray-200">
                  <p className="text-gray-900 break-words font-bold">Side 1</p>
                </td>
                <td className="p-3  border border-black  text-base bg-gray-200">
                  <p className="text-gray-900 break-words font-bold">
                    {preDeterminedValue?.side1}
                  </p>
                </td>
                <td className="p-3  border border-black  text-base bg-gray-200">
                  <p className="text-gray-900 break-words font-bold">
                    {plotDetails?.side1Setback ?? ""}
                  </p>
                </td>
                <td className="border border-black border-r-0 text-base bg-gray-200">
                  <input
                    id="sideOneObs"
                    type="text"
                    className="w-full px-3 h-14 dark:text-black focus:outline-none bg-gray-50"
                    defaultValue={submitData?.drawingTableObs?.sideOneObs}
                    placeholder="Write Your Observation"
                    // onChange={handleRoadWideningAreaChange}
                  />
                </td>
              </tr>
              <tr>
                {/* <td className="p-3  border border-black  text-base bg-gray-200"></td> */}
                <td className="p-3 border border-black text-base bg-gray-200">
                  <p className="text-gray-900 break-words font-bold">Side 2</p>
                </td>
                <td className="p-3 border border-black  text-base bg-gray-200">
                  <p className="text-gray-900 break-words font-bold">
                    {preDeterminedValue?.side2}
                  </p>
                </td>
                <td className="p-3 border border-black text-base bg-gray-200">
                  <p className="text-gray-900 break-words font-bold">
                    {plotDetails?.side2Setback}
                  </p>
                </td>
                <td className="border border-black border-r-0 text-base bg-gray-200">
                  <input
                    id="sideTwoObs"
                    type="text"
                    className="w-full px-3 h-14 dark:text-black focus:outline-none bg-gray-50"
                    defaultValue={submitData?.drawingTableObs?.sideTwoObs}
                    placeholder="Write Your Observation"
                    // onChange={handleRoadWideningAreaChange}
                  />
                </td>
              </tr>
              <tr>
                <td
                  className="p-3 border border-black border-l-0 text-base bg-gray-200"
                  rowSpan={5}
                >
                  <p className="text-gray-900 break-words font-bold">7</p>
                </td>
                <td className="p-3  border border-black  text-base bg-gray-200">
                  <p className="text-gray-900 break-words font-bold">
                    Number of floors
                  </p>
                </td>
                <td className="p-3  border border-black  text-base bg-gray-200"></td>
                <td className="p-3  border border-black  text-base bg-gray-200">
                  <p className="text-gray-900 break-words font-bold">
                    {calculateNoOfFloors(plotDetails?.floorDetails)}
                  </p>
                </td>
                <td className="border border-black border-r-0 text-base bg-gray-200">
                  <input
                    id="numberOfFloorsObs"
                    type="text"
                    className="w-full px-3 h-14 dark:text-black focus:outline-none bg-gray-50"
                    defaultValue={submitData?.drawingTableObs?.floorObs}
                    placeholder="Write Your Observation"
                    // onChange={handleRoadWideningAreaChange}
                  />
                </td>
              </tr>
              <tr>
                {/* <td className="p-3  border border-black  text-base bg-gray-200"></td> */}
                <td className="p-3  border border-black  text-base bg-gray-200">
                  <p className="text-gray-900 break-words font-bold">
                    Stilt Floor
                  </p>
                </td>
                <td className="p-3  border border-black  text-base bg-gray-200"></td>
                <td className="p-3  border border-black  text-base bg-gray-200"></td>
                <td className="border border-black border-r-0 text-base bg-gray-200">
                  <input
                    id="stiltFloorObs"
                    type="text"
                    className="w-full px-3 h-14 dark:text-black focus:outline-none bg-gray-50"
                    defaultValue={submitData?.drawingTableObs?.stiltFloorObs}
                    placeholder="Write Your Observation"
                    // onChange={handleRoadWideningAreaChange}
                  />
                </td>
              </tr>
              <tr>
                {/* <td className="p-3  border border-black  text-base bg-gray-200"></td> */}
                <td className="p-3  border border-black  text-base bg-gray-200">
                  <p className="text-gray-900 break-words font-bold">
                    Ground Floor
                  </p>
                </td>
                <td className="p-3  border border-black  text-base bg-gray-200"></td>
                <td className="p-3  border border-black  text-base bg-gray-200"></td>
                <td className="border border-black border-r-0 text-base bg-gray-200">
                  <input
                    id="groundFloorObs"
                    type="text"
                    className="w-full px-3 h-14 dark:text-black focus:outline-none bg-gray-50"
                    defaultValue={submitData?.drawingTableObs?.groundFloorObs}
                    placeholder="Write Your Observation"
                    // onChange={handleRoadWideningAreaChange}
                  />
                </td>
              </tr>
              <tr>
                {/* <td className="p-3  border border-black  text-base bg-gray-200"></td> */}
                <td className="p-3  border border-black  text-base bg-gray-200">
                  <p className="text-gray-900 break-words font-bold">
                    First Floor
                  </p>
                </td>
                <td className="p-3  border border-black  text-base bg-gray-200"></td>
                <td className="p-3  border border-black  text-base bg-gray-200"></td>
                <td className="border border-black border-r-0 text-base bg-gray-200">
                  <input
                    id="firstFloorObs"
                    type="text"
                    className="w-full px-3 h-14 dark:text-black focus:outline-none bg-gray-50"
                    defaultValue={submitData?.drawingTableObs?.firstFloorObs}
                    placeholder="Write Your Observation"
                    // onChange={handleRoadWideningAreaChange}
                  />
                </td>
              </tr>
              <tr>
                {/* <td className="p-3  border border-black  text-base bg-gray-200"></td> */}
                <td className="p-3  border border-black  text-base bg-gray-200">
                  <p className="text-gray-900 break-words font-bold">
                    Second Floor
                  </p>
                </td>
                <td className="p-3  border border-black  text-base bg-gray-200"></td>
                <td className="p-3  border border-black  text-base bg-gray-200"></td>
                <td className="border border-black border-r-0 text-base bg-gray-200">
                  <input
                    id="secondFloorObs"
                    type="text"
                    className="w-full px-3 h-14 dark:text-black focus:outline-none bg-gray-50"
                    defaultValue={submitData?.drawingTableObs?.secondFloorObs}
                    placeholder="Write Your Observation"
                    // onChange={handleRoadWideningAreaChange}
                  />
                </td>
              </tr>
              <tr>
                <td className="p-3  border border-black border-l-0 text-base bg-gray-200">
                  <p className="text-gray-900 break-words font-bold">8</p>
                </td>
                <td className="p-3  border border-black  text-base bg-gray-200">
                  <p className="text-gray-900 break-words font-bold">
                    Green Strip
                  </p>
                </td>
                <td className="p-3  border border-black  text-base bg-gray-200">
                  <p className="text-gray-900 break-words font-bold">
                    1mtr wide required
                  </p>
                </td>
                <td className="p-3  border border-black  text-base bg-gray-200">
                  <p className="text-gray-900 break-words font-bold">Yes</p>
                </td>
                <td className="border border-black border-r-0 text-base">
                  <select
                    id="greenStripObs"
                    className="w-full py-4 px-2 outline-none bg-gray-50"
                    defaultValue={
                      submitData?.drawingTableObs?.greenStripObs ?? ""
                    }
                  >
                    <option value="">Yes</option>
                    <option>No</option>
                  </select>
                </td>
              </tr>
              <tr>
                <td className="p-3 border border-black border-l-0 text-base bg-gray-200">
                  <p className="text-gray-900 break-words font-bold">9</p>
                </td>
                <td className="p-3  border border-black  text-base bg-gray-200">
                  <p className="text-gray-900 break-words font-bold">
                    Staircase width
                  </p>
                </td>
                <td className="p-3  border border-black  text-base bg-gray-200">
                  <p className="text-gray-900 break-words font-bold">
                    Minimum 2.00 mtr
                  </p>
                </td>
                <td className="p-3  border border-black  text-base bg-gray-200"></td>
                <td className="border border-black border-r-0 text-base bg-gray-200">
                  <input
                    id="stairCaseWidthObs"
                    type="text"
                    className="w-full px-3 h-14 dark:text-black focus:outline-none bg-gray-50"
                    defaultValue={
                      submitData?.drawingTableObs?.stairCaseWidthObs
                    }
                    placeholder="Write Your Observation"
                    // onChange={handleRoadWideningAreaChange}
                  />
                </td>
              </tr>
              <tr>
                <td className="p-3  border border-black border-l-0 border-b-0 text-base bg-gray-200">
                  <p className="text-gray-900 break-words font-bold">10</p>
                </td>
                <td className="p-3  border border-black border-b-0 text-base bg-gray-200">
                  <p className="text-gray-900 break-words font-bold">
                    No. of Units
                  </p>
                </td>
                <td className="p-3  border border-black border-b-0  text-base bg-gray-200">
                  <p className="text-gray-900 break-words font-bold">
                    Maximum 4 no.
                  </p>
                </td>
                <td className="p-3  border border-black border-b-0 text-base bg-gray-200">
                  <p className="text-gray-900 break-words font-bold">
                    {plotDetails?.noOfUnits ?? ""}
                  </p>
                </td>
                <td className="border border-black border-b-0 border-r-0 text-base bg-gray-200">
                  <input
                    id="unitObs"
                    type="text"
                    className="w-full px-3 h-14 dark:text-black focus:outline-none bg-gray-50"
                    defaultValue={submitData?.drawingTableObs?.unitsObs}
                    placeholder="Write Your Observation"
                    // onChange={handleRoadWideningAreaChange}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <DocumentFooter
        setApprovedConfirmation={setApprovedConfirmation}
        setRecommendationMessage={setRecommendationMessage}
        recomendationMessage={recomendationMessage}
        approvedConfirmation={approvedConfirmation}
        submitData={submitData}
      />
    </>
  );
}

export default DrawingTable;
