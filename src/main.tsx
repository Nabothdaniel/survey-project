import React from "react"
import ReactDOM from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import AdminDashboard from "./pages/AdminDashboard"
import UserDashboard from "./pages/UserDashboard"
import "./index.css"
import LoginForm from "./pages/Login"
import SignupForm from "./pages/Signup"
import Dashboard from "./components/UserDashboard/subpages/dashboard";
import SurveyPage from "./components/UserDashboard/subpages/surveys";
import TakeSurvey from "./components/UserDashboard/subpages/create-survey";
import IndexPage from "./components/Dashboard/subpages/index";
import FormsAndOutcomes from "./components/Dashboard/subpages/forms-and-outcomes"

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginForm/>
  },
  {
    path: "/signup",
    element: <SignupForm />
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
      { path: "forms-and-outcomes", element: <FormsAndOutcomes /> },
    ]
  },
])

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
