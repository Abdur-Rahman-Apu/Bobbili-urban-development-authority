import React, { useEffect } from "react";
import DrawingModal from "../../../Shared/DrawingModal";
import ProceedingModal from "../../../Shared/ProceedingModal";

import { pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

export default function ApprovedDecisionModal({
  showApprovedModal,
  setShowApprovedModal,
  downloadFiles,
  downloading,
  wantToSend,
  setWantToSend,
  submitSignedFiles,
  setSubmitSignedFiles,
  handleFileChange,
  submitting,
  setSubmitting,
  sentPsDecision,
  onShowOtpModal,
  handleOtpStoreInDb,
  loadingForOtpGeneration,
  // showOtpModal,
  // setShowOtpModal,
}) {
  useEffect(() => {
    if (showApprovedModal) {
      document.getElementById("approvedModal").showModal();
    }
  }, [showApprovedModal]);

  return (
    <div>
      <dialog id="approvedModal" className="modal">
        <div className="modal-box bg-white w-[95%] max-w-full rounded-md">
          {/* <div className="w-full carousel rounded-box">
            <div className="carousel-item w-full">
              <ProceedingModal />
            </div>
            <div className="carousel-item w-full">
              <DrawingModal />
            </div>
          </div> */}
          <div className="carousel w-full">
            <div id="item1" className="carousel-item w-full">
              <ProceedingModal />
            </div>
            <div id="item2" className="carousel-item w-full max-h-fit">
              <DrawingModal />
            </div>
          </div>

          {/* <ProceedingModal /> */}
        </div>
        <div className="w-1/3 flex justify-center items-center">
          {loadingForOtpGeneration ? (
            <p className="loading loading-dots loading-lg text-[#ffffff]"></p>
          ) : (
            <>
              <button
                className="bg-[#FFE7C1] text-black p-3 rounded-lg font-bold text-base"
                onClick={handleOtpStoreInDb}
              >
                Approved
              </button>

              <div className="flex justify-center w-full py-2 gap-2">
                <a
                  href="#item1"
                  className="btn btn-xs bg-[#15F5BA] hover:bg-[#15F5BA] text-white border-none"
                >
                  1
                </a>
                <a
                  href="#item2"
                  className="btn btn-xs bg-[#211951] hover:bg-[#211951] text-white border-none"
                >
                  2
                </a>
              </div>
              <button
                className="bg-[#FCBAAD] text-black p-3 rounded-lg font-bold text-base"
                onClick={() => setShowApprovedModal(false)}
              >
                Close
              </button>
            </>
          )}
        </div>
      </dialog>
    </div>
  );
}
