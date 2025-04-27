import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Heart } from 'lucide-react';

const AuthLayout: React.FC = () => {
  const { user, loading } = useAuth();
  
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
  
  // If authenticated, redirect to appropriate dashboard
  if (user) {
    return <Navigate to={user.role === 'caregiver' ? '/caregiver' : '/'} replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-8">
          <div className="flex items-center justify-center mb-6">
            <Heart className="text-primary-500 h-10 w-10" />
            <h1 className="text-3xl font-bold text-primary-500 ml-2">ElderMate</h1>
          </div>
          
          <Outlet />
          
          <p className="text-center text-neutral-500 text-sm mt-6">
            Smart Care System for Elderly
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;