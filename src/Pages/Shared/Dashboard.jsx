import React from "react";
import { getCookie } from "../../utils/utils";
import AdminDashboard from "../Dashboard/Admin/AdminDashboard/AdminDashboard";
import LtpDashboard from "../Dashboard/LtpDashboard/Home/LtpDashboard";
import PsDashboard from "../Dashboard/PsDashboard/Home/PsDashboard";
import UdaDashboard from "../Dashboard/UDA/UdaDashboard";

const Dashboard = () => {
  const user = JSON.parse(getCookie("loggedUser"));

  return (
    <>
      {(user?.role === "LTP" && <LtpDashboard />) ||
        (user?.role === "PS" && <PsDashboard />) ||
        (user?.role === "UDA" && <UdaDashboard />) ||
        ((user?.role === "Admin1" ||
          user?.role == "Admin2" ||
          user?.role == "Super Admin") && <AdminDashboard />)}
    </>
  );
};

export default Dashboard;
