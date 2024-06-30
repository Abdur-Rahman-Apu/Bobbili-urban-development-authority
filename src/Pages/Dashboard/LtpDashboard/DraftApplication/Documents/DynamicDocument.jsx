import { useEffect, useState } from "react";
import { TbSlideshow } from "react-icons/tb";
import { Link } from "react-router-dom";
import PsDocument from "./PsDocument";

function DynamicDocument({
  DynamicAppChecklistDocument,
  setDynamicAppChecklistDocument,
  role,
  handleFileChange,
  gradientColor,
  dynamicImageFromDB,
  remarkText,
  setRemarkText,
}) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [render, setRender] = useState(false);

  console.log(remarkText, "dynamic");

  const someEventHandler = (event, id, uploadId) => {
    const file = event?.target.files[0];
    selectedFiles[id] = file;
    handleFileChange(event, id, selectedFiles, "dynamic", uploadId);
  };

  const handleDynamicStatus = ({ value: data, id, uploadId, type }) => {
    if (!data) {
      return;
    }
    const updatedDynamicAppChecklist = DynamicAppChecklistDocument.map(
      (checkListData) => {
        console.log(checkListData, "CheckListData");
        const condition01 = checkListData.id === id;
        const isExistUploadId = checkListData.requirements.find(
          (reqData) => reqData.uploadId === uploadId
        );
        const uploadIdIndex = checkListData.requirements.findIndex(
          (reqData) => reqData.uploadId === uploadId
        );

        if (condition01 && isExistUploadId) {
          checkListData.requirements[uploadIdIndex].approved = data;
          return checkListData;
        } else {
          return checkListData;
        }
      }
    );
    setDynamicAppChecklistDocument(updatedDynamicAppChecklist);
    setRender(updatedDynamicAppChecklist);
  };

  console.log(render, DynamicAppChecklistDocument, "DOC");

  useEffect(() => {
    console.log(render, "render");
  }, [DynamicAppChecklistDocument, render]);

  const page = JSON.parse(localStorage?.getItem("page"));
  return (
    <div className="dark:text-black">
      {DynamicAppChecklistDocument?.map((document, index) => {
        const { id, question, requirements } = document;

        console.log(document, "DYNAMIC");
        return (
          <div key={index + 1} className="w-full px-2 py-5 rounded">
            <div className="text-[17px]">
              <p className="pb-4 font-bold">
                {index + 9}. {question}
              </p>
              <div className="ml-6">
                {requirements?.map((RequireData, ind) => {
                  const { uploadId, requirement, approved, upload } =
                    RequireData;

                  console.log(RequireData, "Require data");
                  console.log(dynamicImageFromDB, "DIDB");
                  // console.log(object);
                  const isMatch = dynamicImageFromDB?.find(
                    (eachFile, i) =>
                      eachFile?.id === id && eachFile?.uploadId === uploadId
                  );
                  console.log(isMatch, id, uploadId, "ISMATCH");
                  const letters = [
                    "a",
                    "b",
                    "c",
                    "d",
                    "e",
                    "f",
                    "g",
                    "h",
                    "i",
                    "j",
                    "k",
                    "l",
                    "m",
                    "n",
                  ];

                  const FindRemarkText = remarkText?.find((item) => {
                    if (item["dynamic"]) {
                      return (
                        item["dynamic"].id === id &&
                        item["dynamic"].uploadId === uploadId
                      );
                    }
                  });
                  const matchedText = FindRemarkText?.["dynamic"]?.value;

                  return (
                    <div key={uploadId} className="mb-8 ">
                      <div className="mb-3 font-bold">
                        <span className="font-bold">{letters[ind]}. </span>
                        {requirement}
                      </div>

                      <div className="flex">
                        {role === "LTP" && page === "draft" && (
                          <input
                            name={id}
                            type="file"
                            accept=".pdf, image/*"
                            onChange={(event) =>
                              someEventHandler(event, id, uploadId)
                            }
                            className="file-input file-input-bordered w-full max-w-xs text-gray-400 bg-white dark:text-black"
                          />
                        )}

                        {isMatch && (
                          <div className="basis-1/6 ml-2">
                            <Link
                              to={`https://drive.google.com/file/d/${isMatch.imageId}/view?usp=sharing`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`${gradientColor} flex items-center text-white hover:underline py-2 px-5 rounded-full shadow-lg w-fit`}
                            >
                              <TbSlideshow size={20} className="me-1" />
                              View
                            </Link>
                          </div>
                        )}
                        {role === "PS" && (
                          <PsDocument
                            role={role}
                            id={id}
                            approved={approved}
                            uploadId={uploadId}
                            handleDynamicStatus={handleDynamicStatus}
                            type="dynamic"
                            setRemarkText={setRemarkText}
                            remarkText={remarkText}
                            remarkValue={matchedText}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default DynamicDocument;
