import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ParticipantDashboard from './pages/ParticipantDashboard';
import MentorDashboard from './pages/MentorDashboard';
import AdminDashboard from "./pages/AdminDashboard";
import HomePage from './pages/HomePage';
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<ParticipantDashboard />} />
        <Route path="/mentor" element={<MentorDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

      </Routes>
    </Router>
  );
}

export default App;
