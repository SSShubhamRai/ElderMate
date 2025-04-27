import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { useAlert } from '../../contexts/AlertContext';
import { useAuth } from '../../contexts/AuthContext';

const EmergencyButton: React.FC = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [countdownActive, setCountdownActive] = useState(false);
  const { triggerAlert } = useAlert();
  const { user } = useAuth();
  
  // Handle emergency button press
  const handleEmergencyPress = () => {
    setDialogOpen(true);
  };
  
  // Handle emergency confirmation
  const confirmEmergency = () => {
    setCountdownActive(true);
    
    // Start countdown
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          triggerAlert(
            'emergency', 
            `Emergency alert triggered by ${user?.name}`,
            user?.id
          );
          setDialogOpen(false);
          setCountdownActive(false);
          setCountdown(5);
          return 5;
        }
        return prev - 1;
      });
    }, 1000);
  };
  
  // Cancel emergency
  const cancelEmergency = () => {
    setDialogOpen(false);
    setCountdownActive(false);
    setCountdown(5);
  };

  return (
    <>
      <button
        onClick={handleEmergencyPress}
        className="bg-error-500 hover:bg-error-600 text-white py-3 px-6 rounded-xl shadow-lg flex items-center justify-center font-bold text-lg transition-all transform hover:scale-105 active:scale-95"
      >
        <AlertTriangle className="mr-2" size={24} />
        Emergency Help
      </button>
      
      {/* Emergency Dialog */}
      {dialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden">
            <div className="bg-error-500 p-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center">
                <AlertTriangle className="mr-2" size={24} />
                Emergency Alert
              </h2>
              <button 
                onClick={cancelEmergency}
                className="text-white hover:text-error-100 focus:outline-none"
                disabled={countdownActive}
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6">
              <p className="text-neutral-800 mb-6">
                This will send an emergency alert to your caregivers and emergency contacts.
              </p>
              
              {countdownActive ? (
                <div className="flex flex-col items-center">
                  <p className="text-neutral-800 mb-2">Sending alert in:</p>
                  <div className="text-4xl font-bold text-error-500 mb-4">
                    {countdown}
                  </div>
                  <button
                    onClick={cancelEmergency}
                    className="bg-neutral-200 hover:bg-neutral-300 text-neutral-800 py-2 px-4 rounded-lg font-medium"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex flex-col space-y-3">
                  <button
                    onClick={confirmEmergency}
                    className="bg-error-500 hover:bg-error-600 text-white py-3 px-6 rounded-lg font-bold text-lg"
                  >
                    Confirm Emergency
                  </button>
                  <button
                    onClick={cancelEmergency}
                    className="bg-neutral-200 hover:bg-neutral-300 text-neutral-800 py-2 px-4 rounded-lg font-medium"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EmergencyButton;