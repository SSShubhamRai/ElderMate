import React from 'react';
import { useHealth } from '../../contexts/HealthContext';
import VitalsCard from '../../components/health/VitalsCard';
import HealthChart from '../../components/health/HealthChart';
import EmergencyButton from '../../components/emergency/EmergencyButton';
import { getPatientMedications } from '../../mocks/medications';
import MedicationCard from '../../components/medications/MedicationCard';
import { Activity, Calendar, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { healthData, currentStatus } = useHealth();
  const { user } = useAuth();
  
  // Get today's medications
  const medications = getPatientMedications(user?.id || '');
  const todayMedications = medications.filter(med => {
    const today = new Date().getDay();
    const daysMap: Record<string, number> = {
      'sun': 0, 'mon': 1, 'tue': 2, 'wed': 3, 'thu': 4, 'fri': 5, 'sat': 6
    };
    
    // Check if any schedule is for today
    return med.schedule.some(schedule => 
      schedule.days.some(day => daysMap[day] === today)
    );
  });
  
  // Get upcoming medication
  const upcomingMedication = todayMedications.find(med => 
    med.schedule.some(schedule => !schedule.taken)
  );
  
  const upcomingSchedule = upcomingMedication?.schedule.find(schedule => !schedule.taken);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Vitals and Emergency */}
        <div className="lg:col-span-2 space-y-6">
          {/* Vitals Card */}
          <VitalsCard data={currentStatus} title="Current Health Status" />
          
          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <HealthChart 
              data={healthData} 
              metric="heartRate" 
              title="Heart Rate" 
              color="#0077B6"
              rangeMin={40}
              rangeMax={120}
            />
            <HealthChart 
              data={healthData} 
              metric="bloodPressureSystolic" 
              title="Blood Pressure" 
              color="#20B2AA"
              rangeMin={90}
              rangeMax={160}
            />
          </div>
          
          {/* Activity Summary */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-neutral-100 flex items-center">
              <Activity size={20} className="text-primary-500 mr-2" />
              <h3 className="font-medium text-neutral-900">Today's Activity</h3>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-neutral-50 rounded-lg p-3 text-center">
                  <p className="text-sm text-neutral-500">Steps</p>
                  <p className="text-2xl font-semibold text-primary-700">3,421</p>
                </div>
                <div className="bg-neutral-50 rounded-lg p-3 text-center">
                  <p className="text-sm text-neutral-500">Active Hours</p>
                  <p className="text-2xl font-semibold text-primary-700">2.5</p>
                </div>
                <div className="bg-neutral-50 rounded-lg p-3 text-center">
                  <p className="text-sm text-neutral-500">Calories</p>
                  <p className="text-2xl font-semibold text-primary-700">1,250</p>
                </div>
                <div className="bg-neutral-50 rounded-lg p-3 text-center">
                  <p className="text-sm text-neutral-500">Sleep</p>
                  <p className="text-2xl font-semibold text-primary-700">7.2h</p>
                </div>
              </div>
              
              <div className="mt-4">
                <p className="text-neutral-700">
                  You've been {currentStatus?.activity || 'active'} for the last hour. 
                  Your vitals are {currentStatus?.fallDetected ? 'concerning' : 'stable'}.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Column - Emergency, Medications, Reminders */}
        <div className="space-y-6">
          {/* Emergency Button */}
          <div className="bg-white rounded-xl shadow-sm p-4">
            <h3 className="font-medium text-neutral-900 mb-4">Emergency Help</h3>
            <EmergencyButton />
          </div>
          
          {/* Upcoming Medication */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-neutral-100 flex items-center">
              <Calendar size={20} className="text-primary-500 mr-2" />
              <h3 className="font-medium text-neutral-900">Upcoming Medication</h3>
            </div>
            
            <div className="p-4">
              {upcomingMedication && upcomingSchedule ? (
                <MedicationCard 
                  medication={upcomingMedication} 
                  schedule={upcomingSchedule}
                  showActions={true}
                />
              ) : (
                <div className="bg-neutral-50 rounded-lg p-4 text-center">
                  <p className="text-neutral-500">No upcoming medications</p>
                </div>
              )}
              
              {todayMedications.length > 0 && (
                <div className="mt-4 text-center">
                  <a 
                    href="/medicine"
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    View All {todayMedications.length} Medications
                  </a>
                </div>
              )}
            </div>
          </div>
          
          {/* Today's Reminders */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-neutral-100 flex items-center">
              <AlertCircle size={20} className="text-primary-500 mr-2" />
              <h3 className="font-medium text-neutral-900">Today's Reminders</h3>
            </div>
            
            <div className="p-4">
              <div className="space-y-3">
                <div className="bg-neutral-50 rounded-lg p-3 flex items-center">
                  <div className="w-2 h-2 rounded-full bg-primary-500 mr-3"></div>
                  <p className="text-neutral-700">Doctor's appointment at 2:00 PM</p>
                </div>
                <div className="bg-neutral-50 rounded-lg p-3 flex items-center">
                  <div className="w-2 h-2 rounded-full bg-accent-500 mr-3"></div>
                  <p className="text-neutral-700">Call daughter Susan at 5:00 PM</p>
                </div>
                <div className="bg-neutral-50 rounded-lg p-3 flex items-center">
                  <div className="w-2 h-2 rounded-full bg-secondary-500 mr-3"></div>
                  <p className="text-neutral-700">Take evening blood pressure reading</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;