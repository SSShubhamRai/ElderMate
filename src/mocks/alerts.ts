import { v4 as uuidv4 } from 'uuid';

export type AlertType = 'emergency' | 'fall' | 'medication' | 'anomaly' | 'system';

export interface Alert {
  id: string;
  type: AlertType;
  message: string;
  timestamp: Date;
  patientId: string;
  caregiverId?: string;
  read: boolean;
  details?: Record<string, any>;
}

// Initialize with some sample alerts
export const mockAlerts: Alert[] = [
  {
    id: uuidv4(),
    type: 'fall',
    message: 'Fall detected in the bathroom',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    patientId: '1',
    caregiverId: '4',
    read: true,
    details: {
      location: 'Bathroom',
      severity: 'moderate'
    }
  },
  {
    id: uuidv4(),
    type: 'medication',
    message: 'Missed morning medication: Lisinopril',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    patientId: '1',
    caregiverId: '4',
    read: false,
    details: {
      medication: 'Lisinopril',
      dosage: '10mg',
      scheduledTime: new Date(Date.now() - 1000 * 60 * 60 * 6)
    }
  },
  {
    id: uuidv4(),
    type: 'anomaly',
    message: 'Elevated heart rate: 105 BPM',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
    patientId: '2',
    caregiverId: '4',
    read: true,
    details: {
      measurement: 'heartRate',
      value: 105,
      unit: 'BPM',
      threshold: 100
    }
  },
  {
    id: uuidv4(),
    type: 'medication',
    message: 'Medication taken: Metformin',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
    patientId: '1',
    caregiverId: '4',
    read: true,
    details: {
      medication: 'Metformin',
      dosage: '500mg',
      scheduledTime: new Date(Date.now() - 1000 * 60 * 60 * 12)
    }
  },
  {
    id: uuidv4(),
    type: 'emergency',
    message: 'Emergency button pressed',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 24 hours ago
    patientId: '3',
    caregiverId: '5',
    read: true,
    details: {
      location: 'Living Room',
      responded: true,
      responder: 'Michael Davis'
    }
  },
  {
    id: uuidv4(),
    type: 'system',
    message: 'Low battery on motion sensor',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 36), // 36 hours ago
    patientId: '2',
    caregiverId: '4',
    read: true,
    details: {
      device: 'Motion Sensor',
      location: 'Hallway',
      batteryLevel: '15%'
    }
  }
];