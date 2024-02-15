import React, { useContext, useEffect, useState } from "react";
import ApplicationHeader from "./ApplicationHeader";
import { AuthContext } from "../../../../AuthProvider/AuthProvider";
import { RxCross2 } from "react-icons/rx";

function Application({ setOpenApplication, filteredData }) {
  const { getApplicationData, ownerNamePattern, calculateNoOfFloors } =
    useContext(AuthContext);
  const applicationNo = JSON.parse(localStorage.getItem("CurrentAppNo"));
  const page = JSON.parse(localStorage.getItem("page"));
  const [generalInformation, setGeneralInformation] = useState({});
  const [plotDetails, setPlotDetails] = useState({});
  const [ltpDetailsData, setLtpDetailsData] = useState({});
  const [applicantDetailsData, setApplicantDetailsData] = useState([]);

  useEffect(() => {
    // Opening the modal when the component mounts
    const modal = document.getElementById("my_modal_5");
    if (modal) {
      modal.showModal();
    }
  }, []);

  const handleModalClick = () => {
    setOpenApplication(false);
  };

  useEffect(() => {
    if (filteredData) {
      setGeneralInformation(filteredData?.buildingInfo?.generalInformation);
      setPlotDetails(filteredData?.buildingInfo?.plotDetails);
      setLtpDetailsData(filteredData?.applicantInfo?.ltpDetails);
      setApplicantDetailsData(filteredData?.applicantInfo?.applicantDetails);
    } else {
      const gettingData = async () => {
        let applicationData;
        if (filteredData) {
          applicationData = filteredData;
        } else {
          applicationData = await getApplicationData(applicationNo, page);
        }

        console.log(applicationData, "ApplicationData");
        setGeneralInformation(
          applicationData?.buildingInfo?.generalInformation
        );
        setPlotDetails(applicationData?.buildingInfo?.plotDetails);
        setLtpDetailsData(applicationData?.applicantInfo?.ltpDetails);
        setApplicantDetailsData(
          applicationData?.applicantInfo?.applicantDetails
        );
      };
      gettingData();
    }
  }, [filteredData, applicationNo, page]);

  // ====Applicant Info
  const Part01 = [
    { "Name(in full)": ownerNamePattern(applicantDetailsData) },
    {
      Address: `${applicantDetailsData[0]?.ownerDoorNo}, ${applicantDetailsData[0]?.ownerStreetNo}`,
    },
    { "Phone / Mobile No.": applicantDetailsData[0]?.phone },
    { "E-mail": applicantDetailsData[0]?.email },
  ];

  const Part02 = [
    { "Survey No": generalInformation?.surveyNo },
    { "L.P Mo./LRS No.": generalInformation.lrsNo },
    { "Plot No": generalInformation?.plotNo },
    { Village: generalInformation?.village },
    { "Grama Panchayat": generalInformation?.gramaPanchayat },
    { Mandal: generalInformation?.mandal },
    { District: generalInformation?.district },
  ];

  const extractFloorInfo = (allFloors, searchFloor) => {
    console.log(allFloors, searchFloor, "Search floor");
    const findFloorInfo = allFloors?.find((floor) =>
      floor?.name?.includes(searchFloor)
    );
    console.log(findFloorInfo, "FFI");
    return findFloorInfo;
  };

  // Part01 && Part02 Keys and Values
  const renderCol = (data, index, type) => {
    console.log(data, "data");
    const keys = type === "keys";
    const isArray = Array.isArray(data);
    if (isArray) {
      return (
        <td
          className={`p-3 border-t border-black text-sm ${type === "keys" && "w-1/3"
            } p-0`}
        >
          <div className="flex">
            {data?.map((e, i) => (
              <p
                key={i}
                className={`flex items-center p-2 border-l border-black h-12 ${i === 0 && "w-1/2 border-l-0 bg-white font-bold"
                  }`}
              >
                {(keys ? Object.keys(data[i]) : Object.values(data[i])) || e}
              </p>
            ))}
          </div>
        </td>
      );
    } else {
      return (
        <td
          className={` border-t border-black text-sm ${type === "keys" && "w-1/3"
            } p-0 font-bold bg-white`}
        >
          <p className="h-12 p-2 flex items-center border-l border-black">
            {keys ? Object.keys(data) : Object.values(data)}
          </p>
        </td>
      );
    }
  };

  return (
    <div
      className={`relative w-full h-full text-black transition-all duration-1000`}
    >
      <dialog id="my_modal_5" className="modal">
        <div
          className={`ScrollingHidden relative overflow-hidden overflow-y-auto modal-box w-full max-w-4xl p-14 bg-white`}
        >
          <form method="dialog" className="absolute top-6 right-6 z-50">
            <button
              onClick={() => setOpenApplication(false)}
              className={`outline outline-red-500 outline-offset-4 text-red-500 rounded-full hover:bg-red-500 hover:text-white hover:outline-offset-0 p-[1px] transition-all duration-1000`}
            >
              <RxCross2 className="text-2xl" />
            </button>
          </form>

          <div className="z-[10]">
            {/* Header */}
            <ApplicationHeader />
            <div>
              {/* Part01 */}
              <div>
                <div className="container mx-auto px-4 font-roboto ">
                  <div className="py-4">
                    <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 ">
                      <div className="inline-block min-w-full nm_Container rounded-lg overflow-hidden">
                        <table className="min-w-full leading-normal text-center ">
                          {/* Part01 head */}
                          <thead className="bg-[#8B5BF6]  border-black text-black dark:text-white">
                            <tr className="text-lg font-bold text-black uppercase">
                              <th className="p-3 border-b-2 border-gray-200  text-white text-sm font-semibold uppercase tracking-wider">
                                A
                              </th>
                              <th
                                colSpan={5}
                                className="p-3 border-b-2 border-gray-200  text-white  text-sm font-semibold uppercase tracking-wider"
                              >
                                Address of the Applicant
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {/* row 1 */}
                            {Part01.map((item, index) => {
                              return (
                                <tr
                                  key={index + 1}
                                  className="bg-white text-center"
                                >
                                  {/* col-01 */}
                                  <td className="border-t border-black text-sm font-bold">
                                    {index + 1}
                                  </td>
                                  {/* col-02 */}
                                  {renderCol(item, index, "keys")}
                                  {/* col-03 */}
                                  {renderCol(item, index, "values")}
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Part02 */}
              <div className="text-black z-[10]">
                <div className="container mx-auto px-4 font-roboto ">
                  <div className="py-4">
                    <div className="-mx-4 sm:-mx-8 px-4 sm:px-8">
                      <div className="inline-block min-w-full nm_Container rounded-lg overflow-hidden">
                        <table className="min-w-full leading-normal text-center ">
                          {/* Part02 head */}
                          <thead className="bg-normalViolet">
                            <tr className="text-lg font-bold text-black uppercase">
                              <th className="p-3 border-b-2 border-gray-200  text-white text-sm font-semibold uppercase tracking-wider">
                                B
                              </th>
                              <th
                                colSpan={5}
                                className="p-3 border-b-2 border-gray-200  text-white text-sm font-semibold uppercase tracking-wider"
                              >
                                Location of the Proposed Site
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {/* row 1 */}
                            {Part02.map((item, index) => {
                              return (
                                <tr key={index} className="">
                                  {/* col-01 */}
                                  <td className="bg-white border-t text-sm font-bold border-black w-[10%]">
                                    {index + 1}
                                  </td>
                                  {/* col-02 */}
                                  {renderCol(item, index, "keys")}
                                  {/* col-03 */}
                                  {renderCol(item, index, "values")}
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Part 03 */}
            <div className="my-10 z-[-10]">
              <div className="container mx-auto px-4 font-roboto ">
                <div>
                  <div className="-mx-4 sm:-mx-8 px-4 sm:px-8">
                    <div className="inline-block min-w-full nm_Container rounded-lg overflow-hidden">
                      <table className="min-w-full leading-normal text-center font-bold">
                        <thead className="bg-normalViolet">
                          <tr>
                            <th className="p-3 border-b-2 border-gray-200  text-white  text-sm font-semibold uppercase tracking-wider">
                              C
                            </th>
                            <th
                              colSpan="5"
                              className="p-3 border-b-2 border-gray-200  text-white  text-sm font-semibold uppercase tracking-wider"
                            >
                              Details of Licensed Technical Person
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="text-sm ">
                            <td className="p-2 font-bold border border-l-0 border-black">
                              #
                            </td>
                            <td className="p-2 font-bold border border-black">
                              Name
                            </td>
                            <td className="p-2 font-bold border border-black">
                              Address
                            </td>
                            <td className="p-2 font-bold border border-black">
                              License No.
                            </td>
                            <td className="p-2 font-bold border border-r-0 border-black">
                              Validity
                            </td>
                          </tr>
                          <tr className="text-center">
                            <td className="p-3  border border-black border-b-0 border-l-0 text-sm">
                              01
                            </td>
                            <td className="p-3  border border-black border-b-0 text-sm">
                              {ltpDetailsData?.name}
                            </td>
                            <td className="p-3  border border-black border-b-0 text-sm">
                              {ltpDetailsData?.address}
                            </td>
                            <td className="p-3  border border-black border-b-0 text-sm">
                              {ltpDetailsData?.licenseNo}
                            </td>
                            <td className="p-3  border border-black border-r-0 border-b-0 text-sm">
                              {ltpDetailsData?.validity}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Part 04 */}
            <div className="my-16">
              <div className="container mx-auto px-4 font-roboto ">
                <div>
                  <div className="-mx-4 sm:-mx-8 px-4 sm:px-8">
                    <div className="inline-block min-w-full nm_Container rounded-lg overflow-hidden">
                      <table className="table bg-white table-sm font-bold">
                        {/* Part 04 head */}
                        <thead className="bg-normalViolet text-white">
                          <tr className="text-lg font-bold uppercase">
                            <th className="p-3 border-b-2 border-gray-200  text-white text-center text-sm font-semibold uppercase tracking-wider w-[10%]">
                              D
                            </th>
                            <th
                              colSpan={5}
                              className="p-3 border-b-2 border-gray-200  text-white text-center text-sm font-semibold uppercase tracking-wider"
                            >
                              Details of the Proposed Construction
                            </th>
                          </tr>
                        </thead>
                        <tbody className="text-start">
                          <tr>
                            <td className="border border-l-0 border-black font-bold text-center w-[10%]">
                              01
                            </td>
                            <td className="border border-black font-bold text-center w-[30%]">
                              Site Area (Sq.mtr.)
                            </td>
                            <td className="p-0 border-0 border-r border-black">
                              <td className="border-0 border-b border-black font-bold text-center w-full block">
                                As per Document
                              </td>
                              <td className="border-0 border-b border-black font-bold text-center w-full block">
                                As on Ground
                              </td>
                              <td className="border-0 font-bold text-center w-full block">
                                As on Proposed
                              </td>
                            </td>
                            <td className="p-0 border-0 border-y border-black">
                              <td className="border-0 border-b border-black text-center w-full block">
                                {plotDetails?.totalPlotDocument}
                              </td>
                              <td className="border-0 border-b border-black text-center w-full block">
                                {plotDetails?.totalPlotGround}
                              </td>
                              <td className="border-0 text-center w-full block">
                                {plotDetails?.proposedPlotAreaCal}
                              </td>
                            </td>
                          </tr>
                          <tr>
                            <td className="border border-l-0 border-black text-center font-bold">
                              02
                            </td>
                            <td className="border border-black font-bold text-center capitalize">
                              Total Number of floors
                            </td>
                            <td
                              className="border border-r-0 border-black text-center"
                              colSpan={2}
                            >
                              {calculateNoOfFloors(plotDetails?.floorDetails)}
                            </td>
                          </tr>
                          <tr>
                            <td className="p-3  border-b border-gray-200 text-sm"></td>
                            <td className="p-3  border-b border-gray-200 text-sm"></td>
                            <td className="p-3  border-b border-gray-200 text-sm"></td>
                            <td className="p-3  border-b border-gray-200 text-sm"></td>
                          </tr>
                          <tr className="text-white">
                            <td className="bg-normalViolet"></td>
                            <td className="font-bold text-center bg-normalViolet">
                              Floor Name
                            </td>
                            <td className="font-bold text-center capitalize bg-normalViolet">
                              Built up area
                            </td>
                            <td className="font-bold text-center capitalize bg-normalViolet">
                              Parking Area
                            </td>
                          </tr>
                          <tr className="text-sm">
                            <td className="border border-l-0 border-black font-bold text-center ">
                              a
                            </td>
                            <td className="border border-black font-bold text-center capitalize">
                              Stilt Floor (sq. mtr.)
                            </td>
                            <td className="border border-black text-center">
                              {
                                extractFloorInfo(
                                  plotDetails?.floorDetails,
                                  "Stilt"
                                )?.builtUpArea
                              }
                            </td>
                            <td className="border-b border-black text-center">
                              {
                                extractFloorInfo(
                                  plotDetails?.floorDetails,
                                  "Stilt"
                                )?.parkingArea
                              }
                            </td>
                          </tr>
                          <tr className="text-sm">
                            <td className="border-b border-black font-bold text-center">
                              b
                            </td>
                            <td className="border border-black text-center font-bold capitalize">
                              Ground floor (sq.mtr.)
                            </td>
                            <td className="border border-black text-center">
                              {" "}
                              {
                                extractFloorInfo(
                                  plotDetails?.floorDetails,
                                  "Ground"
                                )?.builtUpArea
                              }
                            </td>
                            <td className="border-b border-black text-center">
                              {" "}
                              {
                                extractFloorInfo(
                                  plotDetails?.floorDetails,
                                  "Ground"
                                )?.parkingArea
                              }
                            </td>
                          </tr>
                          <tr className="text-sm">
                            <td className="border-b border-black font-bold text-center">
                              c
                            </td>
                            <td className="border border-black font-bold text-center capitalize">
                              First floor (sq.mtr.)
                            </td>
                            <td className="border border-black text-center">
                              {" "}
                              {
                                extractFloorInfo(
                                  plotDetails?.floorDetails,
                                  "First"
                                )?.builtUpArea
                              }
                            </td>
                            <td className="border-b border-black text-center">
                              {" "}
                              {
                                extractFloorInfo(
                                  plotDetails?.floorDetails,
                                  "First"
                                )?.parkingArea
                              }
                            </td>
                          </tr>
                          <tr className="text-sm">
                            <td className="border-b border-black font-bold text-center">
                              d
                            </td>
                            <td className="border border-black font-bold text-center capitalize">
                              Second floor (sq.mtr.)
                            </td>
                            <td className="border border-black text-center">
                              {" "}
                              {
                                extractFloorInfo(
                                  plotDetails?.floorDetails,
                                  "Second"
                                )?.builtUpArea
                              }
                            </td>
                            <td className="border-b border-black text-center">
                              {" "}
                              {
                                extractFloorInfo(
                                  plotDetails?.floorDetails,
                                  "Second"
                                )?.parkingArea
                              }
                            </td>
                          </tr>
                          <tr>
                            <td className="p-3 border-b border-black text-sm"></td>
                            <td className="p-3 border-b border-black text-sm"></td>
                            <td className="p-3 border-b border-black text-sm"></td>
                            <td className="p-3 border-b border-black text-sm"></td>
                          </tr>
                          <tr className="text-sm">
                            <td className="border-b border-black font-bold text-center">
                              03
                            </td>
                            <td className="border border-black font-bold text-center capitalize">
                              Total Built-up area and parking area (sq.mtr.)
                            </td>
                            <td className="border border-black text-center">
                              {plotDetails?.totalBuiltUpArea}
                            </td>
                            <td className="border-b border-black text-center">
                              {plotDetails?.totalParkingArea}
                            </td>
                          </tr>
                          <tr className="text-sm">
                            <td className="border-b border-black font-bold text-center">
                              04
                            </td>
                            <td className="border border-black font-bold text-center capitalize">
                              Numbers Of Units
                            </td>
                            <td
                              className="border-b border-black text-center"
                              colSpan={2}
                            >
                              {plotDetails?.noOfUnits}
                            </td>
                          </tr>
                          <tr className="text-sm">
                            <td className="font-bold text-center">05</td>
                            <td className="border border-b-0 border-black font-bold text-center capitalize">
                              Vacant site area
                            </td>
                            <td className="text-center" colSpan={2}>
                              {plotDetails?.vacantLand}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 ">
              <div className="ps-4">
                <p className="font-bold">Primary</p>
                <p>
                  I hereby declare that I am the owner/ PAH in possession of the
                  plot on which the work is proposed and that the statement made
                  in this form is true and correct to the best of my knowledge.
                </p>
              </div>
              <div>
                <div className="container mx-auto px-4 font-roboto ">
                  <div className="py-4">
                    <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4">
                      <div className="inline-block min-w-full nm_Container rounded-lg overflow-hidden">
                        <table className="min-w-full leading-normal text-center">
                          <thead className="bg-normalViolet text-white">
                            <tr className="text-base font-bold uppercase">
                              <th colSpan={5} className="p-1">
                                Signature
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="text-base">
                              <td
                                className="border-b border-black font-bold text-center p-1"
                                style={{ width: "10%" }}
                              >
                                01
                              </td>
                              <td
                                className="border border-black font-bold text-center p-1"
                                style={{ width: "40%" }}
                              >
                                Signature of Owner
                              </td>
                              <td
                                className="border-b border-black p-1"
                                style={{ width: "50%" }}
                              ></td>
                            </tr>
                            <tr className="text-base">
                              <td
                                className="font-bold text-center p-1"
                                style={{ width: "10%" }}
                              >
                                02
                              </td>
                              <td
                                className="border border-b-0 border-black font-bold text-center p-1"
                                style={{ width: "40%" }}
                              >
                                Signature of the LTP
                              </td>
                              <td className="" style={{ width: "50%" }}></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <form
            method="dialog"
            className="flex justify-center items-center mt-6"
          >
            <button
              onClick={() => setOpenApplication(false)}
              className={`flex justify-center items-center text-base rounded-full bg-violet-500 text-white border-2 border-violet-500  px-4 py-2 transition-all duration-1000 font-bold fancy-button`}
            >
              <span className="">Close</span>
              {/* <RxCross2 className="text-xl ms-1 rounded-full" /> */}
            </button>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button
            onClick={() => {
              setOpenApplication(false);
            }}
          >
            close
          </button>
        </form>
      </dialog>
    </div>
  );
}

export default Application;
