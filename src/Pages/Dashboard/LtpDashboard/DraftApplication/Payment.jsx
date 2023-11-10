import React, { useContext, useEffect, useState } from "react";
import InputField from "../../../Components/InputField";
import { GiMoneyStack } from "react-icons/gi";
import { FaCcAmazonPay, FaMoneyCheckAlt, FaWallet } from "react-icons/fa";
import UDAChargeImg from "../../../../assets/images/mobile-transfer.png";
import GramChargeImg from "../../../../assets/images/pay-per-click.png";
import LabourChargeImg from "../../../../assets/images/payment-method.png";
import GreenChargeImg from "../../../../assets/images/money.png";
import { useOutletContext } from "react-router";
import { AuthContext } from "../../../../AuthProvider/AuthProvider";
import toast from "react-hot-toast";
import axios from "axios";
import SaveData from "./SaveData";
import { Link } from "react-router-dom";
import {
  MdOutlinePayments,
  MdOutlineReceiptLong,
  MdReceiptLong,
} from "react-icons/md";
import Application from "./Application";
import Modal from "./Modal";
import { HiCurrencyRupee } from "react-icons/hi2";
import SendIcon from "../../../Components/SendIcon";

const Payment = () => {
  const [openApplication, setOpenApplication] = useState(false);
  const [viewChallan, setViewChallan] = useState(false);
  const [Newly_Developed_Condition, setNewlyDevelopedCondition] =
    useState(false);
  const [RLP_IPLP_Condition, setRLP_IPLP_Condition] = useState(false);
  const stepperData = useOutletContext();
  const {
    getApplicationData,
    confirmAlert,
    alertToTransferDataIntoDepartment,
    sendUserDataIntoDB,
    userInfoFromLocalStorage,
  } = useContext(AuthContext);
  const [isStepperVisible, currentStep, steps, handleStepClick] = stepperData;
  const [applicationData, setApplicationData] = useState({});
  const [condition, setCondition] = useState("");
  const [calculatedData, setCalculatedData] = useState({});
  const [selectedFiles, setSelectedFiles] = useState({
    gramaBankReceipt: "",
    labourCessBankReceipt: "",
    greenFeeBankReceipt: "",
  });
  const [imageId, setImageId] = useState({
    gramaBankReceipt: "",
    labourCessBankReceipt: "",
    greenFeeBankReceipt: "",
  });
  const [sentData, setSentData] = useState(0);
  const role = userInfoFromLocalStorage().role;
  const applicationNo = JSON.parse(localStorage.getItem("CurrentAppNo"));
  const cameFrom = JSON.parse(localStorage.getItem("page"));
  const gradientColor = "bg-gradient-to-r from-violet-500 to-fuchsia-500";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    getApplicationData(applicationNo, cameFrom).then((applicationData) => {
      setApplicationData(applicationData);
      const generalInformation =
        applicationData?.buildingInfo?.generalInformation;

      const ltpDetails = applicationData?.applicantInfo?.ltpDetails;

      const applicantDetailsData =
        applicationData?.applicantInfo?.applicantDetails;

      const plotDetails = applicationData?.buildingInfo?.plotDetails;

      const gramaPanchaytImgId = applicationData?.payment?.gramaPanchayatFee
        ?.gramaBankReceipt
        ? applicationData?.payment?.gramaPanchayatFee?.gramaBankReceipt
        : "";

      const greenFeeImgId = applicationData?.payment?.greenFeeCharge
        ?.greenFeeBankReceipt
        ? applicationData?.payment?.greenFeeCharge?.greenFeeBankReceipt
        : "";

      const labourCessImageId = applicationData?.payment?.labourCessCharge
        ?.labourCessBankReceipt
        ? applicationData?.payment?.labourCessCharge?.labourCessBankReceipt
        : "";

      setImageId({
        gramaBankReceipt: gramaPanchaytImgId,
        labourCessBankReceipt: labourCessImageId,
        greenFeeBankReceipt: greenFeeImgId,
      });

      if (
        generalInformation?.natureOfTheSite === "Approved Layout" ||
        generalInformation?.natureOfTheSite === "Regularised under LRS" ||
        generalInformation?.natureOfTheSite ===
          "Congested/ Gramakanta/ Old Built-up area" ||
        generalInformation?.natureOfTheSite === "Newly Developed/ Built up area"
      ) {
        setCondition(1);
      }
      if (
        generalInformation?.natureOfTheSite === "Newly Developed/ Built up area"
      ) {
        setCondition(2);
      }
      // calculation process
      calculateFees(
        generalInformation,
        ltpDetails,
        applicantDetailsData,
        plotDetails
      );
    });
  }, []);

  const calculateFees = (
    generalInformation,
    ltpDetails,
    applicantDetailsData,
    plotDetails
  ) => {
    // Plots Details
    const { netPlotAreaCal, marketValueSqym, totalBuiltUpArea, vacantLand } =
      plotDetails;
    // General Informatin
    const { natureOfTheSite } = generalInformation;

    const builtup_Area = Number(totalBuiltUpArea) || 1;
    const vacant_area = Number(vacantLand) || 1;
    const net_Plot_Area = Number(netPlotAreaCal) || 1;
    const market_value = Number(marketValueSqym) || 1;
    const nature_of_site = natureOfTheSite;
    const BuiltUp_area_SquareFeet = Number(builtup_Area * 10.7639104) || 1;

    console.log(typeof builtup_Area, "builtup_Area");

    // ======UDA Charged Segment======
    // ====Built up Development====
    const builtupAreaChargedUnitRate = 15; //per Sqm.
    const builtUpAreaDevelopmentCharged =
      builtupAreaChargedUnitRate * builtup_Area;

    // ====Vacant Development====
    const vacantAreaChargedUnitRate = 10; // per Sqm.
    const vacantAreaDevelopmentCharged =
      vacantAreaChargedUnitRate * vacant_area;

    // ====33% Penalization====
    const calculatePenalizationCharges = (net_Plot_Area, nature_of_site) => {
      let penalizationCharges = 0;
      if (nature_of_site !== "Plot port of RLP/IPLP but not regularised") {
        return (penalizationCharges = 0);
      }

      if (net_Plot_Area <= 100) {
        penalizationCharges = net_Plot_Area * 200 * 0.33;
      } else if (net_Plot_Area <= 300) {
        penalizationCharges = net_Plot_Area * 400 * 0.33;
      } else {
        return (penalizationCharges = 0);
      }

      return penalizationCharges;
    };
    // ====Total 33% Penalization Charged====
    const TotalPenalizationCharged = calculatePenalizationCharges(
      net_Plot_Area,
      nature_of_site
    );

    // ====Open Space====
    function calculateOpenSpaceCharge(
      nature_of_site,
      net_Plot_Area,
      market_value
    ) {
      const Newly_Developed_Condition =
        nature_of_site === "Newly Developed/ Built up area";
      const RLP_IPLP_Condition =
        nature_of_site === "Plot port of RLP/IPLP but not regularised";
      setNewlyDevelopedCondition(Newly_Developed_Condition);
      setRLP_IPLP_Condition(RLP_IPLP_Condition);
      if (Newly_Developed_Condition || RLP_IPLP_Condition) {
        return net_Plot_Area * 1.196 * market_value * 0.14;
      } else {
        return 0;
      }
    }

    // ==== Total 14% Open Space Charged ====
    const TotalOpenSpaceCharged = calculateOpenSpaceCharge(
      nature_of_site,
      net_Plot_Area,
      market_value
    );

    // ==== Labour Cess Component 2 ====
    const labourCessComponentUnitRate2 = 1400; // per Sq.Ft.

    const laboutCessCompo2Calculation = (BuiltUp_area_SquareFeet) => {
      let labourCessComponentCharge2 = 0;

      if (BuiltUp_area_SquareFeet <= 10000) {
        labourCessComponentCharge2 =
          labourCessComponentUnitRate2 * BuiltUp_area_SquareFeet * 10.76;
      }
      if (BuiltUp_area_SquareFeet > 10000) {
        labourCessComponentCharge2 =
          labourCessComponentUnitRate2 *
          BuiltUp_area_SquareFeet *
          10.76 *
          0.01 *
          0.02;
      }
      return labourCessComponentCharge2;
    };
    // ===== Total labour cess Compo 2 Charged====
    const TotalLabourCessComp2Charged = laboutCessCompo2Calculation(
      BuiltUp_area_SquareFeet
    );

    // =====UDA Total=====
    const UDATotal = () => {
      // Calculate UDA Total Charged
      const UDATotalCharged =
        builtUpAreaDevelopmentCharged +
        vacantAreaDevelopmentCharged +
        TotalPenalizationCharged +
        TotalOpenSpaceCharged +
        TotalLabourCessComp2Charged;
      return Math.round(UDATotalCharged);
    };
    // =====UDA Total Charged=====
    const UDATotalCharged = UDATotal();
    console.log(
      {
        builtUpAreaDevelopmentCharged,
        vacantAreaDevelopmentCharged,
        TotalPenalizationCharged,
        TotalOpenSpaceCharged,
        TotalLabourCessComp2Charged,
        UDATotalCharged,
      },
      "UDATotalCharged-Included Items"
    );

    // =======Grama Panchayet Segment=======

    // ====Grama Panchayet fees====
    const bettermentChargedUnitRate = 40; //per Sqm.
    const bettermentCharged = bettermentChargedUnitRate * net_Plot_Area;

    // ====Paper Publication Charged====
    const paperPublicationCharged = 1500; //Fixed

    // ====Processing Fees====
    const processingUnitRate = 7; //per Sqm.
    const processingFees = processingUnitRate * builtup_Area;

    // ====Building Permit====
    const buildingPermitUnitRate = 20; //per Sqm.
    const buildingPermitFees = buildingPermitUnitRate * builtup_Area;

    // =====Grama Panchayet Total=====
    const gramaPanchayetTotal = () => {
      return (
        bettermentCharged +
        paperPublicationCharged +
        processingFees +
        buildingPermitFees
      );
    };
    // =====Grama Panchayet Total Charged=====
    const GramaPanchayetTotalCharged = gramaPanchayetTotal();

    // ======Green Fee Charged======
    let greenFeeCharged = 0;
    const greenFeeChargesUnitRate = 3; //per Sq.ft
    if (BuiltUp_area_SquareFeet > 5000) {
      greenFeeCharged = Math.round(
        greenFeeChargesUnitRate * BuiltUp_area_SquareFeet * 10.76
      );
    }
    const showVariable = `NetPlot: ${net_Plot_Area}(Sq.M), BuiltUpArea: ${builtup_Area} (Sq.M), VacantArea: ${vacant_area} (Sq.M), BuiltUpArea: ${BuiltUp_area_SquareFeet} (Sq.Ft) NatureOfSite: ${nature_of_site}`;
    toast.success(showVariable);
    // ====Labour Cess Component 1 Charged====
    const labourCessComponentUnitRate1 = 1400; // per Sq.ft.
    const labourCessCompo1Charged = Math.round(
      labourCessComponentUnitRate1 *
        BuiltUp_area_SquareFeet *
        10.76 *
        (0.01 * 0.98)
    );

    setCalculatedData({
      UDATotalCharged,
      GramaPanchayetTotalCharged,
      builtUpAreaDevelopmentCharged,
      labourCessCompo1Charged,
      TotalLabourCessComp2Charged,
      vacantAreaDevelopmentCharged,
      builtup_Area,
      nature_of_site,
      greenFeeCharged,
      TotalPenalizationCharged,
      TotalOpenSpaceCharged,
      bettermentCharged,
      processingFees,
      paperPublicationCharged,
      buildingPermitFees,
    });
  };

  // THIS FUNCTION USED FOR GETTING SELECTED FILE
  const handleFileChange = (e, fileName) => {
    const file = e.target.files[0];

    file && toast.success("Uploaded successfully");

    setSelectedFiles((prev) => {
      console.log(prev, fileName, "BEFORE");
      prev[fileName] = file;
      console.log(prev, fileName, "AFTER");
      return prev;
    });
  };

  const getData = () => {
    console.log(document.getElementById("vacantArea"), "BY ID");
    console.log(document.getElementById("builtUpArea"), "BY ID");
    console.log(document.getElementById("UdaImpactFee"), "BY ID");
    console.log(document.getElementById("UDATotalCharged"), "BY ID");
    console.log(document.getElementById("gramaSiteApproval"), "BY ID");
    console.log(document.getElementById("buildingPermitFees"), "BY ID");
    console.log(document.getElementById("bettermentCharged"), "BY ID");
    console.log(document.getElementById("TotalOpenSpaceCharged"), "BY ID");
    console.log(document.getElementById("gramaImpactFee"), "BY ID");
    console.log(document.getElementById("TotalPenalizationCharged"), "BY ID");
    console.log(document.getElementById("GramaPanchayetTotalCharged"), "BY ID");
    console.log(document.getElementById("gramaChallanNo"), "BY ID");
    console.log(document.getElementById("gramaChallanDate"), "BY ID");
    console.log(document.getElementById("gramaBankBranch"), "BY ID");
    console.log(document.getElementById("gramaBankName"), "BY ID");
    console.log(document.getElementById("labourCessSiteApproval"), "BY ID");
    console.log(document.getElementById("labourCessChallanNo"), "BY ID");
    console.log(document.getElementById("labourCessChallanDate"), "BY ID");
    console.log(document.getElementById("labourCessBankBranch"), "BY ID");
    console.log(document.getElementById("greenFeeSiteApproval"), "BY ID");
    console.log(document.getElementById("greenFeeChargeChallanNo"), "BY ID");
    console.log(document.getElementById("greenFeeChargeChallanDate"), "BY ID");
    console.log(document.getElementById("greenFeeChargeBankName"), "BY ID");
    console.log(document.getElementById("greenFeeChargeBankBranch"), "BY ID");
  };

  // send data into database
  const sendPaymentData = async (url) => {
    // let totalFileChecked = 1;

    // UPLOAD IMAGE FILE INTO THE CLOUD STORAGE AT FIRST
    for (const file in selectedFiles) {
      const formData = new FormData();
      console.log(file);

      if (selectedFiles[file]) {
        formData.append("file", selectedFiles[file]);

        console.log(...formData);
        try {
          const response = await axios.post(
            "http://localhost:5000/upload?page=payment",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data", // Important for file uploads
              },
            }
          );
          // Handle success or display a success message to the user
          if (response?.data.msg === "Successfully uploaded") {
            const fileId = response.data.fileId;
            console.log(fileId, "fileId");
            // fileUploadSuccess = 1;
            imageId[file] = fileId;
          }
        } catch (error) {
          // Handle errors, e.g., show an error message to the user
          toast.error("Error to upload documents");
        }
      }
    }

    // uda charge
    const vacantArea = document.getElementById("vacantArea")?.value;
    const TotalPenalizationCharged = document.getElementById(
      "TotalPenalizationCharged"
    )?.value;
    const TotalOpenSpaceCharged = document.getElementById(
      "TotalOpenSpaceCharged"
    )?.value;
    const builtUpArea = document.getElementById("builtUpArea")?.value;
    const labourCessTwo = document.getElementById("labourCess02")?.value;
    const UDATotalCharged = document.getElementById("UDATotalCharged")?.value;

    // grama panchayat fee

    const paperPublicationFee =
      document.getElementById("paperPublication")?.value;

    const processingFee = document.getElementById("processingFee")?.value;

    const bettermentCharged =
      document.getElementById("bettermentCharged")?.value;

    const buildingPermitFee =
      document.getElementById("buildingPermitFees")?.value;

    const GramaPanchayetTotalCharged = document.getElementById(
      "GramaPanchayetTotalCharged"
    )?.value;
    const gramaChallanNo = document.getElementById("gramaChallanNo")?.value;
    const gramaChallanDate = document.getElementById("gramaChallanDate")?.value;
    const gramaBankName = document.getElementById("gramaBankName")?.value;
    const gramaBankBranch = document.getElementById("gramaBankBranch")?.value;

    const labourCessOne = document.getElementById("labourCess01")?.value;

    const labourCessChallanNo = document.getElementById(
      "labourCessChallanNo"
    )?.value;
    const labourCessChallanDate = document.getElementById(
      "labourCessChallanDate"
    )?.value;
    const labourCessBankName =
      document.getElementById("labourCessBankName")?.value;
    const labourCessBankBranch = document.getElementById(
      "labourCessBankBranch"
    )?.value;

    const greenFee = document.getElementById("greenFeeCharge")?.value;
    const greenFeeChargeChallanNo = document.getElementById(
      "greenFeeChargeChallanNo"
    )?.value;
    const greenFeeChargeChallanDate = document.getElementById(
      "greenFeeChargeChallanDate"
    )?.value;
    const greenFeeChargeBankName = document.getElementById(
      "greenFeeChargeBankName"
    )?.value;
    const greenFeeChargeBankBranch = document.getElementById(
      "greenFeeChargeBankBranch"
    )?.value;

    const udaCharge = {
      vacantArea: vacantArea ?? "",
      TotalPenalizationCharged: TotalPenalizationCharged ?? "",
      TotalOpenSpaceCharged: TotalOpenSpaceCharged ?? "",
      labourCessTwo: labourCessTwo ?? "",
      builtUpArea: builtUpArea ?? "",
      UDATotalCharged: UDATotalCharged ?? "",
    };

    const gramaPanchayatFee = {
      paperPublicationFee: paperPublicationFee ?? "",
      processingFee: processingFee ?? "",
      buildingPermitFees: buildingPermitFee ?? "",
      bettermentCharged: bettermentCharged ?? "",
      GramaPanchayetTotalCharged: GramaPanchayetTotalCharged ?? "",
      gramaChallanNo: gramaChallanNo ?? "",
      gramaChallanDate: gramaChallanDate ?? "",
      gramaBankName: gramaBankName ?? "",
      gramaBankBranch: gramaBankBranch ?? "",
      gramaBankReceipt: imageId["gramaBankReceipt"],
    };
    const labourCessCharge = {
      labourCessOne: labourCessOne ?? "",
      labourCessBankBranch: labourCessBankBranch ?? "",
      labourCessBankName: labourCessBankName ?? "",
      labourCessChallanDate: labourCessChallanDate ?? "",
      labourCessChallanNo: labourCessChallanNo ?? "",
      labourCessBankReceipt: imageId["labourCessBankReceipt"],
    };
    const greenFeeCharge = {
      greenFeeChargeBankBranch: greenFeeChargeBankBranch ?? "",
      greenFeeChargeBankName: greenFeeChargeBankName ?? "",
      greenFeeChargeChallanDate: greenFeeChargeChallanDate ?? "",
      greenFeeChargeChallanNo: greenFeeChargeChallanNo ?? "",
      greenFee: greenFee ?? "",
      greenFeeBankReceipt: imageId["greenFeeBankReceipt"],
    };

    console.log(udaCharge, gramaPanchayatFee, labourCessCharge, greenFeeCharge);

    return await sendUserDataIntoDB(url, "PATCH", {
      applicationNo: JSON.parse(localStorage.getItem("CurrentAppNo")),
      payment: {
        udaCharge,
        greenFeeCharge,
        labourCessCharge,
        gramaPanchayatFee,
      },
    });
  };

  return (
    <div className="text-gray-600">
      <form
        onSubmit={(e) => e.preventDefault()}
        className="grid my-5 mx-7 lg:my-0 lg:p-2"
      >
        <div>
          <div className="flex items-center">
            {/* <img
              src={UDAChargeImg}
              alt="Image icon for uda charge section"
              className="h-10 me-3"
            /> */}
            <FaCcAmazonPay size={30} className="text-normalViolet" />
            <h3 className="font-bold text-xl text-gray-900 ml-3">UDA Charge</h3>
          </div>
          <div className="divider m-0"></div>

          <div className="grid grid-cols-2 lg:grid-cols-3 mb-10">
            <InputField
              id="vacantArea"
              name="vacantArea"
              label="Development charges(on Vacant land)"
              placeholder="000"
              type="number"
              ltpDetails={calculatedData?.vacantAreaDevelopmentCharged}
            />
            <InputField
              id="builtUpArea"
              name="builtUpArea"
              label="Development charges(on Built-up area)"
              placeholder="000"
              type="number"
              ltpDetails={calculatedData?.builtUpAreaDevelopmentCharged}
            />
            {(Newly_Developed_Condition || RLP_IPLP_Condition) && (
              <InputField
                id="TotalOpenSpaceCharged"
                name="TotalOpenSpaceCharged"
                label="14% open space charges"
                placeholder="000"
                type="number"
                ltpDetails={calculatedData?.TotalOpenSpaceCharged}
              />
            )}
            {RLP_IPLP_Condition && (
              <InputField
                id="TotalPenalizationCharged"
                name="TotalPenalizationCharged"
                label="33% penalization charges"
                placeholder="000"
                type="number"
                ltpDetails={calculatedData?.TotalPenalizationCharged}
              />
            )}
            <InputField
              id="labourCess02"
              name="labourCess02"
              label="Labour Cess Component 2"
              placeholder="000"
              type="number"
              ltpDetails={calculatedData?.TotalLabourCessComp2Charged}
            />
            <InputField
              id="UDATotalCharged"
              name="UDATotalCharged"
              label="Total"
              placeholder="000"
              type="number"
              ltpDetails={calculatedData?.UDATotalCharged}
            />
            {role === "LTP" && (
              <div className="flex ms-5 items-center pay-btn-container">
                <button className="pay-btn mt-3">
                  <div class="svg-wrapper-1">
                    <div class="svg-wrapper">
                      <SendIcon />
                    </div>
                  </div>
                  <span>Pay now</span>
                </button>
              </div>
            )}
            {role === "PS" && (
              <>
                <button
                  className={`btn btn-md nm_Container w-[60%] mx-auto text-sm px-3 mt-10 border-none text-white transition-all duration-500 bg-normalViolet hover:bg-bgColor hover:text-normalViolet`}
                  onClick={() => setViewChallan(true)}
                >
                  <MdOutlineReceiptLong size={20} />
                  View Challan
                </button>
                {viewChallan && (
                  <Modal
                    viewChallan={viewChallan}
                    setViewChallan={setViewChallan}
                  />
                )}
                <div>
                  <button
                    className={`btn btn-md text-sm px-3 mt-10 font-roboto w-[60%] mx-auto border-none text-white shadow-md transition-all duration-500 ${gradientColor} nm_Container hover:bg-gradient-to-bl`}
                    onClick={() =>
                      document.getElementById("my_modal_4").showModal()
                    }
                  >
                    <GiMoneyStack size={25} /> View Payment Receipt
                  </button>
                </div>

                {/* modal box */}

                <dialog id="my_modal_4" className="modal">
                  <div className="modal-box w-11/12 max-w-5xl dark:bg-white dark:text-black">
                    <div className="modal-action">
                      <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                          ✕
                        </button>
                      </form>
                    </div>

                    {/* payment receipt content start  */}
                    <div>
                      <p className="font-bold text-center text-3xl">
                        Bobbili Urban Development Authority
                      </p>
                      <p className="py-4 text-center text-lg uppercase">
                        Town Planning Department
                      </p>

                      <p className="mt-5 mb-14 w-4/5 mx-auto text-center font-bold border border-black">
                        PAYMENT RECEIPT
                      </p>

                      {/* receipt identification no  */}
                      <div className="grid grid-cols-1 md:grid-cols-2 mb-6">
                        <div className="grid grid-cols-2">
                          {/* 1st row  */}
                          <p className="mb-6">Receipt No.</p>
                          <p>: RC/0106/2023</p>

                          {/* 2nd row  */}
                          <p>Demand Note No</p>
                          <p>: 1177/CH/0114/2023</p>
                        </div>
                        <div className="grid grid-cols-2">
                          {/* 1st row  */}
                          <p className="mb-6">Receipt Date</p>
                          <p>: 24 July, 2023</p>
                          {/* 2nd row  */}
                          <p>BA No</p>
                          <p>: 1177/0023/B/BOB/PII/2023</p>
                        </div>
                      </div>
                    </div>

                    <hr className="h-[2px] bg-black" />

                    {/* applicant information  */}
                    <div className="grid grid-cols-2 my-7">
                      <p className="mb-5">Applicant Name</p>
                      <p>:</p>
                      <p>Communication Address</p>
                      <p>:</p>
                    </div>

                    {/* body  */}
                    <div className="border border-black p-6 grid grid-cols-3">
                      {/* amount  */}
                      {/* 1st row  */}
                      <p>Amount (INR)</p>
                      <p className="col-span-2">:</p>

                      {/* 2nd row  */}
                      <p className="my-6">Amount (In Words)</p>
                      <p className="col-span-2 my-6">:</p>

                      {/* 3rd row  */}
                      <p className="mb-2">
                        Transaction Type
                        <span className="text-black font-bold">
                          {" "}
                          :: Online
                        </span>{" "}
                      </p>

                      {/* 4th row  */}
                      <p className="col-span-3 p-2 mb-5 text-center bg-gray-200 font-bold">
                        Payment Details
                      </p>

                      {/* 5th row  */}
                      <p>Transaction ID</p>
                      <p>:</p>
                      <p>Date:</p>
                    </div>

                    <p className="italic text-center mt-5">
                      ** This is system generated report and does not require
                      any signature. **
                    </p>
                  </div>
                </dialog>
              </>
            )}
          </div>
        </div>

        <div className="my-5">
          <div className="flex items-center">
            {/* <img
              src={GramChargeImg}
              alt="Image icon for Grama Panchayat fee section"
              className="h-10 me-3"
            /> */}

            <MdOutlinePayments size={30} className="text-normalViolet" />
            <h3 className="font-bold text-xl text-gray-900 ml-3">
              Grama Panchayat fee
            </h3>
          </div>
          <div className="divider m-0"></div>

          <div className="grid grid-cols-2 lg:grid-cols-4 mt-3">
            <InputField
              id="paperPublication"
              name="paperPublication"
              label="Paper Publication Charges"
              placeholder="000"
              type="number"
              ltpDetails={calculatedData?.paperPublicationCharged}
            />
            <InputField
              id="processingFee"
              name="processingFee"
              label="Processing Fee"
              placeholder="000"
              type="number"
              ltpDetails={calculatedData?.processingFees}
            />
            {
              <InputField
                id="bettermentCharged"
                name="bettermentCharged"
                label="Betterment charge"
                placeholder="000"
                type="number"
                ltpDetails={calculatedData?.bettermentCharged}
              />
            }
            <InputField
              id="buildingPermitFees"
              name="buildingPermitFees"
              label="Building Permit Fee"
              placeholder="000"
              type="number"
              ltpDetails={calculatedData?.buildingPermitFees}
            />

            <InputField
              id="GramaPanchayetTotalCharged"
              name="GramaPanchayetTotalCharged"
              label="Total"
              placeholder="000"
              type="number"
              ltpDetails={calculatedData?.GramaPanchayetTotalCharged}
            />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 mb-4">
            <InputField
              id="gramaChallanNo"
              name="gramaChallanNo"
              label="DD/Challan no."
              placeholder="xxxx"
              type="text"
              ltpDetails={
                applicationData?.payment?.gramaPanchayatFee?.gramaChallanNo ??
                ""
              }
            />
            <InputField
              id="gramaChallanDate"
              name="gramaChallanDate"
              label="DD/Challan date"
              placeholder="06-04-2023"
              type="text"
              ltpDetails={
                applicationData?.payment?.gramaPanchayatFee?.gramaChallanDate ??
                ""
              }
            />
            <InputField
              id="gramaBankName"
              name="gramaBankName"
              label="Bank name"
              placeholder="xxxx"
              type="text"
              ltpDetails={
                applicationData?.payment?.gramaPanchayatFee?.gramaBankName ?? ""
              }
            />
            <InputField
              id="gramaBankBranch"
              name="gramaBankBranch"
              label="Branch"
              placeholder="xxxx"
              type="text"
              ltpDetails={
                applicationData?.payment?.gramaPanchayatFee?.gramaBankBranch ??
                ""
              }
            />
          </div>
          <div className="px-3 mb-8 flex justify-end">
            <div className="form-control w-full max-w-xs">
              {role === "LTP" && (
                <input
                  type="file"
                  className="file-input file-input-bordered w-full max-w-xs text-gray-400 bg-white dark:text-black"
                  id="gramaBankReceipt"
                  onChange={(e) => handleFileChange(e, "gramaBankReceipt")}
                />
              )}
            </div>
            {applicationData?.payment?.gramaPanchayatFee?.gramaBankReceipt && (
              <Link
                to={`https://drive.google.com/file/d/${applicationData?.payment?.gramaPanchayatFee?.gramaBankReceipt}/view?usp=sharing`}
                target="_blank"
                className="flex justify-center items-center ms-10 px-6  hover:underline bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-lg shadow-lg rounded-full"
              >
                <MdReceiptLong className="me-1" />
                View Challan
              </Link>
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center">
            {/* <img
              src={LabourChargeImg}
              alt="Image icon for labour charge section"
              className="h-10 me-3"
            /> */}

            <FaMoneyCheckAlt size={30} className="text-normalViolet" />
            <h3 className="font-bold text-xl text-gray-900 ml-3">
              Labour cess charge
            </h3>
          </div>
          <div className="divider m-0"></div>

          <div className="grid lg:grid-cols-4 mt-3">
            <InputField
              id="labourCess01"
              name="labourCess01"
              label="Labour Cess Component 1"
              placeholder="000"
              type="number"
              ltpDetails={calculatedData?.labourCessCompo1Charged}
            />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 mb-8">
            <InputField
              id="labourCessChallanNo"
              name="labourCessChallanNo"
              label="DD/Challan no."
              placeholder="xxxx"
              type="text"
              ltpDetails={
                applicationData?.payment?.labourCessCharge
                  ?.labourCessChallanNo ?? ""
              }
            />
            <InputField
              id="labourCessChallanDate"
              name="labourCessChallanDate"
              label="DD/Challan date"
              placeholder="06-04-2023"
              type="text"
              ltpDetails={
                applicationData?.payment?.labourCessCharge
                  ?.labourCessChallanDate ?? ""
              }
            />
            <InputField
              id="labourCessBankName"
              name="labourCessBankName"
              label="Bank name"
              placeholder="xxxx"
              type="text"
              ltpDetails={
                applicationData?.payment?.labourCessCharge
                  ?.labourCessBankName ?? ""
              }
            />
            <InputField
              id="labourCessBankBranch"
              name="labourCessBankBranch"
              label="Branch"
              placeholder="xxxx"
              type="text"
              ltpDetails={
                applicationData?.payment?.labourCessCharge
                  ?.labourCessBankBranch ?? ""
              }
            />
          </div>
          <div className="px-3 mb-4 flex justify-end">
            <div className="form-control w-full max-w-xs">
              {role === "LTP" && (
                <input
                  type="file"
                  className="file-input file-input-bordered w-full max-w-xs text-gray-400 bg-white dark:text-black"
                  id="labourCessBankReceipt"
                  onChange={(e) => handleFileChange(e, "labourCessBankReceipt")}
                />
              )}
            </div>

            {applicationData?.payment?.labourCessCharge
              ?.labourCessBankReceipt && (
              <Link
                to={`https://drive.google.com/file/d/${applicationData?.payment?.labourCessCharge?.labourCessBankReceip}/view?usp=sharing`}
                target="_blank"
                className="flex justify-center items-center ms-10 px-6 hover:underline bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-lg shadow-lg rounded-full"
              >
                <MdReceiptLong className="me-1" />
                View Challan
              </Link>
            )}
          </div>
        </div>

        {/* Green fee charge  */}
        <div className="mt-5 mb-8">
          <div className="flex items-center">
            {/* <img
              src={GreenChargeImg}
              alt="Image icon for green charge section"
              className="h-10 me-3"
            /> */}
            <HiCurrencyRupee size={30} className="text-normalViolet" />
            <h3 className="font-bold text-xl text-gray-900 ml-3">
              Green fee charge
            </h3>
          </div>
          <div className="divider m-0"></div>

          <div className="grid lg:grid-cols-4 mt-3">
            <InputField
              id="greenFeeCharge"
              name="greenFeeCharge"
              label="Green fee charge"
              placeholder="000"
              type="number"
              ltpDetails={calculatedData?.greenFeeCharged}
            />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4">
            <InputField
              id="greenFeeChargeChallanNo"
              name="greenFeeChargeChallanNo"
              label="DD/Challan no."
              placeholder="xxxx"
              type="text"
              ltpDetails={
                applicationData?.payment?.greenFeeCharge
                  ?.greenFeeChargeChallanNo ?? ""
              }
            />
            <InputField
              id="greenFeeChargeChallanDate"
              name="greenFeeChargeChallanDate"
              label="DD/Challan date"
              placeholder="06-04-2023"
              type="text"
              ltpDetails={
                applicationData?.payment?.greenFeeCharge
                  ?.greenFeeChargeChallanDate ?? ""
              }
            />
            <InputField
              id="greenFeeChargeBankName"
              name="greenFeeChargeBankName"
              label="Bank name"
              placeholder="xxxx"
              type="text"
              ltpDetails={
                applicationData?.payment?.greenFeeCharge
                  ?.greenFeeChargeBankName ?? ""
              }
            />
            <InputField
              id="greenFeeChargeBankBranch"
              name="greenFeeChargeBankBranch"
              label="Branch"
              placeholder="xxxx"
              type="text"
              ltpDetails={
                applicationData?.payment?.greenFeeCharge
                  ?.greenFeeChargeBankBranch ?? ""
              }
            />
          </div>
        </div>

        <div className="px-3 mb-4 flex justify-end">
          <div className="form-control w-full max-w-xs">
            {role === "LTP" && (
              <input
                type="file"
                className="file-input file-input-bordered w-full max-w-xs text-gray-400 bg-white dark:text-black"
                id="greenFeeBankReceipt"
                onChange={(e) => handleFileChange(e, "greenFeeBankReceipt")}
              />
            )}
          </div>
          {applicationData?.payment?.greenFeeCharge?.greenFeeBankReceipt && (
            <Link
              to={`https://drive.google.com/file/d/${applicationData?.payment?.greenFeeCharge?.greenFeeBankReceipt}/view?usp=sharing`}
              target="_blank"
              className="flex justify-center items-center ms-10 px-6 hover:underline bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-lg shadow-lg rounded-full"
            >
              <MdReceiptLong className="me-1" />
              View Challan
            </Link>
          )}
        </div>

        {/* <input type="submit" value="GET" onClick={sendPaymentData} /> */}

        {/* save & continue  */}
        {/* navigation button  */}
        <SaveData
          isStepperVisible={isStepperVisible}
          currentStep={currentStep}
          steps={steps}
          stepperData={stepperData}
          confirmAlert={confirmAlert}
          collectInputFieldData={sendPaymentData}
          sentToPS={alertToTransferDataIntoDepartment}
          setSentData={setSentData}
          sentData={sentData}
        />
      </form>
    </div>
  );
};

export default Payment;
