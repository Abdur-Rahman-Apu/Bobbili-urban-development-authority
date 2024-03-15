import { motion } from "framer-motion";
import React, { useContext, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { AuthContext } from "../../AuthProvider/AuthProvider";
import userAddressLogo from "../../assets/user_logo/address_info.svg";
import userContactLogo from "../../assets/user_logo/contact_info.svg";
import userInfoLogo from "../../assets/user_logo/user_info_svg.svg";
import useGetUser from "../CustomHook/useGetUser";
import UpdateProfileInput from "./UpdateProfileInput";

const UpdateProfile = () => {
  const { userInfoFromLocalStorage } = useContext(AuthContext);

  const role = userInfoFromLocalStorage()?.role;
  const [data, refetch] = useGetUser();

  const { register, reset, handleSubmit } = useForm({
    defaultValues: useMemo(() => {
      // console.log("User has changed");
      return {
        department: "Town Planning",
        designation: "Engineer",
        country: "India",
        state: "Andhra Pradesh",
        ...data,
      };
    }, [data]),
  });

  useEffect(() => {
    reset(data);
  }, [data]);

  const onSubmit = (formValue) => {
    console.log(formValue, "Formvalue");
    delete formValue["_id"];

    console.log(formValue, "FOrm r value");

    fetch(
      `http://localhost:5000/updateUserInfo/${userInfoFromLocalStorage()._id}`,
      {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(formValue),
      }
    )
      .then((res) => res.json())
      .then(async (result) => {
        console.log(result);
        if (result.acknowledged) {
          refetch();
          toast.success("Update successfully");
        } else {
          toast.error("Failed to update");
        }
      })
      .catch(() => {
        toast.error("Server error");
      });
  };

  const handleInputPhone = (e) => {
    // Remove non-numeric characters
    const inputValue = e.target.value.replace(/[^0-9]/g, "");
    // Limit the input to 10 characters
    const truncatedValue = inputValue.slice(0, 10);
    // Update the input field with the sanitized value
    e.target.value = truncatedValue;

    if (truncatedValue.length < 10) {
      e.target.setCustomValidity("Must be 10 digits.");
      // e.target.classList.add('errorAdd');
    } else {
      // Reset the error message
      e.target.setCustomValidity("");
    }
  };

  // Same as previous handleInputPhone:
  const handleInputAadhar = (e) => {
    const inputValue = e.target.value.replace(/[^0-9]/g, "");
    const truncatedValue = inputValue.slice(0, 12);
    e.target.value = truncatedValue;

    if (truncatedValue.length < 12) {
      e.target.setCustomValidity("Must be 12 digits.");
    } else {
      e.target.setCustomValidity("");
    }
  };

  // Classes for this component :
  let labelClass = "block mb-1 font-semibold text-gray-600";
  const inputClass =
    "w-full px-3 py-2 border rounded-lg max-w-xs text-gray-600 bg-gray-50 border-gray-400 focus:border-gray-600 focus:outline-none focus:ring-2 ring-violet-200";

  return (
    <div className="py-10 text-gray-900">
      <p className="text-center font-roboto font-bold text-3xl mb-10 dark:text-black">
        Update Your Profile
      </p>

      {/* user information  */}

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* if there is a button in form, it will close the modal */}

        {/* Basic Information  */}
        <motion.div
          className="divide-y-2 mx-5 divide-gray-200 mb-[60px]"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0, transition: { duration: 2 } }}
          viewport={{ once: true }}
        >
          <motion.div
            className="flex items-center"
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0, transition: { duration: 1 } }}
            viewport={{ once: true }}
          >
            <h3 className="font-bold text-xl mb-4 ml-1 flex justify-center items-center">
              <img className="w-7 h-7 mr-1" src={userInfoLogo} alt="" />
              {/* <BiSolidUserRectangle size={30} color="#8B5BF6" className="mr-2" /> */}
              <span>Basic Information</span>
            </h3>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 px-2 nm_Container pb-3">
            <UpdateProfileInput
              id="department"
              name="department"
              label="Department"
              placeholder="Department"
              type="text"
              register={register}
            />
            <UpdateProfileInput
              id="designation"
              name="designation"
              label="Designation"
              placeholder="Designation"
              type="text"
              register={register}
            />
            <UpdateProfileInput
              id="registrationNo"
              name="registrationNo"
              label="Registration No"
              placeholder="Registration No"
              type="text"
              register={register}
            />
            <UpdateProfileInput
              id="qualification"
              name="qualification"
              label="Qualification"
              placeholder="Qualification"
              type="text"
              register={register}
            />
          </div>
        </motion.div>

        {/* Contact Information  */}
        <motion.div
          className="divide-y-2 divide-gray-200 mb-[60px] mx-5"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0, transition: { duration: 2 } }}
          viewport={{ once: true }}
        >
          <motion.div
            className="flex items-center mb-4 ml-1"
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0, transition: { duration: 1 } }}
            viewport={{ once: true }}
          >
            <h3 className="font-bold text-xl flex justify-center items-center">
              <img className="w-6 h-6 mr-1" src={userContactLogo} alt="" />
              {/* <MdContactPhone size={30} color="#8B5BF6" className="mr-2" /> */}
              <span>Contact Information</span>
            </h3>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 px-5 nm_Container pb-3">
            <UpdateProfileInput
              id="contactEmail"
              name="contactEmail"
              label="Email"
              placeholder="Email"
              type="email"
              register={register}
            />
            {/* <UpdateProfileInput
              id="mobileNo"
              name="mobileNo"
              label="Mobile No."
              placeholder="Mobile No."
              type="text"
              register={register}
            /> */}
            <motion.div
              className="my-4 mx-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0, transition: { duration: 1 } }}
              viewport={{ once: true }}
            >
              <label htmlFor="phone" className={labelClass}>
                Mobile no.
              </label>
              <input
                id="mobileNo"
                name="mobileNo"
                type="text"
                placeholder="Mobile No."
                {...register("mobileNo", { required: true })}
                className={inputClass}
                maxLength={10}
                onInput={handleInputPhone}
                required
              />
            </motion.div>

            {/* <UpdateProfileInput
              id="phone"
              name="phone"
              label="Phone no."
              placeholder="Phone no."
              type="text"
              register={register}
            /> */}

            <motion.div
              className="my-4 mx-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0, transition: { duration: 1 } }}
              viewport={{ once: true }}
            >
              <label htmlFor="phone" className={labelClass}>
                Phone no.
              </label>
              <input
                id="phone"
                name="phone"
                type="text"
                placeholder="Phone no."
                {...register("phone", { required: true })}
                className={inputClass}
                maxLength={10}
                onInput={handleInputPhone}
                required
              />
            </motion.div>

            <UpdateProfileInput
              id="fax"
              name="fax"
              label="Fax"
              placeholder="Fax"
              type="text"
              register={register}
            />
          </div>
        </motion.div>

        {/* Address Information  */}
        <motion.div
          className="divide-y-2 divide-gray-200 mb-[60px] mx-5"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0, transition: { duration: 2 } }}
          viewport={{ once: true }}
        >
          <motion.div
            className="flex items-center"
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0, transition: { duration: 1 } }}
            viewport={{ once: true }}
          >
            <h3 className="font-bold text-xl mb-4 ml-1 flex justify-center items-center">
              <img className="w-7 h-7 mr-1" src={userAddressLogo} alt="" />
              {/* <FaAddressCard size={30} color="#8B5BF6" className="mr-2" /> */}
              <span>Address Information</span>
            </h3>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 px-5 nm_Container pb-3">
            <UpdateProfileInput
              id="address"
              name="address"
              label="Address"
              placeholder="Address"
              type="text"
              register={register}
            />
            <UpdateProfileInput
              id="city"
              name="city"
              label="City"
              placeholder="City"
              type="text"
              register={register}
            />
            <UpdateProfileInput
              id="country"
              name="country"
              label="Country"
              placeholder="Country"
              type="text"
              register={register}
            />
            {/* <UpdateProfileInput
              id="aadharNo"
              name="aadharNo"
              label="Aadhar No."
              placeholder="Aadhar No."
              type="text"
              register={register}
            /> */}

            <motion.div
              className="my-4 mx-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0, transition: { duration: 1 } }}
              viewport={{ once: true }}
            >
              <label htmlFor="aadharNo" className={labelClass}>
                Aadhar no.
              </label>
              <input
                id="aadharNo"
                name="aadharNo"
                type="text"
                placeholder="Aadhar no."
                {...register("aadharNo", { required: true })}
                className={inputClass}
                maxLength={12}
                onInput={handleInputAadhar}
                required
              />
            </motion.div>

            <UpdateProfileInput
              id="state"
              name="state"
              label="State"
              placeholder="State"
              type="text"
              register={register}
            />
            <UpdateProfileInput
              id="zip"
              name="zip"
              label="Zip"
              placeholder="Zip"
              type="text"
              register={register}
            />
          </div>
        </motion.div>

        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0, transition: { duration: 1 } }}
          viewport={{ once: true }}
        >
          <button
            type="submit"
            className="text-white transition-all duration-700 fancy-button bg-normalViolet font-bold rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          >
            Update
          </button>
        </motion.div>
      </form>
    </div>
  );
};

export default UpdateProfile;
