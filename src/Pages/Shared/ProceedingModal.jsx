import { DateTime } from "luxon";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../AuthProvider/AuthProvider";
const ProceedingModal = () => {
  // const { setOpenProceeding, openProceeding, filteredData } = modalProceeding;
  const {
    getApplicationData,
    calculateNoOfFloors,
    getUserData,
    userInfoFromLocalStorage,
  } = useContext(AuthContext);

  const applicationNo = JSON.parse(localStorage.getItem("CurrentAppNo"));
  const cameFrom = JSON.parse(localStorage.getItem("page"));

  const [allInfo, setAllInfo] = useState("");
  const [approvedDate, setApprovedDate] = useState([]);
  const [validProceedingDate, setValidProceedingDate] = useState([]);
  const [psData, setPsData] = useState(null);
  const [psSignImg, setPsSignImg] = useState(null);

  // useEffect(() => {
  //   const modal = document.getElementById("proceedingModal");
  //   if (openProceeding) {
  //     modal.showModal();
  //   }
  // }, [openProceeding]);

  const currentDate = DateTime.local();
  const formattedDate = currentDate.toFormat("dd-MM-yyyy");

  useEffect(() => {
    const psData = async () => {
      const { userId } = userInfoFromLocalStorage();

      const data = await getUserData(userId);
      console.log(data, "data");
      if (data?.userInfo) {
        setPsData(data?.userInfo);
        fetch(
          `https://residential-building.onrender.com/proxy-image?url=https://drive.google.com/thumbnail?id=${data?.userInfo?.signId}`
        )
          .then((res) => {
            console.log(res);
            setPsSignImg(res.url);
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      }
    };

    psData();
  }, []);

  useEffect(() => {
    // if (filteredData) {
    //   setAllInfo(filteredData);
    // } else {
    const getData = async () => {
      const applicationData = await getApplicationData(applicationNo, cameFrom);
      // console.log(applicationData, "All info ApplicationData");

      setAllInfo(applicationData);
    };
    // };
    getData();
    // }
  }, []);

  const dateArray = (date) => {
    return date?.split("")?.filter((item) => item !== "-");
  };

  useEffect(() => {
    console.log(allInfo, "ALL info");
    if (allInfo && Object.keys(allInfo)?.length) {
      const psSubmitDate = allInfo?.submitDate;
      // console.log(psSubmitDate, 'psSubmitDate');

      if (psSubmitDate?.length) {
        const splitSubmitDateOfPs = dateArray(psSubmitDate);
        setApprovedDate(splitSubmitDateOfPs);

        const splitDate = psSubmitDate?.split("-");
        // console.log(splitDate, "Split date");
        splitDate[splitDate?.length - 1] = String(
          Number(splitDate[splitDate?.length - 1]) + 3
        );

        console.log(splitDate, "NEW SPLIT DATE");
        const existProceedingDate = dateArray(splitDate.join(""));
        setValidProceedingDate(existProceedingDate);
      }
    }
  }, [allInfo]);

  const dropIn = {
    hidden: {
      y: "-100vh",
      opacity: 0,
    },
    visible: {
      y: "0",
      opacity: 1,
      transition: {
        duration: 0.1,
        type: "spring",
        damping: 25,
        stiffness: 500,
      },
    },
    exit: {
      y: "100vh",
      opacity: 0,
    },
  };

  return (
    <div id="proceedingModal">
      <div
        className={` relative rounded-lg  py-10 px-6 text-gray-900 w-full  bg-white`}
      >
        {/* <form className="absolute top-6 right-6 z-50">
          
          <button
            onClick={() => setOpenProceeding(false)}
            className={`outline outline-red-500 outline-offset-4 text-red-500 rounded-full hover:bg-red-500 hover:text-white hover:outline-offset-0 p-[1px] transition-all duration-1000`}
          >
            <RxCross2 className="text-2xl" />
          </button>
        </form> */}
        <div>
          <p className="text-center">
            <span className="underline">
              {allInfo?.buildingInfo?.generalInformation?.mandal}
            </span>{" "}
            మండలం,{" "}
            <span className="underline">
              {allInfo?.buildingInfo?.generalInformation?.gramaPanchayat}
            </span>{" "}
            గ్రామ పంచాయతి కార్యదర్శి వారి ఉత్తర్వులు ప్రస్తుతము శ్రీ{" "}
            <span className="underline">
              {allInfo?.applicantInfo?.applicantDetails?.[0]?.name}
            </span>
          </p>

          <h1 className="font-bold text-xl my-7  text-center">
            భవన నిర్మాణ ఉత్తర్వులు
          </h1>

          <p className="font-semibold text-sm mt-4">వరకు,</p>
          <div className="flex mt-1">
            <div className="basis-[40%]  mr-5">
              <table className="min-w-full border border-gray-900 h-20">
                <td className="p-2">
                  భవన యజమాని వివరములు{" "}
                  <span className="underline">
                    {allInfo?.applicantInfo?.applicantDetails?.[0]?.name}
                  </span>
                </td>
              </table>
            </div>
            <div className="basis-[60%]">
              <table className="min-w-full border border-gray-900 h-20">
                <thead>
                  <tr>
                    <th className="p-2 border-r border-neutral-500">
                      బి. ఎ.నెం.
                    </th>
                    <th colSpan={8} className="p-2">
                      <span className="">{allInfo?.applicationNo}</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-neutral-500">
                    <th className="border-r p-2 border-neutral-500 text-base">
                      తేది
                    </th>
                    {approvedDate?.length &&
                      approvedDate?.map((item, index) => {
                        return (
                          <td
                            key={index}
                            className="border-r p-2 border-neutral-500 text-base text-center"
                          >
                            {item ?? "N/A"}
                          </td>
                        );
                      })}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="mt-5 px-20 flex">
          <span className="font-semibold mr-1">విషయము: </span>
          <p>
            భవన అనుమతులు - వ్యక్తిగత నివాస భవన నిర్మాణము - అనుమతులు - ఇచ్చుట -
            గురించి.
          </p>
        </div>

        <div className="mt-5 flex ms-20">
          <p className="font-semibold mr-2">సూచిక:</p>
          <ol className="">
            <li className="">
              జి. ఓ. యం. ఎస్. నెం. <span className="font-bold">61,</span> తేది.{" "}
              <span className="font-bold">12.02.2019</span> పురపాలక మరియు
              పట్టణాభివృద్ధి శాఖ, ఆంధ్రప్రదేశ్ వారి ఉత్తర్వులు.
            </li>
            <li className="mt-3">ఆర్. ఓ. సి. నెం.</li>
            <li className="mt-3">
              జి. ఓ. యం. ఎస్. నెం. <span className="font-bold">119,</span> తేది.{" "}
              <span className="font-bold">10.07.2017</span> పురపాలక మరియు
              పట్టణాభివృద్ధి శాఖ, ఆంధ్రప్రదేశ్ వారి ఉత్తర్వులు.
            </li>
            <li className="mt-3">
              దరఖాస్తు చేసుకొనిన తేది: ………digital sign date………….
            </li>
          </ol>
        </div>
        <p className="mt-3 text-justify indent-14 leading-8">
          ఆంధ్ర ప్రదేశ్ మహానగర ప్రాంతం మరియు పట్టణాభివృద్ధి చట్టము, 2016 నందలి
          సెక్షన్ 7(1) (హెచ్) అనుసరించి, సూచిక 2 నందు వైస్-చైర్మన్, బొబ్బిలి
          పట్టణాభివృద్ధి సంస్థ, బొబ్బిలి వారు జారీ చేసిన అధికార బదలాయింపు
          ఉత్తర్వులను అనుసరించి, సూచిక 3 నందలి ప్రభుత్వ ఉత్తర్వులలో జారీ చేయబడిన
          భవన నియమాలకు లోబడి, మీరు దరఖాస్తు చేసుకొనిన భవన నిర్మాణ దరఖాస్తును
          షరతులతో కూడిన అనుమతులు జారీ చేయడం జరుగుతున్నది.
        </p>

        <table className="min-w-full mt-6 ">
          <thead className="border border-gray-900 ">
            <tr>
              <th className="border-r border-neutral-500 p-2 w-16">A</th>
              <th colSpan={4} className="p-2">
                దరఖాస్తు దారులు మరియు ఎల్.టి.పి వివరములు
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border border-gray-900">
              <td className="p-2 border-r border-neutral-500 text-center font-semibold">
                1
              </td>
              <td className="p-2 border-r border-neutral-500">
                దరఖాస్తుదారులు
              </td>
              <td colSpan={4} className="p-2">
                {allInfo?.applicantInfo?.applicantDetails?.[0]?.name}
              </td>
            </tr>
            <tr className="border border-gray-900">
              <td className="p-2 border-r border-neutral-500 text-center font-semibold">
                2
              </td>
              <td className="p-2 border-r border-neutral-500">
                లైసెన్సుడ్ టెక్నికల్ పర్సన్
              </td>
              <td className="p-2 border-r border-neutral-500">
                {allInfo?.applicantInfo?.ltpDetails?.name}
              </td>
              <td className="p-2 border-r border-neutral-500">లైసెన్స్ నెం</td>
              <td colSpan={2} className="p-2 border-r border-neutral-500">
                {allInfo?.applicantInfo?.ltpDetails?.licenseNo} &{" "}
                <span>{allInfo?.applicantInfo?.ltpDetails?.validity}</span>
              </td>
            </tr>
            <tr className="border border-gray-900">
              <th className="p-2 border-r border-neutral-500">B</th>
              <td
                colSpan={5}
                className="border-r border-neutral-500 font-semibold text-center"
              >
                స్థల వివరములు
              </td>
            </tr>
            <tr className="p-2 border border-gray-900">
              <td className="p-2 border-r border-neutral-500 text-center font-semibold">
                1
              </td>
              <td className="p-2 border-r border-neutral-500">సర్వే నెం.</td>
              <td colSpan={4} className="p-2 border-r border-neutral-500">
                {allInfo?.buildingInfo?.generalInformation?.surveyNo}
              </td>
            </tr>
            <tr className="p-2 border border-gray-900 beforeClass">
              <td className="p-2 border-r border-neutral-500 text-center font-semibold">
                2
              </td>
              <td className="p-2 border-r border-neutral-500">డోర్ నెం.</td>
              <td colSpan={4} className="p-2 border-r border-neutral-500">
                {allInfo?.applicantInfo?.applicantDetails[0]?.ownerDoorNo}
              </td>
            </tr>
            <tr className="p-2 border border-gray-900">
              <td className="p-2 border-r border-neutral-500 text-center font-semibold">
                3
              </td>
              <td className="p-2 border-r border-neutral-500">ప్లాట్ నెం.</td>
              <td colSpan={4} className="p-2 border-r border-neutral-500">
                {allInfo?.buildingInfo?.generalInformation?.plotNo ?? "N/A"}
              </td>
            </tr>
            <tr className="p-2 border border-gray-900">
              <td className="p-2 border-r border-neutral-500 text-center font-semibold">
                4
              </td>
              <td className="p-2 border-r border-neutral-500">గ్రామము</td>
              <td colSpan={4} className="p-2 border-r border-neutral-500">
                {allInfo?.buildingInfo?.generalInformation?.village}
              </td>
            </tr>
            <tr className="p-2 border border-gray-900">
              <td className="p-2 border-r border-neutral-500 text-center font-semibold">
                5
              </td>
              <td className="p-2 border-r border-neutral-500">గ్రామ పంచాయతీ</td>
              <td colSpan={4} className="p-2 border-r border-neutral-500">
                {allInfo?.buildingInfo?.generalInformation?.gramaPanchayat}
              </td>
            </tr>
            <tr className="p-2 border border-gray-900">
              <td className="p-2 border-r border-neutral-500 text-center font-semibold">
                6
              </td>
              <td className="p-2 border-r border-neutral-500">మండలం</td>
              <td colSpan={4} className="p-2 border-r border-neutral-500">
                {allInfo?.buildingInfo?.generalInformation?.mandal}
              </td>
            </tr>
            <tr className="p-2 border border-gray-900">
              <td className="p-2 border-r border-neutral-500 text-center font-semibold">
                7
              </td>
              <td className="p-2 border-r border-neutral-500">జిల్లా</td>
              <td colSpan={4} className="p-2 border-r border-neutral-500">
                {allInfo?.buildingInfo?.generalInformation?.district}
              </td>
            </tr>
            <tr className="border border-gray-900">
              <th className="p-2 border-r border-neutral-500">C</th>
              <td
                colSpan={5}
                className="border-r border-neutral-500 font-semibold text-center"
              >
                అనుమతి వివరములు
              </td>
            </tr>
            <tr className="p-2 border-none">
              <td className="p-2 border-l border-neutral-500 text-center font-semibold">
                1
              </td>
              <td className="p-2 border-r border-neutral-500">
                సెట్-బాక్స్ (మీ)
              </td>
              <td className="p-2 border-r border-neutral-500 text-center">
                ముందు
              </td>
              <td className="p-2 border-r border-neutral-500 text-center">
                వెనుక
              </td>
              <td className="p-2 border-r border-neutral-500 text-center">
                ప్రక్క I
              </td>
              <td className="p-2 border-r border-neutral-500 text-center">
                ప్రక్క II
              </td>
            </tr>
            <tr className="p-2 border-none">
              <td className="p-2 border-l border-neutral-500 text-center font-semibold"></td>
              <td className="p-2 border-r border-neutral-500"></td>
              <td className="p-2 border-r border-t border-neutral-500 text-center">
                {allInfo?.buildingInfo?.plotDetails?.frontSetback
                  ? allInfo?.buildingInfo?.plotDetails?.frontSetback
                  : "N/A"}
              </td>
              <td className="p-2 border-r border-t border-neutral-500 text-center">
                {allInfo?.buildingInfo?.plotDetails?.rareSetback
                  ? allInfo?.buildingInfo?.plotDetails?.rareSetback
                  : "N/A"}
              </td>
              <td className="p-2 border-r border-t border-neutral-500 text-center">
                {allInfo?.buildingInfo?.plotDetails?.side1Setback
                  ? allInfo?.buildingInfo?.plotDetails?.side1Setback
                  : "N/A"}
              </td>
              <td className="p-2 border-r border-t border-neutral-500 text-center">
                {allInfo?.buildingInfo?.plotDetails?.side2Setback
                  ? allInfo?.buildingInfo?.plotDetails?.side2Setback
                  : "N/A"}
              </td>
            </tr>
            <tr className="p-2 border border-gray-900">
              <td className="p-2 border-r border-neutral-500 text-center font-semibold">
                2
              </td>
              <td className="p-2 border-r border-neutral-500">
                స్థల వైశాల్యం (మీ2)
              </td>
              <td colSpan={4} className="p-2 border-r border-neutral-500">
                {allInfo?.buildingInfo?.plotDetails?.proposedPlotAreaCal ??
                  "N/A"}
              </td>
            </tr>
            <tr className="p-2 border border-gray-900">
              <td className="p-2 border-r border-neutral-500 text-center font-semibold">
                3
              </td>
              <td className="p-2 border-r border-neutral-500">
                రోడ్ ప్రభావము గల వైశాల్యం (మీ2)
              </td>
              <td colSpan={4} className="p-2 border-r border-neutral-500">
                {allInfo?.buildingInfo?.plotDetails?.roadWideningAreaCal}
              </td>
            </tr>
            <tr className="p-2 border border-gray-900">
              <td className="p-2 border-r border-neutral-500 text-center font-semibold">
                4
              </td>
              <td className="p-2 border-r border-neutral-500">
                పూర్తి వైశాల్యం (మీ2)
              </td>
              <td colSpan={4} className="p-2 border-r border-neutral-500">
                {allInfo?.buildingInfo?.plotDetails?.netPlotAreaCal ?? "N/A"}
              </td>
            </tr>
            <tr className="p-2 border border-gray-900">
              <td className="p-2 border-r border-neutral-500 text-center font-semibold">
                5
              </td>
              <td className="p-2 border-r border-neutral-500">
                అంతస్తుల మొత్తము
              </td>
              <td colSpan={4} className="p-2 border-r border-neutral-500">
                {calculateNoOfFloors(allInfo?.floorDetails)}
              </td>
            </tr>
            <tr className="p-2 border border-gray-900">
              <td className="p-2 border-r border-neutral-500 text-center font-semibold">
                6
              </td>
              <td className="p-2 border-r border-neutral-500">
                నిర్మాణ స్థలం మొత్తము
              </td>
              <td colSpan={4} className="p-2 border-r border-neutral-500">
                {allInfo?.buildingInfo?.plotDetails?.totalBuiltUpArea}
              </td>
            </tr>
            <tr className="border border-gray-900">
              <th className="p-2 border-r border-neutral-500">D</th>
              <td
                colSpan={5}
                className="border-r border-neutral-500 font-semibold text-center"
              >
                చెల్లించిన రుసుము వివరములు (రూ.) మొత్తము:
              </td>
            </tr>
            <tr className="p-2 border border-gray-900">
              <td className="p-2 border-r border-neutral-500 text-center font-semibold">
                1
              </td>
              <td className="p-2 border-r border-neutral-500">
                డెవలప్మెంట్ చార్జెస్ (బిల్డుప్ ఏరియా )
              </td>
              <td className="p-2 border-r border-neutral-500">
                {allInfo?.payment?.udaCharge?.builtUpArea}
              </td>
              <td className="p-2 border-r border-neutral-500 w-5 text-center font-semibold">
                8
              </td>
              <td className="p-2 border-r border-neutral-500">గ్రీన్ ఫీజు</td>
              <td className="p-2 border-r border-neutral-500">
                {allInfo?.payment?.greenFeeCharge?.greenFee}
              </td>
            </tr>
            <tr className="p-2 border border-gray-900">
              <td className="p-2 border-r border-neutral-500 text-center font-semibold">
                2
              </td>
              <td className="p-2 border-r border-neutral-500">
                డెవలప్మెంట్ చార్జెస్ (వేకేంట్ ల్యాండ్)
              </td>
              <td className="p-2 border-r border-neutral-500">
                {allInfo?.payment?.udaCharge?.vacantArea}
              </td>
              <td className="p-2 border-r border-neutral-500 text-center font-semibold ">
                9
              </td>
              <td className="p-2 border-r border-neutral-500">
                బిల్డింగ్ పర్మిట్ ఫీజు
              </td>
              <td className="p-2 border-r border-neutral-500">
                {allInfo?.payment?.gramaPanchayatFee?.buildingPermitFees}
              </td>
            </tr>
            <tr className="p-2 border border-gray-900">
              <td className="p-2 border-r border-neutral-500 text-center font-semibold">
                3
              </td>
              <td className="p-2 border-r border-neutral-500">
                బెట్టేర్మేంట్ చార్జెస్:
              </td>
              <td className="p-2 border-r border-neutral-500">
                {allInfo?.payment?.gramaPanchayatFee?.bettermentCharged}
              </td>
              <td className="p-2 border-r border-neutral-500 text-center font-semibold">
                10
              </td>
              <td className="p-2 border-r border-neutral-500">
                సైట్ అప్రూవల్ చార్జెస్
              </td>
              <td className="p-2 border-r border-neutral-500">
                {allInfo?.payment?.gramaPanchayatFee?.gramaSiteApprovalCharged}
              </td>
            </tr>
            <tr className="p-2 border border-gray-900">
              <td className="p-2 border-r border-neutral-500 text-center font-semibold">
                4
              </td>
              <td className="p-2 border-r border-neutral-500">
                14% ఖాళీ స్థల చార్జెస్
              </td>
              <td className="p-2 border-r border-neutral-500">
                {
                  allInfo?.payment?.udaCharge?.bettermentCharged
                    ?.TotalOpenSpaceCharged
                }
              </td>
              <td className="p-2 border-r border-neutral-500 text-center font-semibold">
                11
              </td>
              <td className="p-2 border-r border-neutral-500">
                పేపర్ పబ్లికేషన్ చార్జెస్
              </td>
              <td className="p-2 border-r border-neutral-500">
                {allInfo?.payment?.gramaPanchayatFee?.paperPublicationFee}
              </td>
            </tr>
            <tr className="p-2 border border-gray-900">
              <td className="p-2 border-r border-neutral-500 text-center font-semibold">
                5
              </td>
              <td className="p-2 border-r border-neutral-500">
                33% పీనలైజేషన్ చార్జెస్
              </td>
              <td className="p-2 border-r border-neutral-500">
                {allInfo?.payment?.udaCharge?.TotalPenalizationCharged}
              </td>
              <td className="p-2 border-r border-neutral-500 text-center font-semibold">
                12
              </td>
              <td className="p-2 border-r border-neutral-500">
                ప్రోసెసింగ్ ఫీజు
              </td>
              <td className="p-2 border-r border-neutral-500">
                {allInfo?.payment?.gramaPanchayatFee?.processingFee}
              </td>
            </tr>
            <tr className="p-2 border border-gray-900 beforeClass">
              <td className="p-2 border-r border-neutral-500 text-center font-semibold ">
                6
              </td>
              <td className="p-2 border-r border-neutral-500">
                లేబర్ చెస్ కాంపౌండ్ 1
              </td>
              <td className="p-2 border-r border-neutral-500">
                {allInfo?.payment?.labourCessCharge?.labourCessOne}
              </td>
              <td className="p-2 border-r border-neutral-500 text-center font-semibold">
                13
              </td>
              <td className="p-2 border-r border-neutral-500">
                లేబర్ చెస్ కాంపౌండ్ 2
              </td>
              <td className="p-2 border-r border-neutral-500">
                {allInfo?.payment?.udaCharge?.labourCessTwo}
              </td>
            </tr>
            <tr className="p-2 border border-gray-900">
              <td className="p-2 border-r border-neutral-500 text-center font-semibold">
                7
              </td>
              <td className="p-2 border-r border-neutral-500">
                వినియోగదారు ఛార్జీలు
              </td>
              <td className="p-2 border-r border-neutral-500" colSpan={4}>
                1000
              </td>
            </tr>
          </tbody>
        </table>
        <table className="min-w-full border border-gray-900 mt-5">
          <tbody>
            <tr className="border-t border-neutral-500">
              <td className="border-r p-2 border-neutral-500 text-base w-[8%] text-center font-semibold">
                E
              </td>
              <td className="p-2 border-r w-[39%] border-neutral-500 text-base">
                భవన నిర్మాణం ప్రారంభమునకు తేది
                {/* proceeding date (Confusion) */}
              </td>
              {approvedDate?.length &&
                approvedDate?.map((item, index) => {
                  return (
                    <td
                      key={index}
                      className="border-r p-2 border-neutral-500 text-base text-center"
                    >
                      {item ?? "N/A"}
                    </td>
                  );
                })}
            </tr>
            <tr className="border-t border-neutral-500">
              <td className="border-r p-2 border-neutral-500 text-base text-center font-semibold">
                F
              </td>

              <td className="border-r p-2 border-neutral-500 text-base">
                భవన నిర్మాణం పూర్తి కావలసిన తేది
                {/* Proceeding date + 3years */}
              </td>
              {validProceedingDate?.length &&
                validProceedingDate?.map((item, index) => {
                  return (
                    <td
                      key={index}
                      className="border-r p-2 border-neutral-500 text-base text-center"
                    >
                      {item ?? "N/A"}
                    </td>
                  );
                })}
            </tr>
          </tbody>
        </table>

        <div className="mt-10 p-4">
          <h4 className="font-semibold underline text-md p-3 pb-0">షరతులు:</h4>
          <ol className="px-10 text-justify leading-8">
            <li className="mt-3">
              ఈ ఉత్తర్వులతో జత చేయబడిన ఆమోదించబడిన ప్లాను ప్రకారము భవన నియమాలకు
              లోబడి మాత్రమే భవన నిర్మాణము జరపవలెను.
            </li>
            <li className="mt-3">
              భవన నిర్మాణమును ఈ ఆర్డర్ పొందిన మూడు సంవత్సరాల లోగా పూర్తి
              చేసినట్లుగా ఈ కార్యాలయమునకు రాతపూర్వకముగా సమాచారం తెలపగలరు.
            </li>
            <li className="mt-3">
              పైన ఇచ్చిన గడువులోగా కట్టడం పూర్తి కానీ ఎడల తిరిగి అనుమతి
              పొందవలెను.
            </li>
            <li className="mt-3">
              ఆమోదించిన ప్లాను ఎల్లప్పుడూ కట్టడము స్థలమునందు జాగ్రత్త పరిచి
              గ్రామపంచాయతీ కార్యదర్శి వారికి గాని లేక వారి అనుమతి పొందిన
              సిబ్బందికి గాని లేదా బుడ అధికారులు తనిఖి నిమిత్తము అడిగినప్పుడు
              చూపవలెను.
            </li>
            <li className="mt-3">
              కాంపౌండ్ గోడ ఎత్తు రోడ్డు మట్టమునకు 1.50 మీటర్లు మించి ఉండరాదు
              గేటు, తలుపులు బయటకు అనగా రోడ్డు వైపునకు తెరవబడరాదు మరియు ఇంటి
              కప్పు ఉండి వర్షపు నీటిని పబ్లిక్ స్థలంలోకి గాని రోడ్డుమీద కు గాని
              రోడ్డు మార్జన్ లోనికి గాని రానీయరాడు. రోడ్డు జంక్షన్ వద్ద మూల నందు
              సరిపడిన స్థలము వదిలి గోడ అవసరమైనంత వంపు చేసి కట్టవలెను.
            </li>
            <li className="mt-3">
              నూతికి ఒక మీటర్ ఎత్తు తక్కువ కాకుండా పేరా పేట్ గోడ మరియు చుట్టూ
              ప్లాట్ఫారం కట్టుకోవలెను.
            </li>
            <li className="mt-3">
              భవాని యజమాని మరుగుదొడ్డికి విధిగా సెప్టిక్ ట్యాంక్ కట్టుకోవలెను.
            </li>
            <li className="mt-3">
              రోడ్డు మార్జన్లో గాని పబ్లిక్ స్థలములో గాని ఏ సందర్భంలోనూ ఆక్రమణ
              చేయరాదు. బిల్డింగ్ లోపలికి గాని స్థలం లోనికి గాని వెళ్లుటకు
              కట్టుకొను మెట్లు దరఖాస్తుదారు సొంత స్థలంలో మాత్రమే కట్టుకోవలెను.
            </li>
            <li className="mt-3">
              పంచాయతీ డ్రాయిన్ లేనప్పుడు పంచాయతీ రోడ్డు మీద మురుగు నీరు లేదా
              వాడుక నీరు లేకుండా నిరోధించుటకు ఇంటి ఆవరణలోనే సోక్పిట్ ఏర్పాటు
              చేసుకోవలెను.
            </li>
            <li className="mt-3">
              ప్రతిపాదించిన బిల్డింగ్ స్థలం నేషనల్ హైవే రోడ్డు నకు ఆనుకొని ఉన్న
              ఎడల బిల్డింగ్ లైన్ గా ఆరు మీటర్ల స్థలమును వదిలి భవనం
              నిర్మించుకోవలెను.
            </li>
            <li className="mt-3">
              నివాస కాంప్లెక్స్ కు ఆసుపత్రి, లాడ్జలు పాఠశాల కళాశాలలకు
              ఇండస్ట్రీస్ మొదలగు వాటికి పార్కింగ్ ప్రదేశముగా ప్లాన్ లో చూపిన
              విధంగా స్థలము కేటాయించవలెను.
            </li>
            <li className="mt-3">
              హై టెన్షన్ ఎలక్ట్రికల్ లైన్ బిల్డింగ్ ముందు నుండి వెళ్తున్న ఎడల
              భద్రత నిమిత్తము భవనం నకు కనీసం మూడు మీటర్ల దూరం ఉండవలెను.
            </li>
            <li className="mt-3">
              బిల్డింగ్ పని పూర్తి అయినట్లు లేదా బిల్డింగ్ ఉపయోగము లోనికి
              తీసుకున్నట్లు ఏది ముందు అయినప్పటికీ వెంటనే పంచాయతీ కార్యదర్శి
              వారికి తెలియజేయవలెను.
            </li>
            <li className="mt-3">
              ఆమోదించిన ప్లానుకు ఏ విధమైన మార్పులు తలపెట్టిన ను సదరు మార్పులు
              చేయకముందు గానే సవరించబడిన ప్లాను దరఖాస్తులు దాఖలు చేసుకొనవలెను
              అట్లు ఆమోదం పొందు వరకు ఏ విధమైన మార్పులు చేయరాదు.
            </li>
            <li className="mt-3">
              భవన నిర్మాణ నియమాలకు విరుద్ధంగా నిర్మాణం చేసిన ఎడల ఏ విధమైనది
              ముందస్తు నోటీసు ఇవ్వకుండానే సదువు నిర్మాణం తొలగించబడును.
            </li>
            <li className="mt-3">
              భవనమునకు ఎదురుగా ఈ సరిహద్దు వరకు పంచాయతీ రోడ్డు మార్గంలో మీ సొంత
              ఖర్చులతో విధిగా పక్కా డ్రైన్ పంచాయతీ కార్యదర్శి వారు సూచించిన
              కొలతల మేరకు నిర్మించుకొనవలెను.
            </li>
            <li className="mt-3">
              పంచాయతీ రోడ్డుపై ఏ విధమైన రాంపులు నిర్మాణములు చేయరాదు మరియు భవనం
              తాలూక బాల్కనీయులు ఖాళీ స్థలంలోకి చొచ్చుకొని రాకుండా
              నిర్మించుకోవలెను.
            </li>
            <li className="mt-3">
              లే అవుట్ నిబంధనలు పూర్తి చేయని భూములు యందు ప్రాథమిక సౌకర్యములైన
              రోడ్డు వీధిలైట్లు నీటి సరఫరా యజమాని తన సొంత ఖర్చు లతో ఏర్పాటు
              చేసుకోవలెను.
            </li>
            <li className="mt-3">
              శ్రీ డైరెక్టర్ ఆఫ్ టౌన్ అండ్ కంట్రీ ప్లానింగ్ గుంటూరు లేదా
              బొబ్బిలి అర్బన్ డెవలప్మెంట్ అథారిటీ వారి మాస్టర్ ప్లాన్ లోని
              రోడ్డు కొలతలు మరియు ఇతర షరతులకు లోబడి మాత్రమే ఆమోదం.
            </li>
            <li className="mt-3">
              ప్రభుత్వం వారి ఆక్ట్ నెంబరు 3/2006 ప్రకారం కన్వెన్షన్ ఫీజు
              చెల్లించి సంబంధిత ఆర్ డి ఓ గారి నుండి సర్టిఫికెట్ పంచాయతీ
              కార్యదర్శి వారు కోరినప్పుడు సమర్పించు వలసి ఉండును.
            </li>
            <li className="mt-3">
              తప్పుడు సమాచారంతో అనుమతి పొందిన ఎడల పై సూచిక మూడు నందలి బిల్డింగ్
              రూల్స్ అనుసరించి అనుమతి రద్దు పరచటమే గాక పంచాయతీ కార్యదర్శి గైకొను
              సివిల్ క్రిమినల్ చర్యలకు బాధ్యులగుదురు.
            </li>
            <li className="mt-3">
              ఈ మంజూరు ఉత్తర్వులు ప్రతిపాదిత నిర్మాణ స్థలము పై ఏ విధమైన యాజమాన్య
              హక్కులు ధ్రువీకరించవు.
            </li>
            <li className="mt-3">
              భవన యజమాని సొంత స్థలములో విధిగా ఇంకుడు గుంత నిర్మాణం చేసుకోవలెను.
            </li>
            <li className="mt-3">
              ఈ మంజూరు ఉత్తర్వులు రద్దు పరచుటకు లేదా నిలుపుదల చేయుటకు పంచాయతీ
              కార్యదర్శి వారి పూర్తి అధికారం గలదు.
            </li>
            <li className="mt-3">
              ఈ ప్రతిపాదనలను మంజూరు చేయుట ద్వారా ఈ గ్రామపంచాయతీ మీకు ఏ విధమైన
              లీగల్ టైటిల్ చేసినట్టుగాని ఇచ్చినట్టు గాని భావించరాదు.
            </li>
            <li className="mt-3">
              గ్రామపంచాయతీకి చెల్లించిన ఫీజు విషయంలో ఎటువంటి వ్యత్యాసం
              ఉన్నట్లుగా గమనించిన ఎడల భవన యజమాని నుండి వసూలు చేయబడును.
            </li>
          </ol>
        </div>
        <div className="mt-10 w-fit flex flex-col items-center ml-auto leading-8">
          <div>
            {/* `https://drive.google.com/thumbnail?id=${psData?.signId}` */}
            <img src={psSignImg} alt="signature" className="w-36" />
          </div>
          <div className="text-start min-w-[120px]">
            <p className="text-lg font-bold text-center">{psData?.name}</p>
            <p className="text-lg font-bold text-center">
              {psData?.gramaPanchayat}
            </p>
            <p className="text-lg font-bold text-center">
              Date: {formattedDate}
            </p>
          </div>
          <p className="font-semibold">పంచాయితీ కార్యదర్శి</p>
          <p>
            {allInfo?.buildingInfo?.generalInformation?.gramaPanchayat}
            ___________గ్రామ పంచాయితీ
          </p>
          <p>{allInfo?.buildingInfo?.generalInformation?.mandal}_____ మండలం </p>
        </div>
      </div>

      {/* <form method="dialog" className="modal-backdrop">
          <button onClick={() => setOpenProceeding(false)}>close</button>
        </form> */}
    </div>
  );
};

export default ProceedingModal;
