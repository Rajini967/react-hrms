import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './modules/auth/Login';
import Layout from './components/layout/Layout';
import Dashboard from './modules/dashboard/Dashboard';
import EmployeeList from './modules/employee/EmployeeList';

// Module Imports
import Attendance from './modules/attendance/Attendance';
import Leave from './modules/leave/Leave';
import Payroll from './modules/payroll/Payroll';
import Recruitment from './modules/recruitment/Recruitment';
import PMS from './modules/pms/PMS';
import Projects from './modules/projects/Projects';
import Onboarding from './modules/onboarding/Onboarding';
import Offboarding from './modules/offboarding/Offboarding';
import Assets from './modules/assets/Assets';
import Helpdesk from './modules/helpdesk/Helpdesk';
import Configuration from './modules/configuration/Configuration';
import Settings from './modules/settings/Settings';
import FaceDetection from './modules/facedetection/FaceDetection';
import Geofencing from './modules/geofencing/Geofencing';

// Protected Route Component
const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return user ? <Outlet /> : <Navigate to="/login" />;
};

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastContainer position="top-right" autoClose={3000} />
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/employees" element={<EmployeeList />} />
              <Route path="/attendance" element={<Attendance />} />
              <Route path="/leave" element={<Leave />} />
              <Route path="/payroll" element={<Payroll />} />
              <Route path="/recruitment" element={<Recruitment />} />
              <Route path="/pms" element={<PMS />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/offboarding" element={<Offboarding />} />
              <Route path="/assets" element={<Assets />} />
              <Route path="/helpdesk" element={<Helpdesk />} />
              <Route path="/configuration" element={<Configuration />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/face-recognition" element={<FaceDetection />} />
              <Route path="/geofencing" element={<Geofencing />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
