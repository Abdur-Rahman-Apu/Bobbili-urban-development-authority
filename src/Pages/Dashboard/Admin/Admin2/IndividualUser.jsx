import React, { useContext } from "react";
import { GrUpdate } from "react-icons/gr";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { AuthContext } from "../../../../AuthProvider/AuthProvider";
import undefinedImg from "../../../../assets/images/man.png";

const IndividualUser = ({ user, deleteUser, updateUser }) => {
  const { userInfoFromLocalStorage } = useContext(AuthContext);

  const imgSrc =
    user?.gender?.toLowerCase() === "male"
      ? "https://avatar.iran.liara.run/public/boy"
      : "https://avatar.iran.liara.run/public/girl";

  const userType = userInfoFromLocalStorage().role;
  // console.log(user, "user");

  return (
    <>
      <tr className="text-black">
        <td className="p-3 border-b border-gray-200 text-sm">
          {/* <div className="flex items-center space-x-3">
            <div className="avatar">
              <div className="mask mask-squircle w-8 h-8 md:w-12 md:h-12">
                <img src={userIcon} alt="Avatar Tailwind CSS Component" />
              </div>
            </div>
            <div>
              <div className="font-bold text-sm md:text-base">{user?.name}</div>
              <div className="opacity-50 text-start text-xs md:text-sm">
                ({user?.role})
              </div>
            </div>
          </div> */}

          <div className="flex">
            <div className="flex-shrink-0 w-10 h-10 nm_Container rounded-full">
              <img
                className="w-full h-full rounded-full"
                src={imgSrc ?? undefinedImg}
                alt="An avatar image"
              />
            </div>
            <div className="ml-3">
              <p className="text-gray-900 break-words text-base font-bold text-left capitalize">
                {user?.name}
              </p>
              <p className="text-gray-600 break-words text-left">
                {user?.role}
              </p>
            </div>
          </div>
        </td>
        <td className="p-3  border-b border-gray-200 text-sm">
          {/* update user information button  */}
          <button
            className="btn btn-sm me-3 border-none bg-yellow-300 hover:bg-yellow-400 hover:shadow-md hover:shadow-yellow-500 "
            onClick={() => updateUser(user)}
          >
            <GrUpdate size={19} />
          </button>
          {userType === "Super Admin" && (
            <button
              className="btn btn-sm text-white border-none bg-red-500 hover:bg-red-600 hover:shadow-md hover:shadow-red-500"
              onClick={() => deleteUser(user?._id)}
            >
              <RiDeleteBin5Fill size={19} />
            </button>
          )}
        </td>
      </tr>
    </>
  );
};

export default IndividualUser;
