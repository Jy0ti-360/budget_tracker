import React, { useRef } from 'react';
import Header from './Header.jsx';
import DashboardContent from '../components/Dashboard.jsx';
import AnalyticsSection from '../components/AnalyticsSection.jsx';
import Footer from './Footer.jsx';
import useAuth from '../hooks/useAuth';

const DashboardPage = () => {
  const { logout, user } = useAuth();
  const analyticsRef = useRef();

  const scrollToAnalytics = () => {
    analyticsRef.current?.scrollIntoView({ behaviour: 'smooth' })
  }

  return (
    <div className="w-full p-4 font-sans">
      <Header onAnalyticsClick={scrollToAnalytics} />
      <header className="mb-8">
        <div className="text-center mt-5 space-y-2">
          <div className="text-xl font-medium text-[#264653] mb-5 mt-10">
            Hello, {user?.name || 'User'}!
          </div>
          <div className="text-xl font-medium text-[#264653]">
            Welcome to the Budget Tracker App!
          </div>
        </div>
      </header>

      <DashboardContent />
      <div ref={analyticsRef}>
        <AnalyticsSection />
      </div>
      <Footer />
    </div>
  );
};

export default DashboardPage;
