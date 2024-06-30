import React from "react";

function ApplicationHeader({ applicationNo }) {
  console.log(applicationNo, "App head");
  const currentDate = new Date();
  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1; // Adding 1 because months are zero-indexed
  const year = currentDate.getFullYear();

  return (
    <div className="my-5">
      <div className="text-center font-extrabold">
        <h2 className="mb-12 text-3xl">BUILDING PERMISSION APPLICATION</h2>
      </div>
      <div className="p-7">
        <div className="flex justify-between text-violetDark">
          <p className="font-bold text-lg ">
            Application No. <span className="">{applicationNo}</span>
          </p>
          <p className="text-lg font-bold">
            {" "}
            <span>Date of Submission:</span>{" "}
            <span>{`${day}-${month}-${year}`}</span>
          </p>
        </div>
        <div className="mt-5 font-bold">
          <p>
            Sub: Building Application for grant of permission for Construction
            of Building Permission Notice u/s 209 & 227 of APM Act, 1965 / 428 &
            433 of HMC Act, 1955.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ApplicationHeader;
