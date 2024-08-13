import { motion } from "framer-motion";
import Lottie from "lottie-react";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useQuery } from "react-query";
import Swal from "sweetalert2";
import { AuthContext } from "../../../../AuthProvider/AuthProvider";
import HomeCss from "../../../../Style/Home.module.css";
import ErrorAnimation from "../../../../assets/ServerError.json";
import { baseUrl } from "../../../../utils/api";
import { getCookie } from "../../../../utils/utils";
import Loading from "../../../Shared/Loading";
import NoApplicationFound from "../../../Shared/NoApplicationFound";
import IndividualUser from "./IndividualUser";

const AllUsers = () => {
  const [records, setRecords] = useState([]);
  const [userInfo, setUserInfo] = useState({});
  const [showModal, setShowModal] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [validityError, setValidityError] = useState("");
  const [loadingForUpdate, setLoadingForUpdate] = useState(false);

  const { userInfoFromCookie, checkLicenseExpirationOfLtp } =
    useContext(AuthContext);

  const getToken = JSON.parse(getCookie("jwToken"));

  const { data, refetch, isLoading, isSuccess } = useQuery({
    queryKey: ["allUser"],
    queryFn: async () => {
      const response = await fetch(`${baseUrl}/user/all`, {
        method: "GET",
        headers: { authorization: getToken },
      });
      const data = await response.json();
      return data;
    },
  });

  useEffect(() => {
    if (isSuccess) {
      setError("");
      setLoading(false);
      console.log("success");
      console.log(data);

      if (data?.message) {
        const msg = data?.message + ". Please login again";
        setError(msg);
      } else {
        if (
          userInfoFromCookie()?.role?.toLowerCase() !==
          "Super Admin"?.toLowerCase()
        ) {
          setRecords([...data.filter((u) => u.role !== "Super Admin")]);
        } else {
          setRecords([...data]);
        }
      }
    } else {
      setLoading(false);
      setError("Failed to fetch data");
    }
  }, [isSuccess, data]);

  // console.log(records);

  const filter = (event) => {
    console.log(data);
    setRecords(
      data.filter((f) =>
        f?.name?.toLowerCase()?.includes(event.target.value.toLowerCase())
      )
    );
    console.log(records);
  };

  // delete user
  const deleteUser = (id) => {
    console.log(id);

    Swal.fire({
      title: "Are you sure?",
      showCancelButton: true,
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result?.isConfirmed) {
        fetch(`${baseUrl}/user/delete/${id}`, {
          method: "DELETE",
        })
          .then((res) => res.json())
          .then((response) => {
            console.log(response);
            if (response.acknowledged) {
              toast.success("Deleted successfully");
              refetch();
            } else {
              toast.error("Failed to delete");
            }
          })
          .catch(() => {
            toast.error("Server Error");
          });
      }
    });
  };

  // update user information
  const { register, reset, handleSubmit } = useForm({
    defaultValues: useMemo(() => {
      console.log("User has changed");
      console.log(userInfo);
      return { ...userInfo };
    }, [userInfo]),
    mode: "onChange",
  });

  useEffect(() => {
    reset(userInfo);
  }, [userInfo]);

  useEffect(() => {
    setShowModal(true);
  }, [showModal]);

  // update user profile information
  const onSubmit = (data) => {
    setLoadingForUpdate(true);
    setValidityError("");
    console.log(data, "update user info");

    const updateDataIntoDB = (id, data) => {
      console.log(data, id, "data in update function");

      fetch(`${baseUrl}/user/update/${id}`, {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ data }),
      })
        .then((res) => res.json())
        .then((result) => {
          if (result.acknowledged) {
            toast.success("Updated successfully");
            refetch();
          } else {
            toast.error("Failed to update");
          }
          setShowModal(false);
          setLoadingForUpdate(false);
        })
        .catch(() => {
          setLoadingForUpdate(false);
          toast.error("Server error");
        });
    };

    const { _id, role, validity } = data;

    if (role?.toLowerCase() === "ltp") {
      if (validity?.length) {
        const validitySplit = validity.split("-");

        // HANDLING ERRORS OF USERS TYPING
        validitySplit.forEach((each, index) => {
          if (each.length < 2) {
            validitySplit[index] = validitySplit[index].padStart(2, "0");
          }

          if (validitySplit.length - 1 === index) {
            validitySplit[index] = validitySplit[index].padStart(4, "0");
          }
        });

        const validityInDateFormat = validitySplit.reverse().join("-");
        const isValidate = checkLicenseExpirationOfLtp(validityInDateFormat);
        console.log(isValidate, "IS VALIDATE");

        if (isValidate.length === 10) {
          const newUpdatedData = { ...data, validity: isValidate };

          delete newUpdatedData._id;

          console.log(newUpdatedData, "New updated data");

          updateDataIntoDB(_id, newUpdatedData);
        } else {
          setValidityError(isValidate);
          setLoadingForUpdate(false);
        }
      } else {
        toast.error("Please fill up empty fields");
        setLoadingForUpdate(false);
      }
    } else {
      delete data["_id"];
      updateDataIntoDB(_id, data);
    }
  };

  const updateUser = (user) => {
    setError("");
    console.log(user);
    setUserInfo(user);
    setShowModal(true);
    document.getElementById("update_user").showModal();
  };

  const handleInputPhone = (e) => {
    // Remove non-numeric characters
    const inputValue = e.target.value.replace(/[^0-9]/g, "");
    // Limit the input to 10 characters
    const truncatedValue = inputValue.slice(0, 10);
    // Update the input field with the sanitized value
    e.target.value = truncatedValue;

    if (truncatedValue.length < 10) {
      e.target.setCustomValidity("Fill up 10 numbers.");
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
      e.target.setCustomValidity("Fill up 12 numbers.");
    } else {
      e.target.setCustomValidity("");
    }
  };

  if (loading) {
    return <Loading />;
  }

  console.log(userInfo, "user info 2");

  const inputLabel = "block mb-1 font-semibold text-gray-600";
  const inputBox =
    "w-full px-3 py-2 border rounded-lg max-w-xs text-gray-600 bg-gray-50 border-gray-400 focus:border-gray-600 focus:outline-none focus:ring-2 ring-violet-200";

  return (
    <>
      {error?.length !== 0 ? (
        <div className="flex flex-col justify-center items-center min-h-[calc(100vh - 10%)]">
          <Lottie
            animationData={ErrorAnimation}
            loop={true}
            className="w-[40%] h-[40%]"
          />
          <p className="text-red-500 font-bold text-lg uppercase">{error}</p>
        </div>
      ) : (
        <>
          <div className="text-black">
            {/* input box for search users  */}
            <div className="mt-10 w-3/4 mx-auto">
              <motion.div
                className={`${HomeCss.searchInputContainer} mx-2`}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1.0 }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
              >
                <input
                  placeholder="Search by name"
                  className={`${HomeCss.searchInput} text-gray-900 focus:border-violet-500 focus:outline-none focus:ring-2 ring-violet-100`}
                  name="text"
                  type="text"
                  onChange={filter}
                  required
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className={`${HomeCss.searchIcon}`}
                >
                  <g strokeWidth="0" id="SVGRepo_bgCarrier"></g>
                  <g
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    id="SVGRepo_tracerCarrier"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    {" "}
                    <rect fill="white"></rect>{" "}
                    <path
                      d="M7.25007 2.38782C8.54878 2.0992 10.1243 2 12 2C13.8757 2 15.4512 2.0992 16.7499 2.38782C18.06 2.67897 19.1488 3.176 19.9864 4.01358C20.824 4.85116 21.321 5.94002 21.6122 7.25007C21.9008 8.54878 22 10.1243 22 12C22 13.8757 21.9008 15.4512 21.6122 16.7499C21.321 18.06 20.824 19.1488 19.9864 19.9864C19.1488 20.824 18.06 21.321 16.7499 21.6122C15.4512 21.9008 13.8757 22 12 22C10.1243 22 8.54878 21.9008 7.25007 21.6122C5.94002 21.321 4.85116 20.824 4.01358 19.9864C3.176 19.1488 2.67897 18.06 2.38782 16.7499C2.0992 15.4512 2 13.8757 2 12C2 10.1243 2.0992 8.54878 2.38782 7.25007C2.67897 5.94002 3.176 4.85116 4.01358 4.01358C4.85116 3.176 5.94002 2.67897 7.25007 2.38782ZM9 11.5C9 10.1193 10.1193 9 11.5 9C12.8807 9 14 10.1193 14 11.5C14 12.8807 12.8807 14 11.5 14C10.1193 14 9 12.8807 9 11.5ZM11.5 7C9.01472 7 7 9.01472 7 11.5C7 13.9853 9.01472 16 11.5 16C12.3805 16 13.202 15.7471 13.8957 15.31L15.2929 16.7071C15.6834 17.0976 16.3166 17.0976 16.7071 16.7071C17.0976 16.3166 17.0976 15.6834 16.7071 15.2929L15.31 13.8957C15.7471 13.202 16 12.3805 16 11.5C16 9.01472 13.9853 7 11.5 7Z"
                      clipRule="evenodd"
                      fillRule="evenodd"
                    ></path>{" "}
                  </g>
                </svg>
              </motion.div>

              {/* <div>
                <label
                  htmlFor="search"
                  className="block mb-2 text-base font-roboto font-bold text-gray-900 "
                >
                  Search User
                </label>
                <input
                  type="text"
                  id="search"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="John"
                  onChange={filter}
                  required
                />
              </div> */}
            </div>

            {/* display users  */}

            <div className="w-3/4 mx-auto px-4 font-roboto">
              <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4">
                <div className="inline-block min-w-full shadow-md rounded-lg overflow-hidden">
                  <table className="min-w-full leading-normal text-center">
                    {/* head */}
                    <thead className="bg-normalViolet">
                      <tr>
                        <th className="p-3 border-b-2 border-gray-200  text-white  text-xs font-semibold uppercase tracking-wider">
                          Name
                        </th>
                        <th className="p-3 border-b-2 border-gray-200  text-white  text-xs font-semibold uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-center">
                      {records?.map((user) => (
                        <IndividualUser
                          key={user?._id}
                          user={user}
                          deleteUser={deleteUser}
                          updateUser={updateUser}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {records?.length === 0 && <NoApplicationFound />}

            {/* dialog box for update User  */}
            {/* Open the modal using document.getElementById('ID').showModal() method */}

            {showModal && (
              <dialog
                id="update_user"
                className="modal modal-top h-full font-roboto transition-all duration-500"
              >
                <div className="modal-box bg-[#E8EAEC]">
                  <h3 className="font-bold text-center my-10 text-2xl dark:text-white">
                    Update Profile
                  </h3>
                  {/* close the modal  */}
                  <form method="dialog">
                    <button
                      className="btn btn-sm btn-circle nm_Container bg-normalViolet hover:bg-normalViolet btn-ghost fixed right-2 top-2 text-white"
                      htmlFor="update_user"
                    >
                      ✕
                    </button>
                  </form>

                  {/* user information  */}
                  <div className="modal-action justify-center">
                    <form onSubmit={handleSubmit(onSubmit)}>
                      {/* if there is a button in form, it will close the modal */}

                      {/* form input boxes  */}
                      <div className="grid gap-6 mb-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        <div>
                          <label htmlFor="name" className={inputLabel}>
                            Name
                          </label>
                          <input
                            type="text"
                            id="name"
                            className={inputBox}
                            placeholder="John"
                            {...register("name")}
                            required
                          />
                        </div>

                        <div>
                          <label htmlFor="user_id" className={inputLabel}>
                            User ID
                          </label>
                          <input
                            type="text"
                            id="user_id"
                            className={inputBox}
                            placeholder="Doe"
                            {...register("userId")}
                            required
                          />
                        </div>

                        <div>
                          <label htmlFor="password" className={inputLabel}>
                            Password
                          </label>
                          <input
                            type="text"
                            id="password"
                            className={inputBox}
                            placeholder="*****"
                            {...register("password")}
                            required
                          />
                        </div>

                        <div>
                          <label htmlFor="role" className={inputLabel}>
                            Role
                          </label>
                          <input
                            type="tel"
                            id="role"
                            className={inputBox}
                            placeholder="role"
                            {...register("role")}
                            required
                          />
                        </div>
                      </div>

                      <div className="mb-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="flex flex-col items-center mt-3">
                          <label htmlFor="" className={`${inputLabel}`}>
                            Gender
                          </label>
                          <div className="radio-button-container">
                            <div className="radio-button">
                              <input
                                type="radio"
                                className="radio-button__input"
                                id="male"
                                name="gender"
                                value="male"
                                // defaultChecked={userInfo?.gender === "male"}
                                required
                                {...register("gender")}
                              />
                              <label
                                className="radio-button__label"
                                htmlFor="male"
                              >
                                <span className="radio-button__custom"></span>
                                male
                              </label>
                            </div>
                            <div className="radio-button">
                              <input
                                type="radio"
                                className="radio-button__input"
                                id="female"
                                name="gender"
                                value="female"
                                // defaultChecked={userInfo?.gender === "female"}
                                required
                                {...register("gender")}
                              />
                              <label
                                className="radio-button__label"
                                htmlFor="female"
                              >
                                <span className="radio-button__custom"></span>
                                female
                              </label>
                            </div>
                          </div>
                        </div>

                        <div>
                          <label htmlFor="email" className={inputLabel}>
                            Email
                          </label>
                          <input
                            type="text"
                            {...register("email", { required: true })}
                            id="email"
                            className={inputBox}
                            placeholder="test@gmail.com"
                            required
                          />
                        </div>

                        <div>
                          <label htmlFor="phone" className={inputLabel}>
                            Phone no.
                          </label>
                          <input
                            type="text"
                            {...register("phone", { required: true })}
                            id="phone"
                            className={inputBox}
                            placeholder="Enter phone no"
                            onInput={handleInputPhone}
                            maxLength={10}
                            required
                          />
                        </div>

                        <div>
                          <label htmlFor="address" className={inputLabel}>
                            Address
                          </label>
                          <textarea
                            id="address"
                            rows="2"
                            {...register("address", { required: true })}
                            className={inputBox}
                            placeholder="Enter address..."
                          ></textarea>
                        </div>
                      </div>

                      {userInfo?.role?.toLowerCase() === "ps" && (
                        <div className="mb-8">
                          <div className="flex flex-col items-center mt-3">
                            <label htmlFor="" className={`${inputLabel}`}>
                              HandOver
                            </label>
                            <div className="radio-button-container">
                              <div className="radio-button">
                                <input
                                  type="radio"
                                  className="radio-button__input"
                                  id="yesHandOver"
                                  name="handOver"
                                  value={"true"}
                                  // defaultChecked={userInfo?.handOver}
                                  required
                                  {...register("handOver")}
                                />
                                <label
                                  className="radio-button__label"
                                  htmlFor="yesHandOver"
                                >
                                  <span className="radio-button__custom"></span>
                                  Yes
                                </label>
                              </div>
                              <div className="radio-button">
                                <input
                                  type="radio"
                                  className="radio-button__input"
                                  id="noHandOver"
                                  name="handOver"
                                  value={"false"}
                                  // defaultChecked={!userInfo?.handOver}
                                  required
                                  {...register("handOver")}
                                />
                                <label
                                  className="radio-button__label"
                                  htmlFor="noHandOver"
                                >
                                  <span className="radio-button__custom"></span>
                                  No
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {userInfo?.role === "LTP" && (
                        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          <div>
                            <label htmlFor="licenseNo" className={inputLabel}>
                              License No
                            </label>
                            <input
                              type="text"
                              {...register("licenseNo", { required: true })}
                              id="licenseNo"
                              className={inputBox}
                              placeholder="Enter license no"
                              required
                            />
                          </div>

                          <div>
                            <label htmlFor="adharNo" className={inputLabel}>
                              Aadhar no
                            </label>
                            <input
                              type="text"
                              {...register("adharNo", { required: true })}
                              id="adharNo"
                              className={inputBox}
                              placeholder="Enter Aadhar No"
                              maxLength={12}
                              onInput={handleInputAadhar}
                              required
                            />
                          </div>

                          <div>
                            <label htmlFor="validity" className={inputLabel}>
                              Validity
                            </label>
                            <input
                              type="text"
                              {...register("validity", { required: true })}
                              id="validity"
                              placeholder="DD-MM-YYYY"
                              className={inputBox}
                            />
                          </div>
                        </div>
                      )}

                      {error?.length !== 0 && (
                        <p className="text-red-500 text-center my-6">{error}</p>
                      )}
                      {validityError?.length !== 0 && (
                        <p className="text-red-500 text-center my-6 font-bold">
                          {validityError}
                        </p>
                      )}

                      <div className="flex justify-center">
                        {loadingForUpdate ? (
                          <span className="loading loading-dots loading-lg text-normalViolet"></span>
                        ) : (
                          <button
                            type="submit"
                            className="text-white transition-all duration-700 save-btn px-5 py-3 rounded-full bg-normalViolet"
                          >
                            Submit
                          </button>
                        )}
                      </div>
                    </form>
                  </div>
                </div>
              </dialog>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default AllUsers;
