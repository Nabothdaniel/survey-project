import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FiBarChart2,
  FiFileText,
  FiPlus,
  FiHelpCircle,
  FiMenu,
  FiX,
  FiChevronDown,
  FiLogOut,
} from "react-icons/fi";
import { gsap } from "gsap";

type HeaderProps = {
  isAdmin?: boolean;
};

const Header = ({ isAdmin}: HeaderProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();

  // Animate Profile Dropdown
  useEffect(() => {
    if (profileRef.current) {
      if (profileOpen) {
        gsap.fromTo(
          profileRef.current,
          { opacity: 0, y: -10, display: "none" },
          { opacity: 1, y: 0, display: "block", duration: 0.3, ease: "power2.out" }
        );
      } else {
        gsap.to(profileRef.current, {
          opacity: 0,
          y: -10,
          duration: 0.2,
          ease: "power2.in",
          onComplete: () => {
            if (profileRef.current) profileRef.current.style.display = "none";
          },
        });
      }
    }
  }, [profileOpen]);

  // Animate Mobile Menu
  useEffect(() => {
    if (mobileMenuRef.current) {
      if (menuOpen) {
        gsap.fromTo(
          mobileMenuRef.current,
          { opacity: 0, y: -20, display: "none" },
          { opacity: 1, y: 0, display: "block", duration: 0.3, ease: "power2.out" }
        );
      } else {
        gsap.to(mobileMenuRef.current, {
          opacity: 0,
          y: -20,
          duration: 0.25,
          ease: "power2.in",
          onComplete: () => {
            if (mobileMenuRef.current) mobileMenuRef.current.style.display = "none";
          },
        });
      }
    }
  }, [menuOpen]);

  const tabs = [
    { id: "", label: "Dashboard", icon: <FiFileText /> },
    { id: "surveys", label: "Surveys", icon: <FiBarChart2 /> },
  ];

  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 shadow-sm fixed top-0 left-0 w-full z-50">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <span className="text-xl font-bold text-gray-900">SURVEY</span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-6">
          {tabs.map((tab) => {
            const path = tab.id ? `/dashboard/${tab.id}` : "/dashboard";
            const isActive = location.pathname === path;
            return (
              <Link
                key={tab.id || "dashboard"}
                to={path}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors ${isActive
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-blue-600"
                  }`}
              >
                {tab.icon}
                {tab.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Side */}
        <div className="flex items-center space-x-3">
          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isAdmin && (
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-medium rounded-lg flex items-center gap-2">
                <FiPlus /> Create New Form
              </button>
            )}
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-2">
              <FiHelpCircle /> Help
            </button>
          </div>

          {/* Profile Button */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">D</span>
              </div>
              <span className="hidden sm:block text-sm font-medium text-gray-700">
                Admin User
              </span>
              <FiChevronDown
                className={`text-gray-400 text-xs transition-transform ${profileOpen ? "rotate-180" : ""
                  }`}
              />
            </button>

            {/* Profile Dropdown */}
            <div
              ref={profileRef}
              style={{ display: "none" }}
              className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-3 z-50"
            >
              <div className="px-4 pb-3 border-b border-gray-200">
                <p className="text-sm font-medium text-gray-900">Admin User</p>
                <p className="text-xs text-gray-500">admin@example.com</p>
              </div>
              <button className="w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2">
                <FiLogOut /> Logout
              </button>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-gray-600 hover:text-blue-600 focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown (overlay, not pushing content) */}
      <div
        ref={mobileMenuRef}
        style={{ display: "none" }}
        className="absolute top-full left-0 w-full bg-gray-50 p-4 shadow-lg md:hidden z-40"
      >
        <nav className="flex flex-col space-y-3">
          {tabs.map((tab) => {
            const path = tab.id ? `/dashboard/${tab.id}` : "/dashboard";
            const isActive = location.pathname === path;
            return (
              <Link
                key={tab.id || "dashboard"}
                to={path}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${isActive
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-600 hover:bg-gray-200"
                  }`}
              >
                {tab.icon}
                {tab.label}
              </Link>
            );
          })}
        </nav>
        {isAdmin && (
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-medium rounded-lg flex items-center gap-2 mt-3">
            <FiPlus /> Create New Form
          </button>
        )}
       
      </div>
    </header>
  );
};

export default Header;