import React from "react"
import ReactDOM from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import AdminDashboard from "./pages/AdminDashboard"
import UserDashboard from "./pages/UserDashboard"
import "./index.css"
import LoginForm from "./pages/Login"
import SignupForm from "./pages/Signup"
import AdminSignup from "./pages/AdminSignup"
import Dashboard from "./components/UserDashboard/subpages/dashboard";
import SurveyPage from "./components/UserDashboard/subpages/surveys";
import TakeSurvey from "./components/UserDashboard/subpages/create-survey";
import IndexPage from "./components/Dashboard/subpages/index";
import Outcomes from "./components/Dashboard/subpages/forms-and-outcomes";
import Reports from "./components/Dashboard/subpages/reports";
import PreviewPage from "./components/Dashboard/subpages/PreviewPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginForm />
  },
  {
    path: "/signup",
    element: <SignupForm />
  },
  {
    path: '/signup-admin',
    element: <AdminSignup />
  },
  {
    path: "/dashboard",
    element: <UserDashboard />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "surveys", element: <SurveyPage /> },
    ]
  },
  {
    path: "/take-survey/:id",
    element: <TakeSurvey />
  },
  {
    path: "/admin",
    element: <AdminDashboard />,
    children: [
      { index: true, element: <IndexPage /> },
      { path: "forms-and-outcomes", element: <Outcomes /> },
      { path: "reports", element: <Reports /> },
      { path: "preview", element: <PreviewPage /> },
    ]
  },
])

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
