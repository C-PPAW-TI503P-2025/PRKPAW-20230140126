import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"; 

import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import DashboardPage from "./components/DashboardPage";
import ReportPage from "./components/ReportPage";
import PresensiPage from "./components/PresensiPage";
import NavBar from "./components/NavBar"; 

function App() {
  const isLoggedIn = localStorage.getItem("token");

  return (
    <Router>
      <NavBar /> 
      <Routes>
        <Route
          path="/"
          element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <LoginPage />}
        />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/reports" element={<ReportPage />} />
        <Route path="/presensi" element={<PresensiPage />} />
      </Routes>
    </Router>
  );
}

export default App;