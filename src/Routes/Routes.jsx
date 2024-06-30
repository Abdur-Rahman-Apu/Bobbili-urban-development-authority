import { createBrowserRouter } from "react-router-dom";
import DashboardLayout from "../Layouts/DashboardLayout";
import MainLayout from "../Layouts/MainLayout";
import CustomerSupport from "../Pages/Dashboard/Admin/Admin1/CustomerSupport/CustomerSupport";
import AddUser from "../Pages/Dashboard/Admin/Admin2/AddUser";
import AllUsers from "../Pages/Dashboard/Admin/Admin2/AllUsers";
import UpdateLocation from "../Pages/Dashboard/Admin/SuperAdmin/UpdateLocation";
import Approved from "../Pages/Dashboard/LtpDashboard/Approved/Approved";
import ApplicantInfo from "../Pages/Dashboard/LtpDashboard/DraftApplication/ApplicantInfo/ApplicantInfo";
import AppChecklist from "../Pages/Dashboard/LtpDashboard/DraftApplication/ApplicationCheckList/AppChecklist";
import BuildingInfo from "../Pages/Dashboard/LtpDashboard/DraftApplication/BuildingInfo/BuildingInfo";
import Documents from "../Pages/Dashboard/LtpDashboard/DraftApplication/Documents/Documents";
import DraftApplication from "../Pages/Dashboard/LtpDashboard/DraftApplication/DraftApplication";
import Drawing from "../Pages/Dashboard/LtpDashboard/DraftApplication/Drawing/Drawing";
import NewApplication from "../Pages/Dashboard/LtpDashboard/DraftApplication/NewApplication/NewApplication";
import Payment from "../Pages/Dashboard/LtpDashboard/DraftApplication/Payment/Payment";
import PaymentStatus from "../Pages/Dashboard/LtpDashboard/DraftApplication/Payment/PaymentStatus";
import RejectedApplications from "../Pages/Dashboard/LtpDashboard/RejectedApplication/RejectedApplications";
import ResubmitApplication from "../Pages/Dashboard/LtpDashboard/Resubmit/ResubmitApplication";
import Shortfall from "../Pages/Dashboard/LtpDashboard/Shortfall/Shortfall";
import SubmitApplication from "../Pages/Dashboard/LtpDashboard/Submitted/SubmitApplication";
import Inward from "../Pages/Dashboard/PsDashboard/InwardApplications/Inward";
import Outward from "../Pages/Dashboard/PsDashboard/OutwardApplications/Outward";
import ReValidation from "../Pages/Dashboard/PsDashboard/ReValidation/ReValidation";
import SearchApplications from "../Pages/Dashboard/PsDashboard/SearchApplications/SearchApplications";
import PlotDetails from "../Pages/Dashboard/UDA/PlotDetails/PlotDetails";
import RevenueReport from "../Pages/Dashboard/UDA/RevenueReport/RevenueReport";
import VerificationStatus from "../Pages/Dashboard/UDA/VerificationStatus/VerificationStatus";
import ApplicationSearch from "../Pages/Main/ApplicationSearch/ApplicationSearch";
import DefaultDrawingFormat from "../Pages/Main/DefaultDrawingFormat/DefaultDrawingFormat";
import DemoVideos from "../Pages/Main/DemoVideos/DemoVideos";
import Home from "../Pages/Main/Home/Home";
import ListOfLTP from "../Pages/Main/ListOfLTP/ListOfLTP";
import OnlinePayment from "../Pages/Main/OnlinePayment/OnlinePayment";
import PrivacyPolicy from "../Pages/Main/PrivacyPolicy/PrivacyPolicy";
import Reports from "../Pages/Main/Reports/Reports";
import Dashboard from "../Pages/Shared/Dashboard";
import Error from "../Pages/Shared/Error";
import UpdateProfile from "../Pages/Shared/UpdateProfile";
import PrivateRoute from "../Routes/PrivateRoutes/PrivateRoute";
import SiteInspection from "./../Pages/Dashboard/PsDashboard/InwardApplications/SiteInspection";
import AdminRoute from "./PrivateRoutes/AdminRoute";
import BothUserRoute from "./PrivateRoutes/BothUserRoute";
import LtpRoute from "./PrivateRoutes/LtpRoute";
import PsRoute from "./PrivateRoutes/PsRoute";
import UdaRoute from "./PrivateRoutes/UdaRoute";

