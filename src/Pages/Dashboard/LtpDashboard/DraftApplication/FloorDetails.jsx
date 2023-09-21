import React from "react";

const FloorDetails = ({
  index,
  floor,
  length,
  increaseFloorNo,
  handleBuiltUpArea,
  handleParkingArea,
}) => {
  // console.log(floorInfo, index);

  console.log(floor, index);

  return (
    <>
      <div className="flex flex-col justify-center mx-3">
        <label className="block text-gray-600 mb-1 font-semibold">
          <span>Floor Name</span>
        </label>
        <select
          id={`floorName${index}`}
          name={`floorName${index}`}
          className="w-full px-3 py-[10px] border border-[#10AC84] rounded-lg max-w-xs"
        >
          <option disabled selected>
            Select Floor Name
          </option>
          <option>Stilt / Parking Floor</option>
          <option>Ground floor</option>
          <option>First Floor</option>
          <option>Second Floor</option>
        </select>
      </div>

      <div className="my-4 mx-3">
        <label
          htmlFor="ProposedPlotArea"
          className="block text-gray-600 mb-1 font-semibold"
        >
          Built up area (in Sq.M.)
        </label>
        <input
          type="number"
          id={`builtUpArea${index}`}
          name={`builtUpArea${index}`}
          placeholder="in Sq.M."
          className="w-full px-3 py-2 border border-green-600 rounded-lg max-w-xs"
          onChange={(e) => handleBuiltUpArea(e.target.value, index)}
        />
      </div>

      <div className="my-4 mx-3">
        <label
          htmlFor="ProposedPlotArea"
          className="block text-gray-600 mb-1 font-semibold"
        >
          Parking Area (in Sq.M.)
        </label>
        <input
          type="number"
          id={`parkingArea${index}`}
          name={`parkingArea${index}`}
          placeholder="in Sq.M."
          className="w-full px-3 py-2 border border-green-600 rounded-lg max-w-xs"
          onChange={(e) => handleParkingArea(e.target.value, index)}
        />
      </div>

      <div className="flex justify-start items-center ml-3 mt-6">
        {index === length - 1 && index < 3 && (
          <div className="flex justify-center items-center">
            <button
              className="text-xl bg-orange-400 rounded-full w-[30px] h-[30px]"
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