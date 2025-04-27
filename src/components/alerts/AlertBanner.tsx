import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Alert } from '../../mocks/alerts';
import { useAlert } from '../../contexts/AlertContext';

interface AlertBannerProps {
  alerts: Alert[];
}

const AlertBanner: React.FC<AlertBannerProps> = ({ alerts }) => {
  const { dismissAlert } = useAlert();
  
  if (!alerts || alerts.length === 0) return null;

  return (
    <div className="bg-error-500 text-white px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <AlertTriangle className="mr-2" size={20} />
          <div>
            <span className="font-medium">Alert: </span>
            <span>
              {alerts.length === 1 
                ? alerts[0].message 
                : `${alerts.length} active alerts - urgent attention required`}
            </span>
          </div>
        </div>
        <button 
          onClick={() => alerts.forEach(alert => dismissAlert(alert.id))}
          className="text-white hover:text-error-100 focus:outline-none"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

export default AlertBanner;