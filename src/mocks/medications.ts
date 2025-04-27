import { v4 as uuidv4 } from 'uuid';

export interface Medication {
  id: string;
  patientId: string;
  name: string;
  dosage: string;
  instructions: string;
  frequency: string;
  schedule: MedicationSchedule[];
  startDate: Date;
  endDate?: Date;
  imageUrl?: string;
  prescribedBy?: string;
  priority: 'low' | 'medium' | 'high';
}

export interface MedicationSchedule {
  id: string;
  time: string; // HH:MM format
  days: ('mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun')[];
  taken: boolean;
  lastTaken?: Date;
}

export interface MedicationEvent {
  id: string;
  medicationId: string;
  scheduleId: string;
  patientId: string;
  timestamp: Date;
  taken: boolean;
  skipped: boolean;
  notes?: string;
}

export const mockMedications: Medication[] = [
  {
    id: '1',
    patientId: '1', // Martha Johnson
    name: 'Lisinopril',
    dosage: '10mg',
    instructions: 'Take with food',
    frequency: 'daily',
    schedule: [
      {
        id: '101',
        time: '08:00',
        days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
        taken: false
      }
    ],
    startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), // 30 days ago
    imageUrl: 'https://images.pexels.com/photos/143654/pexels-photo-143654.jpeg?auto=compress&cs=tinysrgb&w=150',
    prescribedBy: 'Dr. Rebecca Smith',
    priority: 'high'
  },
  {
    id: '2',
    patientId: '1', // Martha Johnson
    name: 'Metformin',
    dosage: '500mg',
    instructions: 'Take with morning and evening meals',
    frequency: 'twice-daily',
    schedule: [
      {
        id: '201',
        time: '08:00',
        days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
        taken: false
      },
      {
        id: '202',
        time: '18:00',
        days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
        taken: false
      }
    ],
    startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60), // 60 days ago
    imageUrl: 'https://images.pexels.com/photos/208512/pexels-photo-208512.jpeg?auto=compress&cs=tinysrgb&w=150',
    prescribedBy: 'Dr. Rebecca Smith',
    priority: 'high'
  },
  {
    id: '3',
    patientId: '1', // Martha Johnson
    name: 'Aspirin',
    dosage: '81mg',
    instructions: 'Take once daily with water',
    frequency: 'daily',
    schedule: [
      {
        id: '301',
        time: '09:00',
        days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
        taken: false
      }
    ],
    startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90), // 90 days ago
    imageUrl: 'https://images.pexels.com/photos/67112/pexels-photo-67112.jpeg?auto=compress&cs=tinysrgb&w=150',
    prescribedBy: 'Dr. Rebecca Smith',
    priority: 'medium'
  },
  {
    id: '4',
    patientId: '2', // Thomas Wilson
    name: 'Albuterol Inhaler',
    dosage: '2 puffs',
    instructions: 'Use as needed for shortness of breath',
    frequency: 'as-needed',
    schedule: [
      {
        id: '401',
        time: '08:00',
        days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
        taken: false
      },
      {
        id: '402',
        time: '20:00',
        days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
        taken: false
      }
    ],
    startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45), // 45 days ago
    imageUrl: 'https://images.pexels.com/photos/360622/pexels-photo-360622.jpeg?auto=compress&cs=tinysrgb&w=150',
    prescribedBy: 'Dr. James Wilson',
    priority: 'high'
  },
  {
    id: '5',
    patientId: '2', // Thomas Wilson
    name: 'Furosemide',
    dosage: '40mg',
    instructions: 'Take in the morning with food',
    frequency: 'daily',
    schedule: [
      {
        id: '501',
        time: '07:00',
        days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
        taken: false
      }
    ],
    startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20), // 20 days ago
    imageUrl: 'https://images.pexels.com/photos/139398/pexels-photo-139398.jpeg?auto=compress&cs=tinysrgb&w=150',
    prescribedBy: 'Dr. James Wilson',
    priority: 'high'
  },
  {
    id: '6',
    patientId: '3', // James Brown
    name: 'Levodopa',
    dosage: '250mg',
    instructions: 'Take three times daily with meals',
    frequency: 'thrice-daily',
    schedule: [
      {
        id: '601',
        time: '08:00',
        days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
        taken: false
      },
      {
        id: '602',
        time: '13:00',
        days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
        taken: false
      },
      {
        id: '603',
        time: '18:00',
        days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
        taken: false
      }
    ],
    startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 120), // 120 days ago
    imageUrl: 'https://images.pexels.com/photos/274769/pexels-photo-274769.jpeg?auto=compress&cs=tinysrgb&w=150',
    prescribedBy: 'Dr. Patricia Johnson',
    priority: 'high'
  },
  {
    id: '7',
    patientId: '3', // James Brown
    name: 'Sertraline',
    dosage: '50mg',
    instructions: 'Take once daily in the morning',
    frequency: 'daily',
    schedule: [
      {
        id: '701',
        time: '09:00',
        days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
        taken: false
      }
    ],
    startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60), // 60 days ago
    imageUrl: 'https://images.pexels.com/photos/207534/pexels-photo-207534.jpeg?auto=compress&cs=tinysrgb&w=150',
    prescribedBy: 'Dr. Patricia Johnson',
    priority: 'medium'
  }
];

export const mockMedicationEvents: MedicationEvent[] = [
  // Generate some past medication events
  ...Array.from({ length: 20 }, (_, i) => ({
    id: uuidv4(),
    medicationId: mockMedications[i % mockMedications.length].id,
    scheduleId: mockMedications[i % mockMedications.length].schedule[0].id,
    patientId: mockMedications[i % mockMedications.length].patientId,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * (24 - i % 24)),
    taken: Math.random() > 0.2, // 80% chance medication was taken
    skipped: Math.random() <= 0.2, // 20% chance medication was skipped
    notes: Math.random() > 0.7 ? 'Felt nauseous afterward' : undefined
  }))
];

// Function to get medications for a user
export const getPatientMedications = (patientId: string): Medication[] => {
  return mockMedications.filter(med => med.patientId === patientId);
};

// Function to get medication events for a user
export const getPatientMedicationEvents = (patientId: string): MedicationEvent[] => {
  return mockMedicationEvents.filter(event => event.patientId === patientId);
};

// Function to record a medication event
export const recordMedicationEvent = (
  medicationId: string,
  scheduleId: string,
  patientId: string,
  taken: boolean,
  skipped: boolean,
  notes?: string
): MedicationEvent => {
  const event: MedicationEvent = {
    id: uuidv4(),
    medicationId,
    scheduleId,
    patientId,
    timestamp: new Date(),
    taken,
    skipped,
    notes
  };
  
  mockMedicationEvents.push(event);
  
  // Update the medication schedule
  const medication = mockMedications.find(med => med.id === medicationId);
  if (medication) {
    const schedule = medication.schedule.find(s => s.id === scheduleId);
    if (schedule) {
      schedule.taken = taken;
      schedule.lastTaken = taken ? new Date() : undefined;
    }
  }
  
  return event;
};