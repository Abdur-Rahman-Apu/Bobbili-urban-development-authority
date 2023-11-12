import { useEffect, useState } from "react";
import DefaultDocumentData from "../../../../assets/DefaultDocument.json";
import PsDocument from "./PsDocument";
import { Link } from "react-router-dom";

function DefaultDocument({
  UpdatedDefaultData,
  PreviousDefaultDocumentData,
  setUpdatedDefaultData,
  role,
  handleFileChange,
  gradientColor,
  defaultImageFromDB,
  setRemarkText,
  remarkText
}) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [latestUpdatedDefaultData, setLatestUpdatedDefaultData] = useState([
    ...UpdatedDefaultData,
  ]);

  // This useEffect runs only on the initial render
  useEffect(() => {
    if (PreviousDefaultDocumentData?.length) {
      const updatedData = latestUpdatedDefaultData.map((mainItem) => {
        const matchedPrevItem = PreviousDefaultDocumentData?.find(
          (prevItem) => prevItem.id === mainItem.id
        );

        if (matchedPrevItem) {
          return {
            id: mainItem.id,
            question: mainItem.question,
            upload: mainItem.upload,
            approved: matchedPrevItem.approved,
          };
        } else {
          return mainItem;
        }
      });
      // Update the state with the new data
      setLatestUpdatedDefaultData(updatedData);
      setUpdatedDefaultData(updatedData);
    }
  }, [PreviousDefaultDocumentData]);

  // This function updates the data with handleDefaultStatus
  const handleDefaultStatus = (data) => {
    const updatedDocument = latestUpdatedDefaultData.map((item) => ({
      ...item,
      approved: item.id === data.id ? data.approved : item.approved,
    }));

    setLatestUpdatedDefaultData(updatedDocument);
    setUpdatedDefaultData(updatedDocument);
  };

  useEffect(() => {
    // Your previous useEffect dependencies here
  }, [latestUpdatedDefaultData]);

  const someEventHandler = (event, id) => {
    const file = event?.target.files[0];
    selectedFiles[id] = file;
    handleFileChange(event, id, selectedFiles, "default");
  };

  return (
    <div className="dark:text-black">
      {latestUpdatedDefaultData.map((data, index) => {
        let { id, question, approved, upload } = data;

        const isMatch = defaultImageFromDB?.find(
          (eachFile, i) => eachFile.id === id
        );
        const FindRemarkText = remarkText?.find((item) =>item["default"].id === id);
        const matchedText = FindRemarkText?.["default"].value;
        
        return (
          <div key={id} className="w-full px-2  rounded mb-8">
            <p className="pb-4 font-bold">
              {id}. {question}
            </p>
            {role === "LTP" && (
              <input
                name={id}
                type="file"
                accept=".pdf, image/*"
                onChange={(event) => someEventHandler(event, id)}
                className="file-input file-input-bordered w-full max-w-xs bg-white border border-gray-300"
              />
            )}
            {isMatch && (
              <Link
                to={`https://drive.google.com/file/d/${isMatch?.imageId}/view?usp=sharing`}
                target="_blank"
                className={`${gradientColor} text-white hover:underline ms-5 py-2 px-5 rounded-full`}
              >
                View
              </Link>
            )}
            <PsDocument
              role={role}
              id={id}
              approved={approved}
              handleDefaultStatus={handleDefaultStatus}
              type="default"
              setRemarkText={setRemarkText}
              remarkText={matchedText}
            />
          </div>
        );
      })}
    </div>
  );
}

export default DefaultDocument;
