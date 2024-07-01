import React from "react";
import { Navigate, useLocation } from "react-router";
import { getCookie } from "../../utils/utils";

const PrivateRoute = ({ children }) => {
  const user = JSON.parse(getCookie("loggedUser"));

  const location = useLocation();

  if (user) {
    return children;
  }

  if (!user) {
    localStorage.clear();
    return <Navigate to="/" state={{ from: location }} />;
  }
};

export default PrivateRoute;
