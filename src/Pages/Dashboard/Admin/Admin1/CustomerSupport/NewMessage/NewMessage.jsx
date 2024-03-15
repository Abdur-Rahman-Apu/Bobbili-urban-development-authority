import axios from "axios";
import Lottie from "lottie-web";
import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AuthContext } from "../../../../../../AuthProvider/AuthProvider";
import ErrorAnimation from "../../../../../../assets/ServerError.json";
import socket from "../../../../../Common/socket";
import TableLayout from "../../../../../Components/TableLayout";
import Loading from "../../../../../Shared/Loading";
import ShowNewMessages from "./ShowNewMessages";

const NewMessage = () => {
  const { userInfoFromLocalStorage } = useContext(AuthContext);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadOnAccept, setLoadOnAccept] = useState(false);
  const [allData, setAllData] = useState([]);
  const [tableData, setTableData] = useState({});
  const [tableComponentProps, setTableComponentProps] = useState({});

  const tableHeader = ["Sl.no.", "Customer Info", "Action"];

  useEffect(() => {
    socket.emit("login", { id: userInfoFromLocalStorage().role.toLowerCase() });
  }, [socket]);

  useEffect(() => {
    socket.on("check-new-message", async (data) => {
      // Handle the new data received from the server
      console.log(data, "New msg data");

      if (data?.change?.operationType === "insert") {
        console.log(allData, "After updating");
        try {
          const { data } = await axios.get(
            "http://localhost:5000/messageRequest"
          );

          setAllData(data);
        } catch (err) {
          setError("Server Error");
        }
      }
    });

    socket.on("check-accept-message", async (data) => {
      // Handle the new data received from the server
      console.log(data, "Check accept message");

      if (data?.change?.operationType === "update") {
        console.log(allData, "After updating");
        try {
          const { data } = await axios.get(
            "http://localhost:5000/messageRequest"
          );

          setAllData(data);
        } catch (err) {
          setError("Server Error");
        }
      }
    });

    // return () => {
    //   // Clean up event listeners on component unmount
    //   socket.off("check-accept-message");
    //   //   clearInterval(countDownInterval);
    // };
  }, [socket]);

  useEffect(() => {
    setError("");
    setLoading(true);
    fetch("http://localhost:5000/messageRequest")
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setAllData(result);
        setLoading(false);
      })
      .catch((err) => {
        toast.error("Server Error");
        setError("Server Error");
        setLoading(false);
      });
  }, []);

  const acceptNewMessage = async (id) => {
    setLoadOnAccept(true);
    console.log(id);
    try {
      const { data } = await axios.patch(
        `http://localhost:5000/messageRequest?update=${JSON.stringify({
          id,
          action: "accept",
          acceptedBy: userInfoFromLocalStorage().role.toLowerCase(),
        })}`
      );

      if (data.acknowledged) {
        toast.success("Request accepted");
        try {
          const { data: updateData } = await axios.get(
            "http://localhost:5000/messageRequest"
          );
          console.log(updateData, "UPD");
          setAllData(updateData);
        } catch (err) {
          setError("Server Error");
        }
      } else {
        toast.error("Server Error");
      }
    } catch (error) {
      setError("Server Error");
    }
    setLoadOnAccept(false);
  };

  useEffect(() => {
    setTableData((prev) => {
      const newValue = {
        tableHeader,
        data: allData,
      };
      return { ...prev, ...newValue };
    });

    setTableComponentProps({ acceptNewMessage, loadOnAccept });
  }, [allData]);

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
              Component={ShowNewMessages}
              tableComponentProps={tableComponentProps}
            />

            {allData?.length === 0 && (
              <p className="text-center  font-bold text-lg text-normalViolet">
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

export default NewMessage;
