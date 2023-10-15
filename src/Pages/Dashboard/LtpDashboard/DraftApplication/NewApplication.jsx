import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { BsPlusLg } from "react-icons/bs";
import { AuthContext } from "../../../../AuthProvider/AuthProvider";
import toast from "react-hot-toast";
import AllDraftApplication from "./AllDraftApplication";
import Swal from "sweetalert2";

const NewApplication = () => {
  const { userInfoFromLocalStorage, sendUserDataIntoDB, alertToConfirmDelete } =
    useContext(AuthContext);

  console.log(userInfoFromLocalStorage());

  const { _id: userID } = userInfoFromLocalStorage();
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const date = new Date();

  const gradientColor = "bg-gradient-to-r from-violet-500 to-fuchsia-500";

  // get all draft applications
  const { data, refetch, isLoading, isError } = useQuery(
    ["draftApplications"],
    async () => {
      const response = await fetch(
        `http://localhost:5000/draftApplications/${userID}`
      );
      return await response.json();
    }
  );

  console.log(data, "Query");

  useEffect(() => {
    if (isError) {
      console.log("ERROR");
      setError("No data found");
    } else {
      setError("");
    }

    localStorage.removeItem("currentStep");
  }, [isError]);

  const removeDraftApplication = (applicationNo) => {
    console.log(applicationNo, "DELTE APP NO");
    fetch(`http://localhost:5000/deleteSingleDraft`, {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ applicationNo, userID }),
    })
      .then((res) => {
        console.log(res);
        if (res.ok) {
          toast.success("Delete successfully");
          refetch();
        } else {
          toast.error("Failed to delete data");
        }
      })
      .catch(() => {
        toast.error("Server is not responded");
      });
  };
  // Function to generate a unique number
  // const generateApplicationNumber = () => {
  //   const date = new Date();
  //   const milisecond = date.getMilliseconds();
  //   const second = date.getSeconds();
  //   const hour = date.getHours();
  //   const year = date.getFullYear();

  //   console.log(hour, milisecond, second);
  //   const applicationNo = `1177/${milisecond}/${hour}/${second}/BUDA/${year}`;

  //   return applicationNo;
  // };

  // navigate after clicking on the draft application no
  const showDraftApplication = (applicationNo) => {
    console.log(applicationNo);
    localStorage.setItem("CurrentAppNo", JSON.stringify(applicationNo));
    localStorage.setItem("stepIndex", JSON.stringify(0));
    navigate("/dashboard/draftApplication/buildingInfo");
  };

  // store new application information into the database
  const storeApplicationData = (serialNo) => {
    const url = `http://localhost:5000/addApplication`;

    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    const applicationNo = `1177/${serialNo}/XX/XX/BUDA/${year}`;

    const data = {
      userId: userID,
      applicationNo,
      buildingInfo: {
        generalInformation: {},
        plotDetails: {},
        scheduleBoundaries: {},
      },
      applicantInfo: { ltpDetails: {}, applicantDetails: {} },
      applicationCheckList: [],
      documents: {
        default: [],
        dynamic: [],
      },
      drawing: { AutoCAD: "", Drawing: "" },
      payment: {
        udaCharge: {},
        gramaPanchayatFee: {},
        labourCessCharge: {},
        greenFeeCharge: {},
      },
      createdDate: `${day}-${month}-${year}`,
    };

    fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        console.log(response);
        if (!response.ok) {
          toast.error("Failed to store data");
        } else {
          toast.success("Data stored Successfully");
          // store current application No
          localStorage.setItem(
            "CurrentAppNo",
            JSON.stringify(data.applicationNo)
          );
          localStorage.setItem("stepIndex", JSON.stringify(0));
          navigate("/dashboard/draftApplication/buildingInfo");
        }
      })
      .catch(() => {
        toast.error("Failed to store data");
      });
  };

  const showConfirmModal = () => {
    Swal.fire({
      title: "Do you want to create a new application?",
      icon: "question",
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#a36ee0",
      cancelButtonColor: "#1f1132",
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        fetch("http://localhost:5000/getSerialNumber")
          .then((res) => res.json())
          .then((data) => {
            storeApplicationData(data?.serialNo);
          });
      }
    });
  };

  return (
    <div className=" my-3  dark:text-gray-100 ">
      <div className="flex justify-end my-5 mr-3">
        <button
          className={`btn flex font-roboto ${gradientColor} transition-all duration-700 text-[#fff]`}
          onClick={showConfirmModal}
        >
          <span className="text-sm">Create a new application</span>
          <BsPlusLg size={20} />
        </button>
      </div>

      <div className=" w-full overflow-auto">
        <table className="w-full font-roboto ">
          {/* head */}
          <thead>
            <tr className="bg-[#2d3436] text-sm md:text-base text-white hover:bg-[#353b48]">
              <th className="p-2">Sl.no.</th>
              <th className="p-2">Application no.</th>
              <th className="p-2">Owner name</th>
              <th className="p-2">Phone no.</th>
              <th className="p-2">Case type</th>
              <th className="p-2">Village</th>
              <th className="p-2">Mandal</th>
              <th className="p-2">Created date</th>
              <th className="p-2">Delete</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {/* show draft applications  */}

            {data?.map((applicationData, index) => (
              <AllDraftApplication
                key={index}
                serialNo={index}
                applicationData={applicationData}
                showDraftApplication={showDraftApplication}
                removeDraftApplication={removeDraftApplication}
              />
            ))}
          </tbody>
        </table>

        {error && (
          <p className="text-lg text-center my-4 font-bold text-error">
            {error}
          </p>
        )}

        {isLoading && <p>Loading...</p>}
      </div>
    </div>
  );
};

export default NewApplication;
