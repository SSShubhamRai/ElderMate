import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getEldersByCaregiver, User } from '../../mocks/users';
import { getUserHealthData, HealthData } from '../../mocks/healthData';
import { useAlert } from '../../contexts/AlertContext';
import { 
  Users, 
  Search, 
  Heart, 
  Activity, 
  PlusCircle,
  Filter,
  AlertTriangle
} from 'lucide-react';

const CaregiverPatients: React.FC = () => {
  const { user } = useAuth();
  const { alerts } = useAlert();
  const [elders, setElders] = useState<User[]>([]);
  const [eldersHealth, setEldersHealth] = useState<Map<string, HealthData>>(new Map());
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'critical' | 'stable'>('all');
  
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
  
  // Filter and search elders
  const filteredElders = elders.filter(elder => {
    // Apply status filter
    if (filterStatus === 'critical' && !needsAttention(elder.id)) {
      return false;
    }
    
    if (filterStatus === 'stable' && needsAttention(elder.id)) {
      return false;
    }
    
    // Apply search
    if (searchTerm) {
      return elder.name.toLowerCase().includes(searchTerm.toLowerCase());
    }
    
    return true;
  });

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
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Users className="text-primary-500 mr-3" size={24} />
          <h1 className="text-2xl font-bold text-neutral-900">Your Patients</h1>
        </div>
        
        <button className="bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded-lg flex items-center text-sm font-medium">
          <PlusCircle size={16} className="mr-1" />
          Add Patient
        </button>
      </div>
      
      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="text-neutral-500" size={18} />
            </div>
            <input
              type="text"
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>
          
          {/* Filters */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center text-sm text-neutral-500">
              <Filter size={16} className="mr-1" />
              Status:
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-3 py-1 rounded-lg text-sm font-medium ${
                  filterStatus === 'all'
                    ? 'bg-primary-500 text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterStatus('critical')}
                className={`px-3 py-1 rounded-lg text-sm font-medium ${
                  filterStatus === 'critical'
                    ? 'bg-error-500 text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                Critical
              </button>
              <button
                onClick={() => setFilterStatus('stable')}
                className={`px-3 py-1 rounded-lg text-sm font-medium ${
                  filterStatus === 'stable'
                    ? 'bg-success-500 text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                Stable
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Patients List */}
      {filteredElders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredElders.map(elder => {
            const hasAlerts = (alertsByPatient.get(elder.id) || 0) > 0;
            const needsAttentionFlag = needsAttention(elder.id);
            
            return (
              <Link 
                key={elder.id} 
                to={`/caregiver/patients/${elder.id}`}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-4">
                  <div className="flex items-center">
                    {/* Elder Avatar */}
                    <div className="mr-3">
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
                    <div>
                      <h3 className="font-medium text-neutral-900">{elder.name}</h3>
                      <p className="text-neutral-500 text-sm">
                        {elder.age && `${elder.age} years old`}
                      </p>
                      
                      {/* Status Badge */}
                      {needsAttentionFlag ? (
                        <div className="mt-1 bg-error-100 text-error-800 px-2 py-0.5 rounded text-xs font-medium inline-flex items-center">
                          <AlertTriangle size={12} className="mr-1" />
                          Needs Attention
                        </div>
                      ) : (
                        <div className="mt-1 bg-success-100 text-success-800 px-2 py-0.5 rounded text-xs font-medium inline-flex items-center">
                          Stable
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Medical Conditions */}
                  {elder.medicalConditions && elder.medicalConditions.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs text-neutral-500 mb-1">Medical Conditions:</p>
                      <div className="flex flex-wrap gap-1">
                        {elder.medicalConditions.map((condition, index) => (
                          <span 
                            key={index}
                            className="bg-neutral-100 text-neutral-800 px-2 py-0.5 rounded text-xs"
                          >
                            {condition}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Vital Signs */}
                  <div className="mt-3 grid grid-cols-2 gap-2">
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
                        Blood Pressure
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
                  </div>
                  
                  {/* Alert Count */}
                  {hasAlerts && (
                    <div className="mt-3 flex justify-end">
                      <div className="bg-error-100 text-error-800 px-2 py-1 rounded text-xs font-medium flex items-center">
                        <AlertTriangle size={12} className="mr-1" />
                        {alertsByPatient.get(elder.id)} unread alerts
                      </div>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-6 text-center">
          <Users className="mx-auto text-neutral-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-neutral-800 mb-2">
            {searchTerm 
              ? 'No patients match your search'
              : filterStatus !== 'all'
                ? `No patients with status: ${filterStatus}`
                : 'No patients found'
            }
          </h3>
          <p className="text-neutral-500 mb-4">
            {searchTerm 
              ? 'Try a different search term'
              : filterStatus !== 'all'
                ? 'Try a different filter'
                : 'You don\'t have any patients assigned to you yet.'
            }
          </p>
          
          {(searchTerm || filterStatus !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterStatus('all');
              }}
              className="bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded-lg text-sm font-medium"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CaregiverPatients;