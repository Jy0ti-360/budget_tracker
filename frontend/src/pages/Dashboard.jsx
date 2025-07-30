import React from 'react';
import DashboardContent from '../components/Dashboard.jsx';
import useAuth from '../hooks/useAuth';

const DashboardPage = () => {
  const { logout, user } = useAuth();

  return (
    <div className="max-w-3xl mx-auto p-4 font-sans">
      <header className="mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <button
            onClick={logout}
            className="bg-red-600 text-white font-bold px-4 py-2 rounded hover:bg-red-700 transition"
          >
            Log out
          </button>
        </div>

        <div className="text-center mt-5 space-y-2">
          <div className="text-xl font-medium text-[#264653] mb-5">
            Hello, {user?.name || 'User'}!
          </div>
          <div className="text-xl font-medium text-[#264653]">
            Welcome to the Budget Tracker App!
          </div>
        </div>
      </header>

      <DashboardContent />
    </div>
  );
};

export default DashboardPage;
