import React, { useContext, useEffect, useState } from "react";
import TableLayout from "../../../../../Components/TableLayout";
import Lottie from "lottie-react";
import ErrorAnimation from "../../../../../../assets/ServerError.json";
import ShowMissedRequest from "./ShowMissedRequest";
import axios from "axios";
import toast from "react-hot-toast";
import Loading from "../../../../../Shared/Loading";
import socket from "../../../../../Common/socket";
import { AuthContext } from "../../../../../../AuthProvider/AuthProvider";

const MissedRequest = () => {
  const { userInfoFromLocalStorage } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [allData, setAllData] = useState([]);
  const [tableData, setTableData] = useState({});
  const [tableComponentProps, setTableComponentProps] = useState({});
  const [error, setError] = useState("");
  const tableHeader = ["Sl.no.", "Customer Info", "Action"];

  useEffect(() => {
    setLoading(true);
    setError("");
    fetch("https://residential-building.vercel.app/missedMessage")
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

      if (data?.change?.operationType === "update") {
        console.log(allData, "After updating");
        const { data } = await axios.get(
          "https://residential-building.vercel.app/missedMessage"
        );

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
    const filteredData = allData.filter((each) => each._id !== id);
    setAllData(filteredData);
    const { data } = await axios.delete(
      `https://residential-building.vercel.app/messageRequest?id=${id}`
    );

    if (data.acknowledged) {
      toast.success("Contacted with the person");
    } else {
      toast.error("Server Error");
    }
  };

  useEffect(() => {
    setTableData((prev) => {
      const newValue = {
        tableHeader,
        data: allData,
      };
      return { ...prev, ...newValue };
    });

    setTableComponentProps({ checkedMissedMessage });
  }, [allData]);

  console.log(error);

  console.log(allData, "All data");

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

            {allData?.length === 0 && (
              <p className="text-center font-bold text-lg text-normalViolet">
                No Request Found
              </p>
            )}

            {/* {isLoading && <p>Loading...</p>} */}
          </>
        </div>
      )}
    </>
  );
};

export default MissedRequest;