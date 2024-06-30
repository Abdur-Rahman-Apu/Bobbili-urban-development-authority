import { useEffect, useState } from "react";
import { TbSlideshow } from "react-icons/tb";
import { Link } from "react-router-dom";
import PsDocument from "./PsDocument";

function DefaultDocument({
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
  console.log(remarkText, "Remark text default");

  // This function updates the data when user Clicked radio btn
  const handleDefaultStatus = ({ value: data, id, type }) => {
    const updatedDocument = UpdatedDefaultData.map((item) => ({
      ...item,
      approved: item.id === id ? data : item.approved,
    }));
    setUpdatedDefaultData(updatedDocument);
    // setRender(updatedDocument)
  };

  useEffect(() => {
    // Your previous useEffect dependencies here
  }, [UpdatedDefaultData]);
  console.log(UpdatedDefaultData, "UpdatedDefaultData");

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
            return item["default"].id === id;
          }
        });
        const matchedText = FindRemarkText?.["default"]?.value;

        return (
          <div key={id} className="w-full rounded mb-8">
            <p className="pb-4 font-bold">
              {id}. {question}
            </p>
            <div className="flex">
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
                <div className="basis-1/6 ml-2">
                  <Link
                    to={`https://drive.google.com/file/d/${isMatch?.imageId}/view?usp=sharing`}
                    target="_blank"
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
                  handleDefaultStatus={handleDefaultStatus}
                  type="default"
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
  );
}

export default DefaultDocument;
