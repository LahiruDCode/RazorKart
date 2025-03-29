import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import AdminDashboard from './components/admin/AdminDashboard';
import ManageUsers from './components/admin/ManageUsers';
import RoleRequests from './components/admin/RoleRequests';
import Profile from './components/admin/Profile';
import { LoadingProvider, useLoading } from './context/LoadingContext';
import PageTransitionLoader from './components/common/PageTransitionLoader';
import './App.css';

// Wrapper for admin routes with loading context
const AdminRoutes = () => {
  const { isLoading } = useLoading();
  
  return (
    <>
      {isLoading && <PageTransitionLoader />}
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/manage-users" element={<ManageUsers />} />
        <Route path="/role-requests" element={<RoleRequests />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin/*" element={
            <LoadingProvider>
              <AdminRoutes />
            </LoadingProvider>
          } />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
