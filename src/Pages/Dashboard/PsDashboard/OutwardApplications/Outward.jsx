import Lottie from "lottie-react";
import React, { useContext, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../../AuthProvider/AuthProvider";
import ErrorAnimation from "../../../../assets/ServerError.json";
import Loading from "../../../Shared/Loading";

function Outward() {
  const [error, setError] = useState("");
  const [allData, setAllData] = useState([]);
  // const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const { userInfoFromLocalStorage, showPageBasedOnApplicationType } =
    useContext(AuthContext);

  // get all applications which are submitted already
  const { data, refetch, isLoading, isError, isSuccess } = useQuery(
    ["allOutwardApplications"],
    async () => {
      const response = await fetch(
        `http://localhost:5000/totalApplications?data=${JSON.stringify(
          userInfoFromLocalStorage()
        )}`
      );
      return await response.json();
    }
  );

  useEffect(() => {
    if (isError) {
      console.log("ERROR");
      setError("No data found");
      // setLoading(false);
    } else {
      setError("");
      // setLoading(false);
    }

    if (isSuccess) {
      setError("");
      console.log(data, "DATA");

      const approved = data?.applications?.approvedApplications;
      const shortfall = data?.applications?.shortfallApplications;
      const rejected = data?.applications?.totalRejectedApplications;

      console.log(approved, "App");
      console.log(shortfall, "shrt");
      console.log(rejected, "reject");
      setAllData((prev) => {
        const newValue = [...approved, ...shortfall, ...rejected];
        return newValue;
      });
    } else {
      setError("Failed to fetch");
    }
  }, [isError, isSuccess]);

  console.log(allData, "Alldata");
  if (isLoading) {
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
          <p className="text-red-500 font-bold text-lg uppercase">
            {error?.length === 0 ? "Failed to fetch " : error + " "} data
          </p>
        </div>
      ) : (
        <div className="container mx-auto p-4 font-roboto ">
          <div className="py-4">
            <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 ">
              <div className="inline-block min-w-full shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full leading-normal text-center">
                  {/* head */}
                  <thead className="bg-normalViolet">
                    <tr className=" text-xs md:text-sm text-white hover:bg-normalViolet">
                      <th className="p-3 border-b-2 border-gray-200  text-white  text-xs font-semibold uppercase tracking-wider ">
                        Sl. no.
                      </th>
                      <th className="p-3 border-b-2 border-gray-200  text-white  text-xs font-semibold uppercase tracking-wider w-48">
                        Application no.
                      </th>
                      <th className="p-3 border-b-2 border-gray-200  text-white  text-xs font-semibold uppercase tracking-wider ">
                        Owner name
                      </th>
                      <th className="p-3 border-b-2 border-gray-200  text-white  text-xs font-semibold uppercase tracking-wider ">
                        Phone no.
                      </th>
                      <th className="p-3 border-b-2 border-gray-200  text-white  text-xs font-semibold uppercase tracking-wider ">
                        Case type
                      </th>
                      <th className="p-3 border-b-2 border-gray-200  text-white  text-xs font-semibold uppercase tracking-wider ">
                        Village
                      </th>
                      <th className="p-3 border-b-2 border-gray-200  text-white  text-xs font-semibold uppercase tracking-wider ">
                        Mandal
                      </th>
                      <th className="p-3 border-b-2 border-gray-200  text-white  text-xs font-semibold uppercase tracking-wider ">
                        Submitted date
                      </th>
                      <th className="p-3 border-b-2 border-gray-200  text-white  text-xs font-semibold uppercase tracking-wider ">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-900">
                    {/* show draft applications  */}

                    {allData?.length !== 0 &&
                      allData?.map((applicationData, index) => {
                        return (
                          <tr key={applicationData?.applicationNo}>
                            <td className="p-3  border-b border-gray-200 text-sm">
                              <p className="text-gray-900 break-words">
                                {index + 1}
                              </p>
                            </td>
                            <td
                              className="hover:underline cursor-pointer border-b border-gray-200 text-sm"
                              onClick={() =>
                                showPageBasedOnApplicationType(
                                  applicationData?.applicationNo,
                                  navigate,
                                  "Outward"
                                )
                              }
                            >
                              <p className="text-gray-900 break-words">
                                {applicationData?.applicationNo}
                              </p>
                            </td>
                            <td className="p-3  border-b border-gray-200 text-sm">
                              <p className="text-gray-900 break-words">
                                {applicationData?.applicantInfo
                                  ?.applicantDetails?.length > 0
                                  ? applicationData?.applicantInfo
                                      ?.applicantDetails[0].name
                                  : "N/A"}
                              </p>
                            </td>
                            <td className="p-3  border-b border-gray-200 text-sm">
                              <p className="text-gray-900 break-words">
                                {applicationData?.applicantInfo
                                  ?.applicantDetails?.length
                                  ? applicationData?.applicantInfo
                                      ?.applicantDetails[0].phone
                                  : "N/A"}
                              </p>
                            </td>
                            <td className="p-3  border-b border-gray-200 text-sm">
                              <p className="text-gray-900 break-words">
                                {applicationData?.buildingInfo
                                  ?.generalInformation?.caseType !== ""
                                  ? applicationData?.buildingInfo
                                      ?.generalInformation?.caseType
                                  : "N/A"}
                              </p>
                            </td>
                            <td className="p-3  border-b border-gray-200 text-sm">
                              <p className="text-gray-900 break-words">
                                {applicationData?.buildingInfo
                                  ?.generalInformation?.village !== ""
                                  ? applicationData?.buildingInfo
                                      ?.generalInformation?.village
                                  : "N/A"}
                              </p>
                            </td>
                            <td className="p-3  border-b border-gray-200 text-sm">
                              <p className="text-gray-900 break-words">
                                {applicationData?.buildingInfo
                                  ?.generalInformation?.mandal !== ""
                                  ? applicationData?.buildingInfo
                                      ?.generalInformation?.mandal
                                  : "N/A"}
                              </p>
                            </td>
                            <td className="p-3  border-b border-gray-200 text-sm">
                              <p className="text-gray-900 break-words">
                                {applicationData?.psSubmitDate ?? "N/A"}
                              </p>
                            </td>
                            <td className="p-3  border-b border-gray-200 text-sm">
                              <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                                <span
                                  aria-hidden
                                  className={`absolute inset-0 nm_Container  ${
                                    (applicationData?.status
                                      ?.toLowerCase()
                                      ?.includes("pending") &&
                                      "bg-violet-400") ||
                                    (applicationData?.status
                                      ?.toLowerCase()
                                      ?.includes("approved") &&
                                      "bg-green-400") ||
                                    (applicationData?.status
                                      ?.toLowerCase()
                                      ?.includes("shortfall") &&
                                      "bg-[#fad390]") ||
                                    (applicationData?.status
                                      ?.toLowerCase()
                                      ?.includes("rejected") &&
                                      "bg-red-400")
                                  } opacity-50 rounded-full`}
                                ></span>
                                <span className="relative">
                                  {applicationData?.status.split(" ")[0] ??
                                    "N/A"}
                                </span>
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>

                {allData?.length === 0 && (
                  <p className="text-center flex justify-center items-center my-4 font-bold text-xl text-black">
                    No application Found
                  </p>
                )}
                {error && (
                  <p className="text-lg text-center my-4 font-bold text-error">
                    {error}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Outward;
