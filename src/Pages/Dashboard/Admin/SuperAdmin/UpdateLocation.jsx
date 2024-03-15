import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  MdOutlineAddLocationAlt,
  MdOutlineWrongLocation,
} from "react-icons/md";
import { AuthContext } from "../../../../AuthProvider/AuthProvider";
import cityImage from "../../../../assets/images/city.png";
import districtImage from "../../../../assets/images/district.png";
import IndiaMapImg from "../../../../assets/images/india.jpg";
import villageImage from "../../../../assets/images/village.png";
import LocationStyle from "./LocationPageStyle.module.css";

const UpdateLocation = () => {
  const { fetchDataFromTheDb } = useContext(AuthContext);
  const [isAddOption, setIsAddOption] = useState(1);

  const [isMandalNeed, setIsMandalNeed] = useState(0);

  const [isVillageNeed, setIsVillageNeed] = useState(0);

  const [allLocationData, setAllLocationData] = useState([]);
  const [allDistricts, setAllDistricts] = useState([]);
  const [allMandal, setAllMandal] = useState([]);
  const [allVillage, setAllVillage] = useState([]);
  const [mandalNames, setMandalNames] = useState([]);
  const [villageNames, setVillageNames] = useState([]);

  const [districtSuggest, setDistrictSuggest] = useState("");
  const [mandalSuggest, setMandalSuggest] = useState("");
  const [villageSuggest, setVillageSuggest] = useState("");

  const setToggleValue = (prevValue, setNewValue) => {
    prevValue === 0 ? setNewValue(1) : setNewValue(0);
  };

  // const inputClass =
  //   "bg-gradient-to-r from-violet-500 to-fuchsia-500 px-6 py-2 font-bold text-white rounded-full cursor-pointer hover:shadow-md hover:shadow-darkViolet hover:bg-gradient-to-l transition-all duration-700";
  const inputClass =
    "nm_Container bg-gradient-to-b from-[#9870F7] to-[#5B4395]  rounded-full px-6 py-2 font-bold text-white rounded-full cursor-pointer  transition-all duration-700";

  const activeTabClass = "text-normalViolet text-base  border-b-normalViolet";

  const swapTheTab = (tabValue) => {
    setIsAddOption(tabValue);
  };

  console.log(isAddOption, "IS EDIT OPTION");

  useEffect(() => {
    (async function () {
      try {
        const locationData = await fetchDataFromTheDb(
          "http://localhost:5000/getDistricts"
        );
        console.log(locationData, "LOC");
        const extractsDataFromDB = locationData[0]?.district;
        setAllLocationData(extractsDataFromDB);
        const districts = extractsDataFromDB?.map((each) => each?.name);
        setAllDistricts(districts);
      } catch (err) {
        toast.error("Server Error");
      }
    })();
  }, []);

  const makeFirstCharacterCapital = (str) => {
    const splitStr = str.split("");
    splitStr[0] = splitStr[0].toUpperCase();
    return splitStr.join("");
  };

  const getInputFieldValue = () => {
    // const districtElement = document.getElementById("district");
    // const mandalElement = document.getElementById("mandal");
    // const villageElement = document.getElementById("village");

    const districtValue = makeFirstCharacterCapital(districtSuggest);
    console.log(districtValue, "District Value");

    // check mandal is available or not

    console.log(mandalSuggest, "Mandal Element");

    if (mandalSuggest?.length) {
      const mandalValue = makeFirstCharacterCapital(mandalSuggest);
      console.log(mandalValue, "Mandal");

      if (villageSuggest?.length) {
        // Check whether the village value is given or not
        const villageValue = makeFirstCharacterCapital(villageSuggest);
        console.log(villageValue);

        // sent district and village value
        return {
          district: districtValue,
          mandal: mandalValue,
          village: villageValue,
        };
      } else {
        // sent district and village name
        return { district: districtValue, mandal: mandalValue };
      }
    } else {
      // Only sent the district into the database

      return { district: districtValue };
    }
  };

  const updateLocation = (e) => {
    console.log(e.target.submit.value, "Action");

    const action = e.target.submit.value;
    e.preventDefault();
    const data = getInputFieldValue();

    let url;
    if (action === "Add") {
      // add location
      console.log(data, "ADD");

      url = `http://localhost:5000/addLocation?data=${JSON.stringify(data)}`;
    } else {
      // remove location
      console.log(data, "Remove");
      url = `http://localhost:5000/removeLocation?data=${JSON.stringify(data)}`;
    }

    fetch(url, {
      method: "PATCH",
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);

        if (result?.response?.acknowledged) {
          toast.success(result?.msg);
        } else {
          toast.error(result?.msg);
        }
      })
      .catch(() => {
        toast.error("Server Failed");
      });
  };

  const setDistrictInputValue = (e) => {
    setDistrictSuggest(e.target.value);
    if (e.target.value.length === 0) {
      setIsMandalNeed(0);
      setAllMandal([]);
      setMandalNames([]);
      setMandalSuggest("");
      if (document.getElementById("mandal")) {
        document.getElementById("mandal").value = "";
      }

      setIsVillageNeed(0);
      setAllVillage([]);
      setVillageSuggest("");
      if (document.getElementById("village")) {
        document.getElementById("village").value = "";
      }
    }
  };

  const setMandalInputValue = (e) => {
    setMandalSuggest(e.target.value);
  };

  const setVillageInputValue = (e) => {
    setVillageSuggest(e.target.value);
  };

  const setSearchItem = (item, searchLabel) => {
    switch (searchLabel) {
      case "d":
        setDistrictSuggest(item);
        break;
      case "m":
        setMandalSuggest(item);
        break;
      case "v":
        setVillageSuggest(item);
        break;
    }
  };

  console.log(districtSuggest, "District suggest");
  console.log(allDistricts, "All district");

  return (
    <>
      <div className="flex justify-center items-center font-roboto min-h-screen transition-all duration-1000">
        {/* container of main div  */}
        <div className="lg:flex lg:min-h-[70%] w-[90%] nm_Container rounded-lg">
          {/* left side  */}
          <div className="basis-1/2 bg-bgColor min-h-full rounded-lg">
            <p className="text-black text-2xl font-roboto font-bold ml-6 my-3">
              Location
            </p>
            <div>
              {/* tab part  */}
              <ul className="flex text-center text-white bg-[#1A1B27] mx-6 rounded-lg p-1">
                <li className={`basis-1/2`} onClick={() => swapTheTab(1)}>
                  <button
                    className={`inline-flex items-center justify-center text-base py-2 w-full ${
                      isAddOption === 1 &&
                      "bg-gradient-to-b from-[#9870F7] to-[#5B4395]  rounded-lg"
                    }`}
                  >
                    <MdOutlineAddLocationAlt className="me-2" size={20} />
                    Add
                  </button>
                </li>
                <li className={`basis-1/2 `} onClick={() => swapTheTab(0)}>
                  <button
                    className={`w-full inline-flex items-center justify-center text-base py-2 ${
                      isAddOption === 0 &&
                      "bg-gradient-to-b from-[#9870F7] to-[#5B4395]  rounded-lg"
                    }`}
                  >
                    <MdOutlineWrongLocation className="me-2" size={20} />
                    Delete
                  </button>
                </li>
              </ul>

              {/* content part  */}

              <form
                className="p-6 "
                onSubmit={(e, isAddOption) => updateLocation(e, isAddOption)}
              >
                {/* district */}
                <div className="relative">
                  <label
                    htmlFor="district"
                    className="block mb-2 text-base text-black"
                  >
                    District
                  </label>
                  <div className="relative mb-6">
                    <div className="absolute inset-y-0 left-0 flex items-center p-3 pointer-events-none">
                      <img
                        className="w-full h-full"
                        src={districtImage}
                        alt="An image which is representing district"
                      />
                    </div>
                    <input
                      type="text"
                      id="district"
                      name="district"
                      value={districtSuggest}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2.5 nm_Inset focus:outline-none"
                      placeholder="Enter district name"
                      onChange={setDistrictInputValue}
                      required
                    />
                  </div>

                  <div className="bg-normalViolet absolute bottom-[-42%] text-white w-[100%] z-[10]">
                    {allDistricts
                      ?.filter((district) => {
                        const searchItem = districtSuggest.toLowerCase();

                        return (
                          searchItem &&
                          district.toLowerCase().startsWith(searchItem) &&
                          searchItem !== district.toLowerCase()
                        );
                      })
                      .map((item) => {
                        return (
                          <div
                            className="py-1 px-2 border-3 border-b-white"
                            key={item}
                            onClick={() => setSearchItem(item, "d")}
                          >
                            {item}
                          </div>
                        );
                      })}
                  </div>
                </div>

                {/* mandal  */}
                {districtSuggest?.length !== 0 && (
                  <div>
                    {/* <label
                    htmlFor="mandal"
                    className="flex items-center mb-2 text-base text-black"
                  >
                    <input
                      type="checkbox"
                      className="toggle toggle-sm me-2"
                      onClick={() =>
                        setToggleValue(isMandalNeed, setIsMandalNeed)
                      }
                    />
                    Mandal
                  </label> */}
                    <div className={`${LocationStyle.switchHolder}`}>
                      <div className={`${LocationStyle.switchLabel}`}>
                        <span className="text-black">Mandal</span>
                      </div>
                      <div className={`${LocationStyle.switchToggle}`}>
                        <input
                          type="checkbox"
                          id="mandal"
                          className="transition-all duration-700"
                          disabled={districtSuggest?.length === 0}
                          onClick={() => {
                            console.log(isMandalNeed, "Is mandal need");
                            setToggleValue(isMandalNeed, setIsMandalNeed);
                            if (isMandalNeed === 0) {
                              console.log(allLocationData, "MandalNeed");
                              console.log(districtSuggest, "districtSuggest");
                              if (districtSuggest?.length) {
                                allLocationData?.filter((item) => {
                                  if (
                                    item?.name?.toLowerCase() ===
                                    districtSuggest.toLocaleLowerCase()
                                  ) {
                                    setAllMandal(item?.mandal);
                                    const mandalNames = item?.mandal?.map(
                                      (item) => item?.name
                                    );

                                    setMandalNames((prev) => {
                                      return [...mandalNames];
                                    });
                                  }
                                });
                              } else {
                                toast.error(
                                  "Enter district name to see autosuggestion"
                                );
                              }
                            } else {
                              setAllMandal([]);
                              setMandalNames([]);
                              setMandalSuggest("");
                              document.getElementById("mandal").value = "";
                              setIsVillageNeed(0);
                              setAllVillage([]);
                              setVillageSuggest("");
                            }
                          }}
                        />
                        <label htmlFor="mandal"></label>
                      </div>
                    </div>
                    {isMandalNeed === 1 && (
                      <div className={`relative mb-6 h-fit`}>
                        <div className="absolute inset-y-0 left-0 flex items-center p-3 pointer-events-none">
                          <img
                            className="w-full h-full"
                            src={cityImage}
                            alt="An image which is representing district"
                          />
                        </div>
                        <input
                          type="text"
                          id="mandal"
                          name="mandal"
                          disabled={districtSuggest?.length === 0}
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2.5 transition-all duration-700 nm_Inset focus:outline-none"
                          placeholder="Enter mandal name"
                          value={mandalSuggest}
                          onChange={setMandalInputValue}
                          required={isMandalNeed && "required"}
                        />
                        <div className="bg-normalViolet absolute text-white w-[100%] z-[10]">
                          {mandalNames
                            ?.filter((mandal) => {
                              const searchItem = mandalSuggest.toLowerCase();
                              const mandalName = mandal?.toLowerCase();
                              console.log(mandal, "MANDAL");
                              return (
                                searchItem &&
                                mandalName.startsWith(searchItem) &&
                                searchItem !== mandalName
                              );
                            })
                            .slice(0, 5)
                            .map((item) => {
                              return (
                                <div
                                  className="py-1 px-2 border-3 border-b-white"
                                  key={item}
                                  onClick={() => setSearchItem(item, "m")}
                                >
                                  {item}
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* vilage  */}
                {isMandalNeed === 1 && (
                  <div>
                    {/* <label
                    htmlFor="village"
                    className="flex items-center mb-2 text-base text-black "
                  >
                    <input
                      type="checkbox"
                      className="toggle toggle-sm me-2"
                      onClick={() =>
                        setToggleValue(isVillageNeed, setIsVillageNeed)
                      }
                    />
                    Village
                  </label> */}
                    <div className={`${LocationStyle.switchHolder}`}>
                      <div className={`${LocationStyle.switchLabel}`}>
                        <span className="text-black">Village</span>
                      </div>
                      <div className={`${LocationStyle.switchToggle}`}>
                        <input
                          type="checkbox"
                          id="village"
                          disabled={
                            districtSuggest?.length === 0 ||
                            mandalSuggest?.length === 0
                          }
                          onClick={() => {
                            setToggleValue(isVillageNeed, setIsVillageNeed);
                            console.log(isVillageNeed, "Is village need");
                            if (isVillageNeed === 0) {
                              console.log(allLocationData, "MandalNeed V");
                              console.log(districtSuggest, "districtSuggest V");
                              console.log(mandalSuggest, "mandalSuggest V");
                              console.log(allMandal, "All mandal v");

                              if (mandalSuggest?.length) {
                                allMandal?.forEach((item) => {
                                  if (
                                    item?.name?.toLowerCase() ===
                                    mandalSuggest.toLowerCase()
                                  ) {
                                    setAllVillage(item?.village);
                                  }
                                });
                              } else {
                                toast.error(
                                  "Enter mandal name to see autosuggestion"
                                );
                              }
                            } else {
                              setVillageSuggest("");
                              document.getElementById("village").value = "";
                            }
                          }}
                        />
                        <label htmlFor="village"></label>
                      </div>
                    </div>
                    {isVillageNeed === 1 && (
                      <div className={`relative mb-6 `}>
                        <div className="absolute inset-y-0 left-0 flex items-center p-3 pointer-events-none">
                          <img
                            className="w-full h-full"
                            src={villageImage}
                            alt="An image which is representing district"
                          />
                        </div>
                        <input
                          type="text"
                          id="village"
                          name="village"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2.5 transition-all duration-700 nm_Inset focus:outline-none"
                          placeholder="Enter village name"
                          value={villageSuggest}
                          onChange={setVillageInputValue}
                          disabled={
                            districtSuggest?.length === 0 ||
                            mandalSuggest?.length === 0
                          }
                          required={isVillageNeed === 1 && "required"}
                        />
                        <div className="bg-normalViolet absolute text-white w-[100%] z-[10]">
                          {allVillage
                            ?.filter((village) => {
                              const searchItem = villageSuggest.toLowerCase();
                              const villageName = village?.toLowerCase();
                              console.log(searchItem, "village");
                              return (
                                searchItem &&
                                villageName.startsWith(searchItem) &&
                                searchItem !== villageName
                              );
                            })
                            .slice(0, 5)
                            .map((item) => {
                              return (
                                <div
                                  className="py-1 px-2 border-3 border-b-white"
                                  key={item}
                                  onClick={() => setSearchItem(item, "v")}
                                >
                                  {item}
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* submit button  */}

                <div className="flex justify-center">
                  <input
                    type="submit"
                    name="submit"
                    value={isAddOption === 1 ? "Add" : "Delete"}
                    className={`${inputClass} hover:bg-gradient-to-l`}
                  />
                </div>
              </form>
            </div>
          </div>

          {/* right side  */}
          <div className="basis-1/2 bg-bgColor min-h-full rounded-lg">
            {/* <Lottie
              animationData={mapAnimation}
              loop={true}
              className="w-full h-full"
            /> */}
            {/* <IndiaMap /> */}
            <img
              src={IndiaMapImg}
              alt="A 3d map of india"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateLocation;
