import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import ReceptionistDashboard from './pages/ReceptionistDashboard';
import PatientDashboard from './pages/PatientDashboard';
import Chatbot from './components/Chatbot';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/receptionist/*" element={<ReceptionistDashboard />} />
          <Route path="/patient" element={<PatientDashboard />} />
          <Route path="/patient/:id" element={<PatientDashboard />} />
        </Routes>
        <Chatbot />
      </div>
    </Router>
  );
}

export default App;
