import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import DashboardPage from './components/DashboardPage';
import ReportPage from './components/ReportPage';
import NavBar from "./components/NavBar";
import PresensiPage from './components/PresensiPage';

function App() {
  return (
    <Router>
      <div>
        <Navbar /> {/* TEMPAT YANG BENAR */}

        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/reports" element={<ReportPage />} />
          <Route path="/presensi" element={<PresensiPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
