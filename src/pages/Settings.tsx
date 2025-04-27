import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Save,
  Camera,
  Trash
} from 'lucide-react';

const Settings: React.FC = () => {
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState('profile');
  
  // Profile form state
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  
  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [emergencyAlerts, setEmergencyAlerts] = useState(true);
  const [medicationReminders, setMedicationReminders] = useState(true);
  const [healthAlerts, setHealthAlerts] = useState(true);
  
  // Handle form submissions
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would update the user's profile
    alert('Profile updated successfully');
  };
  
  const handleNotificationsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would update notification settings
    alert('Notification settings updated successfully');
  };
  
  const handleSecuritySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would update security settings
    alert('Security settings updated successfully');
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center mb-6">
        <SettingsIcon className="text-primary-500 mr-3" size={24} />
        <h1 className="text-2xl font-bold text-neutral-900">Settings</h1>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-neutral-200">
          <div className="flex overflow-x-auto">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-3 font-medium text-sm flex items-center border-b-2 ${
                activeTab === 'profile'
                  ? 'border-primary-500 text-primary-700'
                  : 'border-transparent text-neutral-600 hover:text-neutral-900 hover:border-neutral-300'
              }`}
            >
              <User size={16} className="mr-2" />
              Profile
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`px-4 py-3 font-medium text-sm flex items-center border-b-2 ${
                activeTab === 'notifications'
                  ? 'border-primary-500 text-primary-700'
                  : 'border-transparent text-neutral-600 hover:text-neutral-900 hover:border-neutral-300'
              }`}
            >
              <Bell size={16} className="mr-2" />
              Notifications
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`px-4 py-3 font-medium text-sm flex items-center border-b-2 ${
                activeTab === 'security'
                  ? 'border-primary-500 text-primary-700'
                  : 'border-transparent text-neutral-600 hover:text-neutral-900 hover:border-neutral-300'
              }`}
            >
              <Shield size={16} className="mr-2" />
              Security
            </button>
          </div>
        </div>
        
        {/* Tab Content */}
        <div className="p-6">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileSubmit}>
              <div className="space-y-6">
                {/* Profile Picture */}
                <div className="flex flex-col items-center sm:flex-row sm:items-start">
                  <div className="relative mb-4 sm:mb-0 sm:mr-6">
                    {user?.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user.name} 
                        className="w-24 h-24 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center">
                        <span className="text-primary-800 font-bold text-3xl">
                          {user?.name.substring(0, 1)}
                        </span>
                      </div>
                    )}
                    
                    <button
                      type="button"
                      className="absolute bottom-0 right-0 bg-primary-500 text-white p-1.5 rounded-full shadow-md hover:bg-primary-600"
                    >
                      <Camera size={16} />
                    </button>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-neutral-900 mb-1">{user?.name}</h3>
                    <p className="text-neutral-500 mb-3">{user?.email}</p>
                    <button
                      type="button"
                      className="text-error-600 hover:text-error-700 text-sm font-medium flex items-center"
                    >
                      <Trash size={14} className="mr-1" />
                      Remove photo
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Info */}
                  <div>
                    <h3 className="text-lg font-medium text-neutral-900 mb-4">Basic Information</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1">
                          Full Name
                        </label>
                        <input
                          id="name"
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="input"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
                          Email Address
                        </label>
                        <input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="input"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="role" className="block text-sm font-medium text-neutral-700 mb-1">
                          Role
                        </label>
                        <input
                          id="role"
                          type="text"
                          value={user?.role === 'elder' ? 'Elder/Patient' : 'Caregiver'}
                          disabled
                          className="input bg-neutral-50"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Additional Info - Different for elder and caregiver */}
                  <div>
                    <h3 className="text-lg font-medium text-neutral-900 mb-4">
                      {user?.role === 'elder' ? 'Medical Information' : 'Professional Information'}
                    </h3>
                    
                    {user?.role === 'elder' ? (
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="age" className="block text-sm font-medium text-neutral-700 mb-1">
                            Age
                          </label>
                          <input
                            id="age"
                            type="number"
                            value={user.age || ''}
                            className="input"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="conditions" className="block text-sm font-medium text-neutral-700 mb-1">
                            Medical Conditions
                          </label>
                          <textarea
                            id="conditions"
                            value={(user.medicalConditions || []).join(', ')}
                            className="input min-h-[100px]"
                          ></textarea>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="specialty" className="block text-sm font-medium text-neutral-700 mb-1">
                            Specialty
                          </label>
                          <input
                            id="specialty"
                            type="text"
                            defaultValue="Elder Care"
                            className="input"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="patients" className="block text-sm font-medium text-neutral-700 mb-1">
                            Assigned Patients
                          </label>
                          <input
                            id="patients"
                            type="text"
                            value={(user.assignedElders || []).length.toString()}
                            disabled
                            className="input bg-neutral-50"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="pt-4 border-t border-neutral-200">
                  <button
                    type="submit"
                    className="bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded-lg flex items-center text-sm font-medium"
                  >
                    <Save size={16} className="mr-1" />
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          )}
          
          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <form onSubmit={handleNotificationsSubmit}>
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-neutral-900 mb-4">Notification Preferences</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-neutral-100">
                    <div>
                      <h4 className="font-medium text-neutral-900">Email Notifications</h4>
                      <p className="text-sm text-neutral-500">Receive notifications via email</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={emailNotifications}
                        onChange={() => setEmailNotifications(!emailNotifications)}
                      />
                      <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between py-3 border-b border-neutral-100">
                    <div>
                      <h4 className="font-medium text-neutral-900">SMS Notifications</h4>
                      <p className="text-sm text-neutral-500">Receive notifications via text message</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={smsNotifications}
                        onChange={() => setSmsNotifications(!smsNotifications)}
                      />
                      <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                    </label>
                  </div>
                </div>
                
                <h3 className="text-lg font-medium text-neutral-900 mb-4">Alert Types</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-neutral-100">
                    <div>
                      <h4 className="font-medium text-neutral-900">Emergency Alerts</h4>
                      <p className="text-sm text-neutral-500">Critical alerts requiring immediate attention</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={emergencyAlerts}
                        onChange={() => setEmergencyAlerts(!emergencyAlerts)}
                      />
                      <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between py-3 border-b border-neutral-100">
                    <div>
                      <h4 className="font-medium text-neutral-900">Medication Reminders</h4>
                      <p className="text-sm text-neutral-500">Reminders about scheduled medications</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={medicationReminders}
                        onChange={() => setMedicationReminders(!medicationReminders)}
                      />
                      <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between py-3 border-b border-neutral-100">
                    <div>
                      <h4 className="font-medium text-neutral-900">Health Anomalies</h4>
                      <p className="text-sm text-neutral-500">Alerts about unusual health patterns</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={healthAlerts}
                        onChange={() => setHealthAlerts(!healthAlerts)}
                      />
                      <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                    </label>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-neutral-200">
                  <button
                    type="submit"
                    className="bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded-lg flex items-center text-sm font-medium"
                  >
                    <Save size={16} className="mr-1" />
                    Save Preferences
                  </button>
                </div>
              </div>
            </form>
          )}
          
          {/* Security Tab */}
          {activeTab === 'security' && (
            <form onSubmit={handleSecuritySubmit}>
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-neutral-900 mb-4">Account Security</h3>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="current-password" className="block text-sm font-medium text-neutral-700 mb-1">
                      Current Password
                    </label>
                    <input
                      id="current-password"
                      type="password"
                      className="input"
                      placeholder="••••••••"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="new-password" className="block text-sm font-medium text-neutral-700 mb-1">
                      New Password
                    </label>
                    <input
                      id="new-password"
                      type="password"
                      className="input"
                      placeholder="••••••••"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="confirm-password" className="block text-sm font-medium text-neutral-700 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      id="confirm-password"
                      type="password"
                      className="input"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
                
                <h3 className="text-lg font-medium text-neutral-900 mb-4">Two-Factor Authentication</h3>
                
                <div className="bg-neutral-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-neutral-900">Enable Two-Factor Authentication</h4>
                      <p className="text-sm text-neutral-500">Add an extra layer of security to your account</p>
                    </div>
                    <button
                      type="button"
                      className="bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded-lg text-sm font-medium"
                    >
                      Enable
                    </button>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-neutral-200">
                  <button
                    type="submit"
                    className="bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded-lg flex items-center text-sm font-medium"
                  >
                    <Save size={16} className="mr-1" />
                    Update Security
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;