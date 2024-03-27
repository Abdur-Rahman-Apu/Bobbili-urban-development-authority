import React, { useEffect } from "react";
import EndorsementModal from "../../../Shared/EndorsementModal";

export default function ShortfallDecisionModal({
  showShortfallModal,
  setShowShortfallModal,
}) {
  useEffect(() => {
    if (showShortfallModal) {
      document.getElementById("my_modal_1").showModal();
    }
  }, [showShortfallModal]);

  return (
    <div>
      <dialog id="my_modal_1" className="modal">
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
        <div className="w-1/3 flex justify-between items-center">
          <button className="bg-[#FFE7C1] text-black p-3 rounded-lg font-bold text-base">
            Sign
          </button>
          -
          <button
            className="bg-[#FCBAAD] text-black p-3 rounded-lg font-bold text-base"
            onClick={() => setShowShortfallModal(false)}
          >
            Close
          </button>
        </div>
      </dialog>
    </div>
  );
}
