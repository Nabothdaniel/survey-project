import React, { useState } from "react";
import {
  FiBarChart2,
  FiFileText,
  FiSettings,
  FiHelpCircle,
  FiPlus,
  FiChevronDown,
  FiMenu,
  FiX,
  FiUser,
  FiLogOut,
} from "react-icons/fi";

const Header: React.FC = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 relative">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <span className="text-xl font-bold text-gray-900">SURVEY</span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-6 text-sm font-medium">
          {[
            { key: "dashboard", label: "Dashboard", icon: <FiBarChart2 /> },
            { key: "forms", label: "Forms & Outcomes", icon: <FiFileText /> },
            { key: "reports", label: "Reports", icon: <FiBarChart2 /> },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1 ${
                activeTab === tab.key
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {/* Desktop buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-medium rounded-lg flex items-center gap-1">
              <FiPlus /> New Form
            </button>
            <button className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1">
              <FiHelpCircle /> Help
            </button>
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">A</span>
              </div>
              <span className="hidden sm:block text-sm font-medium text-gray-700">
                Admin User
              </span>
              <FiChevronDown
                className={`text-gray-400 text-xs transition-transform ${
                  profileOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown */}
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 animate-slide-down">
                <button className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                  <FiUser /> Profile
                </button>
                <button className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                  <FiSettings /> Settings
                </button>
                <button className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                  <FiLogOut /> Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-gray-600 hover:text-gray-900"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-4 flex flex-col gap-4 border-t border-gray-200 pt-4">
          {[
            { key: "dashboard", label: "Dashboard", icon: <FiBarChart2 /> },
            { key: "forms", label: "Forms & Outcomes", icon: <FiFileText /> },
            { key: "reports", label: "Reports", icon: <FiBarChart2 /> },
            { key: "settings", label: "Settings", icon: <FiSettings /> },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key);
                setMobileMenuOpen(false);
              }}
              className={`flex items-center gap-2 px-2 ${
                activeTab === tab.key
                  ? "text-blue-600 font-medium"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
          <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
            <FiPlus /> New Form
          </button>
          <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
            <FiHelpCircle /> Help
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
