import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const NotFound: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-8 text-center">
          <div className="flex items-center justify-center mb-6">
            <AlertCircle className="text-primary-500 h-16 w-16" />
          </div>
          
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Page Not Found</h1>
          <p className="text-neutral-600 mb-6">
            The page you're looking for doesn't exist or has been moved.
          </p>
          
          <Link
            to={user?.role === 'caregiver' ? '/caregiver' : '/'}
            className="bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded-lg inline-flex items-center font-medium"
          >
            <Home size={18} className="mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;