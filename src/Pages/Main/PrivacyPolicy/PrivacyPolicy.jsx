import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="px-3 self-start text-black w-full">
      {/* <ComingSoon /> */}

      <div className="my-6">
        <p className="text-xl font-bold text-normalViolet mb-2">
          Terms & conditions
        </p>
        <p>
          The fee paid will be considered under the specific head only. No
          change of head or No adjustment to other head will be entertained
        </p>
      </div>
      <div className="my-6">
        <p className="text-xl font-bold text-normalViolet mb-2">
          Refund and Cancellation
        </p>
        <p>The fee Once paid will not be refunded or cancelled</p>
      </div>
      <div className="my-6">
        <p className="text-xl font-bold text-normalViolet mb-2">
          Privacy Policy
        </p>
        <p>
          The credentials of the payee i.e., Account number, Card No and other
          details will not be saved at our end and the institution will not be
          responsible for fraudulent transactions , if any
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
