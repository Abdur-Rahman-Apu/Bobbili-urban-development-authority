import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getCookie } from "../../utils/utils";

const UdaRoute = ({ children }) => {
  const role = JSON.parse(getCookie("loggedUser"))?.role?.toLowerCase();

  const location = useLocation();

  if (role === "uda") {
    return children;
  } else {
    localStorage.clear();
    return <Navigate to="/" state={{ from: location }} />;
  }
};

export default UdaRoute;
