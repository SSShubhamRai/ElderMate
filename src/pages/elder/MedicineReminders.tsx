import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getPatientMedications, Medication, MedicationSchedule } from '../../mocks/medications';
import MedicationCard from '../../components/medications/MedicationCard';
import { Pill, Clock, Calendar, Filter } from 'lucide-react';

type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'all';

const MedicineReminders: React.FC = () => {
  const { user } = useAuth();
  const [timeFilter, setTimeFilter] = useState<TimeOfDay>('all');
  const medications = getPatientMedications(user?.id || '');
  
  // Get today's day of week
  const today = new Date().getDay();
  const daysOfWeek = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  const todayStr = daysOfWeek[today];
  
  // Get medications for today
  const todayMedications = medications.filter(med => 
    med.schedule.some(schedule => 
      schedule.days.includes(todayStr as any)
    )
  );
  
  // Group medications by time of day
  const groupMedicationsByTime = (meds: Medication[]): Record<TimeOfDay, {medication: Medication, schedule: MedicationSchedule}[]> => {
    const result: Record<TimeOfDay, {medication: Medication, schedule: MedicationSchedule}[]> = {
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
  
  const groupedMedications = groupMedicationsByTime(todayMedications);
  const filteredMedications = groupedMedications[timeFilter];
  
  // Sort medications: overdue first, then by time
  const sortedMedications = [...filteredMedications].sort((a, b) => {
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
    
    // Then by time
    return aTime.getTime() - bTime.getTime();
  });

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <Pill className="text-primary-500 mr-3" size={24} />
        <h1 className="text-2xl font-bold text-neutral-900">Medication Reminders</h1>
      </div>
      
      {/* Date */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-neutral-500 text-sm">Today's Date</p>
            <p className="text-xl font-semibold text-neutral-900">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <Calendar className="text-primary-500" size={32} />
        </div>
      </div>
      
      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex items-center mb-3">
          <Filter className="text-neutral-500 mr-2" size={16} />
          <h3 className="font-medium text-neutral-900">Filter by Time</h3>
        </div>
        
        <div className="grid grid-cols-4 gap-2">
          <button
            onClick={() => setTimeFilter('all')}
            className={`py-2 px-3 rounded-lg text-sm font-medium ${
              timeFilter === 'all'
                ? 'bg-primary-500 text-white'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setTimeFilter('morning')}
            className={`py-2 px-3 rounded-lg text-sm font-medium ${
              timeFilter === 'morning'
                ? 'bg-primary-500 text-white'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            Morning
          </button>
          <button
            onClick={() => setTimeFilter('afternoon')}
            className={`py-2 px-3 rounded-lg text-sm font-medium ${
              timeFilter === 'afternoon'
                ? 'bg-primary-500 text-white'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            Afternoon
          </button>
          <button
            onClick={() => setTimeFilter('evening')}
            className={`py-2 px-3 rounded-lg text-sm font-medium ${
              timeFilter === 'evening'
                ? 'bg-primary-500 text-white'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            Evening
          </button>
        </div>
      </div>
      
      {/* Medications List */}
      {sortedMedications.length > 0 ? (
        <div className="space-y-4">
          {sortedMedications.map(({ medication, schedule }) => (
            <MedicationCard 
              key={`${medication.id}-${schedule.id}`}
              medication={medication}
              schedule={schedule}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-6 text-center">
          <Clock className="mx-auto text-neutral-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-neutral-800 mb-2">No Medications</h3>
          <p className="text-neutral-500">
            {timeFilter === 'all'
              ? "You don't have any medications scheduled for today."
              : `You don't have any medications scheduled for ${timeFilter}.`}
          </p>
        </div>
      )}
    </div>
  );
};

export default MedicineReminders;