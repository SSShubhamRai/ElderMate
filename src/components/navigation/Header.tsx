import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Menu, Bell, X } from 'lucide-react';
import { useAlert } from '../../contexts/AlertContext';
import MobileMenu from './MobileMenu';

const Header: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const { alerts } = useAlert();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  
  // Get unread alerts count
  const unreadCount = alerts.filter(alert => !alert.read).length;
  
  // Determine current page title
  const getPageTitle = () => {
    const path = location.pathname;
    
    if (path === '/') return 'Dashboard';
    if (path === '/medicine') return 'Medication Reminders';
    if (path === '/emergency-contacts') return 'Emergency Contacts';
    if (path === '/caregiver') return 'Caregiver Dashboard';
    if (path === '/caregiver/patients') return 'Patients';
    if (path.includes('/caregiver/patients/') && path.includes('/medications')) return 'Patient Medications';
    if (path.includes('/caregiver/patients/')) return 'Patient Details';
    if (path === '/settings') return 'Settings';
    
    return 'ElderMate';
  };

  return (
    <header className="bg-white border-b border-neutral-200 py-3 px-4 md:px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            className="md:hidden mr-4 text-neutral-500 focus:outline-none"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu size={24} />
          </button>
          <h1 className="text-xl font-semibold text-neutral-900">{getPageTitle()}</h1>
        </div>
        
        <div className="flex items-center">
          {/* Emergency Button - Only for Elder users */}
          {user?.role === 'elder' && (
            <Link
              to="/emergency"
              className="mr-4 bg-error-500 hover:bg-error-600 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors"
            >
              Emergency
            </Link>
          )}
          
          {/* Notifications */}
          <div className="relative mr-4">
            <button
              className="text-neutral-500 hover:text-neutral-700 focus:outline-none relative"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-error-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            
            {/* Notifications dropdown */}
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-neutral-200 z-50">
                <div className="p-3 border-b border-neutral-200 flex items-center justify-between">
                  <h3 className="font-medium">Notifications</h3>
                  <button 
                    className="text-neutral-500 hover:text-neutral-700" 
                    onClick={() => setNotificationsOpen(false)}
                  >
                    <X size={16} />
                  </button>
                </div>
                
                <div className="max-h-96 overflow-y-auto">
                  {alerts.length > 0 ? (
                    <div className="py-2">
                      {alerts.slice(0, 5).map(alert => (
                        <div 
                          key={alert.id} 
                          className={`px-4 py-3 hover:bg-neutral-50 ${
                            !alert.read ? 'bg-primary-50' : ''
                          }`}
                        >
                          <p className="text-sm font-medium">
                            {alert.type === 'emergency' && '🚨 '}
                            {alert.type === 'fall' && '🔴 '}
                            {alert.type === 'medication' && '💊 '}
                            {alert.type === 'anomaly' && '⚠️ '}
                            {alert.type === 'system' && '🔧 '}
                            {alert.message}
                          </p>
                          <p className="text-xs text-neutral-500 mt-1">
                            {new Date(alert.timestamp).toLocaleString()}
                          </p>
                        </div>
                      ))}
                      
                      {alerts.length > 5 && (
                        <Link 
                          to={user?.role === 'caregiver' ? '/caregiver/alerts' : '/alerts'} 
                          className="block text-center text-primary-500 text-sm py-2 hover:underline"
                          onClick={() => setNotificationsOpen(false)}
                        >
                          View all notifications
                        </Link>
                      )}
                    </div>
                  ) : (
                    <p className="py-4 px-4 text-center text-neutral-500 text-sm">
                      No notifications
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* User Avatar */}
          <div className="flex items-center">
            {user?.avatar ? (
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-primary-800 font-medium text-sm">
                  {user?.name.substring(0, 1)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </header>
  );
};

export default Header;