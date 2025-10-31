import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import DriverPage from './pages/DriverPage';
import StudentPage from './pages/StudentPage';
import AdminPage from './pages/AdminPage';
import DriverDashboard from './pages/DriverDashboard';
import StudentMap from './pages/StudentMap';


export default function App() {
  return (
    <BrowserRouter>
      <div className="topbar">
        <Link to="/">Student</Link> | <Link to="/driver">Driver</Link> | <Link to="/admin">Admin</Link>
      </div>
      <Routes>
        <Route path="/" element={<StudentPage />} />
        <Route path="/driver" element={<DriverPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  );
}
