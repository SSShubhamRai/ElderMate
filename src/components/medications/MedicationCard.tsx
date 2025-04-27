import React, { useState } from 'react';
import { Pill, Clock, Check, X, AlertTriangle } from 'lucide-react';
import { Medication, MedicationSchedule, recordMedicationEvent } from '../../mocks/medications';
import { useAlert } from '../../contexts/AlertContext';

interface MedicationCardProps {
  medication: Medication;
  schedule?: MedicationSchedule;
  showActions?: boolean;
}

const MedicationCard: React.FC<MedicationCardProps> = ({ 
  medication, 
  schedule,
  showActions = true 
}) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [notes, setNotes] = useState('');
  const { triggerAlert } = useAlert();
  
  // Format time
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    return `${hours}:${minutes}`;
  };
  
  // Check if medication is due soon or overdue
  const isOverdue = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const scheduledTime = new Date();
    scheduledTime.setHours(hours, minutes, 0, 0);
    
    return scheduledTime < new Date() && !schedule?.taken;
  };
  
  // Get time until next dose
  const getTimeUntil = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const scheduledTime = new Date();
    scheduledTime.setHours(hours, minutes, 0, 0);
    
    // If the scheduled time is earlier today, move to tomorrow
    if (scheduledTime < new Date()) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }
    
    const diffMs = scheduledTime.getTime() - new Date().getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHrs > 0) {
      return `${diffHrs}h ${diffMins}m`;
    }
    return `${diffMins}m`;
  };
  
  // Mark medication as taken
  const markAsTaken = () => {
    if (!schedule) return;
    
    recordMedicationEvent(
      medication.id,
      schedule.id,
      medication.patientId,
      true,
      false,
      notes
    );
    
    triggerAlert(
      'medication',
      `Medication taken: ${medication.name}`,
      medication.patientId
    );
    
    setConfirmOpen(false);
    setNotes('');
  };
  
  // Mark medication as skipped
  const markAsSkipped = () => {
    if (!schedule) return;
    
    recordMedicationEvent(
      medication.id,
      schedule.id,
      medication.patientId,
      false,
      true,
      notes
    );
    
    triggerAlert(
      'medication',
      `Medication skipped: ${medication.name}`,
      medication.patientId
    );
    
    setConfirmOpen(false);
    setNotes('');
  };

  return (
    <>
      <div className={`bg-white rounded-xl shadow-sm overflow-hidden border-l-4 ${
        medication.priority === 'high' ? 'border-error-500' :
        medication.priority === 'medium' ? 'border-warning-500' :
        'border-secondary-500'
      }`}>
        <div className="p-4">
          <div className="flex items-start">
            {/* Medication Image */}
            <div className="mr-3">
              {medication.imageUrl ? (
                <img 
                  src={medication.imageUrl} 
                  alt={medication.name} 
                  className="w-12 h-12 rounded-lg object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center">
                  <Pill className="text-primary-500" size={24} />
                </div>
              )}
            </div>
            
            {/* Medication Info */}
            <div className="flex-1">
              <h3 className="font-medium text-lg text-neutral-900">{medication.name}</h3>
              <p className="text-neutral-600">{medication.dosage} - {medication.instructions}</p>
              
              {schedule && (
                <div className="mt-2 flex items-center">
                  <Clock size={16} className="text-neutral-500 mr-1" />
                  <span className={`text-sm ${
                    isOverdue(schedule.time) ? 'text-error-600 font-medium' : 'text-neutral-500'
                  }`}>
                    {formatTime(schedule.time)}
                    {isOverdue(schedule.time) && (
                      <span className="ml-2 flex items-center">
                        <AlertTriangle size={14} className="mr-1" />
                        Overdue
                      </span>
                    )}
                    {!isOverdue(schedule.time) && !schedule.taken && (
                      <span className="ml-2 text-neutral-500">
                        (in {getTimeUntil(schedule.time)})
                      </span>
                    )}
                  </span>
                </div>
              )}
            </div>
            
            {/* Status */}
            {schedule && schedule.taken && schedule.lastTaken && (
              <div className="bg-success-100 text-success-800 px-3 py-1 rounded-full text-xs font-medium flex items-center">
                <Check size={14} className="mr-1" />
                Taken
              </div>
            )}
          </div>
          
          {/* Action Buttons */}
          {showActions && schedule && !schedule.taken && (
            <div className="mt-3 flex space-x-2">
              <button
                onClick={() => setConfirmOpen(true)}
                className="flex-1 bg-primary-100 hover:bg-primary-200 text-primary-800 py-2 rounded-lg text-sm font-medium flex items-center justify-center"
              >
                <Check size={16} className="mr-1" />
                Take Now
              </button>
              <button
                onClick={markAsSkipped}
                className="flex-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 py-2 rounded-lg text-sm font-medium flex items-center justify-center"
              >
                <X size={16} className="mr-1" />
                Skip
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Confirmation Dialog */}
      {confirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-bold text-neutral-900 mb-4">
                Confirm Medication
              </h2>
              
              <div className="flex items-center mb-4">
                <div className="mr-3">
                  {medication.imageUrl ? (
                    <img 
                      src={medication.imageUrl} 
                      alt={medication.name} 
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center">
                      <Pill className="text-primary-500" size={24} />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-neutral-900">{medication.name}</h3>
                  <p className="text-neutral-600">{medication.dosage}</p>
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="notes" className="block text-sm font-medium text-neutral-700 mb-1">
                  Notes (optional)
                </label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any side effects or remarks?"
                  className="w-full border border-neutral-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows={3}
                ></textarea>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={markAsTaken}
                  className="flex-1 bg-primary-500 hover:bg-primary-600 text-white py-2 rounded-lg font-medium"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setConfirmOpen(false)}
                  className="flex-1 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 py-2 rounded-lg font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MedicationCard;