import { DateTime } from "luxon";
import React, { useContext, useEffect, useState } from "react";
import { Document, Page } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { AuthContext } from "../../AuthProvider/AuthProvider";

const DrawingModal = () => {
  const [numPages, setNumPages] = useState();
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess(numPages) {
    setNumPages(numPages);
  }
  const { getApplicationData, getUserData, userInfoFromLocalStorage } =
    useContext(AuthContext);
  const applicationNo = JSON.parse(localStorage.getItem("CurrentAppNo"));
  const cameFrom = JSON.parse(localStorage.getItem("page"));

  // const { openDrawing, setOpenDrawing, filteredData } = modalStates;
  const [dataFromDB, setDataFromDB] = useState({});
  // console.log(modalStates, "Modal states");
  useEffect(() => {
    // const modal = document.getElementById("drawingModal");
    // if (openDrawing) {
    //   modal.showModal();
    // }

    // if (filteredData) {
    //   setDataFromDB(filteredData);
    // } else {
    const getData = async () => {
      const applicationData = await getApplicationData(applicationNo, cameFrom);
      console.log(applicationData, "All info ApplicationData");
      if (Object.keys(applicationData)?.length) {
        setDataFromDB(applicationData);
      }
    };
    getData();
  }, []);

  console.log(dataFromDB, "DFD");

  const [psData, setPsData] = useState(null);

  const currentDate = DateTime.local();
  const formattedDate = currentDate.toFormat("dd-MM-yyyy");

  const [pdfUrl, setPdfUrl] = useState("");

  useEffect(() => {
    const getPsData = async () => {
      const { userId } = userInfoFromLocalStorage();

      const data = await getUserData(userId);
      console.log(data, "data");
      if (data?.userInfo) {
        setPsData(data?.userInfo);
      }
    };

    getPsData();
  }, []);

  useEffect(() => {
    // Fetch the PDF file from the proxy server
    const fetchPdf = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/pdf?fileId=1Mque_-OWf28RiubAdE5Ll5CFWBnMPvUf"
        );
        console.log(response, "response");
        const blob = await response.blob();
        console.log(blob, "blob");
        const pdfUrl = URL.createObjectURL(blob);
        console.log(pdfUrl, "pdfurl");
        setPdfUrl(pdfUrl);
      } catch (error) {
        console.error("Error fetching PDF:", error);
      }
    };

    fetchPdf();
  }, []);

  return (
    <div className="dark:bg-white w-full">
      <div id="drawingModal" className="pt-4 relative flex-col items-center">
        <p className="w-fit ml-auto font-bold">B.A. no. {applicationNo}</p>
        {/* <iframe
          src={`https://drive.google.com/file/d/${dataFromDB?.drawing?.Drawing}/preview`}
          width="100%"
          height="500px"
          frameborder="0"
          allowfullscreen
        ></iframe> */}
        {/* https://drive.google.com/uc?export=download&id=1Q7MB6smDEFd-PzpqK-3cC2_fAZc4yaXF */}

        <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
          <Page pageNumber={pageNumber} />
        </Document>
        {/* <p>
          Page {pageNumber} of {numPages}
        </p> */}

        <div className="w-fit ml-auto mt-[-130px] mr-[90px] flex flex-col items-center relative z-[1000] ">
          <div>
            <img
              src={`https://drive.google.com/thumbnail?id=${psData?.signId}`}
              alt="signature"
              className="w-20"
            />
          </div>
          <div className="text-center">
            <p className="text-xs font-bold text-center">{psData?.name}</p>
            <p className="text-xs font-bold text-center">
              {psData?.gramaPanchayat}
            </p>
            <p className="text-xs font-bold">Date: {formattedDate}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrawingModal;
