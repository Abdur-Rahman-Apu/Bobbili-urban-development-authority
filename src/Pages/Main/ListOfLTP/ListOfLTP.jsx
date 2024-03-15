import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import HomeCss from "../../../Style/Home.module.css";
import Loading from "../../Shared/Loading";

const ListOfLTP = () => {
  const [filteredData, setFilteredData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:5000/allUser")
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);

        const ltpData = data.filter((user) => user?.role === "LTP");

        setAllData(ltpData);
        setFilteredData(ltpData);
      })
      .catch((err) => {
        setLoading(false);
      });
  }, []);

  const handleSearchLtp = (e) => {
    const searchValue = e.target.value;

    if (searchValue.length) {
      setFilteredData((prev) => {
        const newSearchValue = allData.filter(
          (user) => user?.name.toLowerCase() === searchValue.toLowerCase()
        );

        console.log(newSearchValue, "new search value");
        return newSearchValue;
      });
    } else {
      setFilteredData(allData);
    }
  };

  const gradientColor = "bg-gradient-to-r from-violet-500 to-fuchsia-500";

  console.log(filteredData, "FILTERED DATA");

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="w-full h-full px-2 mt-5">
      <motion.div
        className={`${HomeCss.searchInputContainer} mx-2`}
        initial={{ opacity: 0, x: -40, y: -40 }}
        whileInView={{ opacity: 1, x: 0, y: 0, transition: { duration: 0.5 } }}
        viewport={{ once: true }}
      >
        <input
          placeholder="Search LTP by name"
          className={`${HomeCss.searchInput} text-gray-900 focus:border-violet-500 focus:outline-none focus:ring-2 ring-violet-100`}
          name="text"
          type="text"
          onChange={(e) => handleSearchLtp(e)}
          required
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className={HomeCss.searchIcon}
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

      {/* Location details  */}
      <div className="container px-2 font-roboto mt-9">
        <div className="pb-4">
          <div className="inline-block min-w-full shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full leading-normal text-center">
              {/* head */}
              <thead className="bg-normalViolet">
                <tr>
                  <th className="p-3 border-b-2 border-gray-200  text-white  text-xs font-semibold uppercase tracking-wider">
                    Name
                  </th>
                  <th className="p-3 border-b-2 border-gray-200  text-white  text-xs font-semibold uppercase tracking-wider">
                    Contact no.
                  </th>
                  <th className="p-3 border-b-2 border-gray-200  text-white  text-xs font-semibold uppercase tracking-wider">
                    Email
                  </th>
                  <th className="p-3 border-b-2 border-gray-200  text-white  text-xs font-semibold uppercase tracking-wider">
                    Address
                  </th>
                  <th className="p-3 border-b-2 border-gray-200  text-white  text-xs font-semibold uppercase tracking-wider">
                    License no.
                  </th>
                  <th className="p-3 border-b-2 border-gray-200  text-white  text-xs font-semibold uppercase tracking-wider">
                    Validity
                  </th>
                </tr>
              </thead>
              <tbody className="text-center">
                {filteredData?.map((ltp) => {
                  return (
                    <tr key={ltp?._id}>
                      <td className="p-3  border-b border-gray-200 text-sm">
                        <p className="text-gray-900 break-words">{ltp?.name}</p>
                      </td>
                      <td className="p-3  border-b border-gray-200 text-sm">
                        <p className="text-gray-900 break-words">
                          {ltp?.phone ?? "N/A"}
                        </p>
                      </td>
                      <td className="p-3  border-b border-gray-200 text-sm">
                        <p className="text-gray-900 break-words">
                          {ltp?.email ?? "N/A"}
                        </p>
                      </td>
                      <td className="p-3  border-b border-gray-200 text-sm">
                        <p className="text-gray-900 break-words">
                          {ltp?.address ?? "N/A"}
                        </p>
                      </td>
                      <td className="p-3  border-b border-gray-200 text-sm">
                        <p className="text-gray-900 break-words">
                          {ltp?.licenseNo ?? "N/A"}
                        </p>
                      </td>
                      <td className="p-3  border-b border-gray-200 text-sm">
                        <p className="text-gray-900 break-words">
                          {ltp?.validity ?? "N/A"}
                        </p>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filteredData?.length === 0 && (
              <p className="text-center my-5 text-xl font-bold text-red-400">
                No data found
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListOfLTP;
