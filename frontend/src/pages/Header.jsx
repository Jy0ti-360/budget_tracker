import React from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Header = ({ onAnalyticsClick }) => {
  const { logout, user } = useAuth();

  return (
    <header className="bg-white shadow-md w-full">
      <div className="max-w-screen-lg mx-auto px-4 py-4 flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        
        <Link to="/" className="text-2xl sm:text-xl font-bold text-[#2876a7] text-center sm:text-left">
          Budget Tracker
        </Link>

        <nav className="flex flex-col sm:flex-row sm:space-x-6 text-base sm:text-sm text-gray-700 items-center gap-2 sm:gap-0">
          <Link
            to="/"
            className="hover:text-[#2876a7] transition"
          >
            Dashboard
          </Link>
          <button
            onClick={onAnalyticsClick}
            className="hover:text-[#2876a7] transition text-gray-700"
          >
            Analytics
          </button>
        </nav>

        <div className="flex justify-center sm:justify-end">
          <button
            onClick={logout}
            className="bg-red-600 text-white font-bold px-4 py-2 rounded hover:bg-red-700 transition w-full sm:w-auto text-sm"
          >
            Log out
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
