import { motion } from "framer-motion";
import React, { createContext, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  const [isDark, setIsDark] = useState(0);

  const stepCompleted = useRef(null);

  // get user information from the localStorage
  const userInfoFromLocalStorage = () => {
    return JSON.parse(localStorage.getItem("loggedUser"));
  };

  // update user info
  const updateUserInfoInLocalStorage = (id) => {
    fetch(`https://residential-building.onrender.com/getUser?id=${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          const { userInfo } = data;
          // set information to localstorage to stay logged in
          localStorage.setItem("loggedUser", JSON.stringify(userInfo));
          toast.success("user update successfully");
        } else {
          setLoading(false);
          toast.error("User update failed");
        }
      });
  };

  // send user data into the database
  const sendUserDataIntoDB = async (url, method = "PATCH", data) => {
    const config = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
    const response = await fetch(url, config);
    const result = await response.json();
    return result;
  };

  // get user data
  const getUserData = async (id) => {
    console.log(id, "AUTH ID");

    const response = await fetch(
      `https://residential-building.onrender.com/getUser?id=${id}`
    );
    const data = await response.json();
    console.log(data, "raian2");
    return data;
  };

  // set sweet alert's parameters dynamically
  const alertToTransferDataIntoDepartment = async (applicationNo, navigate) => {
    console.log(applicationNo, "CurrentApplicationNo");

    const data = { userId: userInfoFromLocalStorage()._id, applicationNo };

    const url = `https://residential-building.onrender.com/deleteApplication?data=${JSON.stringify(
      data
    )}`;
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to update this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "bg-violetLight",
      cancelButtonColor: "#000",
      confirmButtonText: "Yes, sent it!",
      showLoaderOnConfirm: true,
      preConfirm: async (confirm) => {
        console.log("confirm", confirm);

        return await fetch(url, { method: "DELETE" })
          .then((response) => {
            console.log(response, "response");
            if (!response.ok) {
              throw new Error(response?.statusText);
            }
            return response;
          })
          .catch((error) => {
            Swal.showValidationMessage(`Request failed: ${error}`);
          });
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      console.log(result);
      if (result.isConfirmed && result?.value?.ok) {
        Swal.fire({
          title: "Sent!",
          text: "Your file has been sent successfully.",
          icon: "success",
          confirmButtonColor: "bg-violetLight",
          confirmButtonText: "Ok",
        }).then((res) => {
          console.log(res);
          if (res.isConfirmed) {
            console.log("asi");
            navigate("/dashboard/submitApplication");
          } else {
            navigate("/dashboard/draftApplication");
          }
        });
      }
    });
  };

  // confirmation message and send data to database
  const confirmAlert = (stepperData, collectInputFieldData, pageWiseAction) => {
    console.log(userInfoFromLocalStorage()._id, "GET USER ID");

    const role = userInfoFromLocalStorage().role;

    const applicationNo = JSON.parse(localStorage.getItem("CurrentAppNo"));

    let url;

    const filterDataForLtp = JSON.stringify({
      userId: userInfoFromLocalStorage()._id,
      oldApplicationNo: applicationNo,
    });

    role === "LTP" &&
      (url = `https://residential-building.onrender.com/updateDraftApplicationData?filterData=${filterDataForLtp}`);

    role === "PS" &&
      (url = `https://residential-building.onrender.com/recommendDataOfPs?appNo=${applicationNo}`);

    // console.log(url, "url here");

    Swal.fire({
      title: "Do you want to save your information?",
      icon: "info",
      confirmButtonText: "Yes, save it",
      showCancelButton: true,
      confirmButtonColor: "bg-violetLight",
      cancelButtonColor: "#000",
      showLoaderOnConfirm: true,
      preConfirm: async (confirm) => {
        return await collectInputFieldData(url)
          .then((response) => {
            console.log(response, "response");

            if (!response?.acknowledged) {
              throw new Error(response.statusText);
            }
            return response;
          })
          .catch((error) => {
            Swal.showValidationMessage(`Request failed: ${error}`);
          });
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      console.log(result, "result");
      if (result?.isConfirmed && result?.value?.acknowledged) {
        toast.success("Data saved successfully");

        console.log(stepperData, "Stepper data");

        // if stepper data is exist then update stepper steps and navigate to the next step
        if (stepperData) {
          const [, currentStep, steps, handleStepClick] = stepperData;
          console.log(currentStep < steps.length - 1);
          currentStep < steps.length - 1 && handleStepClick(currentStep + 1);
        }

        if (pageWiseAction?.page === "PS site inspection data save") {
          const { refetch } = pageWiseAction;
          refetch();
        }
        if (pageWiseAction?.page === "payment") {
          const { setSentData } = pageWiseAction;
          localStorage.setItem("PPS", JSON.stringify(1));
          setSentData(1);
        }

        if (pageWiseAction?.page === "siteInspection") {
          const { navigate } = pageWiseAction;
          navigate("/dashboard/inward");
        }
      } else {
        if (
          pageWiseAction.applicationType === "draft" &&
          stepCompleted !== null
        ) {
          stepCompleted.current = stepCompleted.current - 1;
        }
        toast.error("Failed to save data");
      }
    });
  };

  // confirmation to delete data from the database
  const alertToConfirmDelete = (data, removeData) => {
    Swal.fire({
      title: "Do you want to delete the data?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      confirmButtonColor: "bg-violetLight",
      cancelButtonColor: "#000",
    }).then((result) => {
      if (result.isConfirmed) {
        removeData(data);
      }
    });
  };

  // specific application data
  const getApplicationData = async (appNo, page) => {
    try {
      setLoading(true);
      const query = JSON.stringify({
        appNo,
        userId: userInfoFromLocalStorage()?._id,
        role: userInfoFromLocalStorage()?.role,
        page,
      });

      const response = await fetch(
        `https://residential-building.onrender.com/getApplicationData?data=${query}`
      );

      return await response.json();
    } catch (err) {
      toast.error("ERROR");
    }
  };

  //ge specific submit data
  const getSubmitApplicationData = async (appNo) => {
    try {
      const query = JSON.stringify({
        appNo,
      });

      console.log(query, "query");

      const response = await fetch(
        `https://residential-building.onrender.com/getSubmitDataOfPs?appNo=${query}`
      );

      return await response.json();
    } catch (err) {
      toast.error("Server Error");
    }
  };

  // get all draft application data
  const getAllDraftApplicationData = async () => {
    try {
      const response = await fetch(
        `https://residential-building.onrender.com/allDraftApplicationData`
      );

      return await response.json();
    } catch (err) {
      toast.error("Server Error");
    }
  };

  // logout function
  const handleLogOut = (navigate) => {
    const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
    console.log(loggedUser, "Logged user");
    fetch(
      `https://residential-building.onrender.com/reverseLoggedInFlag?userId=${JSON.stringify(
        loggedUser._id
      )}`,
      {
        method: "PATCH",
      }
    )
      .then((res) => res.json())
      .then((result) => {
        if (result.acknowledged) {
          localStorage.clear();
          toast.success("Logout successfully");

          navigate("/");
        } else {
          toast.error("Server Error");
        }
      })
      .catch((err) => {
        toast.error("Server Error");
      });
  };

  // check license expiration of ltp
  const checkLicenseExpirationOfLtp = (validity) => {
    const validityDate = new Date(validity);

    if (validityDate.toString().includes("Invalid Date")) {
      return "Invalid Date";
    }

    const validityDay = validityDate.getUTCDate().toString().padStart(2, "0");
    const validityMonth = (validityDate.getUTCMonth() + 1)
      .toString()
      .padStart(2, "0");
    const validityYear = validityDate.getUTCFullYear();

    console.log(validityDay, validityMonth, validityYear, "VALIDITY");

    const todayDate = new Date();

    const todayDay = todayDate.getUTCDate().toString().padStart(2, "0");
    const todayMonth = (todayDate.getUTCMonth() + 1)
      .toString()
      .padStart(2, "0");
    const todayYear = todayDate.getUTCFullYear();

    console.log(todayDay, todayMonth, todayYear, "TODAY YEAR");

    const validityFormat = `${validityYear}-${validityMonth}-${validityDay}`;
    const todayFormat = `${todayYear}-${todayMonth}-${todayDay}`;

    const checkValidity = new Date(validityFormat);
    const checkToday = new Date(todayFormat);

    const timeStampValidity = checkValidity.getTime();
    const timeStampToday = checkToday.getTime();

    if (timeStampValidity < timeStampToday) {
      // validity is before today (expired)
      console.log("validity is before today");

      // toast.error("Validity is expired");
      return "Validity is expired";
    } else if (timeStampValidity > timeStampToday) {
      // validity is after today (available)
      console.log("validity is after today");

      const validity = validityFormat.split("-").reverse().join("-");
      return validity;
    } else {
      console.log("validity and today are the same");
      // toast.info("Validity will be expired tomorrow");
      return "Validity will be expired tomorrow";
    }
  };

  // sidebar active & hover color changed on the basis of theme
  const decideActiveColor = () => {
    const gradientColor =
      " text-normalViolet nm_Inset border-4 border-r-normalViolet";
    return gradientColor;
  };

  const decideHoverColor = () => {
    const hoverColor = "hover:text-normalViolet hover:nm_Container";
    return hoverColor;
  };

  const showPageBasedOnApplicationType = (applicationNo, navigate, page) => {
    localStorage.setItem("CurrentAppNo", JSON.stringify(applicationNo));
    localStorage.setItem("stepIndex", JSON.stringify(0));
    localStorage.setItem("page", JSON.stringify(page));

    if (page === "draft") {
      const searchData = JSON.stringify({
        role: "LTP",
        page,
        appNo: applicationNo,
      });

      fetch(
        `https://residential-building.onrender.com/getApplicationData?data=${searchData}`
      )
        .then((res) => res.json())
        .then((data) => {
          const prevState = data?.prevSavedState;
          // localStorage.setItem(
          //   "steepCompleted",
          //   JSON.stringify(Number(prevState) + 1)
          // );
          stepCompleted.current = Number(prevState);

          navigate("/dashboard/draftApplication/buildingInfo");
        });
      // const data = (async function () {
      //   const searchData = JSON.stringify({
      //     role: "LTP",
      //     page,
      //     appNo: applicationNo,
      //   });
      //   const data = await fetchDataFromTheDb(
      //     `https://residential-building.onrender.com/getApplicationData?data=${searchData}`
      //   );
      // })();

      // console.log(data, "DATA");

      // if (Object.keys(data)?.length) {
      //   localStorage.setItem(
      //     "steepCompleted",
      //     JSON.stringify(Number(data?.prevSavedState) + 1)
      //   );

      //   navigate("/dashboard/draftApplication/buildingInfo");
      // }
    } else {
      navigate("/dashboard/draftApplication/buildingInfo");
    }
  };

  const findWhichMenuIsActiveForLtpSideBar = (
    path,
    mainUrl,
    cameFrom,
    role
  ) => {
    const page = JSON.parse(localStorage.getItem("page"));
    const isActive =
      (path === mainUrl ||
        path === "/dashboard/draftApplication/buildingInfo" ||
        path === "/dashboard/draftApplication/applicantInfo" ||
        path === "/dashboard/draftApplication/applicationChecklist" ||
        path === "/dashboard/draftApplication/documents" ||
        path === "/dashboard/draftApplication/drawing" ||
        path === "/dashboard/draftApplication/payment" ||
        (role === "PS" &&
          path === "/dashboard/draftApplication/siteInspection")) &&
      page === cameFrom;

    return isActive;
  };

  const findWhichMenuIsActiveForPsSideBar = (
    path,
    mainUrl,
    cameFrom,
    role,
    menu
  ) => {
    const page = JSON.parse(localStorage.getItem("page"));
    const psMenu = JSON.parse(localStorage.getItem("psMenu"));
    console.log(path, mainUrl, "<<<");
    const isActive =
      (path === mainUrl ||
        path === "/dashboard/draftApplication/buildingInfo" ||
        path === "/dashboard/draftApplication/applicantInfo" ||
        path === "/dashboard/draftApplication/applicationChecklist" ||
        path === "/dashboard/draftApplication/documents" ||
        path === "/dashboard/draftApplication/drawing" ||
        path === "/dashboard/draftApplication/payment" ||
        (role === "PS" &&
          path === "/dashboard/draftApplication/siteInspection")) &&
      page.toLowerCase() === cameFrom.toLowerCase() &&
      psMenu === menu;

    return isActive;
  };

  // fetch data from the database by passing the url
  const fetchDataFromTheDb = async (url) => {
    const response = await fetch(url);
    return await response.json();
  };

  const calculateNoOfFloors = (floors) => {
    const floorNames = floors?.map((floor) => floor?.name);

    if (floorNames) {
      const totalFloors = floorNames?.length;

      const isParkingAreaExist = floorNames?.findIndex((floorName) =>
        floorName.includes("Stilt")
      );

      if (isParkingAreaExist !== -1) {
        return `Ground+Stilt+${totalFloors - 2}`;
      } else {
        if (totalFloors - 1 === 0) {
          return `Ground`;
        } else {
          return `Ground+${totalFloors - 1}`;
        }
      }
    } else {
      return "N/A";
    }
  };

  const ownerNamePattern = (ownerDetails) => {
    const totalOwner = ownerDetails?.length;

    const ownerNames = ownerDetails?.map((owner) => owner.name);

    let ownerNamePattern = "";

    if (ownerNames?.length) {
      switch (totalOwner) {
        case 1:
          ownerNamePattern = `${ownerNames[0]}`;
          break;

        case 2:
          ownerNamePattern = `${ownerNames[0]},${ownerNames[1]}`;
          break;
        case 3:
          ownerNamePattern = `${ownerNames[0]},${ownerNames[1]},${ownerNames[2]}`;
          break;
        default:
          ownerNamePattern = `${ownerNames[0]},${ownerNames[1]},${ownerNames[2]
            } and ${totalOwner - 3} others`;
          break;
      }
    }
    console.log(ownerNamePattern, "PT");
    return ownerNamePattern;
  };

  const needToHideElementBasedOnPage = () => {
    const page = JSON.parse(localStorage.getItem("page"));

    const hideBtnPageWise = page === "submit" || page === "shortfall";

    return hideBtnPageWise;
  };

  const textTypingAnimation = (text) => {
    return text.map((el, i) => (
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.25,
          delay: i / 6,
        }}
        key={i}
      >
        {el}{" "}
      </motion.span>
    ));
  };

  //   create a object to transfer data into various components
  const userInfo = {
    updateUserInfoInLocalStorage,
    userInfoFromLocalStorage,
    sendUserDataIntoDB,
    getUserData,
    confirmAlert,
    alertToConfirmDelete,
    getApplicationData,
    alertToTransferDataIntoDepartment,
    getSubmitApplicationData,
    getAllDraftApplicationData,
    checkLicenseExpirationOfLtp,
    decideActiveColor,
    decideHoverColor,
    setIsDark,
    isDark,
    showPageBasedOnApplicationType,
    findWhichMenuIsActiveForLtpSideBar,
    findWhichMenuIsActiveForPsSideBar,
    fetchDataFromTheDb,
    calculateNoOfFloors,
    ownerNamePattern,
    needToHideElementBasedOnPage,
    textTypingAnimation,
    stepCompleted,
    handleLogOut,
  };

  return (
    <>
      <AuthContext.Provider value={userInfo}>{children}</AuthContext.Provider>
    </>
  );
};

export default AuthProvider;
