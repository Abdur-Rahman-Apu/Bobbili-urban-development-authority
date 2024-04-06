import React, { useEffect } from "react";
import EndorsementModal from "../../../Shared/EndorsementModal";

export default function ShortfallDecisionModal({
  showShortfallModal,
  setShowShortfallModal,
  // setShowOtpModal,
  // showOtpModal,
  loadingForOtpGeneration,
  onShowOtpModal,
  handleOtpStoreInDb,
}) {
  useEffect(() => {
    if (showShortfallModal) {
      document.getElementById("shortfallModal").showModal();
    }
  }, [showShortfallModal]);

  return (
    <div>
      <dialog id="shortfallModal" className="modal">
        <div className="modal-box bg-white w-[95%] max-w-full rounded-md">
          {/* <div className="w-full carousel rounded-box">
            <div className="carousel-item w-full">
              <ProceedingModal />
            </div>
            <div className="carousel-item w-full">
              <DrawingModal />
            </div>
          </div> */}
          <div>
            <EndorsementModal />
          </div>

          {/* <ProceedingModal /> */}
        </div>
        <div className="w-1/3 flex justify-center space-x-40 items-center">
          {loadingForOtpGeneration ? (
            <p className="loading loading-dots loading-lg text-[#ffffff]"></p>
          ) : (
            <>
              <button
                className="bg-[#FFE7C1] text-black p-3 rounded-lg font-bold text-base"
                onClick={handleOtpStoreInDb}
              >
                Sign
              </button>
              -
              <button
                className="bg-[#FCBAAD] text-black p-3 rounded-lg font-bold text-base"
                onClick={() => setShowShortfallModal(false)}
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
