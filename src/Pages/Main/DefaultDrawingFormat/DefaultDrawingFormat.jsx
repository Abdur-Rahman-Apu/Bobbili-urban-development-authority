import { motion } from "framer-motion";
import React, { useState } from "react";
import toast from "react-hot-toast";
import Loading from "../../Shared/Loading";

const DefaultDrawingFormat = () => {
  const [loading, setLoading] = useState(false);

  const downloadFile = (format, fileName) => {
    setLoading(true);
    let data;
    if (format === "pdf") {
      data = JSON.stringify({
        fileName,
        fileId: "1Mque_-OWf28RiubAdE5Ll5CFWBnMPvUf",
      });
    } else if (format === "dwg") {
      data = JSON.stringify({
        fileName,
        fileId: "1xbOVy5XN5vb5Ka1eTlShSYz09VX7WS78",
      });
    }

    fetch(`https://residential-building.onrender.com/downloadFile?data=${data}`)
      .then((res) => {
        if (res.ok) {
          // If the response status is OK, it means the file download is successful
          return res.blob();
        } else {
          // If there's an error response, handle it accordingly
          throw new Error(`Error: ${res.status} - ${res.statusText}`);
        }
      })
      .then((blob) => {
        // Create a URL for the blob and trigger a download
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName; // Set the desired file name and extension
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err, "err");
        setLoading(<i className="fa fa-life-saver" aria-hidden="true"></i>);
        toast.error("Server Error");
      });
  };

  if (loading) {
    return <Loading />;
  }
  return (
    <div className="w-full h-full drawingFormat relative">
      <motion.div
        className="flex flex-col w-full items-center h-full justify-center"
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 1, scale: 1.0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <p className="text-black text-2xl font-bold text-center uppercase mb-10">
          Default Formats
        </p>
        <div className="flex w-full justify-evenly">
          <button
            className="buttonDownload"
            onClick={() => {
              downloadFile("pdf", "Drawing-Model.pdf");
            }}
          >
            Drawing Format PDF
          </button>

          <button
            className="buttonDownload"
            onClick={() => {
              downloadFile("dwg", "Drawing.dwg");
            }}
          >
            AutoCad Drawing
          </button>
        </div>
      </motion.div>

      {/* <div className="absolute top-0 left-1/2 w-[40px] h-[40px] rounded-full bg-[#8579F2]"></div> */}
      <div className="nm_Container absolute top-10 left-10 w-[20px] h-[20px] rounded-full bg-[#8579F2]"></div>
      {/* <div className="absolute top-1/2 right-0 w-[30px] h-[30px] rounded-full bg-[#8579F2]"></div> */}
      <div className="nm_Container absolute bottom-9 left-3/4 w-[70px] h-[70px] rounded-full bg-[#8579F2]"></div>
      <div className="nm_Container absolute top-32 right-32 w-[30px] h-[30px] rounded-full bg-[#8579F2]"></div>
    </div>
  );
};

export default DefaultDrawingFormat;
