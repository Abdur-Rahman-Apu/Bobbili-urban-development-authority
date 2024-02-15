import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../../AuthProvider/AuthProvider";
import Style from "../../../../Style/AddUserStyle.module.css";

const AddUser = () => {
  const { register, handleSubmit, resetField } = useForm();

  const [userType, setUserType] = useState(null);

  const {
    userInfoFromLocalStorage,
    checkLicenseExpirationOfLtp,
    fetchDataFromTheDb,
  } = useContext(AuthContext);

  const userRole = userInfoFromLocalStorage().role;

  const navigate = useNavigate();

  const [allLocationData, setAllLocationData] = useState([]);
  const [allDistricts, setAllDistricts] = useState([]);
  const [allMandal, setAllMandal] = useState([]);
  const [allPanchayat, setAllPanchayat] = useState([]);

  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedMandal, setSelectedMandal] = useState("");
  const [selectedPanchayat, setSelectedPanchayat] = useState("");

  useEffect(() => {
    (async function () {
      const locationData = await fetchDataFromTheDb(
        "https://residential-building.onrender.com/getDistricts"
      );
      console.log(locationData, "LOC");
      const extractsDataFromDB = locationData[0]?.district;
      setAllLocationData(extractsDataFromDB);
      const districts = extractsDataFromDB?.map((each) => each?.name);
      setAllDistricts(districts);
    })();
  }, []);

  const detectSelectOfDistrict = (e) => {
    setAllMandal([]);
    setAllPanchayat([]);
    setSelectedMandal("");
    setSelectedPanchayat("");

    const chooseDistrict = e.target.value;
    console.log(chooseDistrict);
    setSelectedDistrict(chooseDistrict);

    // Reset the selected value of the Mandal dropdown to "select"
    const mandalSelect = document.getElementById("mandal");
    mandalSelect.value = "";

    const panchayatSelect = document.getElementById("panchayat");
    panchayatSelect.value = "";

    allDistricts.forEach((eachDistrict, index) => {
      if (eachDistrict === chooseDistrict) {
        setAllMandal(allLocationData[index]?.mandal);
      }
    });
  };

  const detectChangeOfMandals = (e) => {
    setAllPanchayat([]);
    setSelectedPanchayat("");

    const panchayatSelect = document.getElementById("panchayat");
    panchayatSelect.value = "";

    const value = e.target.value;
    setSelectedMandal(value);

    const mandalWiseVillage = allMandal.find(
      (eachMandal) => eachMandal?.name === value
    )?.village;

    console.log(mandalWiseVillage);
    setAllPanchayat(mandalWiseVillage);
  };

  const detectChangeOfPanchayat = (e) => {
    setSelectedPanchayat(e.target.value);
  };

  const onSubmit = (data) => {
    console.log(data, "data");
    if (data?.role.toLowerCase().includes("select an option")) {
      toast.error("Please select a role");
    } else {
      let userInfo;

      if (data?.role.toLowerCase() === "ltp") {
        const { validity } = data;

        const isValidate = checkLicenseExpirationOfLtp(validity);

        if (isValidate.length === 10) {
          userInfo = {
            ...data,
            validity: isValidate,
            isLoggedIn: 0,
          };
        } else {
          toast.error(isValidate);
        }
      } else if (data?.role.toLowerCase() === "ps") {
        if (selectedDistrict?.length) {
          if (selectedMandal?.length) {
            if (selectedPanchayat?.length) {
              const address = {
                district: selectedDistrict,
                mandal: selectedMandal,
                gramaPanchayat: selectedPanchayat,
              };

              userInfo = {
                ...data,
                ...address,
                handOver: "false",
                isLoggedIn: 0,
              };
            } else {
              toast.error("Please select a grama panchayat");
            }
          } else {
            toast.error("Please select a mandal");
          }
        } else {
          toast.error("Please select a district");
        }
      } else {
        userInfo = { ...data, isLoggedIn: 0 };
      }

      console.log(userInfo, "USER INFO");

      if (userInfo) {
        // store users data in the database
        fetch("https://residential-building.onrender.com/addUser", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(userInfo),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log(data);

            if (data.acknowledged) {
              toast.success("User added successfully");
              navigate("/dashboard/allUser");
            }
            if (data?.result === 0) {
              console.log(data.message);
              toast.error(data.message);
            }
          })
          .catch(() => {
            toast.error("Server is not responded");
          });
      }
    }
  };

  const handleChangeRole = (e) => {
    const value = e.target.value;
    console.log(value);
    setUserType(e.target.value);
  };

  const handleInputPhone = (e) => {
    // Remove non-numeric characters
    const inputValue = e.target.value.replace(/[^0-9]/g, "");
    // Limit the input to 10 characters
    const truncatedValue = inputValue.slice(0, 10);
    // Update the input field with the sanitized value
    e.target.value = truncatedValue;

    if (truncatedValue.length < 10) {
      e.target.setCustomValidity("Fill up 10 numbers.");
      // e.target.classList.add('errorAdd');
    } else {
      // Reset the error message
      e.target.setCustomValidity("");
    }
  };

  const handleInputAadhar = (e) => {
    const inputValue = e.target.value.replace(/[^0-9]/g, "");
    const truncatedValue = inputValue.slice(0, 12);
    e.target.value = truncatedValue;

    if (truncatedValue.length < 12) {
      e.target.setCustomValidity("Fill up 12 numbers.");
    } else {
      e.target.setCustomValidity("");
    }
  };

  const inputLabel = "block mb-1 font-semibold text-gray-600";
  const inputBox =
    "w-full px-3 py-2 border rounded-lg max-w-xs text-gray-600 bg-gray-50 border-gray-400 focus:border-gray-600 focus:outline-none focus:ring-2 ring-violet-200";

  return (
    <div className="mt-10 text-black">
      <h1 className="text-xl lg:text-3xl text-center font-roboto font-bold text-black">
        Add a New User
      </h1>

      <form
        className="w-[90%] mx-auto mt-10 font-roboto text-lg"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label htmlFor="name" className={inputLabel}>
              Name
            </label>
            <input
              type="text"
              {...register("name", { required: true })}
              id="name"
              className={inputBox}
              placeholder="Enter user name"
              required
            />
          </div>

          <div>
            <label htmlFor="id" className={inputLabel}>
              User ID
            </label>
            <input
              type="text"
              {...register("userId", { required: true })}
              id="id"
              className={inputBox}
              placeholder="Enter user id"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className={inputLabel}>
              Password
            </label>
            <input
              type="text"
              {...register("password", { required: true })}
              id="password"
              className={inputBox}
              placeholder="•••••••••"
              required
            />
          </div>

          <div className="flex flex-col items-center mt-3">
            <label htmlFor="" className={`${inputLabel}`}>
              Gender
            </label>
            <div className="radio-button-container">
              <div className="radio-button">
                <input
                  type="radio"
                  className="radio-button__input"
                  id="male"
                  name="gender"
                  value="male"
                  {...register("gender")}
                  required
                />
                <label className="radio-button__label" htmlFor="male">
                  <span className="radio-button__custom"></span>
                  male
                </label>
              </div>
              <div className="radio-button">
                <input
                  type="radio"
                  className="radio-button__input"
                  id="female"
                  name="gender"
                  value="female"
                  {...register("gender")}
                />
                <label className="radio-button__label" htmlFor="female">
                  <span className="radio-button__custom"></span>
                  female
                </label>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="role" className={inputLabel}>
              Role
            </label>
            <select
              id="role"
              {...register("role", { required: true })}
              className="w-full px-3 py-[10.5px] border rounded-lg max-w-xs text-gray-600 bg-gray-50 border-gray-400 focus:border-gray-600 focus:outline-none focus:ring-2 ring-violet-200"
              onChange={(e) => handleChangeRole(e)}
              required
            >
              <option disabled selected value="">
                Select an option
              </option>
              <option value="LTP">LTP</option>
              <option value="PS">PS</option>
              <option value="UDA">UDA</option>
              {userRole === "Super Admin" && (
                <>
                  <option value="Admin1">Admin1</option>
                  <option value="Admin2">Admin2</option>
                </>
              )}
            </select>
          </div>

          {/* <div>
            <label htmlFor="gender" className={inputLabel}>
              Gender
            </label>
            <select
              id="gender"
              {...register("gender", { required: true })}
              className="w-full px-3 py-[10.5px] border rounded-lg max-w-xs text-gray-600 bg-gray-50 border-gray-400 focus:border-gray-600 focus:outline-none focus:ring-2 ring-violet-200"
            // onChange={(e) => handleChangeRole(e)}
            >
              <option value="Select an option">Select an option</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div> */}

          <div>
            <label htmlFor="email" className={inputLabel}>
              Email
            </label>
            <input
              type="text"
              {...register("email", { required: true })}
              id="email"
              className={inputBox}
              placeholder="test@gmail.com"
              required
            />
          </div>

          <div>
            <label htmlFor="phone" className={inputLabel}>
              Phone no.
            </label>
            <input
              type="text"
              {...register("phone", { required: true })}
              id="phone"
              className={inputBox}
              placeholder="Enter phone no"
              maxLength={10}
              onInput={handleInputPhone}
              required
            />
          </div>

          <div>
            <label htmlFor="address" className={inputLabel}>
              Address
            </label>
            <textarea
              id="address"
              rows="2"
              {...register("address", { required: true })}
              className={inputBox}
              placeholder="Enter address..."
            ></textarea>
          </div>
        </div>

        {/* <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"></div> */}

        {userType === "LTP" && (
          <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label htmlFor="licenseNo" className={inputLabel}>
                License No
              </label>
              <input
                type="text"
                {...register("licenseNo", { required: true })}
                id="licenseNo"
                className={inputBox}
                placeholder="Enter license no"
                required
              />
            </div>

            <div>
              <label htmlFor="adharNo" className={inputLabel}>
                Aadhar no
              </label>
              <input
                type="text"
                {...register("adharNo", { required: true })}
                id="adharNo"
                className={inputBox}
                placeholder="Enter phone no"
                onInput={handleInputAadhar}
                maxLength={12}
                required
              />
            </div>

            <div>
              <label htmlFor="validity" className={inputLabel}>
                Validity
              </label>
              <input
                type="date"
                {...register("validity", { required: true })}
                id="validity"
                className={inputBox}
              />
              {/* <FaRegCalendarAlt className="absolute bottom-[15%] right-[5%] bg-transparent" /> */}
            </div>
          </div>
        )}

        {userType === "PS" && (
          <div className="flex justify-between items-center">
            {/* district  */}
            <div className="basis-[30%]">
              <label htmlFor="district" className={inputLabel}>
                District
              </label>
              <select
                id="district"
                className="w-full px-3 py-[10.5px] border rounded-lg max-w-xs text-gray-600 bg-gray-50 border-gray-400 focus:border-gray-600 focus:outline-none focus:ring-2 ring-violet-200"
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
            <div className="basis-[30%]">
              <label htmlFor="mandal" className={inputLabel}>
                Mandal
              </label>
              <select
                id="mandal"
                className="w-full px-3 py-[10.5px] border rounded-lg max-w-xs text-gray-600 bg-gray-50 border-gray-400 focus:border-gray-600 focus:outline-none focus:ring-2 ring-violet-200"
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
            <div className="basis-[30%]">
              <label htmlFor="panchayat" className={inputLabel}>
                Grama Panchayat
              </label>
              <select
                id="panchayat"
                className="w-full px-3 py-[10.5px] border rounded-lg max-w-xs text-gray-600 bg-gray-50 border-gray-400 focus:border-gray-600 focus:outline-none focus:ring-2 ring-violet-200"
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
          </div>
        )}

        <div className="flex justify-center my-10">
          <button
            type="submit"
            className={`${Style.addButton} bg-gradient-to-b from-[#a29bfe] to-[#6c5ce7]`}
          >
            <span className={`${Style.button__text}`}>Add User</span>
            <span className={`${Style.button__icon}`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                viewBox="0 0 24 24"
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
                stroke="currentColor"
                height="24"
                fill="none"
                className="svg"
              >
                <line y2="19" y1="5" x2="12" x1="12"></line>
                <line y2="12" y1="12" x2="19" x1="5"></line>
              </svg>
            </span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddUser;
