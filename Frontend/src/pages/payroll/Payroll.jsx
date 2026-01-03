import React from 'react';
import EmployeePayroll from './EmployeePayroll';
import AdminPayroll from './AdminPayroll';

const Payroll = ({ user, onLogout }) => {
  // Get user role from localStorage if not provided
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

  const userRole = getUserRole();

  // Render appropriate payroll page based on role
  if (userRole === 'ADMIN' || userRole === 'HR') {
    return <AdminPayroll user={user} onLogout={onLogout} />;
  }

  return <EmployeePayroll user={user} onLogout={onLogout} />;
};

export default Payroll;

