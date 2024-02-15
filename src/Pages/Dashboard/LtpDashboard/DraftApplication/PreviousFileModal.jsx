import React, { useContext, useEffect, useRef } from 'react';
import InputField from '../../../Components/InputField';
import useGetPageWiseApplication from '../../../CustomHook/useGetPageWiseApplication';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AuthContext } from '../../../../AuthProvider/AuthProvider';

const PreviousFileModal = ({ FileModal }) => {

    const { setIsModalOpen, isModalOpen, setDataFromDB } = FileModal;
    const fileInputRef = useRef(null);

    const { sendUserDataIntoDB, userInfoFromLocalStorage, getApplicationData } = useContext(AuthContext);

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
        console.log('raian');

        const formData = document.getElementById('FileNoForApplication');
        console.log(formData.value);

        const searchData = { appNo: formData.value, page: 'approved', };
        fetch(`http://localhost:5000/getApplicationData?data=${JSON.stringify(searchData)}`)
            .then((res) => res.json())
            .then(async (oldApprovedFileData) => {

                const { applicationNo, buildingInfo, applicantInfo, applicationCheckList, drawing, payment, } = oldApprovedFileData;

                const oldApplicationNo = JSON.parse(localStorage.getItem("CurrentAppNo"))

                const filterDataForLtp = {
                    userId: userInfoFromLocalStorage()._id,
                    oldApplicationNo,
                }


                const serialNumber = applicationNo.split('/')[1];

                const result = await sendUserDataIntoDB(`http://localhost:5000/updateDraftApplicationData?filterData=${JSON.stringify(filterDataForLtp)}`, "PATCH", {
                    applicationNo: `${oldApplicationNo}-(${serialNumber})`,
                    buildingInfo: buildingInfo,
                    applicantInfo: applicantInfo,
                    applicationCheckList: applicationCheckList,
                    drawing,
                    previousPayment: payment,
                    // payment,
                });

                if (result.acknowledged === true) {
                    toast.error('Data get success')

                    localStorage.setItem("CurrentAppNo", `${oldApplicationNo}-(${serialNumber})`)

                    const getData = async () => {
                        const applicationData = await getApplicationData(`${oldApplicationNo}-(${serialNumber})`, 'draft');
                        console.log(applicationData, "All info ApplicationData");
                        if (Object.keys(applicationData)?.length) {
                            setDataFromDB(applicationData);
                        }
                    };
                    getData();
                }
                else {
                    toast.error('Data get failed')
                }

            })
            .catch((error) => {
                toast.error("Server failed");
            })


        // const formData = document.getElementById('FileNo');
        // console.log(formData.value);

        // console.log('sdfjsdfjhi');
    }


    return (
        <>
            <dialog id="fileModal" className="modal">
                <div className="modal-box bg-white">
                    <div method="dialog">
                        <button onClick={() => setIsModalOpen(false)} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </div>


                    <h3 className="font-bold text-lg">Enter previous approved file no :</h3>

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
                        <label htmlFor="" className={"block mb-1 font-semibold text-gray-600"}>
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

                    <div className='flex justify-end'>
                        <button
                            onClick={(e) => handlePreviousApplication(e)}
                            className='fancy-button'
                        >Save</button>
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