import React, { useState } from "react";

const FloorDetails = ({
  index,
  floor,
  length,
  increaseFloorNo,
  handleBuiltUpArea,
  handleParkingArea,
  plotDetailsFloor,
  parkingAreaValue,
  builtUpAreaValue,
  floorOptions,
  // handleFloorChange,
  // setFloorTrack,
  // floorTrack,
}) => {
  const [floorChange, setFloorChange] = useState("");
  const [floorTrack, setFloorTrack] = useState([
    { value: "Stilt / Parking Floor", checked: "" },
    { value: "Ground Floor", checked: "" },
    { value: "First Floor", checked: "" },
    { value: "Second Floor", checked: "" },
  ]);

  console.log(floorTrack, "Floor track");

  const handleFloorChange = (e, index) => {
    setFloorChange(e.target.value);

    const floorValue = e.target.value;
    const floorNameIndex = index;

    setFloorTrack((prev) => {
      prev.forEach((item, index) => {
        if (item.value === floorValue) {
          prev[index].checked = floorNameIndex;

          prev.forEach((itm, j) => {
            if (j !== index && prev[j].checked === floorNameIndex) {
              prev[j].checked = "";
            }
          });
        }
      });
      return prev;
    });

    console.log(floorTrack);
  };

  return (
    <>
      <div className="flex flex-col justify-center mx-3">
        <label className="block text-gray-600 mb-1 font-semibold dark:text-gray-100">
          <span>Floor Name</span>
        </label>
        <select
          id={`floorName${index}`}
          name={`floorName${index}`}
          className="w-full px-3 py-[10px] border border-violet-500 rounded-lg max-w-xs dark:text-black focus:border-violetLight focus:outline-none focus:ring-2 ring-violet-200"
          value={floorChange ? floorChange : plotDetailsFloor?.name}
          onChange={(e) => handleFloorChange(e, index)}
        >
          <option disabled selected value="Select Floor Name">
            Select Floor Name
          </option>
          {floorOptions?.length &&
            floorOptions?.map((eachFloor, index) => {
              return (
                <option key={index} value={eachFloor}>
                  {eachFloor}
                </option>
              );
            })}
        </select>
      </div>

      <div className="my-4 mx-3">
        <label
          htmlFor="ProposedPlotArea"
          className="block text-gray-600 mb-1 font-semibold dark:text-gray-100"
        >
          Built up area (in Sq.Mts.)
        </label>
        <input
          type="number"
          id={`builtUpArea${index}`}
          name={`builtUpArea${index}`}
          placeholder="in Sq.Mts."
          className="w-full px-3 py-2 border border-violet-500 rounded-lg max-w-xs dark:text-black focus:border-violetLight focus:outline-none focus:ring-2 ring-violet-200"
          defaultValue={
            builtUpAreaValue ? builtUpAreaValue : plotDetailsFloor?.builtUpArea
          }
          onChange={(e) => handleBuiltUpArea(e.target.value, index)}
        />
      </div>

      <div className="my-4 mx-3">
        <label
          htmlFor="ProposedPlotArea"
          className="block text-gray-600 mb-1 font-semibold dark:text-gray-100"
        >
          Parking Area (in Sq.Mts.)
        </label>
        <input
          type="number"
          id={`parkingArea${index}`}
          name={`parkingArea${index}`}
          placeholder="in Sq.Mts."
          className="w-full px-3 py-2 border border-violet-500 rounded-lg max-w-xs dark:text-black focus:border-violetLight focus:outline-none focus:ring-2 ring-violet-200"
          defaultValue={
            parkingAreaValue ? parkingAreaValue : plotDetailsFloor?.parkingArea
          }
          onChange={(e) => handleParkingArea(e.target.value, index)}
        />
      </div>

      <div className="flex justify-start items-center ml-3 mt-6">
        {index === length - 1 && index < 3 && (
          <div className="flex justify-center items-center">
            <button
              className="text-xl rounded-full w-[30px] h-[30px] bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white cursor-pointer shadow-lg shadow-violetDark transition-all duration-500 hover:shadow-sm hover:shadow-black font-bold"
              onClick={increaseFloorNo}
            >
              +
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default FloorDetails;
