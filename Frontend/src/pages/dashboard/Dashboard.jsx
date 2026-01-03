import React, { useState, useEffect } from 'react';
import EmployeeDashboard from './EmployeeDashboard';
import EmployeeCardsDashboard from '../employee/EmployeeDashboard';

const Dashboard = ({ user, onLogout }) => {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user role from localStorage or user prop
    const getUserRole = () => {
      if (user?.role) return user.role;
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          return parsedUser.role;
        } catch (e) {
          return 'EMPLOYEE';
        }
      }
      return 'EMPLOYEE';
    };

    const role = getUserRole();
    setUserRole(role);
    setLoading(false);
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Render employee cards dashboard for Admin/HR
  if (userRole === 'ADMIN' || userRole === 'HR') {
    return <EmployeeCardsDashboard user={user} onLogout={onLogout} />;
  }

  // Render employee dashboard for regular employees
  return <EmployeeDashboard user={user} onLogout={onLogout} />;
};

export default Dashboard;
