import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import { getDashboard } from '../../api/dashboard.api';

const AdminDashboard = ({ user, onLogout }) => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    presentToday: 0,
    onLeave: 0,
    pendingApprovals: 0,
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch dashboard stats from API
    const load = async () => {
      try {
        const data = await getDashboard();
        setStats({
          totalEmployees: data.totalUsers || 0,
          presentToday: data.presentToday || 0,
          onLeave: data.leaveToday || 0,
          pendingApprovals: 0,
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
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
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
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-gray-600 text-sm font-semibold">Total Employees</div>
            <p className="text-4xl font-bold text-indigo-600 mt-2">{stats.totalEmployees}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-gray-600 text-sm font-semibold">Present Today</div>
            <p className="text-4xl font-bold text-green-600 mt-2">{stats.presentToday}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-gray-600 text-sm font-semibold">On Leave</div>
            <p className="text-4xl font-bold text-yellow-600 mt-2">{stats.onLeave}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-gray-600 text-sm font-semibold">Pending Approvals</div>
            <p className="text-4xl font-bold text-orange-600 mt-2">{stats.pendingApprovals}</p>
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
              Manage Attendance
            </Button>
            <Button
              onClick={() => navigate('/leave')}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Review Leave Requests
            </Button>
            <Button
              onClick={() => navigate('/payroll')}
              className="bg-green-600 hover:bg-green-700"
            >
              Manage Payroll
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

export default AdminDashboard;
