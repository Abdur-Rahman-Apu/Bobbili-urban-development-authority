import React, { useContext, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import sidebarStyle from "../Style/dashboardSidebar.module.css";
import Navbar from "../Pages/Shared/Navbar";
import LtpSidebar from "./LtpSidebar/LtpSidebar";
import PsSidebar from "./PsSidebar/PsSidebar";
import { MdOutlineLogout, MdOutlineMenuOpen } from "react-icons/md";
import AdminSideBar from "./AdminSidebar/AdminSideBar";
import UdaSidebar from "./UdaSidebar/UdaSidebar";
import UserImg from "../assets/images/man.png";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaRegEdit, FaUserEdit } from "react-icons/fa";
import { LuSettings } from "react-icons/lu";
import { AuthContext } from "../AuthProvider/AuthProvider";
import SvgTextAnimation from "../Pages/Components/SvgTextAnimation";
import { FaUserMinus } from "react-icons/fa6";
import Swal from "sweetalert2";

const DashboardLayout = () => {
  const { handleLogOut } = useContext(AuthContext);
  const currentUser = JSON.parse(localStorage.getItem("loggedUser"));
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const handOverByPs = (id) => {
    console.log(id, "id");

    Swal.fire({
      title: "Do you want to handOver?",
      showCancelButton: true,
      confirmButtonText: "Yes",
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        try {
          const url = `http://localhost:5000/handOveredByPs?id=${JSON.stringify(
            id
          )}`;
          const response = await fetch(url, { method: "PATCH" });

          if (!response?.ok) {
            return Swal.showValidationMessage(`
          ${JSON.stringify(await response.json())}
        `);
          }
          return response.json();
        } catch (error) {
          Swal.showValidationMessage(`
        Request failed: ${error}
      `);
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result?.isConfirmed) {
        Swal.fire({
          title: "You handOvered your credentials",
          icon: "success",
          confirmButtonText: "Leave Now",
          allowOutsideClick: false,
        }).then((result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
            handleLogOut(navigate);
          }
        });
      }
    });
    // Swal.fire({
    //   title: "Do you want to handOver?",
    //   showCancelButton: true,
    //   confirmButtonText: "Yes",
    // }).then((result) => {
    //   /* Read more about isConfirmed, isDenied below */
    //   if (result.isConfirmed) {
    //     fetch(`http://localhost:5000/handOveredByPs?id=${JSON.stringify(id)}`, {
    //       method: "PATCH",
    //     })
    //       .then((res) => res.json())
    //       .then((result) => {
    //         console.log(result, "result");
    //         Swal.fire("Saved!", "", "success");
    //       });
    //   }
    // });
  };

  return (
    <div className="bg-bgColor">
      {/* <Navbar /> */}
      <div className="drawer dark:bg-grad lg:drawer-open min-h-screen relative transition-all duration-700 grid-cols-1 lg:grid-cols-5">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle " />
        <div className="drawer-content w-full overflow-hidden lg:drawer-open col-span-4">
          {/* <!-- Page content here --> */}

          <label
            htmlFor="my-drawer-2"
            className="btn btn-sm md:btn-md m-2 lg:hidden bg-violetLight shadow-md shadow-violetLight text-white border-0 drawer-button transition-all duration-700 hover:bg-black hover:shadow-black "
          >
            <MdOutlineMenuOpen size={24} />
          </label>

          {/* page content will be here  */}
          <Outlet />
          {/* page content will be here  */}
        </div>

        {/* sidebar start here  */}
        <div className="drawer-side w-full h-full z-10 overflow-hidden">
          <label htmlFor="my-drawer-2" className="drawer-overlay"></label>

          <ul
            className={`nm_Container lg:my-3 w-full lg:w-[19.5%] h-full lg:h-[95%] bg-bgColor font-roboto font-bold text-xl md:text-base text-black pt-10 md:pt-0 lg:fixed lg:rounded-3xl text-center`}
          >
            {/* <!-- Sidebar content here --> */}

            <li className="absolute right-7 top-7 lg:hidden">
              <label
                htmlFor="my-drawer-2"
                className="btn btn-sm btn-circle bg-black text-white hover:bg-violetDark hover:border-0"
              >
                ✕
              </label>
            </li>

            <li>
              <div className="flex-1 mt-10 lg:mt-3">
                <Link to="/dashboard" className="font-bold normal-case text-xl">
                  {/* <img className="h-full" src={Logo} alt="The logo of the website" /> */}
                  {/* <p className="hidden text-gray-600 lg:block text-3xl font-titleFont">
                    BUDA
                  </p> */}
                  {/* <SvgTextAnimation /> */}
                  <button className="logo-btn" data-text="Awesome">
                    <span className="actual-text">&nbsp;BUDA&nbsp;</span>
                    <span aria-hidden="true" className="hover-text">
                      &nbsp;BUDA&nbsp;
                    </span>
                  </button>
                </Link>
              </div>

              {/* <div className="relative">
                <div className="w-14 mx-auto mt-3 rounded-full nm_Container ">
                  <img src={UserImg} alt="An image of user icon" />
                </div>
              </div> */}

              {/* <LuSettings size={20} className="text-black cursor-pointer" /> */}
              <div className="dropdown dropdown-hover">
                <label tabIndex={0} className="block w-20 btn-circle avatar ">
                  <div className="cursor-pointer mx-auto mt-3 rounded-full nm_Container">
                    <img src={UserImg} alt="An image of user icon" />
                    {/* <LuSettings size={30} className="text-black cursor-pointer" /> */}
                  </div>
                </label>
                <ul
                  tabIndex={0}
                  className="shadow-md bg-normalViolet text-white menu menu-md dropdown-content mt-8 z-[1] p-2 rounded-box w-44 dark:text-white"
                >
                  <li>
                    <Link
                      className="items-center hover:bg-gray-100 hover:text-black"
                      to="/dashboard/profile"
                    >
                      <FaRegEdit size={17} />
                      Profile
                    </Link>
                  </li>
                  {currentUser?.role?.toLowerCase() === "ps" && (
                    <li>
                      <button
                        className="items-center hover:bg-gray-100 hover:text-black"
                        onClick={() => handOverByPs(currentUser?._id)}
                      >
                        <FaUserMinus size={17} />
                        HandOver
                      </button>
                    </li>
                  )}
                  <li>
                    <Link
                      className="items-center hover:bg-gray-100 hover:text-black"
                      onClick={() => handleLogOut(navigate)}
                    >
                      <MdOutlineLogout size={22} />
                      Logout
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="relative">
                <div className="mb-2 flex flex-col font-roboto">
                  <p className="font-semibold md:text-lg text-black">
                    {currentUser?.name}
                  </p>
                  <small className="font-medium md:text-base text-gray-500">
                    ({currentUser?.role})
                  </small>
                </div>
              </div>
            </li>

            <div className="text-lg mt-6 ">
              {(currentUser?.role === "LTP" && <LtpSidebar />) ||
                (currentUser?.role === "PS" && <PsSidebar />) ||
                (currentUser?.role === "UDA" && <UdaSidebar />) ||
                ((currentUser?.role === "Admin1" ||
                  currentUser?.role === "Admin2" ||
                  currentUser?.role === "Super Admin") && <AdminSideBar />)}
            </div>
          </ul>
        </div>
        {/* sidebar end here  */}
      </div>
    </div>
  );
};

export default DashboardLayout;
