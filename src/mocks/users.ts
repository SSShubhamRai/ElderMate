export interface User {
  id: string;
  name: string;
  email: string;
  role: 'elder' | 'caregiver';
  avatar?: string;
  age?: number;
  medicalConditions?: string[];
  emergencyContacts?: EmergencyContact[];
  assignedCaregiver?: string;  // Caregiver ID for elder
  assignedElders?: string[];   // Elder IDs for caregiver
}

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  isEmergencyContact: boolean;
}

// Mock data includes password for demo, in a real app this would be hashed and stored server-side
export const mockUsers: (User & { password: string })[] = [
  {
    id: '1',
    name: 'Martha Johnson',
    email: 'martha@example.com',
    password: 'password123',
    role: 'elder',
    avatar: 'https://images.pexels.com/photos/2050994/pexels-photo-2050994.jpeg?auto=compress&cs=tinysrgb&w=150',
    age: 78,
    medicalConditions: ['Hypertension', 'Type 2 Diabetes', 'Arthritis'],
    emergencyContacts: [
      {
        id: '101',
        name: 'Robert Johnson',
        relationship: 'Son',
        phone: '555-123-4567',
        email: 'robert@example.com',
        isEmergencyContact: true
      },
      {
        id: '102',
        name: 'Susan Williams',
        relationship: 'Daughter',
        phone: '555-987-6543',
        email: 'susan@example.com',
        isEmergencyContact: true
      }
    ],
    assignedCaregiver: '4'
  },
  {
    id: '2',
    name: 'Thomas Wilson',
    email: 'thomas@example.com',
    password: 'password123',
    role: 'elder',
    avatar: 'https://images.pexels.com/photos/834863/pexels-photo-834863.jpeg?auto=compress&cs=tinysrgb&w=150',
    age: 82,
    medicalConditions: ['COPD', 'Heart Failure', 'Glaucoma'],
    emergencyContacts: [
      {
        id: '103',
        name: 'Mary Wilson',
        relationship: 'Wife',
        phone: '555-222-3333',
        email: 'mary@example.com',
        isEmergencyContact: true
      }
    ],
    assignedCaregiver: '4'
  },
  {
    id: '3',
    name: 'James Brown',
    email: 'james@example.com',
    password: 'password123',
    role: 'elder',
    avatar: 'https://images.pexels.com/photos/1139743/pexels-photo-1139743.jpeg?auto=compress&cs=tinysrgb&w=150',
    age: 75,
    medicalConditions: ['Parkinson\'s Disease', 'Depression'],
    emergencyContacts: [
      {
        id: '104',
        name: 'Patricia Brown',
        relationship: 'Daughter',
        phone: '555-444-5555',
        email: 'patricia@example.com',
        isEmergencyContact: true
      }
    ],
    assignedCaregiver: '5'
  },
  {
    id: '4',
    name: 'Sarah Miller',
    email: 'sarah@example.com',
    password: 'password123',
    role: 'caregiver',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
    assignedElders: ['1', '2']
  },
  {
    id: '5',
    name: 'Michael Davis',
    email: 'michael@example.com',
    password: 'password123',
    role: 'caregiver',
    avatar: 'https://images.pexels.com/photos/1722198/pexels-photo-1722198.jpeg?auto=compress&cs=tinysrgb&w=150',
    assignedElders: ['3']
  }
];

export const getUser = (id: string): User | undefined => {
  const user = mockUsers.find(u => u.id === id);
  if (user) {
    // Remove password before returning
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  return undefined;
};

export const getEldersByCaregiver = (caregiverId: string): User[] => {
  const caregiver = mockUsers.find(u => u.id === caregiverId && u.role === 'caregiver');
  if (!caregiver || !caregiver.assignedElders || caregiver.assignedElders.length === 0) {
    return [];
  }
  
  return caregiver.assignedElders.map(elderId => {
    const elder = getUser(elderId);
    return elder as User;
  }).filter(Boolean);
};