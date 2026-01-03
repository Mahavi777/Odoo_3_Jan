import React, { useState, useEffect } from 'react';
import AdminDashboard from './AdminDashboard';
import EmployeeDashboard from './EmployeeDashboard';

const Dashboard = ({ user, onLogout }) => {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user role from localStorage or user prop
    if (user) {
      setUserRole(user.role);
    } else {
      const userData = localStorage.getItem('user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUserRole(parsedUser.role);
      }
    }
    setLoading(false);
  }, [user]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  // Render admin or employee dashboard based on role
  if (userRole === 'ADMIN' || userRole === 'HR') {
    return <AdminDashboard user={user} onLogout={onLogout} />;
  }

  return <EmployeeDashboard user={user} onLogout={onLogout} />;
};

export default Dashboard;
