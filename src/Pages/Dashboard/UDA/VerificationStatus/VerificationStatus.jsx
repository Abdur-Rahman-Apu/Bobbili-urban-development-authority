import Lottie from "lottie-react";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useDownloadExcel } from "react-export-table-to-excel";
import { AuthContext } from "../../../../AuthProvider/AuthProvider";
import Style from "../../../../Style/TableDownloadBtn.module.css";
import ErrorAnimation from "../../../../assets/ServerError.json";
import Loading from "../../../Shared/Loading";

const VerificationStatus = () => {
  const { fetchDataFromTheDb } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState([]);
  const verificationTableRef = useRef(null);

  const { onDownload } = useDownloadExcel({
    currentTableRef: verificationTableRef.current,
    filename: "VerificationStatus",
    sheet: "VerificationStatus",
  });

  const getToken = localStorage.getItem("jwToken");

  useEffect(() => {
    setLoading(true);
    setError("");
    fetch("http://localhost:5000/getVerificationStatus", {
      method: "GET",
      headers: { authorization: getToken },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result, "result");
        if (result?.message) {
          const msg = result?.message + ". Please login again";
          setError(msg);
          setLoading(false);
        } else {
          setLoading(false);
          setError("");
          console.log(result);
          setData(result);
        }
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Loading />;
  }
  return (
    <>
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
          <div className="flex justify-end mt-9 mr-6">
            <button
              className={`${Style.Btn} nm_Container`}
              onClick={onDownload}
            >
              <svg
                className={`${Style.svgIcon} `}
                viewBox="0 0 384 512"
                height="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M169.4 470.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 370.8 224 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 306.7L54.6 265.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"></path>
              </svg>
              <span className={`${Style.icon2}`}></span>
              <span className={`${Style.tooltip} bg-normalViolet nm_Container`}>
                Download
              </span>
            </button>
          </div>

          <div className="container mx-auto px-4 font-roboto">
            <div className="py-4">
              <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4">
                <div className="inline-block min-w-full nm_Container  overflow-hidden rounded-2xl">
                  <table
                    className=" min-w-full leading-normal text-center "
                    ref={verificationTableRef}
                  >
                    <thead className="bg-normalViolet">
                      <tr className="hidden md:table-row">
                        <th
                          className={`p-3 border-2 border-gray-200  text-white  text-xs font-semibold uppercase tracking-wider `}
                          rowSpan={2}
                        >
                          Staff Name
                        </th>
                        <th
                          className={`p-3 border-2 border-gray-200  text-white  text-xs font-semibold uppercase tracking-wider `}
                          rowSpan={2}
                        >
                          Cantact no.
                        </th>
                        <th
                          className={`p-3 border-2 border-r-0 border-gray-200  text-white  text-xs font-semibold uppercase tracking-wider `}
                          colSpan={3}
                        >
                          No. of Files
                        </th>
                      </tr>
                      <tr className="hidden md:table-row">
                        <th
                          className={`p-3 border-2 border-gray-200  text-white  text-xs font-semibold uppercase tracking-wider `}
                        >
                          Assigned
                        </th>
                        <th
                          className={`p-3 border-2 border-gray-200  text-white  text-xs font-semibold uppercase tracking-wider `}
                        >
                          Verified
                        </th>
                        <th
                          className={`p-3 border-2 border-r-0 border-gray-200  text-white  text-xs font-semibold uppercase tracking-wider `}
                        >
                          Pending
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {data?.length !== 0 &&
                        data?.map((item, index) => {
                          return (
                            <tr
                              key={index}
                              className="border-b border-gray-200 dark:text-black hidden md:table-row"
                            >
                              <td className="p-3 text-sm">
                                <p className="text-gray-900 ">{item?.psName}</p>
                              </td>
                              <td className="p-3 text-sm">
                                <p className="text-gray-900 ">
                                  {item?.psContact}
                                </p>
                              </td>
                              <td className="p-3 text-sm">
                                <p className="text-gray-900 ">
                                  {item?.assigned}
                                </p>
                              </td>
                              <td className="p-3 text-sm">
                                <p className="text-gray-900 ">
                                  {item?.verified}
                                </p>
                              </td>
                              <td className="p-3 text-sm">
                                <p className="text-gray-900 ">
                                  {item?.pending}
                                </p>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VerificationStatus;
