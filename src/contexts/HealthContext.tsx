import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { generateHealthData, HealthData } from '../mocks/healthData';
import { v4 as uuidv4 } from 'uuid';

interface HealthContextType {
  healthData: HealthData[];
  currentStatus: HealthData | null;
  loading: boolean;
  fetchPatientData: (patientId: string) => Promise<HealthData[]>;
  recordHealthData: (data: Partial<HealthData>) => void;
  detectAnomalies: (data: HealthData) => string[];
}

const HealthContext = createContext<HealthContextType | undefined>(undefined);

export const useHealth = () => {
  const context = useContext(HealthContext);
  if (!context) {
    throw new Error('useHealth must be used within a HealthProvider');
  }
  return context;
};

export const HealthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [healthData, setHealthData] = useState<HealthData[]>([]);
  const [currentStatus, setCurrentStatus] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Generate initial health data and set up interval for updates
  useEffect(() => {
    if (user) {
      const initialData = Array.from({ length: 24 }, (_, i) => 
        generateHealthData(user.id, new Date(Date.now() - (23 - i) * 60 * 60 * 1000))
      );
      
      setHealthData(initialData);
      setCurrentStatus(initialData[initialData.length - 1]);
      setLoading(false);
      
      // Simulate real-time updates every minute
      const interval = setInterval(() => {
        const newDataPoint = generateHealthData(user.id, new Date());
        
        setHealthData(prev => {
          // Keep last 24 hours of data
          const newData = [...prev, newDataPoint];
          if (newData.length > 144) { // 6 data points per hour * 24 hours
            return newData.slice(newData.length - 144);
          }
          return newData;
        });
        
        setCurrentStatus(newDataPoint);
        
        // Check for anomalies
        const anomalies = detectAnomalies(newDataPoint);
        if (anomalies.length > 0) {
          console.log('Anomalies detected:', anomalies);
          // In a real app, this would trigger alerts
        }
      }, 60000); // Update every minute
      
      return () => clearInterval(interval);
    }
  }, [user]);

  // Fetch patient data (for caregivers)
  const fetchPatientData = async (patientId: string): Promise<HealthData[]> => {
    setLoading(true);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        // Generate 24 hours of data for the patient
        const patientData = Array.from({ length: 24 }, (_, i) => 
          generateHealthData(patientId, new Date(Date.now() - (23 - i) * 60 * 60 * 1000))
        );
        
        setLoading(false);
        resolve(patientData);
      }, 1000);
    });
  };

  // Record new health data point
  const recordHealthData = (data: Partial<HealthData>) => {
    if (!user) return;
    
    const newDataPoint: HealthData = {
      id: uuidv4(),
      userId: user.id,
      timestamp: new Date(),
      heartRate: data.heartRate || (currentStatus?.heartRate || 75),
      bloodPressureSystolic: data.bloodPressureSystolic || (currentStatus?.bloodPressureSystolic || 120),
      bloodPressureDiastolic: data.bloodPressureDiastolic || (currentStatus?.bloodPressureDiastolic || 80),
      temperature: data.temperature || (currentStatus?.temperature || 36.6),
      oxygenLevel: data.oxygenLevel || (currentStatus?.oxygenLevel || 98),
      glucoseLevel: data.glucoseLevel || (currentStatus?.glucoseLevel || 5.5),
      activity: data.activity || (currentStatus?.activity || 'resting'),
      fallDetected: data.fallDetected || false,
      location: data.location || (currentStatus?.location || { x: 0, y: 0 }),
    };
    
    setHealthData(prev => [...prev, newDataPoint]);
    setCurrentStatus(newDataPoint);
  };

  // Detect anomalies in health data
  const detectAnomalies = (data: HealthData): string[] => {
    const anomalies: string[] = [];
    
    // Heart rate checks
    if (data.heartRate > 100) anomalies.push('Elevated heart rate');
    if (data.heartRate < 50) anomalies.push('Low heart rate');
    
    // Blood pressure checks
    if (data.bloodPressureSystolic > 140) anomalies.push('High systolic blood pressure');
    if (data.bloodPressureDiastolic > 90) anomalies.push('High diastolic blood pressure');
    
    // Temperature checks
    if (data.temperature > 37.5) anomalies.push('Elevated temperature');
    if (data.temperature < 36) anomalies.push('Low temperature');
    
    // Oxygen level checks
    if (data.oxygenLevel < 95) anomalies.push('Low oxygen saturation');
    
    // Glucose level checks
    if (data.glucoseLevel > 7) anomalies.push('High glucose level');
    if (data.glucoseLevel < 4) anomalies.push('Low glucose level');
    
    // Fall detection
    if (data.fallDetected) anomalies.push('Fall detected');
    
    return anomalies;
  };

  return (
    <HealthContext.Provider value={{ 
      healthData, 
      currentStatus, 
      loading, 
      fetchPatientData, 
      recordHealthData,
      detectAnomalies
    }}>
      {children}
    </HealthContext.Provider>
  );
};