import React from "react"
import ReactDOM from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import AdminDashboard from "./pages/AdminDashboard"
import UserDashboard from "./pages/UserDashboard"
import "./index.css"
import LoginForm from "./pages/Login"
import SignupForm from "./pages/Signup"
import AdminSignup from "./pages/AdminSignup"
import Dashboard from "./components/UserDashboard/subpages/dashboard";
import SurveyPage from "./components/UserDashboard/subpages/surveys";
import TakeSurvey from "./components/UserDashboard/subpages/take-survey";
import IndexPage from "./components/Dashboard/subpages/index";
import Outcomes from "./components/Dashboard/subpages/forms-and-outcomes";
//import Reports from "./components/Dashboard/subpages/reports";
import PreviewPage from "./components/Dashboard/subpages/PreviewPage";
import ErrorPage from "./extra/ErrorPage";
import NotFoundPage from "./extra/NotFound";
import AdminWrapper from "./routes/AdminRoutes";
import ProtectedRoute from "./routes/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginForm />,
    errorElement: <ErrorPage />, 
  },
  {
    path: "/signup",
    element: <SignupForm />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/signup-admin",
    element: <AdminSignup />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <UserDashboard />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "surveys", element: <SurveyPage /> },
    ],
  },
  {
    path: "/take-survey/:id",
    element: <TakeSurvey />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <AdminWrapper>
          <AdminDashboard />
        </AdminWrapper>
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <IndexPage /> },
      { path: "forms-and-outcomes", element: <Outcomes /> },
      //{ path: "reports", element: <Reports /> },
      { path: "preview", element: <PreviewPage /> },
    ],
  },
  // Catch-all route for non-existent paths
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    <ToastContainer position="top-right" autoClose={3000} />
  </React.StrictMode>
)
