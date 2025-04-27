import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import ElderDashboard from './pages/elder/Dashboard';
import MedicineReminders from './pages/elder/MedicineReminders';
import EmergencyContacts from './pages/elder/EmergencyContacts';
import CaregiverDashboard from './pages/caregiver/Dashboard';
import CaregiverPatients from './pages/caregiver/Patients';
import PatientDetails from './pages/caregiver/PatientDetails';
import PatientMedications from './pages/caregiver/PatientMedications';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

function App() {
  const { user } = useAuth();
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <Routes>
      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Protected Routes */}
      <Route element={<MainLayout />}>
        {/* Elder Routes */}
        <Route path="/" element={<ElderDashboard />} />
        <Route path="/medicine" element={<MedicineReminders />} />
        <Route path="/emergency-contacts" element={<EmergencyContacts />} />
        
        {/* Caregiver Routes */}
        <Route path="/caregiver" element={<CaregiverDashboard />} />
        <Route path="/caregiver/patients" element={<CaregiverPatients />} />
        <Route path="/caregiver/patients/:id" element={<PatientDetails />} />
        <Route path="/caregiver/patients/:id/medications" element={<PatientMedications />} />

        {/* Shared Routes */}
        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;