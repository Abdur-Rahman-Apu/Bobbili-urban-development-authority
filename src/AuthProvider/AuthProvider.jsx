import React, { createContext, useState } from "react";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";
export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  // get user information from the localStorage
  const userInfoFromLocalStorage = () => {
    return JSON.parse(localStorage.getItem("loggedUser"));
  };

  // update user info
  const updateUserInfoInLocalStorage = (id) => {
    fetch(`http://localhost:5000/getUser?id=${id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.status) {
          console.log(1);

          const { userInfo } = data;
          console.log(userInfo);

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
    console.log(data, "DATA");
    console.log(url, "URL");
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

    const response = await fetch(`http://localhost:5000/getUser?id=${id}`);
    const data = await response.json();
    return data;
  };

  // set sweet alert's parameters dynamically

  const alertToTransferDataIntoDepartment = async (applicationNo, navigate) => {
    console.log(applicationNo, "CurrentApplicationNo");

    const data = { userId: userInfoFromLocalStorage()._id, applicationNo };

    const url = `http://localhost:5000/deleteApplication?data=${JSON.stringify(
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
      console.log(result);
      if (result.isConfirmed && result?.value?.ok) {
        Swal.fire({
          title: "Sent!",
          text: "Your file has been sent successfully.",
          icon: "success",
          confirmButtonColor: "#3085d6",
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
  const confirmAlert = (
    stepperData,
    collectInputFieldData,
    isPaymentDataSent
  ) => {
    console.log(userInfoFromLocalStorage()._id, "GET USER ID");

    const role = userInfoFromLocalStorage().role;

    const applicationNo = JSON.parse(localStorage.getItem("CurrentAppNo"));

    let url;

    role === "LTP" &&
      (url = `http://localhost:5000/updateDraftApplicationData/${
        userInfoFromLocalStorage()._id
      }`);

    role === "PS" &&
      (url = `http://localhost:5000/recommendDataOfPs?appNo=${applicationNo}`);

    console.log(url, "url");

    Swal.fire({
      title: "Do you want to save your information?",
      icon: "info",
      confirmButtonText: "Yes, save it",
      showCancelButton: true,
      confirmButtonColor: "bg-violetLight",
      cancelButtonColor: "#000",
      showLoaderOnConfirm: true,
      preConfirm: async (confirm) => {
        console.log("confirm", confirm);

        console.log(collectInputFieldData, "COLLECT INPUT FIELD DATA");

        return await collectInputFieldData(url)
          .then((response) => {
            console.log(response, "response");
            if (!response.acknowledged) {
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
      if (result.isConfirmed && result.value.acknowledged) {
        toast.success("Data saved successfully");

        console.log(stepperData, "Stepper data");

        // if stepper data is exist then update stepper steps and navigate to the next step
        if (stepperData) {
          console.log("Asci");
          const [, currentStep, steps, handleStepClick] = stepperData;
          console.log(currentStep < steps.length - 1);
          currentStep < steps.length - 1 && handleStepClick(currentStep + 1);
        }

        if (isPaymentDataSent) {
          isPaymentDataSent((prev) => prev + 1);
        }
      } else {
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
  const getApplicationData = async (appNo) => {
    try {
      setLoading(true);
      const query = JSON.stringify({
        appNo,
        userId: userInfoFromLocalStorage()._id,
        role: userInfoFromLocalStorage().role,
      });

      console.log(query, "query");

      const response = await fetch(
        `http://localhost:5000/getApplicationData?data=${query}`
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
        `http://localhost:5000/getSubmitDataOfPs?appNo=${query}`
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
        `http://localhost:5000/allDraftApplicationData`
      );

      return await response.json();
    } catch (err) {
      toast.error("Server Error");
    }
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
  };

  return (
    <>
      <AuthContext.Provider value={userInfo}>{children}</AuthContext.Provider>
    </>
  );
};

export default AuthProvider;
