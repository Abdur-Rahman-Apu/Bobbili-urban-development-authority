import { useEffect, useState } from "react";
import DefaultDocumentData from "../../../../assets/DefaultDocument.json";
import PsDocument from "./PsDocument";
import { Link } from "react-router-dom";

function DefaultDocument({
  PreviousDefaultDocumentData,
  UpdatedDefaultData,
  setUpdatedDefaultData,
  role,
  handleFileChange,
  gradientColor,
  defaultImageFromDB,
  setRemarkText,
  remarkText,
}) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [render, setRender] = useState(false);
  // PreviousDefault Document and DefaultDocument combinding
  useEffect(() => {
    const combinedArray = [...PreviousDefaultDocumentData || [], ...DefaultDocumentData];
    const uniqueCombinedArray = [];

    combinedArray.forEach(item => {
      const exists = uniqueCombinedArray.some(existingItem => existingItem.id === item.id);
      if (!exists) {
        uniqueCombinedArray.push(item);
      }
    });
    setUpdatedDefaultData(uniqueCombinedArray);
    setRender(uniqueCombinedArray)
  }, [PreviousDefaultDocumentData,render]);

  // This function updates the data when user Clicked radio btn
  const handleDefaultStatus = ({ value: data, id, type }) => {
    const updatedDocument = UpdatedDefaultData.map((item) => ({
      ...item,
      approved: item.id === id ? data : item.approved,
    }));
    setUpdatedDefaultData(updatedDocument);
    setRender(updatedDocument)
  };

  useEffect(() => {
    // Your previous useEffect dependencies here
    console.log(render,"Default Render")
  }, [UpdatedDefaultData,render]);

  const someEventHandler = (event, id) => {
    const file = event?.target.files[0];
    selectedFiles[id] = file;
    handleFileChange(event, id, selectedFiles, "default");
  };

  const page = JSON.parse(localStorage.getItem("page"));

  return (
    <div className="dark:text-black">
      {UpdatedDefaultData.map((data, index) => {
        let { id, question, approved, upload } = data;

        const isMatch = defaultImageFromDB?.find(
          (eachFile, i) => eachFile.id === id
        );
        const FindRemarkText = remarkText?.find((item) => {
          if (item["default"]) {
            return (item["default"].id === id)
          }
        });
        const matchedText = FindRemarkText?.["default"].value;

        return (
          <div key={id} className="w-full px-2  rounded mb-8">
            <p className="pb-4 font-bold">
              {id}. {question}
            </p>
            {role === "LTP" && page === "draft" && (
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
