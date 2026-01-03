import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import { getDashboard } from '../../api/dashboard.api';

const EmployeeDashboard = ({ user, onLogout }) => {
  const [stats, setStats] = useState({
    presentDays: 0,
    absentDays: 0,
    leavesBalance: 0,
    upcomingLeaves: 0,
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch employee dashboard stats from API
    const load = async () => {
      try {
        const data = await getDashboard();
        setStats({
          presentDays: data.presentToday || 0,
          absentDays: data.absentToday || 0,
          leavesBalance: data.leaveToday || 0,
          upcomingLeaves: data.recentActivities ? data.recentActivities.length : 0,
        });
      } catch (err) {
        console.error('Failed to load dashboard', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    onLogout();
    navigate('/signin');
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Employee Dashboard</h1>
          <Button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Welcome Message */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-indigo-900">
            Welcome, {user?.firstName || 'Employee'}!
          </h2>
          <p className="text-indigo-700 mt-2">Here's your attendance and leave summary</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-gray-600 text-sm font-semibold">Present Days</div>
            <p className="text-4xl font-bold text-green-600 mt-2">{stats.presentDays}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-gray-600 text-sm font-semibold">Absent Days</div>
            <p className="text-4xl font-bold text-red-600 mt-2">{stats.absentDays}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-gray-600 text-sm font-semibold">Leave Balance</div>
            <p className="text-4xl font-bold text-blue-600 mt-2">{stats.leavesBalance}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-gray-600 text-sm font-semibold">Upcoming Leaves</div>
            <p className="text-4xl font-bold text-yellow-600 mt-2">{stats.upcomingLeaves}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button
              onClick={() => navigate('/attendance')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              View Attendance
            </Button>
            <Button
              onClick={() => navigate('/leave')}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Request Leave
            </Button>
            <Button
              onClick={() => navigate('/payroll')}
              className="bg-green-600 hover:bg-green-700"
            >
              View Payroll
            </Button>
            <Button
              onClick={() => navigate('/profile')}
              className="bg-gray-600 hover:bg-gray-700"
            >
              View Profile
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
