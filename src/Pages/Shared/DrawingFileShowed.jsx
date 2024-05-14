import React, { useContext, useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { Document, Page } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { AuthContext } from "../../AuthProvider/AuthProvider";

export default function DrawingFileShowed({ modalStates, searchAppData }) {
  console.log(searchAppData, "DRAEING");
  const { setOpenDrawing, openDrawing } = modalStates;
  const { getApplicationData } = useContext(AuthContext);

  const applicationNo = JSON.parse(localStorage.getItem("CurrentAppNo"));
  const cameFrom = JSON.parse(localStorage.getItem("page"));

  const [allInfo, setAllInfo] = useState(null);
  const [numPages, setNumPages] = useState();
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess(numPages) {
    console.log(numPages, "fn");
    setNumPages(numPages?._pdfInfo?.numPages);
  }

  // const [approvedDate, setApprovedDate] = useState([]);
  // const [validProceedingDate, setValidProceedingDate] = useState([]);

  useEffect(() => {
    const modal = document.getElementById("drawingFilePdf");
    if (openDrawing) {
      modal.showModal();
    }
  }, [openDrawing]);

  const [pdfUrl, setPdfUrl] = useState("");

  const getPsSignedFiles = async (applicationData) => {
    try {
      const response = await fetch(
        `https://residential-building.onrender.com/pdf?fileId=${applicationData?.psSignedFiles?.drawingFile}`
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

  useEffect(() => {
    const getData = async () => {
      const applicationData = await getApplicationData(applicationNo, cameFrom);
      // console.log(applicationData, "All info ApplicationData");

      setAllInfo(applicationData);
      getPsSignedFiles(applicationData);
    };

    if (searchAppData) {
      setAllInfo(searchAppData);
      getPsSignedFiles(searchAppData);
    } else {
      getData();
    }
  }, []);

  console.log(numPages, "num pages");

  // const dateArray = (date) => {
  //   return date?.split("")?.filter((item) => item !== "-");
  // };

  // useEffect(() => {
  //   console.log(allInfo, "ALL info");
  //   if (allInfo && Object.keys(allInfo)?.length) {
  //     const psSubmitDate = allInfo?.submitDate;
  //     // console.log(psSubmitDate, 'psSubmitDate');

  //     if (psSubmitDate?.length) {
  //       const splitSubmitDateOfPs = dateArray(psSubmitDate);
  //       setApprovedDate(splitSubmitDateOfPs);

  //       const splitDate = psSubmitDate?.split("-");
  //       // console.log(splitDate, "Split date");
  //       splitDate[splitDate?.length - 1] = String(
  //         Number(splitDate[splitDate?.length - 1]) + 3
  //       );

  //       console.log(splitDate, "NEW SPLIT DATE");
  //       const existProceedingDate = dateArray(splitDate.join(""));
  //       setValidProceedingDate(existProceedingDate);
  //     }
  //   }
  // }, [allInfo]);

  // const dropIn = {
  //   hidden: {
  //     y: "-100vh",
  //     opacity: 0,
  //   },
  //   visible: {
  //     y: "0",
  //     opacity: 1,
  //     transition: {
  //       duration: 0.1,
  //       type: "spring",
  //       damping: 25,
  //       stiffness: 500,
  //     },
  //   },
  //   exit: {
  //     y: "100vh",
  //     opacity: 0,
  //   },
  // };

  console.log(allInfo?.psSignedFiles?.proceeding, "pssign");

  return (
    <div className="dark:bg-white">
      <dialog id="drawingFilePdf" className="modal">
        {/* divide-y-2 divide-gray-200 */}
        <div
          className={`relative overflow-hidden overflow-y-auto rounded-lg modal-box py-10 px-12 bg-white text-gray-900 max-w-[1000px]`}
        >
          <form method="dialog" className="absolute top-6 right-6 z-50">
            {/* if there is a button in form, it will close the modal */}
            <button
              onClick={() => setOpenDrawing(false)}
              className={`outline outline-red-500 outline-offset-4 text-red-500 rounded-full hover:bg-red-500 hover:text-white hover:outline-offset-0 p-[1px] transition-all duration-1000`}
            >
              <RxCross2 className="text-2xl" />
            </button>
          </form>

          <div className="pt-4">
            <h3 className="font-bold text-2xl text-center mb-8 uppercase">
              Drawing File
            </h3>

            {/* <iframe
              src={`https://drive.google.com/file/d/${allInfo?.psSignedFiles?.proceeding}/preview`}
              width="100%"
              height="500px"
              frameborder="0"
              allowfullscreen
            ></iframe> */}
            {/* <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
              <Page pageNumber={pageNumber} />
            </Document> */}

            <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
              {[...Array(numPages).keys()].map((pageIndex) => (
                <Page
                  key={`page_${pageIndex + 1}`}
                  pageNumber={pageIndex + 1}
                  width={900}
                />
              ))}
            </Document>
          </div>
        </div>

        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setOpenDrawing(false)}>close</button>
        </form>
      </dialog>
    </div>
  );
}
