// src/components/SurveyForm.tsx

import Header from "../components/Dashboard/Header";
import Footer from '../components/ui/Footer'

import { Outlet } from "react-router-dom";

const SurveyForm: React.FC = () => {






  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="px-4 sm:px-6 pt-20 pb-10">
        <Outlet />
      </main>
      <Footer/>
    </div>
  );
};

export default SurveyForm;
