import axios from "axios";
import Lottie from "lottie-react";
import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BsQuestionOctagonFill } from "react-icons/bs";
import { AuthContext } from "../../../../../../AuthProvider/AuthProvider";
import ErrorAnimation from "../../../../../../assets/ServerError.json";
import femaleImg from "../../../../../../assets/images/female.png";
import maleImg from "../../../../../../assets/images/male.png";
import unknownImg from "../../../../../../assets/images/unknown.png";
import socket from "../../../../../Common/socket";
import TableLayout from "../../../../../Components/TableLayout";
import Loading from "../../../../../Shared/Loading";
import ShowMissedRequest from "./ShowMissedRequest";

const MissedRequest = () => {
  const { userInfoFromLocalStorage } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [allData, setAllData] = useState([]);
  const [tableData, setTableData] = useState({});
  const [tableComponentProps, setTableComponentProps] = useState({});
  const [error, setError] = useState("");
  const [query, setQuery] = useState(null);
  const tableHeader = ["Sl.no.", "Customer Info", "Action"];

  useEffect(() => {
    setLoading(true);
    setError("");
    fetch("http://localhost:5000/missedMessage")
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setAllData(result);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setError("Server Error");
      });
  }, []);

  useEffect(() => {
    socket.emit("login", { id: userInfoFromLocalStorage().role.toLowerCase() });
  }, []);

  useEffect(() => {
    socket.on("check-accept-message", async (data) => {
      // Handle the new data received from the server
      console.log(data, "Data");

      if (
        data?.change?.operationType === "update" ||
        data?.change?.operationType === "insert"
      ) {
        console.log(allData, "After updating or inserting");
        const { data } = await axios.get("http://localhost:5000/missedMessage");

        setAllData(data);
      }
    });

    // return () => {
    //   // Clean up event listeners on component unmount
    //   socket.off("check-accept-message");
    //   //   clearInterval(countDownInterval);
    // };
  }, [socket]);

  const checkedMissedMessage = async (id) => {
    setLoading(true);
    const filteredData = allData.filter((each) => each._id !== id);
    setAllData(filteredData);
    const { data } = await axios.delete(
      `http://localhost:5000/messageRequest?id=${id}`
    );

    if (data.acknowledged) {
      toast.success("Contacted with the person");
    } else {
      toast.error("Server Error");
    }
    setLoading(false);
  };

  useEffect(() => {
    setTableData((prev) => {
      const newValue = {
        tableHeader,
        data: allData,
      };
      return { ...prev, ...newValue };
    });

    setTableComponentProps({ checkedMissedMessage, setQuery });
  }, [allData]);

  useEffect(() => {
    if (query) {
      document.getElementById("my_modal_5").showModal();
    }
  }, [query]);

  console.log(error);

  console.log(allData, "All data");

  if (loading) {
    return <Loading />;
  }
  return (
    <div>
      {error?.length !== 0 ? (
        <div className="flex flex-col justify-center items-center min-h-[calc(100vh - 10%)]">
          <Lottie
            animationData={ErrorAnimation}
            loop={true}
            className="w-[40%] h-[40%]"
          />
          <p className="text-red-500 font-bold text-lg uppercase">
            {error} data
          </p>
        </div>
      ) : (
        <div>
          <>
            <TableLayout
              tableData={tableData}
              Component={ShowMissedRequest}
              tableComponentProps={tableComponentProps}
            />

            {/* modal to show query  */}
            {query && (
              <dialog
                id="my_modal_5"
                className="modal modal-bottom sm:modal-middle"
              >
                <div className="modal-box">
                  {/* upper part  */}
                  <div className="flex items-center">
                    <div className="h-20">
                      <img
                        src={
                          (query?.gender === "male" && maleImg) ||
                          (query?.gender === "female" && femaleImg) ||
                          (query?.gender === null && unknownImg)
                        }
                        alt="Customer avatar"
                        className="h-full object-cover"
                      />
                    </div>
                    <div className="text-start ml-4">
                      <p className="text-xl font-bold text-normalViolet capitalize">
                        {query?.name}
                      </p>
                      <p className="text-gray-500 font-mono text-base">
                        {query?.mobile}
                      </p>
                    </div>
                  </div>
                  {/* question part  */}
                  <div className="">
                    <p className="flex justify-center items-center gap-3 my-3 font-bold fancy-button hover:scale-100 rounded-lg text-white text-base p-1">
                      <BsQuestionOctagonFill size={20} />
                      Queries
                      <BsQuestionOctagonFill size={20} />
                    </p>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: query?.noResponse?.query,
                      }}
                    />
                  </div>
                  <div className="modal-action">
                    <form method="dialog">
                      {/* if there is a button in form, it will close the modal */}
                      <button
                        className="btn fancy-button text-white"
                        onClick={() => setQuery(null)}
                      >
                        Close
                      </button>
                    </form>
                  </div>
                </div>
              </dialog>
            )}

            {allData?.length === 0 && (
              <p className="text-center font-bold text-lg text-normalViolet">
                No Request Found
              </p>
            )}

            {/* {isLoading && <p>Loading...</p>} */}
          </>
        </div>
      )}
    </div>
  );
};

export default MissedRequest;
