import React, { useState } from "react";
import InputField from "../../../Components/InputField";
import { AiFillPlusCircle } from "react-icons/ai";
import { FaHandPointRight } from "react-icons/fa";
import generalInfoImage from "../../../../assets/images/general-information.png";
import plotImage from "../../../../assets/images/land.png";
import wallImage from "../../../../assets/images/gate.png";

const BuildingInfo = () => {
  // Case Type 
  const [selectedOptionCase, setSelectedOptionCase] = useState('Select Case type');
  const [selectedOptionPermission, setSelectedOptionPermission] = useState('Select Nature of permission');

  // Nature of the site 
  const [selectedOption, setSelectedOption] = useState('Select Nature of the site');
  const [showInputFields, setShowInputFields] = useState(false);

  // Add a state variable to keep track of the number of sets of input fields
  const [inputFieldCount, setInputFieldCount] = useState(0);

  // Net Plot Area(in Sq.M.) Calculation :
  const [proposedPlotArea, setProposedPlotArea] = useState('');
  const [roadWideningArea, setRoadWideningArea] = useState('');
  const [netPlotArea, setNetPlotArea] = useState('');

  // Function to add more 3 sets of input fields
  const handleAddInputFields = () => {
    if (inputFieldCount < 3) {
      setInputFieldCount(inputFieldCount + 1);
    }
  };

  // Case Type 
  const handleCaseTypeChange = (e) => {
    setSelectedOptionCase(e.target.value);
  };
  const handlePermissionChange = (e) => {
    setSelectedOptionPermission(e.target.value);
  };

  // Nature of the site 
  const handleNatureChange = (e) => {
    setSelectedOption(e.target.value);

    // Check if the selected option should show additional input fields
    if (e.target.value === 'Approved Layout' || e.target.value === 'Regularised under LRS' || e.target.value === 'Plot port of RLP/IPLP but not regularised') {
      setShowInputFields(true);
    }
    else {
      setShowInputFields(false);
    }
  };

  const handleProposedPlotAreaChange = (e) => {
    const newValue = e.target.value;

    // Check if the entered value is a valid number and less than or equal to 300
    if (newValue <= 300) {
      setProposedPlotArea(newValue);
      calculateNetPlotArea(newValue, roadWideningArea);
    }
  };

  const handleRoadWideningAreaChange = (e) => {
    const newValue = e.target.value;

    // Check if the entered value is a valid number and less than or equal to 300
    if (newValue <= 300) {
      setRoadWideningArea(newValue);
      calculateNetPlotArea(proposedPlotArea, newValue);
    }
  };

  const calculateNetPlotArea = (proposed, widening) => {
    const proposedArea = parseFloat(proposed);
    const wideningArea = parseFloat(widening);

    if (!isNaN(proposedArea) && !isNaN(wideningArea)) {
      const netArea = proposedArea - wideningArea;
      setNetPlotArea(netArea.toFixed(2)); // Format to 2 decimal places
    } else {
      setNetPlotArea('');
    }
  };



  // get data from input field :
  const collectInputFieldData = (data) => {
    console.log(data);

    const surveyNo = document.getElementById('SurveyNo').value;
    const district = document.getElementById('District').value;
    const mandal = document.getElementById('Mandal').value;
    const gramaPanchayat = document.getElementById('GramaPanchayat').value;
    const village = document.getElementById('Village').value;
    // const bpsApprovedNo = document.getElementById('BpsApprovedNo').value;
    // const previewsApprovedFileNo = document.getElementById('PreviewsApprovedFileNo').value;
    // const lpNo = document.getElementById('LpNo').value;
    // const plotNo = document.getElementById('PlotNo').value;
    // const lrsNo = document.getElementById('LrsNo').value;
    // const plotNo2 = document.getElementById('PlotNo2').value;
    // const iplpNo = document.getElementById('IplpNo').value;

    // const totalPlotDocument = document.getElementById('TotalPlotDocument').value;
    // const totalPlotGround = document.getElementById('TotalPlotGround').value;
    // const proposedPlotArea = document.getElementById('ProposedPlotArea').value;

    // Get the selected radio input's value
    const selectedApplicationType = document.querySelector('input[name="radio-1"]:checked')?.value || '';

    const inputData = {
      // General Information:
      surveyNo,
      district,
      mandal,
      gramaPanchayat,
      village,
      // bpsApprovedNo,
      // previewsApprovedFileNo,
      // lpNo,
      // plotNo,
      // lrsNo,
      // plotNo2,
      // iplpNo,
      caseType: selectedOptionCase,      // Access caseType from data
      natureOfPermission: selectedOptionPermission,
      natureOfTheSite: selectedOption,
      applicationType: selectedApplicationType,

      // Plot Details:
      // totalPlotDocument,
      // totalPlotGround,
      // proposedPlotArea: proposedPlotArea,


    };

    console.log(inputData);
  };



  return (
    <div className="grid my-5 lg:my-0 lg:p-2">

      <button type="submit" className="btn" onClick={collectInputFieldData}>
        Log Input Data
      </button>

      {/* general information */}
      <div className="mb-10">
        {/* heading  */}
        <div className="flex items-center">
          <img src={generalInfoImage} alt="" className="h-10 me-3" />
          <h3 className="font-bold text-xl ">General Information</h3>
        </div>
        {/* divider  */}
        <div className="divider m-0 mb-2"></div>

        <div className="grid grid-cols-2 lg:grid-cols-4 my-5">
          <div className="flex flex-col justify-center px-3">
            <label htmlFor="nature" className="block text-gray-600 mb-1 font-semibold">
              <span>Case Type</span>
            </label>
            <select
              id="caseType"
              className="w-full px-3 py-[10px] border border-[#10AC84] rounded-lg max-w-xs"
              value={selectedOptionCase}
              onChange={handleCaseTypeChange}
            >
              <option disabled selected value="Select Case type">Select Case type</option>
              <option value="New">New</option>
              <option value="Demolition and Reconstruction">Demolition and Reconstruction</option>
              <option value="Alteration Addition Existing">Alteration Addition Existing</option>
              <option value="Revision">Revision</option>
            </select>
          </div>

          <div className="grid grid-cols-1 font-medium  lg:justify-items-center my-4 mx-3">
            <p className="flex items-center font-semibold text-gray-600">
              Application Type?
            </p>
            <div className="grid-cols-1 lg:grid-cols-2 items-center">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="radio-1"
                  className="radio border border-[#10AC84] h-4 w-4"
                  value="Private"
                />
                <span className="ml-2 text-base">Private</span>
              </label>
              <label className="inline-flex items-center md:ml-3">
                <input
                  type="radio"
                  name="radio-1"
                  className="radio border border-[#10AC84] h-4 w-4"
                  value="Govt. Land"
                />
                <span className="ml-2 text-base">Govt. Land</span>
              </label>
            </div>
          </div>

          <div className="flex flex-col justify-center mx-3">
            <label className="block text-gray-600 mb-1 font-semibold">
              <span>Nature of permission</span>
            </label>
            <select
              className="w-full px-3 py-[10px] border border-[#10AC84] rounded-lg max-w-xs"
              value={selectedOptionPermission}
              onChange={handlePermissionChange}
            >
              <option disabled selected value="Select Nature of permission">Select Nature of permission</option>
              <option value="General">General</option>
              <option value="Regularised under BPS">Regularised under BPS</option>
              <option value="Housing Scheme">Housing Scheme</option>
            </select>
          </div>

          <div className="my-4 mx-3">
            <label
              htmlFor="nature"
              className="block text-gray-600 mb-1 font-semibold"
            >
              <span>Nature of the site</span>
            </label>
            <select
              id="nature"
              className="w-full px-3 py-[10px] border border-[#10AC84] rounded-lg max-w-xs"
              value={selectedOption}
              onChange={handleNatureChange}
            >
              <option disabled selected>Select Nature of the site</option>
              <option>Approved Layout</option>
              <option>Regularised under LRS</option>
              <option>Plot port of RLP/IPLP but not regularised</option>
              <option>Congested/ Gramakanta/ Old Built-up area</option>
              <option>Newly Developed/ Built up area</option>
            </select>
          </div>

          <InputField
            id="SurveyNo"
            name="Survey no."
            label="Survey no."
            placeholder="Survey no."
            type="text"
          />
          <InputField
            id="District"
            name="District"
            label="District"
            placeholder="District"
          />
          <InputField
            id="Mandal"
            name="Mandal"
            label="Mandal"
            placeholder="Mandal"
          />
          <InputField
            id="GramaPanchayat"
            name="Grama Panchayat"
            label="Grama Panchayat"
            placeholder="Grama Panchayat"
          />
          <InputField
            id="Village"
            name="Village"
            label="Village"
            placeholder="Village"
          />

          {/*===================== Conditionally render input fields based on Case Type  =====================*/}
          {selectedOptionCase === 'Alteration Addition Existing' && selectedOptionPermission === 'Regularised under BPS' && (
            <div>
              <InputField
                id="BpsApprovedNo"
                name=""
                label="BPS approved no."
                placeholder="BPS approved no."
                type="number"
              />
            </div>
          )}

          {selectedOptionCase === 'Alteration Addition Existing' && selectedOptionPermission !== 'Regularised under BPS' && (
            <div>
              <InputField
                id="PreviewsApprovedFileNo"
                name=""
                label="Previews approved file no."
                placeholder="Previews approved file no."
                type="number"
              />
            </div>
          )}

          {/* Conditionally render input fields based on Nature of the site */}
          {showInputFields && (
            <>
              {selectedOption === 'Approved Layout' && (
                <>
                  <InputField
                    id="LpNo"
                    name=""
                    label="L.P. no."
                    placeholder="L.P. no."
                    type="number"
                  />
                  <InputField
                    id="PlotNo"
                    name=""
                    label="Plot no."
                    placeholder="Plot no."
                    type="number"
                  />
                </>
              )}
              {selectedOption === 'Regularised under LRS' && (
                <>
                  <InputField
                    id="LrsNo"
                    name=""
                    label="LRS no"
                    placeholder="LRS no."
                    type="number"
                  />
                  <InputField
                    id="PlotNo2"
                    name=""
                    label="Plot no"
                    placeholder="Plot no."
                    type="number"
                  />
                </>
              )}
              {selectedOption === 'Plot port of RLP/IPLP but not regularised' && (
                <InputField
                  id="IplpNo"
                  name=""
                  label="RLP/IPLP no."
                  placeholder="RLP/IPLP no."
                  type="number"
                />
              )}
            </>
          )}
          {/*===================== Conditional Input Field End =====================*/}
        </div>
      </div>

      {/* plot details  */}
      <div className="mb-5">
        <div className="flex items-center">
          <img src={plotImage} alt="" className="h-10 me-3" />
          <h3 className="font-bold text-xl my-3">Plot Details</h3>
        </div>
        <div className="divider m-0"></div>

        <div className="grid grid-cols-2 lg:grid-cols-4 mt-5">
          <InputField
            type="number"
            id="totalPlotDocument"
            name=""
            label="Total Plot are as per document"
            placeholder="in Sq.M."
          />
          <InputField
            type="number"
            id="totalPlotGround"
            name=""
            label="Total Plot are as on ground"
            placeholder="in Sq.M."
          />

          <div className="my-4 mx-3">
            <label htmlFor='ProposedPlotArea' className="block text-gray-600 mb-1 font-semibold">
              Proposed Plot area
            </label>
            <input
              type="number"
              id="ProposedPlotArea"
              placeholder="in Sq.M."
              className="w-full px-3 py-2 border border-green-600 rounded-lg max-w-xs"
              value={proposedPlotArea}
              onChange={handleProposedPlotAreaChange}
              maxLength="3"
            />
          </div>

          <div className="my-4 mx-3">
            <label htmlFor='ProposedPlot' className="block text-gray-600 mb-1 font-semibold">
              Road Widening Area
            </label>
            <input
              type="number"
              placeholder="in Sq.M."
              className="w-full px-3 py-2 border border-green-600 rounded-lg max-w-xs"
              value={roadWideningArea}
              onChange={handleRoadWideningAreaChange}
            />
          </div>

          {/* Automatically calculated Plot Details  */}
          <div className="my-4 mx-3">
            <label
              htmlFor="disabled-input"
              className="block text-gray-600 mb-1 font-semibold"
            >
              Net Plot Area (in Sq.M.)
            </label>
            <input
              type="text"
              id="disabled-input"
              name="disabled-input1"
              placeholder="Automatically calculated"
              className="w-full px-3 py-2 border rounded-lg max-w-xs"
              value={netPlotArea}
              disabled
            />
          </div>
        </div>

        <div className="grid grid-cols-1 mx-5 md:mx-10 lg:mx-14 my-10">

          <div className="flex flex-col md:flex-row font-medium mb-4 text-lg">
            <div className="flex items-center mb-3 md:mb-0">
              <FaHandPointRight className="me-3 w-5 lg:w-auto text-green-500" />
              <p className="font-bold text-lg">
                Whether site abuts any Existing Road?
              </p>
            </div>
            <label className="inline-flex items-center ml-3">
              <input
                type="radio"
                name="radio-2"
                className="radio border border-[#10AC84] h-4 w-4"
                value="yes"
              />
              <span className="ml-2 text-base">Yes</span>
            </label>
            <label className="inline-flex items-center ml-3">
              <input
                type="radio"
                name="radio-2"
                className="radio border border-[#10AC84] h-4 w-4"
                value="no"
              />
              <span className="ml-2 text-base">No</span>
            </label>
          </div>

          <div className="flex flex-col md:flex-row font-medium mb-4 text-lg mt-4">
            <div className="flex items-center mb-3 md:mb-0">
              <FaHandPointRight className="me-3 w-5 lg:w-auto text-green-500" />
              <p className="font-bold text-lg">Status of Road?</p>
            </div>
            <label className="inline-flex items-center ml-3">
              <input
                type="radio"
                name="radio-3"
                className="radio border border-[#10AC84] h-4 w-4"
                value="Public"
              />
              <span className="ml-2 text-base">Public</span>
            </label>
            <label className="inline-flex items-center ml-3">
              <input
                type="radio"
                name="radio-3"
                className="radio border border-[#10AC84] h-4 w-4"
                value="Private"
              />
              <span className="ml-2 text-base">Private</span>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 mt-3">
          <div className="flex flex-col justify-center mx-3">
            <label className="block text-gray-600 mb-1 font-semibold">
              <span>Nature of Road</span>
            </label>
            <select className="w-full px-3 py-[10px] border border-[#10AC84] rounded-lg max-w-xs">
              <option disabled selected>Select Nature of Road</option>
              <option>BT Road</option>
              <option>CC Road</option>
              <option>WBM</option>
              <option>Kutchha/ Graval</option>
            </select>
          </div>

          <InputField
            id="name12"
            name="name1"
            label="Existing road (in Mts.)"
            placeholder="in Sq.M."
          />
          <InputField
            id="name12"
            name="name1"
            label="Proposed road (in Mts.)"
            placeholder="in Sq.M."
          />
          <InputField
            id="name12"
            name="name1"
            label="Market Value (per Sq.Yd.)"
            placeholder="per Sq.Yd."
          />

          <div className="flex flex-col justify-center mx-3">
            <label className="block text-gray-600 mb-1 font-semibold">
              <span>Floor Name</span>
            </label>
            <select className="w-full px-3 py-[10px] border border-[#10AC84] rounded-lg max-w-xs">
              <option disabled selected>Select Floor Name</option>
              <option>Stilt / Parking Floor</option>
              <option>Ground floor</option>
              <option>First Floor</option>
              <option>Second Floor</option>
            </select>
          </div>

          <InputField
            id="name12"
            name="name1"
            label="Built up area (in Sq.M.)"
            placeholder="in Sq.M."
          />
          <InputField
            id="name12"
            name="name1"
            label="Parking Area (in Sq.M.)"
            placeholder="in Sq.M."
          />
          {/* Add button for adding more input fields */}
          <div className="flex justify-start items-center ml-3 mt-6">
            <button className="btn" onClick={handleAddInputFields}>
              <AiFillPlusCircle size={25} color="#6fd7bd" />
            </button>
          </div>
        </div>

        {/* Render additional input field sets based on inputFieldCount */}
        {Array.from({ length: inputFieldCount }).map((_, index) => (
          <div key={index} className="grid grid-cols-2 lg:grid-cols-4 mt-5">
            <div className="flex flex-col justify-center mx-3">
              <label className="block text-gray-600 mb-1 font-semibold">
                <span>Floor Name</span>
              </label>
              <select className="w-full px-3 py-[10px] border border-[#10AC84] rounded-lg max-w-xs">
                <option disabled selected>Select Floor Name</option>
                <option>Stilt / Parking Floor</option>
                <option>Ground floor</option>
                <option>First Floor</option>
                <option>Second Floor</option>
              </select>
            </div>

            <InputField
              id={`name12-${index}`}
              name="name1"
              label="Built up Area (in Sq.M.)"
              placeholder="in Sq.M."
            />
            <InputField
              id={`name12-${index}`}
              name="name1"
              label="Parking Area (in Sq.M.)"
              placeholder="in Sq.M."
            />
          </div>
        ))}

        <div className="grid grid-cols-2 lg:grid-cols-4 mt-5">
          <div className="my-4 mx-3">
            <label
              htmlFor="disabled-input"
              className="block text-gray-600 mb-1 font-semibold"
            >
              Total Built up area
            </label>
            <input
              type="text"
              id="disabled-input"
              name="name1"
              placeholder="Automatically calculated"
              className="w-full px-3 py-2 border rounded-lg max-w-xs"
              disabled
            />
          </div>

          <div className="my-4 mx-3">
            <label
              htmlFor="disabled-input2"
              className="block text-gray-600 mb-1 font-semibold"
            >
              Total Parking area
            </label>
            <input
              id="disabled-input2"
              name="name1"
              placeholder="Automatically calculated"
              className="w-full px-3 py-2 border rounded-lg max-w-xs"
              disabled
            />
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4">
          <InputField
            id="name7"
            name="name72"
            label="Front setback (in M.)"
            placeholder="in M."
          />
          <InputField
            id="name8"
            name="name1"
            label="Rare setback (in M.)"
            placeholder="in M."
          />
          <InputField
            id="name9"
            name="name1"
            label="Side1 setback (in M.)"
            placeholder="in M."
          />
          <InputField
            id="name10"
            name="name1"
            label="Side 2 setback (in M.)"
            placeholder="in M."
          />
          <InputField
            id="name11"
            name="name1"
            label="Total Height of The Building Exclude Stilt (in Mts.)"
            placeholder="in Mts."
          />
        </div>

        <div className="grid grid-cols-1 mx-5 md:mx-10 lg:mx-14 my-10">
          <div className="flex flex-col md:flex-row font-medium mb-4 text-lg">
            <div className="flex items-center mb-3 md:mb-0">
              <FaHandPointRight className="me-3 w-5 lg:w-auto text-green-500" />
              <p className="font-bold text-lg">
                Compounding wall proposed?
              </p>
            </div>
            <label className="inline-flex items-center ml-3">
              <input
                type="radio"
                name="radio-2"
                className="radio border border-[#10AC84] h-4 w-4"
                value="yes"
              />
              <span className="ml-2 text-base">Yes</span>
            </label>
            <label className="inline-flex items-center ml-3">
              <input
                type="radio"
                name="radio-2"
                className="radio border border-[#10AC84] h-4 w-4"
                value="no"
              />
              <span className="ml-2 text-base">No</span>
            </label>
          </div>

          <div className="flex flex-col md:flex-row font-medium mb-4 text-lg mt-4">
            <div className="flex items-center mb-3 md:mb-0">
              <FaHandPointRight className="me-3 w-7 lg:w-auto text-green-500" />
              <p className="font-bold text-lg">Whether site Registered as house plot/ Building prior to 18-01-2006?</p>
            </div>
            <label className="inline-flex items-center ml-3">
              <input
                type="radio"
                name="radio-3"
                className="radio border border-[#10AC84] h-4 w-4"
                value="Yes"
              />
              <span className="ml-2 text-base">Yes</span>
            </label>
            <label className="inline-flex items-center ml-3">
              <input
                type="radio"
                name="radio-3"
                className="radio border border-[#10AC84] h-4 w-4"
                value="No"
              />
              <span className="ml-2 text-base">No</span>
            </label>
          </div>
        </div>
      </div>

      {/* schedule boundaries  */}
      <div>
        <div className="flex items-center mb-2">
          <img src={wallImage} alt="A image of wall" className="h-8 me-3" />
          <h3 className="font-bold text-xl">Schedule of Boundaries</h3>
        </div>
        <div className="divider m-0"></div>
        <div className="grid grid-cols-2 lg:grid-cols-4 items-center my-5">

          <div className="flex flex-col  justify-center mx-3">
            <label className="block text-gray-600 mb-1 font-semibold">
              <span>North</span>
            </label>
            <select className="w-full px-3 py-[10px] border border-[#10AC84] rounded-lg max-w-xs">
              <option disabled selected>Select North</option>
              <option>Road</option>
              <option>Plot</option>
              <option>Vacant land</option>
              <option>Vacant land</option>
              <option>Water body</option>
            </select>
          </div>

          <div className="flex flex-col  justify-center mx-3">
            <label className="block text-gray-600 mb-1 font-semibold">
              <span>South</span>
            </label>
            <select className="w-full px-3 py-[10px] border border-[#10AC84] rounded-lg max-w-xs">
              <option disabled selected>Select South</option>
              <option>Road</option>
              <option>Plot</option>
              <option>Vacant land</option>
              <option>Vacant land</option>
              <option>Water body</option>
            </select>
          </div>

          <div className="flex flex-col  justify-center mx-3">
            <label className="block text-gray-600 mb-1 font-semibold">
              <span>East</span>
            </label>
            <select className="w-full px-3 py-[10px] border border-[#10AC84] rounded-lg max-w-xs">
              <option disabled selected>Select East</option>
              <option>Road</option>
              <option>Plot</option>
              <option>Vacant land</option>
              <option>Vacant land</option>
              <option>Water body</option>
            </select>
          </div>

          <div className="flex flex-col  justify-center mx-3">
            <label className="block text-gray-600 mb-1 font-semibold">
              <span>West</span>
            </label>
            <select className="w-full px-3 py-[10px] border border-[#10AC84] rounded-lg max-w-xs">
              <option disabled selected>Select West</option>
              <option>Road</option>
              <option>Plot</option>
              <option>Vacant land</option>
              <option>Vacant land</option>
              <option>Water body</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuildingInfo;
