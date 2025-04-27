import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Heart, 
  Home, 
  Pill, 
  PhoneCall, 
  Users, 
  Activity, 
  Settings, 
  LogOut,
  Bell
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  
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

  return (
    <aside className="w-64 bg-white border-r border-neutral-200 hidden md:flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-neutral-200">
        <div className="flex items-center">
          <Heart className="text-primary-500 h-8 w-8" />
          <span className="ml-2 text-xl font-semibold text-primary-500">ElderMate</span>
        </div>
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
            >
              <span className="mr-3"><Settings size={20} /></span>
              Settings
            </NavLink>
          </li>
          <li>
            <button
              onClick={logout}
              className="w-full flex items-center px-3 py-2 rounded-lg text-sm text-neutral-700 hover:bg-neutral-100"
            >
              <span className="mr-3"><LogOut size={20} /></span>
              Logout
            </button>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;