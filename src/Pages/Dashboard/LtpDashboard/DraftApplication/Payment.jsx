import axios from "axios";
import { motion } from "framer-motion";
import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaCcAmazonPay, FaMoneyCheckAlt } from "react-icons/fa";
import { HiCurrencyRupee } from "react-icons/hi2";
import { IoReceipt } from "react-icons/io5";
import { MdOutlinePayments, MdReceiptLong } from "react-icons/md";
import { useLocation, useNavigate, useOutletContext } from "react-router";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { AuthContext } from "../../../../AuthProvider/AuthProvider";
import InputField from "../../../Components/InputField";
import SendIcon from "../../../Components/SendIcon";
import Modal from "./Modal";
import SaveData from "./SaveData";

const Payment = () => {
  const {
    getApplicationData,
    confirmAlert,
    alertToTransferDataIntoDepartment,
    sendUserDataIntoDB,
    userInfoFromLocalStorage,
    getUserData,
    stepCompleted,
  } = useContext(AuthContext);

  const [ltpInfo, setLtpInfo] = useState([]);
  const [viewChallan, setViewChallan] = useState(false);
  const [Newly_Developed_Condition, setNewlyDevelopedCondition] =
    useState(false);
  const [RLP_IPLP_Condition, setRLP_IPLP_Condition] = useState(false);
  const stepperData = useOutletContext();
  const pathname = useLocation().pathname;

  const navigate = useNavigate();
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
  const [sentData, setSentData] = useState(
    JSON.parse(localStorage.getItem("PPS"))
  );
  const role = userInfoFromLocalStorage().role;
  const applicationNo = JSON.parse(localStorage.getItem("CurrentAppNo"));
  const cameFrom = JSON.parse(localStorage.getItem("page"));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    fetch(
      `https://residential-building.onrender.com/userInformation?id=${
        userInfoFromLocalStorage()?.userId
      }`
    )
      .then((res) => res.json())
      .then((result) => {
        console.log(result, "result");
        setLtpInfo(result);
      });

    getApplicationData(applicationNo, cameFrom).then((appData) => {
      console.log(appData, "APP DATA");
      setApplicationData(appData);

      if (appData?.prevSavedState === 6) {
        localStorage.setItem("PPS", JSON.parse(1));
        setSentData(1);
      } else {
        localStorage.setItem("PPS", JSON.parse(0));
        setSentData(0);
      }
      const generalInformation = appData?.buildingInfo?.generalInformation;

      const ltpDetails = appData?.applicantInfo?.ltpDetails;

      const applicantDetailsData = appData?.applicantInfo?.applicantDetails;

      const plotDetails = appData?.buildingInfo?.plotDetails;

      const gramaPanchaytImgId = appData?.payment?.gramaPanchayatFee
        ?.gramaBankReceipt
        ? appData?.payment?.gramaPanchayatFee?.gramaBankReceipt
        : "";

      const greenFeeImgId = appData?.payment?.greenFeeCharge
        ?.greenFeeBankReceipt
        ? appData?.payment?.greenFeeCharge?.greenFeeBankReceipt
        : "";

      const labourCessImageId = appData?.payment?.labourCessCharge
        ?.labourCessBankReceipt
        ? appData?.payment?.labourCessCharge?.labourCessBankReceipt
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
        plotDetails,
        appData
      );
    });
  }, []);

  const calculateFees = (
    generalInformation,
    ltpDetails,
    applicantDetailsData,
    plotDetails,
    appData
  ) => {
    // Plots Details
    const { netPlotAreaCal, marketValueSqym, totalBuiltUpArea, vacantLand } =
      plotDetails;
    // General Informatin
    const { natureOfTheSite: nature_of_site } = generalInformation;

    const builtup_Area = Number(totalBuiltUpArea) || 0;
    const vacant_area = Number(vacantLand) || 0;
    const net_Plot_Area = Number(netPlotAreaCal) || 0;
    const market_value = Number(marketValueSqym) || 0;
    // const nature_of_site = natureOfTheSite;
    const BuiltUp_area_SquareFeet = Number(builtup_Area * 10.7639104) || 0;

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

    const labourCessCompo2Calculation = (BuiltUp_area_SquareFeet) => {
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
    const TotalLabourCessComp2Charged = labourCessCompo2Calculation(
      BuiltUp_area_SquareFeet
    );
    // ====== User Charges======
    const userCharged = 1000;
    // =====UDA Total=====
    const UDATotal = () => {
      // Calculate UDA Total Charged
      const UDATotalCharged =
        builtUpAreaDevelopmentCharged +
        vacantAreaDevelopmentCharged +
        TotalPenalizationCharged +
        TotalOpenSpaceCharged +
        TotalLabourCessComp2Charged +
        userCharged;
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
    const gramaSiteApprovalCharged = 10 * net_Plot_Area;
    // =====Grama Panchayet Total=====
    const gramaPanchayetTotal = () => {
      return (
        bettermentCharged +
        paperPublicationCharged +
        processingFees +
        buildingPermitFees +
        gramaSiteApprovalCharged
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
    // toast.success(showVariable);
    // ====Labour Cess Component 1 Charged====
    const labourCessComponentUnitRate1 = 1400; // per Sq.ft.
    const labourCessCompo1Charged = Math.round(
      labourCessComponentUnitRate1 *
        BuiltUp_area_SquareFeet *
        10.76 *
        (0.01 * 0.98)
    );

    console.log(TotalLabourCessComp2Charged, "tt");

    let needToPay = {};
    if (generalInformation?.caseType?.toLowerCase() === "revision") {
      console.log(appData, "Application data");

      // retrieve previous payment information for revision case
      const { udaCharge, labourCessCharge, greenFeeCharge, gramaPanchayatFee } =
        appData?.previousPayment;

      const newUDATotalCharged =
        Number(UDATotalCharged.toFixed(2)) - Number(udaCharge?.UDATotalCharged);

      const newGramaPanchayetTotalCharged =
        Number(GramaPanchayetTotalCharged.toFixed(2)) -
        Number(gramaPanchayatFee?.GramaPanchayetTotalCharged);

      const newBuiltUpAreaDevelopmentCharged =
        Number(builtUpAreaDevelopmentCharged.toFixed(2)) -
        Number(udaCharge?.builtUpArea);

      const newLabourCessCompo1Charged =
        Number(labourCessCompo1Charged.toFixed(2)) -
        Number(labourCessCharge?.labourCessOne);

      const newTotalLabourCessComp2Charged =
        Number(TotalLabourCessComp2Charged.toFixed(2)) -
        Number(udaCharge?.labourCessTwo);

      const newUserCharged =
        Number(userCharged.toFixed(2)) - Number(udaCharge?.userCharges);

      const newVacantAreaDevelopmentCharged =
        Number(vacantAreaDevelopmentCharged.toFixed(2)) -
        Number(udaCharge?.vacantArea);

      const newGreenFeeCharged =
        Number(greenFeeCharged.toFixed(2)) - Number(greenFeeCharge?.greenFee);

      const newTotalPenalizationCharged =
        Number(TotalPenalizationCharged.toFixed(2)) -
        Number(udaCharge?.TotalPenalizationCharged);

      const newTotalOpenSpaceCharged =
        Number(TotalOpenSpaceCharged.toFixed(2)) -
        Number(udaCharge?.TotalOpenSpaceCharged);

      const newBettermentCharged =
        Number(bettermentCharged.toFixed(2)) -
        Number(gramaPanchayatFee?.bettermentCharged);

      const newProcessingFees =
        Number(processingFees.toFixed(2)) -
        Number(gramaPanchayatFee?.processingFee);

      const newPaperPublicationCharged =
        Number(paperPublicationCharged.toFixed(2)) -
        Number(gramaPanchayatFee?.paperPublicationFee);

      const newBuildingPermitFees =
        Number(paperPublicationCharged.toFixed(2)) -
        Number(gramaPanchayatFee?.buildingPermitFees);

      const newGramaSiteApprovalCharged =
        Number(gramaSiteApprovalCharged.toFixed(2)) -
        Number(gramaPanchayatFee?.gramaSiteApprovalCharged);

      needToPay = {
        UDATotalCharged: newUDATotalCharged < 0 ? 0 : newUDATotalCharged,

        GramaPanchayetTotalCharged:
          newGramaPanchayetTotalCharged < 0 ? 0 : newGramaPanchayetTotalCharged,

        builtUpAreaDevelopmentCharged:
          newBuiltUpAreaDevelopmentCharged < 0
            ? 0
            : newBuiltUpAreaDevelopmentCharged,

        labourCessCompo1Charged:
          newLabourCessCompo1Charged < 0 ? 0 : newLabourCessCompo1Charged,

        TotalLabourCessComp2Charged:
          newTotalLabourCessComp2Charged < 0
            ? 0
            : newTotalLabourCessComp2Charged,

        userCharged: newUserCharged < 0 ? 0 : newUserCharged,

        vacantAreaDevelopmentCharged:
          newVacantAreaDevelopmentCharged < 0
            ? 0
            : newVacantAreaDevelopmentCharged,

        builtup_Area: Number(builtup_Area.toFixed(2)),
        nature_of_site,
        greenFeeCharged: newGreenFeeCharged < 0 ? 0 : newGreenFeeCharged,
        TotalPenalizationCharged:
          newTotalPenalizationCharged < 0 ? 0 : newTotalPenalizationCharged,
        TotalOpenSpaceCharged:
          newTotalOpenSpaceCharged < 0 ? 0 : newTotalOpenSpaceCharged,
        bettermentCharged: newBettermentCharged < 0 ? 0 : newBettermentCharged,
        processingFees: newProcessingFees < 0 ? 0 : newProcessingFees,
        paperPublicationCharged:
          newPaperPublicationCharged < 0 ? 0 : newPaperPublicationCharged,
        buildingPermitFees:
          newBuildingPermitFees < 0 ? 0 : newBuildingPermitFees,
        gramaSiteApprovalCharged:
          newGramaSiteApprovalCharged < 0 ? 0 : newGramaSiteApprovalCharged,
      };
    } else {
      needToPay = {
        UDATotalCharged: Number(UDATotalCharged.toFixed(2)),
        GramaPanchayetTotalCharged: Number(
          GramaPanchayetTotalCharged.toFixed(2)
        ),
        builtUpAreaDevelopmentCharged: Number(
          builtUpAreaDevelopmentCharged
        ).toFixed(2),
        labourCessCompo1Charged: Number(labourCessCompo1Charged.toFixed(2)),
        TotalLabourCessComp2Charged: Number(
          TotalLabourCessComp2Charged.toFixed(2)
        ),
        userCharged: Number(userCharged.toFixed(2)),
        vacantAreaDevelopmentCharged: Number(
          vacantAreaDevelopmentCharged.toFixed(2)
        ),
        builtup_Area: Number(builtup_Area.toFixed(2)),
        nature_of_site,
        greenFeeCharged: Number(greenFeeCharged.toFixed(2)),
        TotalPenalizationCharged: Number(TotalPenalizationCharged.toFixed(2)),
        TotalOpenSpaceCharged: Number(TotalOpenSpaceCharged.toFixed(2)),
        bettermentCharged: Number(bettermentCharged.toFixed(2)),
        processingFees: Number(processingFees.toFixed(2)),
        paperPublicationCharged: Number(paperPublicationCharged.toFixed(2)),
        buildingPermitFees: Number(paperPublicationCharged.toFixed(2)),
        gramaSiteApprovalCharged: Number(gramaSiteApprovalCharged.toFixed(2)),
      };
    }

    setCalculatedData(needToPay);
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
            "https://residential-building.onrender.com/upload?page=payment",
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
    const userCharges = document.getElementById("userCharges")?.value;
    const UDATotalCharged = document.getElementById("UDATotalCharged")?.value;

    // grama panchayat fee

    const paperPublicationFee =
      document.getElementById("paperPublication")?.value;

    const processingFee = document.getElementById("processingFee")?.value;

    const bettermentCharged =
      document.getElementById("bettermentCharged")?.value;

    const buildingPermitFee =
      document.getElementById("buildingPermitFees")?.value;
    const gramaSiteApprovalCharges = document.getElementById(
      "gramaSiteApprovalCharges"
    )?.value;

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
      userCharges: userCharges ?? "",
      UDATotalCharged: UDATotalCharged ?? "",
    };

    const gramaPanchayatFee = {
      paperPublicationFee: paperPublicationFee ?? "",
      processingFee: processingFee ?? "",
      buildingPermitFees: buildingPermitFee ?? "",
      bettermentCharged: bettermentCharged ?? "",
      gramaSiteApprovalCharged: gramaSiteApprovalCharges ?? "",
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

    stepCompleted.current =
      stepCompleted.current > 6 ? stepCompleted.current : 6;

    return await sendUserDataIntoDB(url, "PATCH", {
      applicationNo: JSON.parse(localStorage.getItem("CurrentAppNo")),
      payment: {
        udaCharge,
        greenFeeCharge,
        labourCessCharge,
        gramaPanchayatFee,
      },
      prevSavedState: stepCompleted.current,
    });
  };

  const [loadingPayment, setLoadingPayment] = useState(false);

  const confirmMessageForPayment = () => {
    Swal.fire({
      title: "Do you want to pay?",
      showCancelButton: true,
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        // make a order

        const amount = document.getElementById("UDATestCharge").value;
        console.log(amount, "amount");
        if (amount > 0) {
          setLoadingPayment(true);
          const data = {
            amount: amount,
            customer_email: ltpInfo?.email,
            customer_phone: ltpInfo?.mobileNo,
            first_name: ltpInfo?.name,
            description: `Pay UDA fees`,
            applicationNo: JSON.parse(localStorage.getItem("CurrentAppNo")),
            userId: userInfoFromLocalStorage()._id,
            page: "dashboard",
          };

          fetch(
            "https://residential-building.onrender.com/storePaymentInfo",
            // "http://localhost:5000/storePaymentInfo",
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                authorization: localStorage.getItem("jwToken"),
              },
              body: JSON.stringify({
                applicationNo: data.applicationNo,
                amount,
                customer_email: ltpInfo?.email,
                customer_phone: ltpInfo?.mobileNo,
              }),
            }
          )
            .then((res) => res.json())
            .then((storeResult) => {
              // setLoadingPayment(false);
              console.log(storeResult, "Store payment");

              if (
                storeResult?.acknowledged &&
                Number(storeResult?.onlinePaymentStatus?.amount) ===
                  Number(amount)
              ) {
                fetch(
                  "https://residential-building.onrender.com/initiateJuspayPayment",
                  // "http://localhost:5000/initiateJuspayPayment",
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      authorization: localStorage.getItem("jwToken"),
                    },
                    body: JSON.stringify(data),
                  }
                )
                  .then((response) => {
                    if (!response.ok) {
                      throw new Error(`Failed to make payment`);
                    }
                    return response.json();
                  })
                  .then((data) => {
                    console.log(data, "DATA");
                    if (data.status === "NEW") {
                      const url = data.payment_links.web;
                      window.location.href = url;
                    } else {
                      toast.error(data.message);
                    }
                    setLoadingPayment(false);
                  })
                  .catch((error) => {
                    setLoadingPayment(false);
                    console.log(error, "Payment error");
                    toast.error(error.message);
                  });
              } else {
                setLoadingPayment(false);
                toast.error("Failed to make payment");
              }
            })
            .catch((err) => {
              setLoadingPayment(false);
              toast.error("Failed to make payment");
            });
        } else {
          toast.error("Please enter a valid amount");
        }
      }
    });
  };

  console.log(sentData, "Sent data");

  return (
    <div className="grid m-4 lg:my-0 text-gray-900">
      <form
        onSubmit={(e) => {
          e.preventDefault();

          if (sentData !== 1) {
            confirmAlert(undefined, sendPaymentData, {
              page: "payment",
              applicationType: JSON.parse(localStorage.getItem("page")),
              setSentData,
            });
          } else {
            alertToTransferDataIntoDepartment(
              JSON.parse(localStorage.getItem("CurrentAppNo")),
              navigate
            );
          }
        }}
        className="grid my-5 lg:my-0"
      >
        {/* UDA Charge  */}
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
            <FaCcAmazonPay size={30} className="text-normalViolet" />
            <h3 className="font-bold text-xl text-gray-900 ml-3">UDA Charge</h3>
          </motion.div>

          <div className="px-2">
            <hr className="w-full h-[1.5px] inline-block bg-gray-400" />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 -mt-2">
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
              id="userCharges"
              name="userCharges"
              label="User Charges"
              placeholder="000"
              type="number"
              ltpDetails={calculatedData?.userCharged}
            />
            <InputField
              id="UDATotalCharged"
              name="UDATotalCharged"
              label="Total"
              placeholder="000"
              type="number"
              ltpDetails={calculatedData?.UDATotalCharged}
            />
            <InputField
              id="UDATestCharge"
              name="UDATestCharged"
              label="Pay Online"
              placeholder="000"
              type="number"
            />
            {role === "LTP" && cameFrom?.toLowerCase() === "draft" && (
              <>
                {applicationData?.onlinePaymentStatus?.order_id ? (
                  <div className="flex gap-2 items-end ms-5 mt-[16px]">
                    <Link
                      to={`/dashboard/draftApplication/paymentStatus/${applicationData?.onlinePaymentStatus?.order_id}`}
                      className="bg-gradient-to-b from-normalViolet to-normalViolet text-white w-fit px-4 py-3 rounded-full capitalize font-roboto flex gap-2 items-center shadow-lg"
                    >
                      <IoReceipt size={15} className="mr-1" />
                      Payment Receipt
                    </Link>
                  </div>
                ) : (
                  <motion.div
                    className="flex ms-5 items-center mt-[16px] pay-btn-container"
                    initial={{ opacity: 0, x: 40 }}
                    whileInView={{
                      opacity: 1,
                      x: 0,
                      transition: { duration: 1 },
                    }}
                    viewport={{ once: true }}
                  >
                    <button
                      className="pay-btn mt-3"
                      onClick={confirmMessageForPayment}
                    >
                      <div className="svg-wrapper-1">
                        <div className="svg-wrapper">
                          <SendIcon />
                        </div>
                      </div>
                      <span>{loadingPayment ? "Paying..." : "Pay now"}</span>
                    </button>
                  </motion.div>
                )}
              </>
            )}
            {role === "PS" && (
              <>
                {/* <button
                  className={`btn btn-md nm_Container w-[70%] max-w-xs mx-auto text-sm px-3 mt-10 border-none text-white transition-all duration-500 bg-normalViolet hover:bg-bgColor hover:text-normalViolet`}
                  onClick={() => setViewChallan(true)}
                >
                  <MdOutlineReceiptLong size={20} />
                  View Challan
                </button> */}
                {viewChallan && (
                  <Modal
                    viewChallan={viewChallan}
                    setViewChallan={setViewChallan}
                  />
                )}

                {/* <button
                  className={`btn btn-md text-sm px-3 mt-5 mb-1 font-roboto w-[70%] max-w-xs mx-3 border-none text-white shadow-md transition-all duration-500 ${gradientColor} nm_Container hover:bg-gradient-to-bl`}
                  onClick={() =>
                    document.getElementById("my_modal_4").showModal()
                  }
                >
                  <GiMoneyStack size={25} /> View Payment Receipt
                </button> */}

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
        </motion.div>

        {/* Grama Panchayat fee */}
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
            <MdOutlinePayments size={30} className="text-normalViolet" />
            <h3 className="font-bold text-xl text-gray-900 ml-3">
              Grama Panchayat fee
            </h3>
          </motion.div>

          <div className="px-2">
            <hr className="w-full h-[1.5px] inline-block bg-gray-400" />
          </div>

          <div className="-mt-2">
            <div className="grid grid-cols-2 lg:grid-cols-4">
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
                id="gramaSiteApprovalCharges"
                name="gramaSiteApprovalCharges"
                label="Site Approval Charges"
                placeholder="000"
                type="number"
                ltpDetails={calculatedData?.gramaSiteApprovalCharged}
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
                  applicationData?.payment?.gramaPanchayatFee
                    ?.gramaChallanDate ?? ""
                }
              />
              <InputField
                id="gramaBankName"
                name="gramaBankName"
                label="Bank name"
                placeholder="xxxx"
                type="text"
                ltpDetails={
                  applicationData?.payment?.gramaPanchayatFee?.gramaBankName ??
                  ""
                }
              />
              <InputField
                id="gramaBankBranch"
                name="gramaBankBranch"
                label="Branch"
                placeholder="xxxx"
                type="text"
                ltpDetails={
                  applicationData?.payment?.gramaPanchayatFee
                    ?.gramaBankBranch ?? ""
                }
              />
            </div>

            <motion.div
              className="px-3 mb-4 flex justify-end"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0, transition: { duration: 1 } }}
              viewport={{ once: true }}
            >
              <div className="form-control w-full max-w-xs">
                {role === "LTP" && cameFrom === "draft" && (
                  <input
                    type="file"
                    className="file-input file-input-bordered w-full max-w-xs text-gray-400 bg-white dark:text-black"
                    id="gramaBankReceipt"
                    onChange={(e) => handleFileChange(e, "gramaBankReceipt")}
                  />
                )}
              </div>
              {applicationData?.payment?.gramaPanchayatFee
                ?.gramaBankReceipt && (
                <Link
                  to={`https://drive.google.com/file/d/${applicationData?.payment?.gramaPanchayatFee?.gramaBankReceipt}/view?usp=sharing`}
                  target="_blank"
                  className="flex justify-center items-center ms-10 px-4 py-2 hover:underline bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-lg shadow-lg rounded-full"
                >
                  <MdReceiptLong className="me-1" />
                  View Challan
                </Link>
              )}
            </motion.div>
          </div>
        </motion.div>

        {/* Labour cess charge  */}
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
            <FaMoneyCheckAlt size={30} className="text-normalViolet" />
            <h3 className="font-bold text-xl text-gray-900 ml-3">
              Labour cess charge
            </h3>
          </motion.div>

          <div className="px-2">
            <hr className="w-full h-[1.5px] inline-block bg-gray-400" />
          </div>

          <div className="-mt-2">
            <div className="grid lg:grid-cols-4">
              <InputField
                id="labourCess01"
                name="labourCess01"
                label="Labour Cess Component 1"
                placeholder="000"
                type="number"
                ltpDetails={calculatedData?.labourCessCompo1Charged}
              />
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 mb-4">
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

            <motion.div
              className="px-3 mb-4 flex justify-end"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0, transition: { duration: 1 } }}
              viewport={{ once: true }}
            >
              <div className="form-control w-full max-w-xs">
                {role === "LTP" && cameFrom === "draft" && (
                  <input
                    type="file"
                    className="file-input file-input-bordered w-full max-w-xs text-gray-400 bg-white dark:text-black"
                    id="labourCessBankReceipt"
                    onChange={(e) =>
                      handleFileChange(e, "labourCessBankReceipt")
                    }
                  />
                )}
              </div>

              {applicationData?.payment?.labourCessCharge
                ?.labourCessBankReceipt && (
                <Link
                  to={`https://drive.google.com/file/d/${applicationData?.payment?.labourCessCharge?.labourCessBankReceip}/view?usp=sharing`}
                  target="_blank"
                  className="flex justify-center items-center ms-10 px-4 py-2 hover:underline bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-lg shadow-lg rounded-full"
                >
                  <MdReceiptLong className="me-1" />
                  View Challan
                </Link>
              )}
            </motion.div>
          </div>
        </motion.div>

        {/* Green fee charge  */}
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
            <HiCurrencyRupee size={30} className="text-normalViolet" />
            <h3 className="font-bold text-xl text-gray-900 ml-3">
              Green fee charge
            </h3>
          </motion.div>

          <div className="px-2">
            <hr className="w-full h-[1.5px] inline-block bg-gray-400" />
          </div>

          <div className="-mt-2">
            <div className="grid lg:grid-cols-4">
              <InputField
                id="greenFeeCharge"
                name="greenFeeCharge"
                label="Green fee charge"
                placeholder="000"
                type="number"
                ltpDetails={calculatedData?.greenFeeCharged}
              />
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 mb-4">
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

            <motion.div
              className="px-3 mb-4 flex justify-end"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0, transition: { duration: 1 } }}
              viewport={{ once: true }}
            >
              <div className="form-control w-full max-w-xs">
                {role === "LTP" && cameFrom === "draft" && (
                  <input
                    type="file"
                    className="file-input file-input-bordered w-full max-w-xs text-gray-400 bg-white dark:text-black"
                    id="greenFeeBankReceipt"
                    onChange={(e) => handleFileChange(e, "greenFeeBankReceipt")}
                  />
                )}
              </div>
              {applicationData?.payment?.greenFeeCharge
                ?.greenFeeBankReceipt && (
                <Link
                  to={`https://drive.google.com/file/d/${applicationData?.payment?.greenFeeCharge?.greenFeeBankReceipt}/view?usp=sharing`}
                  target="_blank"
                  className="flex justify-center items-center ms-10 px-4 py-2 hover:underline bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-lg shadow-lg rounded-full"
                >
                  <MdReceiptLong className="me-1" />
                  View Challan
                </Link>
              )}
            </motion.div>
          </div>
        </motion.div>

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
