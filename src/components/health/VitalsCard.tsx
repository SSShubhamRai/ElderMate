import React from 'react';
import { 
  Heart, 
  Thermometer, 
  Droplets, 
  Activity, 
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { HealthData } from '../../mocks/healthData';

interface VitalsCardProps {
  data: HealthData | null;
  title: string;
  showDetails?: boolean;
}

const VitalsCard: React.FC<VitalsCardProps> = ({ data, title, showDetails = false }) => {
  if (!data) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-4 animate-pulse flex flex-col h-full">
        <div className="h-4 bg-neutral-200 rounded w-1/2 mb-4"></div>
        <div className="h-8 bg-neutral-200 rounded w-1/3 mb-2"></div>
        <div className="h-4 bg-neutral-200 rounded w-2/3"></div>
      </div>
    );
  }

  // Check for anomalies
  const isHeartRateAbnormal = data.heartRate > 100 || data.heartRate < 50;
  const isBloodPressureAbnormal = data.bloodPressureSystolic > 140 || data.bloodPressureDiastolic > 90;
  const isTemperatureAbnormal = data.temperature > 37.5 || data.temperature < 36;
  const isOxygenAbnormal = data.oxygenLevel < 95;
  
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 border-b border-neutral-100">
        <h3 className="font-medium text-neutral-900">{title}</h3>
      </div>
      
      <div className="p-4 grid grid-cols-2 gap-4">
        {/* Heart Rate */}
        <div className="flex items-start">
          <div className={`p-2 rounded-lg mr-3 ${isHeartRateAbnormal ? 'bg-error-100 text-error-600' : 'bg-primary-100 text-primary-600'}`}>
            <Heart size={20} />
          </div>
          <div>
            <p className="text-sm text-neutral-500">Heart Rate</p>
            <p className={`text-lg font-semibold ${isHeartRateAbnormal ? 'text-error-600' : 'text-neutral-900'}`}>
              {data.heartRate} 
              <span className="text-sm font-normal ml-1">BPM</span>
              {isHeartRateAbnormal && <AlertTriangle size={16} className="inline ml-1" />}
            </p>
          </div>
        </div>
        
        {/* Blood Pressure */}
        <div className="flex items-start">
          <div className={`p-2 rounded-lg mr-3 ${isBloodPressureAbnormal ? 'bg-error-100 text-error-600' : 'bg-secondary-100 text-secondary-600'}`}>
            <Activity size={20} />
          </div>
          <div>
            <p className="text-sm text-neutral-500">Blood Pressure</p>
            <p className={`text-lg font-semibold ${isBloodPressureAbnormal ? 'text-error-600' : 'text-neutral-900'}`}>
              {data.bloodPressureSystolic}/{data.bloodPressureDiastolic}
              <span className="text-sm font-normal ml-1">mmHg</span>
              {isBloodPressureAbnormal && <AlertTriangle size={16} className="inline ml-1" />}
            </p>
          </div>
        </div>
        
        {/* Temperature */}
        <div className="flex items-start">
          <div className={`p-2 rounded-lg mr-3 ${isTemperatureAbnormal ? 'bg-error-100 text-error-600' : 'bg-warning-100 text-warning-600'}`}>
            <Thermometer size={20} />
          </div>
          <div>
            <p className="text-sm text-neutral-500">Temperature</p>
            <p className={`text-lg font-semibold ${isTemperatureAbnormal ? 'text-error-600' : 'text-neutral-900'}`}>
              {data.temperature}
              <span className="text-sm font-normal ml-1">°C</span>
              {isTemperatureAbnormal && <AlertTriangle size={16} className="inline ml-1" />}
            </p>
          </div>
        </div>
        
        {/* Oxygen */}
        <div className="flex items-start">
          <div className={`p-2 rounded-lg mr-3 ${isOxygenAbnormal ? 'bg-error-100 text-error-600' : 'bg-accent-100 text-accent-600'}`}>
            <Droplets size={20} />
          </div>
          <div>
            <p className="text-sm text-neutral-500">Oxygen</p>
            <p className={`text-lg font-semibold ${isOxygenAbnormal ? 'text-error-600' : 'text-neutral-900'}`}>
              {data.oxygenLevel}
              <span className="text-sm font-normal ml-1">%</span>
              {isOxygenAbnormal && <AlertTriangle size={16} className="inline ml-1" />}
            </p>
          </div>
        </div>
        
        {showDetails && (
          <>
            {/* Glucose */}
            <div className="flex items-start">
              <div className="p-2 rounded-lg mr-3 bg-success-100 text-success-600">
                <TrendingUp size={20} />
              </div>
              <div>
                <p className="text-sm text-neutral-500">Glucose</p>
                <p className="text-lg font-semibold text-neutral-900">
                  {data.glucoseLevel}
                  <span className="text-sm font-normal ml-1">mmol/L</span>
                </p>
              </div>
            </div>
            
            {/* Activity Status */}
            <div className="flex items-start">
              <div className="p-2 rounded-lg mr-3 bg-neutral-100 text-neutral-600">
                <Activity size={20} />
              </div>
              <div>
                <p className="text-sm text-neutral-500">Activity</p>
                <p className="text-lg font-semibold text-neutral-900 capitalize">
                  {data.activity}
                </p>
              </div>
            </div>
          </>
        )}
      </div>
      
      <div className="px-4 py-2 bg-neutral-50 text-sm text-neutral-500 flex justify-between items-center">
        <span>Updated: {new Date(data.timestamp).toLocaleTimeString()}</span>
        
        {/* Show fall alert */}
        {data.fallDetected && (
          <span className="text-error-600 font-medium flex items-center">
            <AlertTriangle size={16} className="inline mr-1" />
            Fall detected
          </span>
        )}
      </div>
    </div>
  );
};

export default VitalsCard;