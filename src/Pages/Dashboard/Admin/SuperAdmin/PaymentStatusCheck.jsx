import { motion } from "framer-motion";
import Lottie from "lottie-react";
import React, { useContext, useEffect, useRef, useState } from "react";
import creditCardAnimation from "../../../../assets/Payment/paymentStatus.json";
import { AuthContext } from "../../../../AuthProvider/AuthProvider";
import HomeCss from "../../../../Style/Home.module.css";
import { baseUrl } from "../../../../utils/api";
import TableLayout from "../../../Components/TableLayout";
import useDebounce from "../../../CustomHook/useDebounce";
import NetworkError from "../../../Shared/NetworkError";
import SearchApplicationLoading from "../../../Shared/SearchApplicationLoading";
import PaymentData from "./PaymentData";
import ShowPaymentInfoInModal from "./ShowPaymentInfoInModal";
export default function PaymentStatusCheck() {
  const { fetchDataFromTheDb } = useContext(AuthContext);
  const [applicationData, setApplicationData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tableData, setTableData] = useState({ tableHeader: [], data: [] });
  const [tableComponentProps, setTableComponentProps] = useState({});
  const timeoutIdRef = useRef(null);

  const doSearch = useDebounce(
    (searchQuery) => {
      setLoading(true);
      setError("");

      const query = JSON.stringify(searchQuery);

      fetchDataFromTheDb(`${baseUrl}/payment/search?search=${query}`)
        .then((result) => {
          setLoading(false);
          console.log(result);
          setApplicationData(result);
        })
        .catch((err) => {
          setLoading(false);
          setError("Network Error");
        });
    },
    2000,
    timeoutIdRef
  );

  //   console.log(applicationData, "APPLICATION DATA");
  const searchApplicationData = (e) => {
    setError("");
    setLoading(true);
    const value = e.target.value.trim();

    if (value?.length) {
      value?.includes("BUDA")
        ? doSearch({ appNo: value })
        : doSearch({ name: value });
    } else {
      clearTimeout(timeoutIdRef.current);
      setApplicationData([]);
      setLoading(false);
    }
  };

  const [showModal, setShowModal] = useState({
    state: false,
    appNo: null,
    data: null,
  });

  const handleModal = (appNo, payInfo) => {
    console.log(appNo, "app no");
    setShowModal((prev) => {
      const newData = {
        state: !prev.state,
        appNo: appNo ?? null,
        data: payInfo ?? null,
      };

      return newData;
    });
  };

  useEffect(() => {
    const tableHeader = [
      "Sl. no.",
      "Application no.",
      "Billing name",
      "Billing tel",
      "Amount",
      "Status",
      "Date",
      "Details",
    ];
    const newValue = {
      tableHeader,
      data: applicationData,
    };
    console.log(newValue, "new value");
    setTableData((prev) => {
      return { ...prev, ...newValue };
    });
  }, [applicationData]);

  //   useEffect(() => {
  //     setTableComponentProps((prev) => {
  //       const newValue = {
  //         handleModal,
  //       };
  //       return { ...prev, ...newValue };
  //     });
  //   }, []);

  console.log(
    tableComponentProps,
    "tableComponentProps",
    applicationData,
    tableData
  );

  console.log(showModal, "show modal state");

  return (
    <div className="p-3">
      <p className="mx-2 mt-2 mb-3 text-xl font-bold">Check Payment Info</p>
      <motion.div
        className={`${HomeCss.searchInputContainer} mx-2`}
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 1, scale: 1.0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <input
          placeholder="Application no. or owner name"
          className={`${HomeCss.searchInput} text-gray-900 focus:border-violet-500 focus:outline-none focus:ring-2 ring-violet-100`}
          name="text"
          type="text"
          onChange={(e) => searchApplicationData(e)}
          required
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className={`${HomeCss.searchIcon}`}
        >
          <g strokeWidth="0" id="SVGRepo_bgCarrier"></g>
          <g
            strokeLinejoin="round"
            strokeLinecap="round"
            id="SVGRepo_tracerCarrier"
          ></g>
          <g id="SVGRepo_iconCarrier">
            {" "}
            <rect fill="white"></rect>{" "}
            <path
              d="M7.25007 2.38782C8.54878 2.0992 10.1243 2 12 2C13.8757 2 15.4512 2.0992 16.7499 2.38782C18.06 2.67897 19.1488 3.176 19.9864 4.01358C20.824 4.85116 21.321 5.94002 21.6122 7.25007C21.9008 8.54878 22 10.1243 22 12C22 13.8757 21.9008 15.4512 21.6122 16.7499C21.321 18.06 20.824 19.1488 19.9864 19.9864C19.1488 20.824 18.06 21.321 16.7499 21.6122C15.4512 21.9008 13.8757 22 12 22C10.1243 22 8.54878 21.9008 7.25007 21.6122C5.94002 21.321 4.85116 20.824 4.01358 19.9864C3.176 19.1488 2.67897 18.06 2.38782 16.7499C2.0992 15.4512 2 13.8757 2 12C2 10.1243 2.0992 8.54878 2.38782 7.25007C2.67897 5.94002 3.176 4.85116 4.01358 4.01358C4.85116 3.176 5.94002 2.67897 7.25007 2.38782ZM9 11.5C9 10.1193 10.1193 9 11.5 9C12.8807 9 14 10.1193 14 11.5C14 12.8807 12.8807 14 11.5 14C10.1193 14 9 12.8807 9 11.5ZM11.5 7C9.01472 7 7 9.01472 7 11.5C7 13.9853 9.01472 16 11.5 16C12.3805 16 13.202 15.7471 13.8957 15.31L15.2929 16.7071C15.6834 17.0976 16.3166 17.0976 16.7071 16.7071C17.0976 16.3166 17.0976 15.6834 16.7071 15.2929L15.31 13.8957C15.7471 13.202 16 12.3805 16 11.5C16 9.01472 13.9853 7 11.5 7Z"
              clipRule="evenodd"
              fillRule="evenodd"
            ></path>{" "}
          </g>
        </svg>
      </motion.div>

      {loading && <SearchApplicationLoading />}

      {error && !loading && <NetworkError errMsg={error} />}

      {!loading && !error && applicationData?.length === 0 && (
        <div className="flex flex-col justify-center items-center">
          <Lottie
            animationData={creditCardAnimation}
            loop={true}
            className="w-[50%] lg:w-[60%]"
          />
        </div>
      )}

      {/* {applicationData?.length === 0 && !loading && !error && (
        <NoApplicationFound />
      )} */}

      {applicationData?.length !== 0 && !loading && !error && (
        <TableLayout
          tableData={tableData}
          Component={PaymentData}
          tableComponentProps={{ handleModal }}
        />
      )}

      {showModal?.state && (
        <ShowPaymentInfoInModal
          showModal={showModal}
          setShowModal={setShowModal}
          onModal={handleModal}
        />
      )}
    </div>
  );
}
