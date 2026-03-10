import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Landingpage from './pages/Landingpage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import RoleSelection from './pages/RoleSelection';
import DriverDashboard from './pages/DriverDashboard';
import ControlRoomDashboard from './pages/ControlRoomDashboard';
import HospitalDashboard from './pages/HospitalDashboard';
import LearnMore from './pages/LearnMore';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Landingpage />} />
          <Route path="/learn-more" element={<LearnMore />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/role-selection" element={<RoleSelection />} />
          <Route path="/driver-dashboard" element={<DriverDashboard />} />
          <Route path="/control-room" element={<ControlRoomDashboard />} />
          <Route path="/hospital-dashboard" element={<HospitalDashboard />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
