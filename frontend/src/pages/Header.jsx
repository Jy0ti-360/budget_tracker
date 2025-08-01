import React from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Header = ({ onAnalyticsClick }) => {
  const { logout, user } = useAuth();

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-screen-lg mx-auto px-4 py-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-[#2876a7]">
          Budget Tracker
        </Link>

        {/* Navigation Links */}
        <nav className="flex flex-col sm:flex-row sm:space-x-6 text-sm text-gray-700 gap-2 sm:gap-0">
          <Link
            to="/"
            className="hover:text-[#2876a7] transition"
          >
            Dashboard
          </Link>
          <button
            onClick={onAnalyticsClick}
            className="hover:text-[#2876a7] transition text-sm text-gray-700 text-left"
          >
            Analytics
          </button>
        </nav>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="bg-red-600 text-white font-bold px-4 py-2 rounded hover:bg-red-700 transition w-full sm:w-auto"
        >
          Log out
        </button>
      </div>
    </header>
  );
};

export default Header;
