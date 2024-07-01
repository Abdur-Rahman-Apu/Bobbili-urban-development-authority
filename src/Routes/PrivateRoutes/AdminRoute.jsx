import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getCookie } from "../../utils/utils";

const AdminRoute = ({ children }) => {
  const role = JSON.parse(getCookie("loggedUser"))?.role?.toLowerCase();

  const condition =
    role === "admin1" || role === "admin2" || role === "super admin";

  const location = useLocation();

  if (condition) {
    return children;
  } else {
    localStorage.clear();
    return <Navigate to="/" state={{ from: location }} />;
  }
};

export default AdminRoute;
