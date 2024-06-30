import { motion } from "framer-motion";
import React, { useContext, useEffect, useState } from "react";
import { BiSolidUserDetail } from "react-icons/bi";
import { FaBuildingUser } from "react-icons/fa6";
import { useOutletContext } from "react-router";
import { AuthContext } from "../../../../../AuthProvider/AuthProvider";
import InputField from "../../../../Components/InputField";
import useGetUser from "../../../../CustomHook/useGetUser";
import SaveData from "../SaveData";
import OwnerDetail from "./OwnerDetail";

const ApplicantInfo = () => {
  const stepperData = useOutletContext();
  const [isStepperVisible, currentStep, steps] = stepperData;

  const {
    userInfoFromLocalStorage,
    confirmAlert,
    sendUserDataIntoDB,
    getApplicationData,
    stepCompleted,
  } = useContext(AuthContext);

  const role = userInfoFromLocalStorage().role;

  const [data] = useGetUser();

  const isReadOnly = role === "PS";

  const applicationNo = JSON.parse(localStorage.getItem("CurrentAppNo"));

  const cameFrom = JSON.parse(localStorage.getItem("page"));

  const [ltpDetails, setLtpDetails] = useState("");
  const [applicantDetails, setApplicantDetails] = useState("");

  const [ltpPhone, setLtpPhone] = useState("");

  const [ltpType, setLtpType] = useState("");

  const [totalApplicant, setTotalApplicant] = useState(["Owner1"]);

  const increaseApplicantNo = () => {
    const newOwner = `Owner${totalApplicant.length + 1}`;
    setTotalApplicant((prev) => [...prev, newOwner]);
  };

  const decreaseApplicationNo = () => {
    totalApplicant.pop();
    setTotalApplicant([...totalApplicant]);
  };

  const handleLtpType = (e) => {
    const value = e.target.value;

    if (!value?.includes("Select")) {
      setLtpType(value);
    }
  };

  const setPhoneNoLimit = (e, setPhoneNo) => {
    const value = e.target.value;
    console.log(value, "value");
    // Check if the Applicant Phone No Input value contains only digits and is not longer than 10 characters

    console.log(/^\d*$/.test(value));
    if (/^\d*$/.test(value) && value.length <= 10) {
      setPhoneNo(value);
    } else {
      e.target.value = ltpPhone;
    }
  };

  const handleApplicantInfoData = async (url) => {
    // ====================LTP’s Details

    const ltpName = document.getElementById("ltpName").value;
    const licenseNo = document.getElementById("licenseNo").value;
    const validity = document.getElementById("validity").value;
    const ltpPhoneNo = document.getElementById("ltpPhoneNo").value;
    const ltpEmail = document.getElementById("ltpEmail").value;
    const ltpAddress = document.getElementById("ltpAddress").value;

    const ownerDetail = totalApplicant.map((applicant, index) => {
      return {
        name: document.getElementById(`applicantName${index}`).value,
        identity: document.getElementById(`soWoCo${index}`).value,
        phone: document.getElementById(`applicantPhoneNo${index}`).value,
        email: document.getElementById(`applicantEmail${index}`).value,
        adharNo: document.getElementById(`applicantAadharNo${index}`).value,
        pinCode: document.getElementById(`applicantPinCode${index}`).value,
        ownerDoorNo: document.getElementById(`ownerDoorNo${index}`).value,
        ownerStreetNo: document.getElementById(`ownerStreetNo${index}`).value,
      };
    });

    const ltpDetails = {
      type: ltpType,
      name: ltpName,
      licenseNo,
      validity,
      phoneNo: ltpPhoneNo,
      email: ltpEmail,
      address: ltpAddress,
    };

    const applicantInfo = {
      ltpDetails,
      applicantDetails: ownerDetail,
    };

    stepCompleted.current =
      stepCompleted.current > 2 ? stepCompleted.current : 2;

    return await sendUserDataIntoDB(url, "PATCH", {
      applicationNo,
      applicantInfo,
      prevSavedState: stepCompleted.current,
    });
  };

  const [isDataGet, setIsDataGet] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (data && Object.keys(data)?.length) {
      setLtpDetails(data);
    }
  }, [data]);

  useEffect(() => {
    const getData = async () => {
      const applicationData = await getApplicationData(applicationNo, cameFrom);
      const ltpDetailsData = applicationData?.applicantInfo?.ltpDetails;
      const applicantDetailsData =
        applicationData?.applicantInfo?.applicantDetails;

      setApplicantDetails(applicantDetailsData);
      setLtpType(ltpDetailsData?.type);
      setLtpPhone(ltpDetailsData?.phoneNo);
    };
    getData();
  }, []);

  console.log(data, "user data");
  console.log(ltpType, "ltp type");

  // useEffect(() => {
  //   if (role === "LTP" && isDataGet) {
  //     setLtpDetails(data);
  //   }
  // }, [isDataGet]);

  useEffect(() => {
    if (applicantDetails?.length) {
      applicantDetails.forEach((value, index) => {
        if (index > 0 && totalApplicant?.length < applicantDetails?.length) {
          console.log(index, "INDEX");
          setTotalApplicant((prev) => {
            return [...prev, `Owner${index + 1}`];
          });
        }
      });
    }
  }, [applicantDetails]);

  const { designation, name, email, licenseNo, phone, validity, address } =
    ltpDetails || {};

  // Classes for this component :
  let labelClass = "block mb-1 font-semibold text-gray-600";
  const inputClass =
    "w-full px-3 py-2 border rounded-lg max-w-xs text-gray-600 bg-gray-50 border-gray-400 focus:border-gray-600 focus:outline-none focus:ring-2 ring-violet-200";

  return (
    <div className="grid m-4 lg:my-0 text-gray-900">
      <form
        action=""
        onSubmit={(e) => {
          e.preventDefault();
          confirmAlert(stepperData, handleApplicantInfoData);
        }}
      >
        {/* LTP’s Details  */}
        <motion.div
          className="nm_Container mt-3 px-2 py-5 mb-10"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0, transition: { duration: 2 } }}
          viewport={{ once: true }}
        >
          <motion.div
            className="flex items-center -mb-2 px-2"
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0, transition: { duration: 1 } }}
            viewport={{ once: true }}
          >
            <BiSolidUserDetail size={30} className="text-normalViolet" />
            <h3 className="font-bold text-xl ml-3">LTP’s Details</h3>
          </motion.div>

          <div className="px-2">
            <hr className="w-full h-[1.5px] inline-block bg-gray-400" />
          </div>

          <div className="lg:flex -mt-2">
            <div className="grid grid-cols-2 lg:grid-cols-3 basis-[75%]">
              {/* <InputField
                id="ltpType"
                name="ltpType"
                label="LTP Type"
                placeholder="Licensed Engineer"
                ltpDetails={designation}
                isAlwaysHide={1}
              /> */}

              <motion.div
                className="my-4 mx-3 flex flex-col justify-between"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0, transition: { duration: 1 } }}
                viewport={{ once: true }}
              >
                <label
                  htmlFor="ltpType"
                  className="block mb-1 font-semibold text-gray-600"
                >
                  LTP Type
                </label>
                <select
                  id="caseType"
                  className={inputClass}
                  value={ltpType}
                  onChange={handleLtpType}
                  disabled={isReadOnly}
                  required
                >
                  <option disabled value="">
                    Select LTP type
                  </option>
                  <option value="Surveyor">Surveyor</option>
                  <option value="Engineer">Engineer</option>
                  <option value="Structural Engineer">
                    Structural Engineer
                  </option>
                  <option value="Architecture">Architecture</option>
                  <option value="Town Planner">Town Planner</option>
                </select>
              </motion.div>

              <InputField
                id="ltpName"
                name="ltpName"
                label="LTP Name"
                placeholder="xxxxxxxxxxxxxxxxx"
                ltpDetails={name}
                isAlwaysHide={1}
              />
              <InputField
                id="licenseNo"
                name="licenseNo"
                label="Licence no."
                placeholder="xx/xxxxx"
                type="text"
                ltpDetails={licenseNo}
                isAlwaysHide={1}
              />

              <InputField
                id="validity"
                name="validity"
                label="Validity"
                type="text"
                ltpDetails={validity}
                isAlwaysHide={1}
              />

              <motion.div
                className="my-4 mx-3"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0, transition: { duration: 1 } }}
                viewport={{ once: true }}
              >
                <label htmlFor="ltpPhoneNo" className={labelClass}>
                  Phone no.
                </label>
                <input
                  id="ltpPhoneNo"
                  type="text"
                  name="ltpPhoneNo"
                  placeholder="xxxxxxxxxx"
                  defaultValue={phone}
                  onChange={(e) => setPhoneNoLimit(e, setLtpPhone)}
                  className={inputClass}
                  maxLength={10}
                  readOnly={true}
                  required
                />
              </motion.div>

              <InputField
                id="ltpEmail"
                name="ltpEmail"
                label="E-mail"
                placeholder="xxxx@gmail.com"
                type="email"
                ltpDetails={email}
                isAlwaysHide={1}
              />
            </div>

            <motion.div
              className="my-4 mx-3 basis-[25%]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0, transition: { duration: 1 } }}
              viewport={{ once: true }}
            >
              <label htmlFor="ltpAddress" className={labelClass}>
                Address
              </label>
              <textarea
                id="ltpAddress"
                name="ltpAddress"
                rows="4"
                className={inputClass}
                defaultValue={address}
                placeholder="Dr. no., Street, Village, Mandal, Dist."
                readOnly={true}
                required
              ></textarea>
            </motion.div>
          </div>
        </motion.div>

        {/* Owner’s Details  */}
        <motion.div
          className="nm_Container mt-3 px-2 py-5"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0, transition: { duration: 2 } }}
          viewport={{ once: true }}
        >
          <motion.div
            className="flex items-center -mb-2 px-2"
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0, transition: { duration: 1 } }}
            viewport={{ once: true }}
          >
            <FaBuildingUser size={30} className="text-normalViolet" />
            <h3 className="font-bold text-xl ml-3">Owner’s Details</h3>
          </motion.div>

          <div className="px-2">
            <hr className="w-full h-[1.5px] inline-block bg-gray-400" />
          </div>

          <div className="-mt-2">
            {totalApplicant?.map((applicantNo, index) => (
              <OwnerDetail
                key={index}
                index={index}
                labelClass={labelClass}
                inputClass={inputClass}
                length={totalApplicant.length}
                applicantNo={applicantNo}
                increaseApplicantNo={increaseApplicantNo}
                decreaseApplicationNo={decreaseApplicationNo}
                setPhoneNoLimit={setPhoneNoLimit}
                applicantDetails={applicantDetails[index]}
                isReadOnly={isReadOnly}
              />
            ))}
          </div>
        </motion.div>

        {/* save & continue  */}
        <SaveData
          isStepperVisible={isStepperVisible}
          currentStep={currentStep}
          steps={steps}
          stepperData={stepperData}
          confirmAlert={confirmAlert}
          collectInputFieldData={handleApplicantInfoData}
        />
      </form>
    </div>
  );
};

export default ApplicantInfo;
