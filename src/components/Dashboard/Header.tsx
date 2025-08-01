import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiBarChart2,
  FiFileText,
  FiSettings,
  FiChevronDown,
  FiMenu,
  FiX,
  FiLogOut,
} from "react-icons/fi";

const Header: React.FC = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const navLinks = [
    { key: "dashboard", label: "Dashboard", icon: <FiBarChart2 />, path: "/admin" },
    { key: "forms", label: "Forms & Outcomes", icon: <FiFileText />, path: "/admin/forms-and-outcomes" },
    { key: "reports", label: "Reports", icon: <FiBarChart2 />, path: "/admin/reports" },
  ];

  return (
    <header className="fixed top-0 left-0 w-full bg-white border-b border-gray-200 px-4 sm:px-6 py-4 z-50">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <span className="text-xl font-bold text-gray-900">SURVEY</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-6 text-sm font-medium">
          {navLinks.map((tab) => (
            <Link
              key={tab.key}
              to={tab.path}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1 ${activeTab === tab.key
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-900"
                }`}
            >
              {tab.icon} {tab.label}
            </Link>
          ))}
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-3">


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
                className={`text-gray-400 text-xs transition-transform ${profileOpen ? "rotate-180" : ""
                  }`}
              />
            </button>

            {/* Dropdown */}
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 animate-slide-down">
                <Link
                  to="/logout"
                  className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                >
                  <FiLogOut /> Logout
                </Link>
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
          {[...navLinks, { key: "settings", label: "Settings", icon: <FiSettings />, path: "/settings" }].map(
            (tab) => (
              <Link
                key={tab.key}
                to={tab.path}
                onClick={() => {
                  setActiveTab(tab.key);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center gap-2 px-2 ${activeTab === tab.key
                  ? "text-blue-600 font-medium"
                  : "text-gray-600 hover:text-gray-900"
                  }`}
              >
                {tab.icon} {tab.label}
              </Link>
            )
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
