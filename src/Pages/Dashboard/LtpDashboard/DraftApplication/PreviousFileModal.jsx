import React, { useContext, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../../AuthProvider/AuthProvider";

const PreviousFileModal = ({ FileModal }) => {
  const { setIsModalOpen, isModalOpen, setDataFromDB } = FileModal;
  const fileInputRef = useRef(null);

  const { sendUserDataIntoDB, userInfoFromLocalStorage, getApplicationData } =
    useContext(AuthContext);

  const navigate = useNavigate();

  useEffect(() => {
    const modal = document.getElementById("fileModal");
    if (isModalOpen) {
      modal.showModal();
    }
  }, [isModalOpen]);

  const handlePreviousApplication = (e) => {
    console.log(e);
    e.preventDefault();

    console.log(fileInputRef.current);
    console.log("raian");

    const formData = document.getElementById("FileNoForApplication");
    console.log(formData.value);

    const searchData = { appNo: formData.value, page: "approved" };
    fetch(
      `https://residential-building.onrender.com/getApplicationData?data=${JSON.stringify(
        searchData
      )}`
    )
      .then((res) => res.json())
      .then(async (oldApprovedFileData) => {
        const {
          applicationNo,
          buildingInfo,
          applicantInfo,
          applicationCheckList,
          drawing,
          payment,
        } = oldApprovedFileData;

        // generate new application no
        const newAppNo = JSON.parse(localStorage.getItem("CurrentAppNo"));
        const oldAppNo = applicationNo;

        let newApplicationNo;
        let isAppNoModified = false;

        if (!newAppNo.includes("(")) {
          isAppNoModified = true;

          const oldModifiedAppNo = oldAppNo.split("/");

          console.log(oldModifiedAppNo, "OLDMA");

          console.log(newAppNo.split("/"));

          const splitCurrentAppNo = newAppNo.split("/");
          splitCurrentAppNo.splice(
            2,
            2,
            oldModifiedAppNo[2],
            oldModifiedAppNo[3]
          );

          console.log(newAppNo, "MODIFIED");

          newApplicationNo =
            splitCurrentAppNo.join("/") + `-(${oldModifiedAppNo[1]})`;
          console.log(newApplicationNo, "DDD");
        }

        console.log(newApplicationNo, newAppNo);

        // modified case type into revision
        buildingInfo["generalInformation"]["caseType"] = "Revision";
        buildingInfo["generalInformation"]["fileNo"] = applicationNo;

        const newUpdatedAppNo = isAppNoModified ? newApplicationNo : newAppNo;

        const modifiedFields = {
          applicationNo: newUpdatedAppNo,
          buildingInfo: buildingInfo,
          applicantInfo: applicantInfo,
          previousPayment: payment,
          // payment,
        };

        console.log(modifiedFields, "modifiedFields");

        const filterDataForLtp = {
          userId: userInfoFromLocalStorage()._id,
          oldApplicationNo: newAppNo,
        };

        const result = await sendUserDataIntoDB(
          `https://residential-building.onrender.com/updateDraftApplicationData?filterData=${JSON.stringify(
            filterDataForLtp
          )}`,
          "PATCH",
          modifiedFields
        );

        if (result?.acknowledged === true) {
          toast.success("Data get success");

          localStorage.setItem("CurrentAppNo", JSON.stringify(newUpdatedAppNo));

          const getData = async () => {
            const applicationData = await getApplicationData(
              newUpdatedAppNo,
              "draft"
            );
            console.log(applicationData, "All info ApplicationData");
            if (Object.keys(applicationData)?.length) {
              setDataFromDB(applicationData);
            }
            setIsModalOpen(false);
          };
          getData();
        } else {
          toast.error("Data get failed");
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error("Server failed");
      });

    // const formData = document.getElementById('FileNo');
    // console.log(formData.value);

    // console.log('sdfjsdfjhi');
  };

  return (
    <>
      <dialog id="fileModal" className="modal">
        <div className="modal-box bg-white">
          <div method="dialog">
            <button
              onClick={() => setIsModalOpen(false)}
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            >
              ✕
            </button>
          </div>

          <h3 className="font-bold text-lg">
            Enter previous approved file no :
          </h3>

          {/* <InputField
                        id="FileNo"
                        name="FileNo"
                        label="File no."
                        placeholder="Enter your file no."
                        type="number"
                        ltpDetails={FileNo}
                    /> */}

          <div
            className="my-4 mx-3 flex flex-col justify-between"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{
              opacity: 1,
              y: 0,
              transition: { duration: 1 },
            }}
            viewport={{ once: true }}
          >
            <label
              htmlFor=""
              className={"block mb-1 font-semibold text-gray-600"}
            >
              File no.
            </label>
            <input
              ref={fileInputRef}
              type="text"
              id="FileNoForApplication"
              name="FileNoForApplication"
              placeholder="Enter your file no."
              className="w-full px-3 py-2 border rounded-lg max-w-xs text-gray-600 bg-gray-50 border-gray-400 focus:border-gray-600 focus:outline-none focus:ring-2 ring-violet-200"
              // defaultValue={proposedPlotArea ?? ""}
              // onChange={handleProposedPlotAreaChange}
              // readOnly={isReadOnly}
              required
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={(e) => handlePreviousApplication(e)}
              className="fancy-button"
            >
              Save
            </button>
            {/* <input type="submit" value='submit' /> */}
          </div>

          {/* <div className="modal-action">
                        <form method="dialog">
                            <button className="btn" onClick={() => setIsModalOpen(false)}>Close</button>
                        </form>
                    </div> */}
        </div>
      </dialog>
    </>
  );
};

export default PreviousFileModal;
