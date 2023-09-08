import { createBrowserRouter } from "react-router-dom";
import Login from "../Pages/Login/Login";
import DashboardLayout from "../Layouts/DashboardLayout";
import Dashboard from "../Pages/Shared/Dashboard";
import PrivateRoute from "./PrivateRoute";
import DraftApplication from "../Pages/Dashboard/LtpDashboard/DraftApplication/DraftApplication";
import NewApplication from "../Pages/Dashboard/LtpDashboard/DraftApplication/NewApplication";
import BuildingInfo from "../Pages/Dashboard/LtpDashboard/DraftApplication/BuildingInfo";
import ApplicantInfo from "../Pages/Dashboard/LtpDashboard/DraftApplication/ApplicantInfo";
import AppChecklist from "../Pages/Dashboard/LtpDashboard/DraftApplication/AppChecklist/AppChecklist";
import Documents from "../Pages/Dashboard/LtpDashboard/DraftApplication/Documents";
import Drawing from "../Pages/Dashboard/LtpDashboard/DraftApplication/Drawing";
import Payment from "../Pages/Dashboard/LtpDashboard/DraftApplication/Payment";
import SubmitApplication from "../Pages/Dashboard/LtpDashboard/Submitted/SubmitApplication";
import AddUser from "../Pages/Dashboard/Admin/Admin2/AddUser";
import UpdateUser from "../Pages/Dashboard/Admin/Admin2/UpdateUser";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      {
        path: "/dashboard",
        element: (
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        ),
      },
      {
        path: "/dashboard/addUser",
        element: (
          <PrivateRoute>
            <AddUser />
          </PrivateRoute>
        ),
      },
      {
        path: "/dashboard/updateUser",
        element: (
          <PrivateRoute>
            <UpdateUser />
          </PrivateRoute>
        ),
      },
      {
        path: "/dashboard/draftApplication",
        element: (
          <PrivateRoute>
            <DraftApplication />
          </PrivateRoute>
        ),
        children: [
          {
            path: "/dashboard/draftApplication",
            element: (
              <PrivateRoute>
                <NewApplication />
              </PrivateRoute>
            ),
          },
          {
            path: "/dashboard/draftApplication/buildingInfo",
            element: (
              <PrivateRoute>
                <BuildingInfo />
              </PrivateRoute>
            ),
          },
          {
            path: "/dashboard/draftApplication/applicantInfo",
            element: (
              <PrivateRoute>
                <ApplicantInfo />
              </PrivateRoute>
            ),
          },
          {
            path: "/dashboard/draftApplication/applicationChecklist",
            element: (
              <PrivateRoute>
                <AppChecklist />
              </PrivateRoute>
            ),
          },
          {
            path: "/dashboard/draftApplication/documents",
            element: (
              <PrivateRoute>
                <Documents />
              </PrivateRoute>
            ),
          },
          {
            path: "/dashboard/draftApplication/drawing",
            element: (
              <PrivateRoute>
                <Drawing />
              </PrivateRoute>
            ),
          },
          {
            path: "/dashboard/draftApplication/payment",
            element: (
              <PrivateRoute>
                <Payment />
              </PrivateRoute>
            ),
          },
        ],
      },
      {
        path: "/dashboard/submitApplication",
        element: (
          <PrivateRoute>
            <SubmitApplication />
          </PrivateRoute>
        ),
      },
    ],
  },
]);

export default router;
