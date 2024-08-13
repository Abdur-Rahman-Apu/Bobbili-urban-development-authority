import React, { useEffect } from "react";
import creditCardImg from "../../../../assets/images/payment/credit-card.png";

export default function ShowPaymentInfoInModal({
  showModal,
  setShowModal,
  onModal,
}) {
  console.log("Inside showpay");
  console.log(showModal, "show modal");
  console.log(Object.keys(showModal.data), "keys");
  console.log(Object.values(showModal.data), "values");
  console.log(Object.entries(showModal.data), "entries");
  useEffect(() => {
    if (showModal?.state) {
      document.getElementById("my_modal_3").showModal();
    }
  }, []);
  return (
    <>
      <dialog id="my_modal_3" className="modal ">
        <div className="modal-box no-scrollbar">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button
              className="btn btn-sm btn-circle btn-error text-white absolute right-2 top-2"
              onClick={onModal}
            >
              ✕
            </button>
          </form>
          <h3 className="font-bold text-xl">Payment Details</h3>

          <div>
            <img
              src={creditCardImg}
              className="w-2/3 object-cover mx-auto py-5 "
              alt=""
            />
          </div>

          {Object.entries(showModal.data).map((data, idx) => (
            <div
              key={data[0]}
              className={`flex p-3 ${
                idx % 2 === 0 && "bg-gray-200 rounded-md"
              }`}
            >
              {/* keys  */}

              <p className="w-1/2 font-bold capitalize">{data[0]}</p>

              {/* values  */}

              <p className="break-words w-1/2">{data[1]}</p>
            </div>
          ))}
        </div>
      </dialog>
    </>
  );
}
