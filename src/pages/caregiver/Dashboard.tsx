import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useAlert } from '../../contexts/AlertContext';
import { getEldersByCaregiver } from '../../mocks/users';
import { getUserHealthData, HealthData } from '../../mocks/healthData';
import { AlertTriangle, User, Heart, Activity, ArrowRight, Clock, Bell } from 'lucide-react';
import VitalsCard from '../../components/health/VitalsCard';
import { User as UserType } from '../../mocks/users';

const CaregiverDashboard: React.FC = () => {
  const { user } = useAuth();
  const { alerts } = useAlert();
  const [elders, setElders] = useState<UserType[]>([]);
  const [eldersHealth, setEldersHealth] = useState<Map<string, HealthData>>(new Map());
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (user) {
      // Get assigned elders
      const assignedElders = getEldersByCaregiver(user.id);
      setElders(assignedElders);
      
      // Get latest health data for each elder
      const healthData = new Map<string, HealthData>();
      
      assignedElders.forEach(elder => {
        const elderHealth = getUserHealthData(elder.id);
        if (elderHealth.length > 0) {
          healthData.set(elder.id, elderHealth[elderHealth.length - 1]);
        }
      });
      
      setEldersHealth(healthData);
      setLoading(false);
    }
  }, [user]);
  
  // Get unread alerts
  const unreadAlerts = alerts.filter(alert => !alert.read);
  
  // Get alerts by patient
  const alertsByPatient = new Map<string, number>();
  
  elders.forEach(elder => {
    const elderAlerts = alerts.filter(alert => 
      alert.patientId === elder.id && !alert.read
    );
    
    alertsByPatient.set(elder.id, elderAlerts.length);
  });
  
  // Check if any patient needs attention
  const needsAttention = (elderId: string): boolean => {
    const healthData = eldersHealth.get(elderId);
    if (!healthData) return false;
    
    // Check for anomalies
    const anomalies = [
      healthData.heartRate > 100 || healthData.heartRate < 50,
      healthData.bloodPressureSystolic > 140 || healthData.bloodPressureDiastolic > 90,
      healthData.temperature > 37.5 || healthData.temperature < 36,
      healthData.oxygenLevel < 95,
      healthData.fallDetected
    ];
    
    return anomalies.some(a => a) || (alertsByPatient.get(elderId) || 0) > 0;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-primary-500 text-2xl">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Patients Overview */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
              <div className="flex items-center">
                <User className="text-primary-500 mr-2" size={20} />
                <h2 className="font-medium text-neutral-900">Your Patients</h2>
              </div>
              <Link
                to="/caregiver/patients" 
                className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center"
              >
                View All
                <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>
            
            {elders.length > 0 ? (
              <div className="divide-y divide-neutral-100">
                {elders.map(elder => {
                  const hasAlerts = (alertsByPatient.get(elder.id) || 0) > 0;
                  const needsAttentionFlag = needsAttention(elder.id);
                  
                  return (
                    <div key={elder.id} className="p-4">
                      <div className="flex items-start">
                        {/* Elder Avatar */}
                        <div className="mr-4">
                          {elder.avatar ? (
                            <img 
                              src={elder.avatar} 
                              alt={elder.name} 
                              className="w-16 h-16 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
                              <span className="text-primary-800 font-medium text-lg">
                                {elder.name.substring(0, 1)}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        {/* Elder Info */}
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-medium text-neutral-900">{elder.name}</h3>
                              <p className="text-neutral-500 text-sm">
                                {elder.age && `${elder.age} years old`}
                                {elder.medicalConditions && elder.medicalConditions.length > 0 && 
                                  ` • ${elder.medicalConditions[0]}${elder.medicalConditions.length > 1 ? ' +' + (elder.medicalConditions.length - 1) : ''}`
                                }
                              </p>
                            </div>
                            
                            {/* Alert Status */}
                            {needsAttentionFlag && (
                              <div className="bg-error-100 text-error-800 px-3 py-1 rounded-full text-xs font-medium flex items-center">
                                <AlertTriangle size={14} className="mr-1" />
                                Needs Attention
                              </div>
                            )}
                          </div>
                          
                          {/* Vital Signs */}
                          <div className="mt-3 grid grid-cols-3 gap-2">
                            <div className="bg-neutral-50 rounded p-2">
                              <p className="text-xs text-neutral-500 flex items-center">
                                <Heart size={12} className="mr-1" />
                                Heart Rate
                              </p>
                              <p className={`text-sm font-medium ${
                                eldersHealth.get(elder.id)?.heartRate && 
                                (eldersHealth.get(elder.id)?.heartRate! > 100 || 
                                 eldersHealth.get(elder.id)?.heartRate! < 50)
                                  ? 'text-error-600'
                                  : 'text-neutral-900'
                              }`}>
                                {eldersHealth.get(elder.id)?.heartRate || '–'} BPM
                              </p>
                            </div>
                            <div className="bg-neutral-50 rounded p-2">
                              <p className="text-xs text-neutral-500 flex items-center">
                                <Activity size={12} className="mr-1" />
                                BP
                              </p>
                              <p className={`text-sm font-medium ${
                                eldersHealth.get(elder.id)?.bloodPressureSystolic && 
                                (eldersHealth.get(elder.id)?.bloodPressureSystolic! > 140 || 
                                 eldersHealth.get(elder.id)?.bloodPressureDiastolic! > 90)
                                  ? 'text-error-600'
                                  : 'text-neutral-900'
                              }`}>
                                {eldersHealth.get(elder.id)?.bloodPressureSystolic || '–'}/{eldersHealth.get(elder.id)?.bloodPressureDiastolic || '–'}
                              </p>
                            </div>
                            <div className="bg-neutral-50 rounded p-2">
                              <p className="text-xs text-neutral-500 flex items-center">
                                <Clock size={12} className="mr-1" />
                                Last Update
                              </p>
                              <p className="text-sm font-medium text-neutral-900">
                                {eldersHealth.get(elder.id)?.timestamp 
                                  ? new Date(eldersHealth.get(elder.id)?.timestamp!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                  : '–'
                                }
                              </p>
                            </div>
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="mt-3 flex space-x-2">
                            <Link
                              to={`/caregiver/patients/${elder.id}`}
                              className="flex-1 bg-primary-100 hover:bg-primary-200 text-primary-800 py-2 rounded-lg text-sm font-medium text-center"
                            >
                              View Details
                            </Link>
                            {hasAlerts && (
                              <Link
                                to={`/caregiver/patients/${elder.id}/alerts`}
                                className="flex-1 bg-error-100 hover:bg-error-200 text-error-800 py-2 rounded-lg text-sm font-medium text-center flex items-center justify-center"
                              >
                                <Bell size={16} className="mr-1" />
                                {alertsByPatient.get(elder.id)} Alerts
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-6 text-center">
                <User className="mx-auto text-neutral-400 mb-4" size={48} />
                <h3 className="text-lg font-medium text-neutral-800 mb-2">No Patients Assigned</h3>
                <p className="text-neutral-500">
                  You don't have any patients assigned to you yet.
                </p>
              </div>
            )}
          </div>
          
          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-neutral-100">
              <h2 className="font-medium text-neutral-900">Recent Activity</h2>
            </div>
            
            <div className="p-4">
              <div className="space-y-4">
                {alerts.slice(0, 5).map((alert) => {
                  const patient = elders.find(e => e.id === alert.patientId);
                  
                  return (
                    <div 
                      key={alert.id} 
                      className={`p-3 rounded-lg ${
                        !alert.read ? 'bg-primary-50' : 'bg-neutral-50'
                      }`}
                    >
                      <div className="flex items-start">
                        <div className={`p-2 rounded-full mr-3 ${
                          alert.type === 'emergency' ? 'bg-error-100 text-error-600' :
                          alert.type === 'fall' ? 'bg-error-100 text-error-600' :
                          alert.type === 'medication' ? 'bg-primary-100 text-primary-600' :
                          alert.type === 'anomaly' ? 'bg-warning-100 text-warning-600' :
                          'bg-neutral-100 text-neutral-600'
                        }`}>
                          <AlertTriangle size={16} />
                        </div>
                        <div>
                          <p className="text-neutral-900 font-medium">
                            {alert.message}
                          </p>
                          <div className="flex items-center text-sm text-neutral-500 mt-1">
                            <span>{patient?.name}</span>
                            <span className="mx-1">•</span>
                            <span>
                              {new Date(alert.timestamp).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {alerts.length === 0 && (
                  <div className="p-4 text-center text-neutral-500">
                    No recent activity
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Column */}
        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="bg-white rounded-xl shadow-sm p-4">
            <h2 className="font-medium text-neutral-900 mb-4">Your Dashboard</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-primary-50 rounded-lg p-3 text-center">
                <p className="text-sm text-neutral-500">Patients</p>
                <p className="text-2xl font-semibold text-primary-700">{elders.length}</p>
              </div>
              <div className="bg-warning-50 rounded-lg p-3 text-center">
                <p className="text-sm text-neutral-500">Alerts</p>
                <p className="text-2xl font-semibold text-warning-700">{unreadAlerts.length}</p>
              </div>
              <div className="bg-success-50 rounded-lg p-3 text-center">
                <p className="text-sm text-neutral-500">Medications</p>
                <p className="text-2xl font-semibold text-success-700">24</p>
              </div>
              <div className="bg-error-50 rounded-lg p-3 text-center">
                <p className="text-sm text-neutral-500">Critical</p>
                <p className="text-2xl font-semibold text-error-700">
                  {elders.filter(e => needsAttention(e.id)).length}
                </p>
              </div>
            </div>
          </div>
          
          {/* Current Focus */}
          {elders.length > 0 && elders.some(e => needsAttention(e.id)) && (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-neutral-100">
                <h2 className="font-medium text-neutral-900">Priority Patient</h2>
              </div>
              
              {(() => {
                const priorityElder = elders.find(e => needsAttention(e.id));
                if (!priorityElder) return null;
                
                return (
                  <div className="p-4">
                    <div className="flex items-center mb-4">
                      {priorityElder.avatar ? (
                        <img 
                          src={priorityElder.avatar} 
                          alt={priorityElder.name} 
                          className="w-12 h-12 rounded-full object-cover mr-3"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mr-3">
                          <span className="text-primary-800 font-medium">
                            {priorityElder.name.substring(0, 1)}
                          </span>
                        </div>
                      )}
                      <div>
                        <h3 className="font-medium text-neutral-900">{priorityElder.name}</h3>
                        <p className="text-neutral-500 text-sm">
                          {priorityElder.age && `${priorityElder.age} years old`}
                          {priorityElder.medicalConditions && priorityElder.medicalConditions.length > 0 && 
                            ` • ${priorityElder.medicalConditions[0]}`
                          }
                        </p>
                      </div>
                    </div>
                    
                    <VitalsCard 
                      data={eldersHealth.get(priorityElder.id) || null} 
                      title="Current Status" 
                      showDetails={false}
                    />
                    
                    <div className="mt-4">
                      <Link
                        to={`/caregiver/patients/${priorityElder.id}`}
                        className="btn-primary w-full"
                      >
                        View Patient Details
                      </Link>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
          
          {/* Today's Schedule */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-neutral-100">
              <h2 className="font-medium text-neutral-900">Today's Schedule</h2>
            </div>
            
            <div className="p-4">
              <div className="space-y-3">
                <div className="bg-neutral-50 rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-neutral-900">Team Meeting</p>
                      <p className="text-neutral-500 text-sm">9:00 AM - 10:00 AM</p>
                    </div>
                    <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded text-xs font-medium">
                      Meeting
                    </span>
                  </div>
                </div>
                
                <div className="bg-neutral-50 rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-neutral-900">Martha Johnson</p>
                      <p className="text-neutral-500 text-sm">Doctor's Appointment</p>
                      <p className="text-neutral-500 text-sm">2:00 PM - 3:00 PM</p>
                    </div>
                    <span className="bg-secondary-100 text-secondary-800 px-2 py-1 rounded text-xs font-medium">
                      Appointment
                    </span>
                  </div>
                </div>
                
                <div className="bg-neutral-50 rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-neutral-900">Thomas Wilson</p>
                      <p className="text-neutral-500 text-sm">Medication Review</p>
                      <p className="text-neutral-500 text-sm">4:30 PM - 5:00 PM</p>
                    </div>
                    <span className="bg-accent-100 text-accent-800 px-2 py-1 rounded text-xs font-medium">
                      Follow-up
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaregiverDashboard;