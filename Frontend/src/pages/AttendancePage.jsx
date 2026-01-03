import React from 'react';
import AdminAttendence from './attendance/AdminAttendence';
import EmployeeAttendance from './attendance/EmployeeAttendance';
import useAuth from '../hooks/useAuth';

export default function AttendancePage() {
  const { user } = useAuth();
  // Simple role check: show admin view for non-employee roles
  if (user && (user.role === 'admin' || user.role === 'hr' || user.role === 'manager')) {
    return <AdminAttendence />;
  }
  return <EmployeeAttendance />;
}
