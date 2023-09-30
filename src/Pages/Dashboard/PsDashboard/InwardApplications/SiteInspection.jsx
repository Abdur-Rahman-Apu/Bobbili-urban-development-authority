import React from 'react';
import { GiMoneyStack } from 'react-icons/gi';

const SiteInspection = () => {

    const tableDataClass = "whitespace-nowrap border-r px-6 py-4 border-neutral-500"
    return (
        <div className="flex flex-col sm:px-6 lg:px-8">
            <div className="overflow-x-auto">
                <div className="inline-block min-w-full py-2">
                    <div className="overflow-hidden">
                        <table
                            className="min-w-full border text-center text-sm font-light border-neutral-500">
                            <thead className="border-b font-medium border-neutral-500">
                                <tr>
                                    <th scope="col" className="border-r px-6 py-4 border-neutral-500"> Si. No.</th>
                                    <th scope="col" className="border-r px-6 py-4 border-neutral-500">Description</th>
                                    <th scope="col" className="border-r px-6 py-4 border-neutral-500">As per Application</th>
                                    <th scope="col" className="px-6 py-4">Observation</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Ground Position  */}
                                <tr className="border-b border-neutral-500">
                                    <td rowSpan='5' className={tableDataClass}>1</td>
                                    <td colSpan='3' className={`${tableDataClass} text-base font-semibold bg-gray-200`}>Ground Position</td>
                                </tr>
                                <tr className="border-b border-neutral-500">
                                    <td className={tableDataClass}>Nature of site</td>
                                    <td rowSpan='4' className={tableDataClass}>No</td>
                                    <td rowSpan='4' className={tableDataClass}>Yes/No</td>
                                </tr>
                                <tr className="border-b border-neutral-500">
                                    <td className={tableDataClass}>Site level</td>
                                </tr>
                                <tr className="border-b border-neutral-500">
                                    <td className={tableDataClass}>Total area as on ground in Sq.M.</td>
                                </tr>
                                <tr className="border-b border-neutral-500">
                                    <td className={tableDataClass}>Work commented</td>
                                </tr>

                                {/* Site Boundaries  */}
                                <tr className="border-b border-neutral-500">
                                    <td rowSpan='6' className={tableDataClass}>2</td>
                                    <td colSpan='3' className={`${tableDataClass} text-base font-semibold bg-gray-200`}>Site Boundaries</td>
                                </tr>
                                <tr className="border-b border-neutral-500">
                                    <td className={tableDataClass}>North</td>
                                    <td rowSpan='5' className={tableDataClass}></td>
                                    <td rowSpan='5' className={tableDataClass}>Yes/No</td>
                                </tr>
                                <tr className="border-b border-neutral-500">
                                    <td className={tableDataClass}>South</td>
                                </tr>
                                <tr className="border-b border-neutral-500">
                                    <td className={tableDataClass}>East</td>
                                </tr>
                                <tr className="border-b border-neutral-500">
                                    <td className={tableDataClass}>West</td>
                                </tr>
                                <tr className="border-b border-neutral-500">
                                    <td className={tableDataClass}>Whether the above physical<br />
                                        feature are talking / Not talking<br />
                                        with the schedule of the Documents.</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div className='flex items-center'>
                <div className="my-4 basis-[80%]">
                    <label htmlFor="ltpAddress" className='block text-gray-600 mb-1 font-semibold dark:text-gray-100'>
                        Recommendations
                    </label>
                    <textarea
                        id="recommendations"
                        name="Recommendations"
                        rows="5"
                        // cols='50'
                        className='w-full px-3 py-2 border border-green-600 rounded-lg  dark:text-black'
                        // defaultValue={}
                        placeholder="Comments"
                    ></textarea>
                </div>
                <div className='basic-[20%]'>
                    <button className="btn btn-md text-sm px-3 mt-10 ml-3 bg-green-300 hover:bg-green-400 hover:shadow-md transition-all duration-500">
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SiteInspection;