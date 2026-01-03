<<<<<<< HEAD
import React, { useState } from 'react';
import { Search, LogOut, User, Clock, CheckCircle, XCircle, Coffee } from 'lucide-react';

const EmployeeDashboard = () => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('employees');

  // Sample employee data
  const employees = [
    { id: 1, name: 'Sarah Johnson', status: 'present', avatar: 'SJ', checkIn: '09:00 AM' },
    { id: 2, name: 'Michael Chen', status: 'present', avatar: 'MC', checkIn: '08:45 AM' },
    { id: 3, name: 'Emma Williams', status: 'leave', avatar: 'EW', checkIn: null },
    { id: 4, name: 'James Brown', status: 'present', avatar: 'JB', checkIn: '09:15 AM' },
    { id: 5, name: 'Olivia Davis', status: 'absent', avatar: 'OD', checkIn: null },
    { id: 6, name: 'Robert Miller', status: 'present', avatar: 'RM', checkIn: '08:30 AM' },
    { id: 7, name: 'Sophia Garcia', status: 'present', avatar: 'SG', checkIn: '09:00 AM' },
    { id: 8, name: 'William Wilson', status: 'leave', avatar: 'WW', checkIn: null },
    { id: 9, name: 'Ava Martinez', status: 'present', avatar: 'AM', checkIn: '08:50 AM' },
  ];

  const getStatusIcon = (status) => {
    switch(status) {
      case 'present':
        return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case 'leave':
        return <Coffee className="w-5 h-5 text-amber-500" />;
      case 'absent':
        return <XCircle className="w-5 h-5 text-rose-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'present':
        return 'bg-emerald-100 border-emerald-300';
      case 'leave':
        return 'bg-amber-100 border-amber-300';
      case 'absent':
        return 'bg-rose-100 border-rose-300';
      default:
        return 'bg-gray-100 border-gray-300';
    }
  };

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo and Navigation */}
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">C</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  CompanyHub
                </span>
              </div>
              
              {/* Tabs */}
              <nav className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                {['employees', 'attendance', 'time-off'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      activeTab === tab
                        ? 'bg-white text-indigo-700 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1).replace('-', ' ')}
                  </button>
                ))}
              </nav>
            </div>

            {/* Profile Section */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-3 hover:bg-gray-50 rounded-xl px-3 py-2 transition-all duration-200"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-orange-500 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-white font-semibold text-sm">AD</span>
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-semibold text-gray-900">Admin User</p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
              </button>

              {/* Dropdown Menu */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 flex items-center space-x-2 transition-colors">
                    <User className="w-4 h-4" />
                    <span>My Profile</span>
                  </button>
                  <div className="my-1 border-t border-gray-200"></div>
                  <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2 transition-colors">
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Actions Bar */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search employees..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
              />
            </div>
          </div>
          
          <button className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center space-x-2">
            <span className="text-lg">+</span>
            <span>NEW</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-md border border-emerald-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Present Today</p>
                <p className="text-3xl font-bold text-emerald-600 mt-1">6</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md border border-amber-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">On Leave</p>
                <p className="text-3xl font-bold text-amber-600 mt-1">2</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <Coffee className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md border border-rose-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Absent</p>
                <p className="text-3xl font-bold text-rose-600 mt-1">1</p>
              </div>
              <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center">
                <XCircle className="w-6 h-6 text-rose-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Employee Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmployees.map((employee) => (
            <div
              key={employee.id}
              className={`bg-white rounded-2xl p-6 shadow-md border-2 hover:shadow-xl transition-all duration-300 hover:scale-105 ${getStatusColor(employee.status)}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">{employee.avatar}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">{employee.name}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Employee</p>
                  </div>
                </div>
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-sm">
                  {getStatusIcon(employee.status)}
                </div>
              </div>

              {employee.checkIn && (
                <div className="flex items-center space-x-2 bg-white bg-opacity-70 rounded-lg px-3 py-2">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  <span className="text-sm text-gray-700 font-medium">Since {employee.checkIn}</span>
                </div>
              )}

              {!employee.checkIn && (
                <div className="flex items-center justify-center bg-white bg-opacity-70 rounded-lg px-3 py-2">
                  <span className="text-sm text-gray-600 font-medium capitalize">{employee.status}</span>
                </div>
              )}

              <button className="w-full mt-4 py-2 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 transition-colors shadow-sm">
                Check In →
              </button>
            </div>
          ))}
        </div>
      </main>
=======
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
>>>>>>> d26480e22e855fdb9f1f5c564123b11a65b43538
    </div>
  );
};

<<<<<<< HEAD
export default EmployeeDashboard;
=======
export default EmployeeDashboard;
>>>>>>> d26480e22e855fdb9f1f5c564123b11a65b43538
