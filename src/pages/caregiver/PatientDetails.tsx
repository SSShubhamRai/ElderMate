import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getUser, User } from '../../mocks/users';
import { getUserHealthData, HealthData } from '../../mocks/healthData';
import { getPatientMedications } from '../../mocks/medications';
import { useAlert } from '../../contexts/AlertContext';
import {
  User as UserIcon,
  Heart,
  ChevronLeft,
  Activity,
  Thermometer,
  Clock,
  Pill,
  AlertTriangle,
  PhoneCall,
  MessageSquare,
  Share2
} from 'lucide-react';
import VitalsCard from '../../components/health/VitalsCard';
import HealthChart from '../../components/health/HealthChart';
import MedicationCard from '../../components/medications/MedicationCard';

const PatientDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<User | null>(null);
  const [healthData, setHealthData] = useState<HealthData[]>([]);
  const [currentStatus, setCurrentStatus] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);
  const { alerts } = useAlert();
  
  useEffect(() => {
    if (id) {
      // Get patient details
      const patientData = getUser(id);
      if (patientData) {
        setPatient(patientData);
        
        // Get health data
        const health = getUserHealthData(id);
        setHealthData(health);
        
        if (health.length > 0) {
          setCurrentStatus(health[health.length - 1]);
        }
      }
      
      setLoading(false);
    }
  }, [id]);
  
  // Get patient alerts
  const patientAlerts = alerts.filter(alert => alert.patientId === id);
  const unreadAlerts = patientAlerts.filter(alert => !alert.read);
  
  // Get patient medications
  const medications = getPatientMedications(id || '');
  const upcomingMedication = medications.find(med => 
    med.schedule.some(schedule => !schedule.taken)
  );
  
  const upcomingSchedule = upcomingMedication?.schedule.find(schedule => !schedule.taken);
  
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
          <UserIcon className="mx-auto text-neutral-400 mb-4" size={48} />
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
    <div className="max-w-6xl mx-auto">
      {/* Back Link */}
      <div className="mb-4">
        <Link
          to="/caregiver/patients"
          className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center"
        >
          <ChevronLeft size={18} className="mr-1" />
          Back to All Patients
        </Link>
      </div>
      
      {/* Patient Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center">
            {patient.avatar ? (
              <img 
                src={patient.avatar} 
                alt={patient.name} 
                className="w-20 h-20 rounded-full object-cover mr-4"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center mr-4">
                <span className="text-primary-800 font-bold text-2xl">
                  {patient.name.substring(0, 1)}
                </span>
              </div>
            )}
            
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">{patient.name}</h1>
              <p className="text-neutral-500">
                {patient.age && `${patient.age} years old`}
                {patient.medicalConditions && patient.medicalConditions.length > 0 && 
                  ` • ${patient.medicalConditions.join(', ')}`
                }
              </p>
              
              {unreadAlerts.length > 0 && (
                <div className="mt-2 bg-error-100 text-error-800 px-3 py-1 rounded-full text-sm font-medium inline-flex items-center">
                  <AlertTriangle size={16} className="mr-1" />
                  {unreadAlerts.length} unread alert{unreadAlerts.length !== 1 ? 's' : ''}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button className="btn-outline flex items-center">
              <PhoneCall size={16} className="mr-1" />
              Call
            </button>
            <button className="btn-outline flex items-center">
              <MessageSquare size={16} className="mr-1" />
              Message
            </button>
            <button className="btn-outline flex items-center">
              <Share2 size={16} className="mr-1" />
              Share
            </button>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Health Data */}
        <div className="lg:col-span-2 space-y-6">
          {/* Current Vitals */}
          <VitalsCard data={currentStatus} title="Current Health Status" showDetails={true} />
          
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <HealthChart 
              data={healthData} 
              metric="temperature" 
              title="Temperature" 
              color="#FF8C42"
              rangeMin={35.5}
              rangeMax={38}
            />
            <HealthChart 
              data={healthData} 
              metric="oxygenLevel" 
              title="Oxygen Saturation" 
              color="#04B14A"
              rangeMin={90}
              rangeMax={100}
            />
          </div>
          
          {/* Activity Summary */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-neutral-100 flex items-center">
              <Activity size={20} className="text-primary-500 mr-2" />
              <h3 className="font-medium text-neutral-900">Activity Summary</h3>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-neutral-50 rounded-lg p-3 text-center">
                  <p className="text-sm text-neutral-500">Steps Today</p>
                  <p className="text-2xl font-semibold text-primary-700">2,841</p>
                </div>
                <div className="bg-neutral-50 rounded-lg p-3 text-center">
                  <p className="text-sm text-neutral-500">Active Hours</p>
                  <p className="text-2xl font-semibold text-primary-700">2.1</p>
                </div>
                <div className="bg-neutral-50 rounded-lg p-3 text-center">
                  <p className="text-sm text-neutral-500">Calories</p>
                  <p className="text-2xl font-semibold text-primary-700">1,120</p>
                </div>
                <div className="bg-neutral-50 rounded-lg p-3 text-center">
                  <p className="text-sm text-neutral-500">Sleep</p>
                  <p className="text-2xl font-semibold text-primary-700">6.8h</p>
                </div>
              </div>
              
              <div className="mt-4">
                <p className="text-neutral-700">
                  {patient.name} has been {currentStatus?.activity || 'active'} for the last hour. 
                  {currentStatus?.fallDetected 
                    ? ' A fall was detected recently.' 
                    : ' No falls detected in the last 24 hours.'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Column - Quick Actions, Medications, Alerts, Contacts */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-neutral-100">
              <h3 className="font-medium text-neutral-900">Quick Actions</h3>
            </div>
            <div className="p-4 space-y-3">
              <Link
                to={`/caregiver/patients/${patient.id}/medications`}
                className="bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded-lg text-sm font-medium w-full flex items-center justify-center"
              >
                <Pill size={16} className="mr-1" />
                Manage Medications
              </Link>
              
              <button className="bg-secondary-500 hover:bg-secondary-600 text-white py-2 px-4 rounded-lg text-sm font-medium w-full flex items-center justify-center">
                <Activity size={16} className="mr-1" />
                View Detailed Reports
              </button>
              
              <button className="bg-accent-500 hover:bg-accent-600 text-white py-2 px-4 rounded-lg text-sm font-medium w-full flex items-center justify-center">
                <Clock size={16} className="mr-1" />
                Schedule Appointment
              </button>
            </div>
          </div>
          
          {/* Upcoming Medication */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
              <div className="flex items-center">
                <Pill size={20} className="text-primary-500 mr-2" />
                <h3 className="font-medium text-neutral-900">Upcoming Medication</h3>
              </div>
              <Link
                to={`/caregiver/patients/${patient.id}/medications`}
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                View All
              </Link>
            </div>
            
            <div className="p-4">
              {upcomingMedication && upcomingSchedule ? (
                <MedicationCard 
                  medication={upcomingMedication} 
                  schedule={upcomingSchedule}
                  showActions={false}
                />
              ) : (
                <div className="bg-neutral-50 rounded-lg p-4 text-center">
                  <p className="text-neutral-500">No upcoming medications</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Recent Alerts */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
              <div className="flex items-center">
                <AlertTriangle size={20} className="text-primary-500 mr-2" />
                <h3 className="font-medium text-neutral-900">Recent Alerts</h3>
              </div>
              <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                View All
              </button>
            </div>
            
            <div className="p-4">
              {patientAlerts.length > 0 ? (
                <div className="space-y-3">
                  {patientAlerts.slice(0, 3).map(alert => (
                    <div 
                      key={alert.id} 
                      className={`p-3 rounded-lg ${
                        !alert.read ? 'bg-primary-50' : 'bg-neutral-50'
                      }`}
                    >
                      <div className="flex items-start">
                        <div className={`p-1.5 rounded-full mr-2 ${
                          alert.type === 'emergency' ? 'bg-error-100 text-error-600' :
                          alert.type === 'fall' ? 'bg-error-100 text-error-600' :
                          alert.type === 'medication' ? 'bg-primary-100 text-primary-600' :
                          alert.type === 'anomaly' ? 'bg-warning-100 text-warning-600' :
                          'bg-neutral-100 text-neutral-600'
                        }`}>
                          <AlertTriangle size={14} />
                        </div>
                        <div>
                          <p className={`text-sm font-medium ${!alert.read ? 'text-neutral-900' : 'text-neutral-700'}`}>
                            {alert.message}
                          </p>
                          <p className="text-xs text-neutral-500 mt-0.5">
                            {new Date(alert.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-neutral-50 rounded-lg p-4 text-center">
                  <p className="text-neutral-500">No alerts in the past 24 hours</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Emergency Contacts */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-neutral-100 flex items-center">
              <PhoneCall size={20} className="text-primary-500 mr-2" />
              <h3 className="font-medium text-neutral-900">Emergency Contacts</h3>
            </div>
            
            <div className="p-4">
              {patient.emergencyContacts && patient.emergencyContacts.length > 0 ? (
                <div className="space-y-3">
                  {patient.emergencyContacts.map(contact => (
                    <div key={contact.id} className="bg-neutral-50 rounded-lg p-3">
                      <p className="font-medium text-neutral-900">{contact.name}</p>
                      <p className="text-neutral-500 text-sm">{contact.relationship}</p>
                      <a 
                        href={`tel:${contact.phone}`}
                        className="text-primary-600 hover:text-primary-700 text-sm mt-1 inline-flex items-center"
                      >
                        <PhoneCall size={14} className="mr-1" />
                        {contact.phone}
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-neutral-50 rounded-lg p-4 text-center">
                  <p className="text-neutral-500">No emergency contacts</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDetails;