import React, { useEffect } from "react";
import OtpUi from "./OtpUi";

export default function OtpModal({
  showOtpModal,
  setShowOtpModal,
  handleOtpMatching,
}) {
  useEffect(() => {
    if (showOtpModal) {
      document.getElementById("otpModal").showModal();
    }
  }, [showOtpModal]);
  return (
    <div>
      <dialog id="otpModal" className="modal">
        <div className="modal-box bg-white w-11/12 max-w-4xs rounded-md p-0">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 z-[100]"
              onClick={() => setShowOtpModal(false)}
            >
              ✕
            </button>
          </form>
          <OtpUi handleOtpMatching={handleOtpMatching} />
        </div>
      </dialog>
    </div>
  );
}
