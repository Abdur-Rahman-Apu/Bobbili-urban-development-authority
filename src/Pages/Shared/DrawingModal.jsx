import { DateTime } from "luxon";
import React, { useContext, useEffect, useState } from "react";
import { Document, Page } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { AuthContext } from "../../AuthProvider/AuthProvider";
import { baseUrl } from "../../utils/api";

const DrawingModal = () => {
  const [numPages, setNumPages] = useState();
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess(numPages) {
    setNumPages(numPages);
  }
  const { getApplicationData, getUserData, userInfoFromCookie } =
    useContext(AuthContext);
  const applicationNo = JSON.parse(localStorage.getItem("CurrentAppNo"));
  const cameFrom = JSON.parse(localStorage.getItem("page"));

  // const { openDrawing, setOpenDrawing, filteredData } = modalStates;
  const [dataFromDB, setDataFromDB] = useState({});
  const [pdfUrl, setPdfUrl] = useState("");
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
        try {
          const response = await fetch(
            `${baseUrl}/storage/pdf?fileId=${applicationData?.drawing?.Drawing}`
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
      }
    };
    getData();
  }, []);

  console.log(dataFromDB, "DFD");

  const [psData, setPsData] = useState(null);

  const currentDate = DateTime.local();
  const formattedDate = currentDate.toFormat("dd-MM-yyyy");

  const [psSignImg, setPsSignImg] = useState(null);
  useEffect(() => {
    const getPsData = async () => {
      const { userId } = userInfoFromCookie();

      const data = await getUserData(userId);
      console.log(data, "data");
      if (data?.userInfo) {
        setPsData(data?.userInfo);
        fetch(
          `${baseUrl}/storage/proxyImage?url=https://drive.google.com/thumbnail?id=${data?.userInfo?.signId}`
        )
          .then((res) => {
            console.log(res);
            setPsSignImg(res.url);
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      }
    };

    getPsData();
  }, []);

  return (
    <div className="dark:bg-white w-full " id="drawingModal">
      <div className="pt-4 relative flex-col items-center">
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
            <img src={`${psSignImg}`} alt="signature" className="w-20" />
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
