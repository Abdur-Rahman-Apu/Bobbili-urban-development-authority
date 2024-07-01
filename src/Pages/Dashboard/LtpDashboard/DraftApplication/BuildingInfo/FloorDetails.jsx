import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { getCookie } from "../../../../../utils/utils";

const FloorDetails = ({
  index,
  floor,
  length,
  increaseFloorNo,
  decreaseFloorNo,
  handleBuiltUpArea,
  handleParkingArea,
  plotDetailsFloor,
  parkingAreaValue,
  builtUpAreaValue,
  floorOptions,
  setFloorOptions,
  individualFloorSelected,
  setIndividualFloorSelected,
  isReadOnly,
}) => {
  const [floorChange, setFloorChange] = useState("select");

  const { role } = JSON.parse(getCookie("loggedUser"));

  const [selectedFloor, setSelectedFloor] = useState("");

  useEffect(() => {
    setSelectedFloor(plotDetailsFloor?.name ?? "select");
  }, [plotDetailsFloor]);

  // a function to find old selected value holding by others floor select boxes and if any option existing return 1 else return 0
  const findOldSelectedValue = (value) => {
    let flag = 0;

    individualFloorSelected.forEach((value) => {
      if (value?.length) {
        flag = 1;
      }
    });

    // console.log(selectedFloor, "SELELELE");

    if (flag === 1) {
      const searchInIndividualFloorSelected = individualFloorSelected.findIndex(
        (floorSelected) => floorSelected === value
      );

      // console.log(searchInIndividualFloorSelected);
      if (searchInIndividualFloorSelected === -1) {
        return 0;
      } else {
        return 1;
      }
    }
  };

  const handleFloorChange = (e, index) => {
    setFloorChange(e.target.value);

    setSelectedFloor(e.target.value);

    setIndividualFloorSelected((prev) => {
      const oldValue = [...prev];

      oldValue[index] = e.target.value;

      return oldValue;
    });
  };

  // console.log(selectedFloor?.length ? selectedFloor : floorChange, "SELECTED");

  const page = JSON.parse(localStorage.getItem("page"));

  const hideBtn =
    page === "submit" ||
    page === "approved" ||
    page === "shortfall" ||
    role.toLowerCase() === "ps";

  // const isAreaDisabled=

  const inputClass =
    "w-full px-3 py-2 border rounded-lg max-w-xs text-gray-600 bg-gray-50 border-gray-400 focus:border-gray-600 focus:outline-none focus:ring-2 ring-violet-200";

  return (
    <>
      <motion.div
        className="flex flex-col justify-center mx-3"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0, transition: { duration: 1 } }}
        viewport={{ once: true }}
      >
        <label className="block mb-1 font-semibold text-gray-600">
          <span>Floor Name</span>
        </label>
        <select
          id={`floorName${index}`}
          name={`floorName${index}`}
          className="w-full px-3 py-[10px] border rounded-lg max-w-xs text-gray-600 bg-gray-50 border-gray-400 focus:border-gray-600 focus:outline-none focus:ring-2 ring-violet-200"
          value={selectedFloor?.length ? selectedFloor : floorChange}
          onChange={(e) => {
            handleFloorChange(e, index);
          }}
          disabled={isReadOnly}
          required
        >
          <option disabled value="select">
            Select Floor Name
          </option>
          {floorOptions?.length &&
            floorOptions?.map((eachFloor, index) => {
              return (
                <option
                  key={index}
                  value={eachFloor}
                  className={`${
                    findOldSelectedValue(eachFloor) ? "hidden" : ""
                  }`}
                >
                  {eachFloor}
                </option>
              );
            })}
        </select>
      </motion.div>

      <motion.div
        className="my-4 mx-3"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0, transition: { duration: 1 } }}
        viewport={{ once: true }}
      >
        <label
          htmlFor="ProposedPlotArea"
          className="block mb-1 font-semibold text-gray-600"
        >
          Built up area (in Sq.Mts.)
        </label>
        <input
          type="number"
          id={`builtUpArea${index}`}
          name={`builtUpArea${index}`}
          placeholder="in Sq.Mts."
          className={inputClass}
          defaultValue={
            builtUpAreaValue ? builtUpAreaValue : plotDetailsFloor?.builtUpArea
          }
          onChange={(e) => handleBuiltUpArea(e.target.value, index)}
          readOnly={isReadOnly}
          required
        />
      </motion.div>

      <motion.div
        className="my-4 mx-3"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0, transition: { duration: 1 } }}
        viewport={{ once: true }}
      >
        <label
          htmlFor="ProposedPlotArea"
          className="block mb-1 font-semibold text-gray-600"
        >
          Parking Area (in Sq.Mts.)
        </label>
        <input
          type="number"
          id={`parkingArea${index}`}
          name={`parkingArea${index}`}
          placeholder="in Sq.Mts."
          className={inputClass}
          defaultValue={
            parkingAreaValue ? parkingAreaValue : plotDetailsFloor?.parkingArea
          }
          onChange={(e) => handleParkingArea(e.target.value, index)}
          readOnly={isReadOnly}
          required
        />
      </motion.div>

      {role.toLowerCase() === "ltp" && (
        <div className="flex justify-start items-center ml-7 mt-7">
          {index === length - 1 && index < 3 && (
            <motion.div
              className="flex justify-center items-center"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0, transition: { duration: 2 } }}
              viewport={{ once: true }}
            >
              <button
                className={`nm_Container text-xl rounded-full w-[30px] h-[30px] text-normalViolet cursor-pointer transition-all duration-500 hover:shadow-sm hover:shadow-black font-bold ${
                  hideBtn && "hidden"
                }`}
                onClick={increaseFloorNo}
              >
                +
              </button>
            </motion.div>
          )}

          {index === length - 1 && index > 0 && index <= 3 && (
            <motion.div
              className="flex justify-center items-center"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0, transition: { duration: 2 } }}
              viewport={{ once: true }}
            >
              <button
                className={`nm_Container text-xl mx-2 rounded-full text-red-500 w-[30px] h-[30px]  transition-all duration-500 font-bold ${
                  hideBtn && "hidden"
                }`}
                onClick={decreaseFloorNo}
              >
                -
              </button>
            </motion.div>
          )}
        </div>
      )}
    </>
  );
};

export default FloorDetails;
