import Lottie from "lottie-react";
import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BsPlusLg } from "react-icons/bs";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { AuthContext } from "../../../../AuthProvider/AuthProvider";
import ErrorAnimation from "../../../../assets/ServerError.json";
import StarIcon from "../../../Components/StarIcon";
import TableLayout from "../../../Components/TableLayout";
import Loading from "../../../Shared/Loading";
import AllDraftApplication from "./AllDraftApplication";

const NewApplication = () => {
  const {
    userInfoFromLocalStorage,
    sendUserDataIntoDB,
    alertToConfirmDelete,
    showPageBasedOnApplicationType,
    stepCompleted,
  } = useContext(AuthContext);

  const { _id: userID } = userInfoFromLocalStorage();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const date = new Date();

  const gradientColor = "bg-gradient-to-r from-violet-500 to-fuchsia-500";

  // get all draft applications
  const { data, refetch, isLoading, isError, isSuccess } = useQuery(
    ["draftApplications"],
    async () => {
      const response = await fetch(
        `http://localhost:5000/draftApplications/${userID}`
      );
      return await response.json();
    }
  );

  // console.log(data, "Query");

  useEffect(() => {
    return () => {
      localStorage.removeItem("currentStep");
      localStorage.removeItem("steepCompleted");
    };
  }, []);

  useEffect(() => {
    if (isError) {
      console.log("ERROR");
      setError("Failed to fetch data");
      setLoading(false);
    } else {
      setLoading(false);
      setError("");
    }
  }, [isError]);

  useEffect(() => {
    if (isSuccess) {
      setError("");
      setLoading(false);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (!data) {
      setError("Failed to fetch data");
    }
  }, [data]);

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

  // navigate after clicking on the draft application no
  const navigate = useNavigate();

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
      applicantInfo: { ltpDetails: {}, applicantDetails: [] },
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
      prevSavedState: 0,
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
          stepCompleted.current = 0;
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

  const tableHeader = [
    "Sl.no.",
    "Application no.",
    "Owner name",
    "Phone no.",
    "Case type",
    "Village",
    "Mandal",
    "Created date",
    "Action",
  ];

  const [tableData, setTableData] = useState({});
  const [tableComponentProps, setTableComponentProps] = useState({});

  useEffect(() => {
    setTableData((prev) => {
      const newValue = {
        tableHeader,
        data,
      };
      return { ...prev, ...newValue };
    });
  }, [isSuccess, data]);

  useEffect(() => {
    setTableComponentProps((prev) => {
      const newValue = {
        removeDraftApplication,
        showPageBasedOnApplicationType,
        navigate,
      };
      return { ...prev, ...newValue };
    });
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className=" my-3 transition-all duration-700">
      <div className="flex justify-end mt-10 mr-10">
        {/* Create a new application button */}
        <button className="star-btn font-roboto" onClick={showConfirmModal}>
          <div className="flex justify-center items-center">
            <BsPlusLg size={20} />
            <span className="text-lg ml-2 create-application-text">
              Create a new application
            </span>
          </div>
          <div className="star-1">
            <StarIcon />
          </div>
          <div className="star-2">
            <StarIcon />
          </div>
          <div className="star-3">
            <StarIcon />
          </div>
          <div className="star-4">
            <StarIcon />
          </div>
          <div className="star-5">
            <StarIcon />
          </div>
          <div className="star-6">
            <StarIcon />
          </div>
        </button>
      </div>

      {error?.length !== 0 ? (
        <div className="flex flex-col justify-center items-center min-h-[calc(100vh - 10%)]">
          <Lottie
            animationData={ErrorAnimation}
            loop={true}
            className="w-[40%] h-[40%]"
          />
          <p className="text-red-500 font-bold text-lg uppercase">{error}</p>
        </div>
      ) : (
        <div>
          <TableLayout
            tableData={tableData}
            Component={AllDraftApplication}
            tableComponentProps={tableComponentProps}
          />

          {data?.length === 0 && (
            <p className="text-lg text-center my-4 font-bold text-error">
              No Application Found
            </p>
          )}

          {error && (
            <p className="text-lg text-center my-4 font-bold text-error">
              {error}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default NewApplication;
