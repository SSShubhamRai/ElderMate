import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Heart,
  Home, 
  Pill, 
  PhoneCall, 
  Users, 
  Settings, 
  LogOut,
  X,
  Bell
} from 'lucide-react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  
  if (!isOpen) return null;
  
  const elderLinks = [
    { to: '/', icon: <Home size={20} />, label: 'Dashboard' },
    { to: '/medicine', icon: <Pill size={20} />, label: 'Medication' },
    { to: '/emergency-contacts', icon: <PhoneCall size={20} />, label: 'Emergency Contacts' },
  ];
  
  const caregiverLinks = [
    { to: '/caregiver', icon: <Home size={20} />, label: 'Dashboard' },
    { to: '/caregiver/patients', icon: <Users size={20} />, label: 'Patients' },
    { to: '/caregiver/alerts', icon: <Bell size={20} />, label: 'Alerts' },
  ];
  
  const links = user?.role === 'caregiver' ? caregiverLinks : elderLinks;
  
  const handleLogout = () => {
    onClose();
    logout();
  };

  return (
    <div className="fixed inset-0 z-50 bg-neutral-900 bg-opacity-50">
      <div className="absolute left-0 top-0 h-full w-64 bg-white shadow-lg">
        {/* Header */}
        <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center">
            <Heart className="text-primary-500 h-6 w-6" />
            <span className="ml-2 text-lg font-semibold text-primary-500">ElderMate</span>
          </div>
          <button 
            className="text-neutral-500 hover:text-neutral-700 focus:outline-none" 
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>
        
        {/* User Profile */}
        <div className="p-4 border-b border-neutral-200">
          <div className="flex items-center">
            {user?.avatar ? (
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-primary-800 font-medium">
                  {user?.name.substring(0, 1)}
                </span>
              </div>
            )}
            <div className="ml-3">
              <p className="text-sm font-medium text-neutral-900">{user?.name}</p>
              <p className="text-xs text-neutral-500 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>
        
        {/* Navigation Links */}
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) => 
                    `flex items-center px-3 py-2 rounded-lg text-sm ${
                      isActive 
                        ? 'bg-primary-50 text-primary-700 font-medium' 
                        : 'text-neutral-700 hover:bg-neutral-100'
                    }`
                  }
                  onClick={onClose}
                >
                  <span className="mr-3">{link.icon}</span>
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        
        {/* Bottom Links */}
        <div className="p-4 border-t border-neutral-200">
          <ul className="space-y-1">
            <li>
              <NavLink
                to="/settings"
                className={({ isActive }) => 
                  `flex items-center px-3 py-2 rounded-lg text-sm ${
                    isActive 
                      ? 'bg-primary-50 text-primary-700 font-medium' 
                      : 'text-neutral-700 hover:bg-neutral-100'
                  }`
                }
                onClick={onClose}
              >
                <span className="mr-3"><Settings size={20} /></span>
                Settings
              </NavLink>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-3 py-2 rounded-lg text-sm text-neutral-700 hover:bg-neutral-100"
              >
                <span className="mr-3"><LogOut size={20} /></span>
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;