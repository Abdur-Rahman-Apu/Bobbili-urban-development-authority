import React from "react";

const CustomerSupport = () => {
  return (
    <div role="tablist" className="tabs tabs-lifted m-3">
      <input
        type="radio"
        name="my_tabs_2"
        role="tab"
        className="tab text-base font-bold checked:text-normalViolet"
        aria-label="New Request"
        defaultChecked={true}
      />
      <div
        role="tabpanel"
        className="tab-content bg-base-100 border-base-300 rounded-box p-6"
      >
        Tab content 1
      </div>

      <input
        type="radio"
        name="my_tabs_2"
        role="tab"
        className="tab text-base font-bold checked:text-normalViolet"
        aria-label="Chat"
      />
      <div
        role="tabpanel"
        className="tab-content bg-base-100 border-base-300 rounded-box p-6"
      >
        Tab content 2
      </div>

      <input
        type="radio"
        name="my_tabs_2"
        role="tab"
        className="tab text-base font-bold checked:text-normalViolet"
        aria-label="Today"
      />
      <div
        role="tabpanel"
        className="tab-content bg-base-100 border-base-300 rounded-box p-6"
      >
        Tab content 3
      </div>
    </div>
  );
};

export default CustomerSupport;
