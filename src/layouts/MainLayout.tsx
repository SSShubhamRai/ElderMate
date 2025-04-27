import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/navigation/Sidebar';
import Header from '../components/navigation/Header';
import AlertBanner from '../components/alerts/AlertBanner';
import { useAlert } from '../contexts/AlertContext';

const MainLayout: React.FC = () => {
  const { user, loading } = useAuth();
  const { alerts } = useAlert();
  
  // Show unread emergency or fall alerts
  const emergencyAlerts = alerts.filter(
    alert => (alert.type === 'emergency' || alert.type === 'fall') && !alert.read
  );

  // If loading, show loading screen
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-primary-500 text-2xl">
          Loading...
        </div>
      </div>
    );
  }
  
  // If not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        {emergencyAlerts.length > 0 && (
          <AlertBanner alerts={emergencyAlerts} />
        )}
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-24">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;