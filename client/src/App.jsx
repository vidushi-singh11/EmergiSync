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
import AmbulanceSetup from './pages/AmbulanceSetup';
import HospitalSetup from './pages/HospitalSetup';

function App() {
  return (
    <Router>
      <Routes>
        {/* Routes with Layout */}
        <Route path="/" element={<Layout><Landingpage /></Layout>} />
        <Route path="/learn-more" element={<Layout><LearnMore /></Layout>} />
        <Route path="/login" element={<Layout><Login /></Layout>} />
        <Route path="/signup" element={<Layout><Signup /></Layout>} />
        <Route path="/role-selection" element={<Layout><RoleSelection /></Layout>} />
        <Route path="/control-room" element={<Layout><ControlRoomDashboard /></Layout>} />
        <Route path="/hospital-dashboard" element={<Layout><HospitalDashboard /></Layout>} />
        
        {/* Routes without Layout */}
        <Route path="/driver-dashboard" element={<DriverDashboard />} />
        <Route path="/ambulance-setup" element={<AmbulanceSetup />} />
        <Route path="/hospital-setup" element={<HospitalSetup />} />
      </Routes>
    </Router>
  );
}

export default App;
