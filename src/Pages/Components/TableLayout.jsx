import React, { useEffect, useState } from "react";

const TableLayout = ({ tableData, Component, tableComponentProps }) => {
  console.log(tableData, "tableData");
  console.log(tableComponentProps, "table component props");

  const [screenSize, setScreenSize] = useState(window.innerWidth);

  useEffect(() => {
    // Update screen size on window resize
    const handleResize = () => {
      setScreenSize(window.innerWidth);
    };
    // Attach the event listener
    window.addEventListener("resize", handleResize);
    // Remove the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="container mx-auto px-4 font-roboto ">
      <div className="py-4">
        <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4">
          <div className="inline-block min-w-full nm_Container rounded-lg overflow-hidden">
            {screenSize > 1024 ? (
              <table className="min-w-full leading-normal text-center">
                <thead className="bg-normalViolet">
                  <tr className="hidden lg:table-row">
                    {tableData?.tableHeader?.map((headerName) => {
                      return (
                        <th
                          key={headerName}
                          className={`p-3 border-b-2 border-gray-200  text-white  text-xs font-semibold uppercase tracking-wider ${
                            headerName === "Application no." && "w-48"
                          }`}
                        >
                          {headerName}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {tableData?.data?.map((applicationData, index) => (
                    <Component
                      key={index}
                      serialNo={index}
                      applicationData={applicationData}
                      tableComponentProps={tableComponentProps}
                      screenSize={screenSize}
                    />
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="min-w-full leading-normal text-center">
                {tableData?.data?.map((applicationData, index) => (
                  <Component
                    key={index}
                    serialNo={index}
                    applicationData={applicationData}
                    tableComponentProps={tableComponentProps}
                    screenSize={screenSize}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableLayout;
