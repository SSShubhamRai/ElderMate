import { v4 as uuidv4 } from 'uuid';

export interface HealthData {
  id: string;
  userId: string;
  timestamp: Date;
  heartRate: number;
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  temperature: number;
  oxygenLevel: number;
  glucoseLevel: number;
  activity: 'resting' | 'walking' | 'sleeping' | 'active';
  fallDetected: boolean;
  location: { x: number; y: number };
}

// Generate realistic looking health data
export const generateHealthData = (userId: string, timestamp: Date): HealthData => {
  // Generate baseline values
  const baseHeartRate = Math.floor(Math.random() * 20) + 65; // 65-85
  const baseSystolic = Math.floor(Math.random() * 30) + 110; // 110-140
  const baseDiastolic = Math.floor(Math.random() * 20) + 70; // 70-90
  const baseTemperature = (Math.random() * 0.8) + 36.2; // 36.2-37.0
  const baseOxygen = Math.floor(Math.random() * 3) + 96; // 96-99
  const baseGlucose = (Math.random() * 1.5) + 4.5; // 4.5-6.0
  
  // Time-based variations
  const hour = timestamp.getHours();
  const isNight = hour >= 22 || hour <= 6;
  const isMorning = hour >= 7 && hour <= 10;
  const isEvening = hour >= 17 && hour <= 21;
  
  // Adjust values based on time
  let heartRate = baseHeartRate;
  let systolic = baseSystolic;
  let diastolic = baseDiastolic;
  let temperature = baseTemperature;
  let activity: 'resting' | 'walking' | 'sleeping' | 'active' = 'resting';
  
  if (isNight) {
    // Lower values at night during sleep
    heartRate -= Math.floor(Math.random() * 10) + 5;
    systolic -= Math.floor(Math.random() * 10) + 5;
    diastolic -= Math.floor(Math.random() * 5) + 3;
    temperature -= 0.2;
    activity = 'sleeping';
  } else if (isMorning) {
    // Slightly elevated in the morning
    heartRate += Math.floor(Math.random() * 5) + 3;
    systolic += Math.floor(Math.random() * 8) + 5;
    diastolic += Math.floor(Math.random() * 3) + 2;
    activity = Math.random() > 0.6 ? 'walking' : 'resting';
  } else if (isEvening) {
    // Varied in the evening
    heartRate += Math.floor(Math.random() * 8) - 4; // -4 to +4
    activity = Math.random() > 0.4 ? 'active' : 'resting';
  }
  
  // Occasional fall detection (very rare)
  const fallDetected = Math.random() < 0.005; // 0.5% chance
  
  // If fall detected, adjust values accordingly
  if (fallDetected) {
    heartRate += Math.floor(Math.random() * 15) + 20; // Spike in heart rate
    systolic += Math.floor(Math.random() * 20) + 15;
    diastolic += Math.floor(Math.random() * 10) + 10;
  }
  
  // Location data (simulated as x,y coordinates in a home)
  const location = {
    x: Math.floor(Math.random() * 100),
    y: Math.floor(Math.random() * 100)
  };
  
  return {
    id: uuidv4(),
    userId,
    timestamp,
    heartRate,
    bloodPressureSystolic: systolic,
    bloodPressureDiastolic: diastolic,
    temperature: parseFloat(temperature.toFixed(1)),
    oxygenLevel: baseOxygen,
    glucoseLevel: parseFloat(baseGlucose.toFixed(1)),
    activity,
    fallDetected,
    location
  };
};

// Store last 24 hours of data for each user
export const mockHealthData: Map<string, HealthData[]> = new Map();

// Function to get health data for a user
export const getUserHealthData = (userId: string): HealthData[] => {
  if (!mockHealthData.has(userId)) {
    // Generate 24 hours of data
    const data = Array.from({ length: 24 }, (_, i) => 
      generateHealthData(userId, new Date(Date.now() - (23 - i) * 60 * 60 * 1000))
    );
    mockHealthData.set(userId, data);
  }
  
  return mockHealthData.get(userId) || [];
};