const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <Error />,
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
        children: [
          {
            path: "/",
            element: <ApplicationSearch />,
          },
          {
            path: "/onlinePayment",
            element: <OnlinePayment />,
          },
          {
            path: "/onlinePayment/paymentStatus/:orderId",
            element: <PaymentStatus />,
            loader: async ({ request, params }) => {
              // return fetch(
              //   `https://residential-building.onrender.com/paymentStatus?orderId=${params.orderId}`
              // );
              return fetch(
                `http://localhost:5000/paymentStatus?orderId=${params.orderId}`
              );
            },
          },
          {
            path: "/listOfLTP",
            element: <ListOfLTP />,
          },
          {
            path: "/demoVideos",
            element: <DemoVideos />,
          },
          {
            path: "/privacyPolicy",
            element: <PrivacyPolicy />,
          },
          {
            path: "/defaultDrawingFormat",
            element: <DefaultDrawingFormat />,
          },
        ],
      },
      {
        path: "/statistics",
        element: <Reports />,
      },
    ],
  },
  {
    path: "/dashboard",
    errorElement: <Error />,
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
          <AdminRoute>
            <AddUser />
          </AdminRoute>
        ),
      },
      {
        path: "/dashboard/allUser",
        element: (
          <AdminRoute>
            <AllUsers />
          </AdminRoute>
        ),
      },
      {
        path: "/dashboard/updateLocation",
        element: (
          <AdminRoute>
            <UpdateLocation />
          </AdminRoute>
        ),
      },
      {
        path: "/dashboard/support",
        element: (
          <AdminRoute>
            <CustomerSupport />
          </AdminRoute>
        ),
      },
      {
        path: "/dashboard/draftApplication",
        element: (
          <BothUserRoute>
            {" "}
            <DraftApplication />{" "}
          </BothUserRoute>
        ),
        children: [
          {
            path: "/dashboard/draftApplication",
            element: (
              <LtpRoute>
                {" "}
                <NewApplication />{" "}
              </LtpRoute>
            ),
          },
          {
            path: "/dashboard/draftApplication/buildingInfo",
            element: (
              <BothUserRoute>
                {" "}
                <BuildingInfo />{" "}
              </BothUserRoute>
            ),
          },
          {
            path: "/dashboard/draftApplication/applicantInfo",
            element: (
              <BothUserRoute>
                {" "}
                <ApplicantInfo />{" "}
              </BothUserRoute>
            ),
          },
          {
            path: "/dashboard/draftApplication/applicationChecklist",
            element: (
              <BothUserRoute>
                {" "}
                <AppChecklist />{" "}
              </BothUserRoute>
            ),
          },
          {
            path: "/dashboard/draftApplication/documents",
            element: (
              <BothUserRoute>
                {" "}
                <Documents />{" "}
              </BothUserRoute>
            ),
          },
          {
            path: "/dashboard/draftApplication/drawing",
            element: (
              <BothUserRoute>
                <Drawing />{" "}
              </BothUserRoute>
            ),
          },
          {
            path: "/dashboard/draftApplication/payment",
            element: (
              <BothUserRoute>
                <Payment />
              </BothUserRoute>
            ),
          },
          {
            path: "/dashboard/draftApplication/paymentStatus/:orderId",
            element: (
              <LtpRoute>
                {" "}
                <PaymentStatus />{" "}
              </LtpRoute>
            ),
            loader: async ({ request, params }) => {
              // return fetch(
              //   `https://residential-building.onrender.com/paymentStatus?orderId=${params.orderId}`
              // );
              return fetch(
                `https://residential-building.onrender.com/paymentStatus?orderId=${params.orderId}`
              );
            },
          },
          {
            path: "/dashboard/draftApplication/siteInspection",
            element: (
              <PsRoute>
                <SiteInspection />
              </PsRoute>
            ),
          },
        ],
      },
      {
        path: "/dashboard/submitApplication",
        element: (
          <LtpRoute>
            <SubmitApplication />
          </LtpRoute>
        ),
      },
      {
        path: "/dashboard/approvedApplication",
        element: (
          <LtpRoute>
            <Approved />
          </LtpRoute>
        ),
      },
      {
        path: "/dashboard/shortfallApplication",
        element: (
          <LtpRoute>
            <Shortfall />
          </LtpRoute>
        ),
      },
      {
        path: "/dashboard/rejectedApplications",
        element: (
          <LtpRoute>
            <RejectedApplications />
          </LtpRoute>
        ),
      },
      {
        path: "/dashboard/resubmitApplication",
        element: (
          <LtpRoute>
            <ResubmitApplication />
          </LtpRoute>
        ),
      },
      {
        path: "/dashboard/inWard",
        element: (
          <PsRoute>
            <Inward />
          </PsRoute>
        ),
      },
      {
        path: "/dashboard/outWard",
        element: (
          <PsRoute>
            <Outward />
          </PsRoute>
        ),
      },
      {
        path: "/dashboard/searchApplication",
        element: (
          <PsRoute>
            <SearchApplications />
          </PsRoute>
        ),
      },
      {
        path: "/dashboard/reValidation",
        element: (
          <PrivateRoute>
            <ReValidation />
          </PrivateRoute>
        ),
      },
      // {
      //   path: "/dashboard/location",
      //   element: <Location />,
      // },
      {
        path: "/dashboard/plotDetails",
        element: (
          <UdaRoute>
            <PlotDetails />
          </UdaRoute>
        ),
      },
      {
        path: "/dashboard/revenueReport",
        element: (
          <UdaRoute>
            <RevenueReport />
          </UdaRoute>
        ),
      },
      {
        path: "/dashboard/verificationStatus",
        element: (
          <UdaRoute>
            <VerificationStatus />
          </UdaRoute>
        ),
      },
      {
        path: "/dashboard/profile",
        element: (
          <PrivateRoute>
            <UpdateProfile />
          </PrivateRoute>
        ),
      },
    ],
  },
]);

export default router;
