import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from './AuthContext';
import { mockAlerts, Alert, AlertType } from '../mocks/alerts';

interface AlertContextType {
  alerts: Alert[];
  loading: boolean;
  triggerAlert: (type: AlertType, message: string, patientId?: string) => void;
  dismissAlert: (id: string) => void;
  fetchAlerts: (patientId?: string) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  // Load alerts on mount
  useEffect(() => {
    if (user) {
      fetchAlerts();
    }
  }, [user]);

  // Fetch alerts for user or specific patient
  const fetchAlerts = (patientId?: string) => {
    setLoading(true);
    
    setTimeout(() => {
      let userAlerts;
      
      if (user?.role === 'caregiver') {
        if (patientId) {
          // Get alerts for a specific patient
          userAlerts = mockAlerts.filter(alert => alert.patientId === patientId);
        } else {
          // Get all alerts for all of the caregiver's patients
          userAlerts = mockAlerts.filter(alert => alert.caregiverId === user.id);
        }
      } else {
        // Get alerts for elder user
        userAlerts = mockAlerts.filter(alert => alert.patientId === user?.id);
      }
      
      setAlerts(userAlerts);
      setLoading(false);
    }, 800);
  };

  // Trigger a new alert
  const triggerAlert = (type: AlertType, message: string, patientId?: string) => {
    if (!user) return;
    
    const newAlert: Alert = {
      id: uuidv4(),
      type,
      message,
      timestamp: new Date(),
      patientId: patientId || user.id,
      caregiverId: user.role === 'caregiver' ? user.id : undefined,
      read: false,
    };
    
    // Add to mock alerts (would be sent to server in real app)
    mockAlerts.unshift(newAlert);
    
    // Update state
    setAlerts(prev => [newAlert, ...prev]);
    
    // In a real app, this would trigger notifications to caregivers
    console.log('Alert triggered:', newAlert);
  };

  // Dismiss an alert
  const dismissAlert = (id: string) => {
    // Mark as read in mock data
    const alertIndex = mockAlerts.findIndex(alert => alert.id === id);
    if (alertIndex >= 0) {
      mockAlerts[alertIndex].read = true;
    }
    
    // Update state
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === id ? { ...alert, read: true } : alert
      )
    );
  };

  return (
    <AlertContext.Provider value={{ 
      alerts, 
      loading, 
      triggerAlert, 
      dismissAlert,
      fetchAlerts
    }}>
      {children}
    </AlertContext.Provider>
  );
};