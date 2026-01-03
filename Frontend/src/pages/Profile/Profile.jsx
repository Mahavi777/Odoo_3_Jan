import React from 'react';
import EmployeeProfile from './EmployeeProfile';
import AdminProfile from './AdminProfile';

const Profile = ({ user, onLogout }) => {
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

  // Render appropriate profile based on role
  if (userRole === 'ADMIN' || userRole === 'HR') {
    return <AdminProfile user={user} onLogout={onLogout} />;
  }

  return <EmployeeProfile user={user} onLogout={onLogout} />;
};

export default Profile;
