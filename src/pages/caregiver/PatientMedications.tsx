import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getUser, User } from '../../mocks/users';
import { getPatientMedications, Medication, MedicationSchedule } from '../../mocks/medications';
import { Pill, ChevronLeft, Plus, Search, Filter, Clock } from 'lucide-react';
import MedicationCard from '../../components/medications/MedicationCard';

type TimeOfDay = 'all' | 'morning' | 'afternoon' | 'evening';
type Status = 'all' | 'taken' | 'pending' | 'missed';
type Priority = 'all' | 'high' | 'medium' | 'low';

const PatientMedications: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<User | null>(null);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [timeFilter, setTimeFilter] = useState<TimeOfDay>('all');
  const [statusFilter, setStatusFilter] = useState<Status>('all');
  const [priorityFilter, setPriorityFilter] = useState<Priority>('all');
  
  useEffect(() => {
    if (id) {
      // Get patient details
      const patientData = getUser(id);
      if (patientData) {
        setPatient(patientData);
        
        // Get medications
        const meds = getPatientMedications(id);
        setMedications(meds);
      }
      
      setLoading(false);
    }
  }, [id]);
  
  // Get today's day of week
  const today = new Date().getDay();
  const daysOfWeek = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  const todayStr = daysOfWeek[today];
  
  // Group medications by time of day
  const groupMedicationsByTime = (meds: Medication[]): Record<string, {medication: Medication, schedule: MedicationSchedule}[]> => {
    const result: Record<string, {medication: Medication, schedule: MedicationSchedule}[]> = {
      morning: [],
      afternoon: [],
      evening: [],
      all: []
    };
    
    meds.forEach(med => {
      med.schedule.forEach(schedule => {
        if (!schedule.days.includes(todayStr as any)) return;
        
        const hour = parseInt(schedule.time.split(':')[0]);
        let timeOfDay: TimeOfDay;
        
        if (hour >= 5 && hour < 12) {
          timeOfDay = 'morning';
        } else if (hour >= 12 && hour < 17) {
          timeOfDay = 'afternoon';
        } else {
          timeOfDay = 'evening';
        }
        
        result[timeOfDay].push({ medication: med, schedule });
        result.all.push({ medication: med, schedule });
      });
    });
    
    return result;
  };
  
  // Apply filters
  const filteredMedications = () => {
    let result = [...medications];
    
    // Filter by search term
    if (searchTerm) {
      result = result.filter(med => 
        med.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        med.dosage.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by priority
    if (priorityFilter !== 'all') {
      result = result.filter(med => med.priority === priorityFilter);
    }
    
    // Group and filter by time of day
    const grouped = groupMedicationsByTime(result);
    let filteredByTime = grouped[timeFilter];
    
    // Filter by status
    if (statusFilter !== 'all') {
      if (statusFilter === 'taken') {
        filteredByTime = filteredByTime.filter(item => item.schedule.taken);
      } else if (statusFilter === 'pending') {
        const now = new Date();
        const [hours, minutes] = [now.getHours(), now.getMinutes()];
        
        filteredByTime = filteredByTime.filter(item => {
          const [schedHours, schedMinutes] = item.schedule.time.split(':').map(Number);
          
          // Future time today and not taken
          return (schedHours > hours || (schedHours === hours && schedMinutes > minutes)) && !item.schedule.taken;
        });
      } else if (statusFilter === 'missed') {
        const now = new Date();
        const [hours, minutes] = [now.getHours(), now.getMinutes()];
        
        filteredByTime = filteredByTime.filter(item => {
          const [schedHours, schedMinutes] = item.schedule.time.split(':').map(Number);
          
          // Past time today and not taken
          return (schedHours < hours || (schedHours === hours && schedMinutes < minutes)) && !item.schedule.taken;
        });
      }
    }
    
    // Sort medications
    return filteredByTime.sort((a, b) => {
      const aTime = new Date();
      const bTime = new Date();
      
      const [aHours, aMinutes] = a.schedule.time.split(':').map(Number);
      const [bHours, bMinutes] = b.schedule.time.split(':').map(Number);
      
      aTime.setHours(aHours, aMinutes, 0, 0);
      bTime.setHours(bHours, bMinutes, 0, 0);
      
      const now = new Date();
      const aIsOverdue = aTime < now && !a.schedule.taken;
      const bIsOverdue = bTime < now && !b.schedule.taken;
      
      // Overdue items first
      if (aIsOverdue && !bIsOverdue) return -1;
      if (!aIsOverdue && bIsOverdue) return 1;
      
      // Then by priority
      if (a.medication.priority !== b.medication.priority) {
        const priorityRank = { high: 0, medium: 1, low: 2 };
        return priorityRank[a.medication.priority] - priorityRank[b.medication.priority];
      }
      
      // Then by time
      return aTime.getTime() - bTime.getTime();
    });
  };
  
  const medicationsToDisplay = filteredMedications();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-primary-500 text-2xl">
          Loading...
        </div>
      </div>
    );
  }
  
  if (!patient) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-6 text-center">
          <Pill className="mx-auto text-neutral-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-neutral-800 mb-2">Patient Not Found</h3>
          <p className="text-neutral-500 mb-4">
            The patient you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/caregiver/patients"
            className="bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded-lg text-sm font-medium inline-flex items-center"
          >
            <ChevronLeft size={16} className="mr-1" />
            Back to Patients
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Link */}
      <div className="mb-4">
        <Link
          to={`/caregiver/patients/${patient.id}`}
          className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center"
        >
          <ChevronLeft size={18} className="mr-1" />
          Back to Patient
        </Link>
      </div>
      
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">{patient.name}'s Medications</h1>
          <p className="text-neutral-500">
            Manage and track medication schedules
          </p>
        </div>
        
        <button className="bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded-lg flex items-center text-sm font-medium">
          <Plus size={16} className="mr-1" />
          Add Medication
        </button>
      </div>
      
      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-col space-y-4">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="text-neutral-500" size={18} />
            </div>
            <input
              type="text"
              placeholder="Search medications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Time Filter */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1 flex items-center">
                <Clock size={14} className="mr-1" />
                Time of Day
              </label>
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value as TimeOfDay)}
                className="input"
              >
                <option value="all">All Times</option>
                <option value="morning">Morning</option>
                <option value="afternoon">Afternoon</option>
                <option value="evening">Evening</option>
              </select>
            </div>
            
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1 flex items-center">
                <Filter size={14} className="mr-1" />
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as Status)}
                className="input"
              >
                <option value="all">All Statuses</option>
                <option value="taken">Taken</option>
                <option value="pending">Pending</option>
                <option value="missed">Missed</option>
              </select>
            </div>
            
            {/* Priority Filter */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1 flex items-center">
                <Filter size={14} className="mr-1" />
                Priority
              </label>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value as Priority)}
                className="input"
              >
                <option value="all">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {/* Medications List */}
      {medicationsToDisplay.length > 0 ? (
        <div className="space-y-4">
          {medicationsToDisplay.map(({ medication, schedule }) => (
            <MedicationCard 
              key={`${medication.id}-${schedule.id}`}
              medication={medication}
              schedule={schedule}
              showActions={false}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-6 text-center">
          <Pill className="mx-auto text-neutral-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-neutral-800 mb-2">No Medications Found</h3>
          <p className="text-neutral-500">
            {searchTerm || timeFilter !== 'all' || statusFilter !== 'all' || priorityFilter !== 'all'
              ? 'No medications match your current filters.'
              : 'This patient doesn\'t have any medications scheduled.'}
          </p>
          
          {(searchTerm || timeFilter !== 'all' || statusFilter !== 'all' || priorityFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setTimeFilter('all');
                setStatusFilter('all');
                setPriorityFilter('all');
              }}
              className="mt-4 bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded-lg text-sm font-medium"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default PatientMedications;