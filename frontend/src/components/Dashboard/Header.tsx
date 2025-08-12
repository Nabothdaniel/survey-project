import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FiBarChart2,
  FiFileText,
  FiChevronDown,
  FiMenu,
  FiX,
  FiLogOut,
} from "react-icons/fi";
import { useAtom } from "jotai";
import { profileAtom } from "../../atoms/profileAtom";
import { logoutAtom } from "../../atoms/authAtom";
import { toast } from "react-toastify";

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const [profile] = useAtom(profileAtom);
  const [, logout] = useAtom(logoutAtom);
  const navigate = useNavigate();
  const location = useLocation();


  const navLinks = [
    { key: "dashboard", label: "Dashboard", icon: <FiBarChart2 />, path: "/admin" },
    { key: "forms", label: "Forms & Outcomes", icon: <FiFileText />, path: "/admin/forms-and-outcomes" },
    { key: "reports", label: "Reports", icon: <FiBarChart2 />, path: "/admin/reports" },
  ];

  const firstLetter = profile?.name ? profile.name.charAt(0).toUpperCase() : "A";
  const handleLogout = async () => {
    await logout();
    toast.success('logged out succesfully....')
    setTimeout(() => navigate("/", { replace: true }), 1500)
  };

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
          <nav className="hidden md:flex gap-6 text-sm font-medium">
            {navLinks.map((tab) => (
              <Link
                key={tab.key}
                to={tab.path}
                className={`flex items-center gap-1 ${location.pathname === tab.path
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900"
                  }`}
              >
                {tab.icon} {tab.label}
              </Link>
            ))}
          </nav>

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
                <span className="text-white text-sm font-medium">{firstLetter}</span>
              </div>
              <span className="hidden sm:block text-sm font-medium text-gray-700">
                {profile?.name || "Admin User"}
              </span>
              <FiChevronDown
                className={`text-gray-400 text-xs transition-transform ${profileOpen ? "rotate-180" : ""
                  }`}
              />
            </button>

            {/* Dropdown */}
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-3 z-50">
                <div className="px-4 pb-3 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-900">{profile?.name || "Admin User"}</p>
                  <p className="text-xs text-gray-500">{profile?.email || "admin@example.com"}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
                >
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
          <nav className="hidden md:flex gap-6 text-sm font-medium">
            {navLinks.map((tab) => (
              <Link
                key={tab.key}
                to={tab.path}
                className={`flex items-center gap-1 ${location.pathname === tab.path
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                  }`}
              >
                {tab.icon} {tab.label}
              </Link>
            ))}
          </nav>

        </div>
      )}
    </header>
  );
};

export default Header;
