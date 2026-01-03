import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, LogOut, User, Clock, CheckCircle, XCircle, Coffee, DollarSign, FileText, BarChart3 } from 'lucide-react';
import EmployeeAttendance from '../attendance/EmployeeAttendance';
import EmployeeTimeOff from '../leave/EmployeeTimeOff';
import CheckInOut from '../../components/attendance/CheckInOut';
import { getAllUsers } from '../../api/user.api';
import { getAllAttendance } from '../../api/attendance.api';
import { toast } from 'react-toastify';

const EmployeeDashboard = ({ user, onLogout }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    presentToday: 0,
    onLeave: 0,
    absent: 0,
  });
  const navigate = useNavigate();

  const userRole = user?.role || (() => {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData).role : 'EMPLOYEE';
  })();
  const isHRorAdmin = userRole === 'HR' || userRole === 'ADMIN';

  useEffect(() => {
    if (isHRorAdmin && activeTab === 'dashboard') {
      loadEmployees();
      loadStats();
    }
  }, [isHRorAdmin, activeTab]);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const allUsers = await getAllUsers();
      // Filter out current user and get employees with attendance status
      const today = new Date().toISOString().split('T')[0];
      const attendanceData = await getAllAttendance({ month: new Date().getMonth() + 1, year: new Date().getFullYear() });
      
      const employeesWithStatus = allUsers
        .filter(u => u.role === 'EMPLOYEE')
        .map(emp => {
          const todayAttendance = attendanceData.find(a => 
            a.user?._id === emp._id && 
            new Date(a.date).toISOString().split('T')[0] === today
          );
          return {
            id: emp._id,
            name: emp.fullName || `${emp.firstName} ${emp.lastName}`,
            status: todayAttendance ? (todayAttendance.status === 'PRESENT' ? 'present' : 'absent') : 'absent',
            avatar: (emp.fullName || emp.firstName || 'E').charAt(0).toUpperCase(),
            checkIn: todayAttendance?.checkIn ? new Date(todayAttendance.checkIn).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : null,
            email: emp.email,
            role: emp.role,
          };
        });
      setEmployees(employeesWithStatus);
    } catch (error) {
      console.error('Error loading employees:', error);
      toast.error('Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const attendanceData = await getAllAttendance({ month: new Date().getMonth() + 1, year: new Date().getFullYear() });
      const todayRecords = attendanceData.filter(a => new Date(a.date).toISOString().split('T')[0] === today);
      
      setStats({
        presentToday: todayRecords.filter(a => a.status === 'PRESENT').length,
        onLeave: todayRecords.filter(a => a.status === 'ON_LEAVE').length,
        absent: todayRecords.filter(a => a.status === 'ABSENT').length,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

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
                {['dashboard', 'attendance', 'time-off', ...(isHRorAdmin ? ['payroll', 'analytics'] : [])].map((tab) => (
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
                  <span className="text-white font-semibold text-sm">
                    {user?.fullName?.charAt(0) || user?.firstName?.charAt(0) || 'U'}
                  </span>
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-semibold text-gray-900">{user?.fullName || user?.firstName || 'User'}</p>
                  <p className="text-xs text-gray-500">{user?.role || 'Employee'}</p>
                </div>
              </button>

              {/* Dropdown Menu */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <button 
                    onClick={() => {
                      navigate('/profile');
                      setShowProfileMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 flex items-center space-x-2 transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span>My Profile</span>
                  </button>
                  <div className="my-1 border-t border-gray-200"></div>
                  <button 
                    onClick={() => {
                      localStorage.removeItem('token');
                      localStorage.removeItem('user');
                      if (onLogout) onLogout();
                      navigate('/signin');
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2 transition-colors"
                  >
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
        {activeTab === 'attendance' ? (
          <EmployeeAttendance />
        ) : activeTab === 'time-off' ? (
          <EmployeeTimeOff />
        ) : activeTab === 'payroll' ? (
          <div className="text-center py-12">
            <DollarSign className="w-16 h-16 text-indigo-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Payroll Management</h2>
            <p className="text-gray-600 mb-6">Access your payroll information</p>
            <button
              onClick={() => navigate('/payroll')}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
            >
              View Payroll
            </button>
          </div>
        ) : activeTab === 'analytics' ? (
          <div className="text-center py-12">
            <BarChart3 className="w-16 h-16 text-indigo-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Analytics & Reports</h2>
            <p className="text-gray-600 mb-6">View comprehensive reports and analytics</p>
            <button
              onClick={() => navigate('/analytics')}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
            >
              View Analytics
            </button>
          </div>
        ) : activeTab === 'dashboard' ? (
          <>
            {isHRorAdmin ? (
              <>
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
                  
                  <button 
                    onClick={() => navigate('/profile')}
                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center space-x-2"
                  >
                    <span className="text-lg">+</span>
                    <span>Manage Employees</span>
                  </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white rounded-2xl p-6 shadow-md border border-emerald-100 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Present Today</p>
                        <p className="text-3xl font-bold text-emerald-600 mt-1">{stats.presentToday}</p>
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
                        <p className="text-3xl font-bold text-amber-600 mt-1">{stats.onLeave}</p>
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
                        <p className="text-3xl font-bold text-rose-600 mt-1">{stats.absent}</p>
                      </div>
                      <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center">
                        <XCircle className="w-6 h-6 text-rose-600" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Employee Grid */}
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading employees...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {employees
                      .filter(emp => emp.name.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map((employee) => (
                        <div
                          key={employee.id}
                          className={`bg-white rounded-2xl p-6 shadow-md border-2 hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer ${getStatusColor(employee.status)}`}
                          onClick={() => navigate(`/profile?employeeId=${employee.id}`)}
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                                <span className="text-white font-bold text-lg">{employee.avatar}</span>
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900 text-sm">{employee.name}</h3>
                                <p className="text-xs text-gray-500 mt-0.5">{employee.email}</p>
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
                            View Profile →
                          </button>
                        </div>
                      ))}
                  </div>
                )}
              </>
            ) : (
              <>
                {/* Check In/Out Component for Employees */}
                <div className="mb-6">
                  <CheckInOut />
                </div>

                {/* Welcome Section */}
                <div className="bg-white rounded-2xl p-12 shadow-lg text-center mb-6">
                  <User className="w-16 h-16 text-indigo-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to Your Dashboard</h2>
                  <p className="text-gray-600 mb-6">You can manage your attendance, leave requests, and view your payroll information.</p>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <button
                    onClick={() => setActiveTab('attendance')}
                    className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl hover:shadow-lg transition-all"
                  >
                    <Clock className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                    <h3 className="font-semibold text-gray-800">Attendance</h3>
                    <p className="text-sm text-gray-600 mt-2">View your attendance records</p>
                  </button>
                  <button
                    onClick={() => setActiveTab('time-off')}
                    className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl hover:shadow-lg transition-all"
                  >
                    <Coffee className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <h3 className="font-semibold text-gray-800">Time Off</h3>
                    <p className="text-sm text-gray-600 mt-2">Request and manage leaves</p>
                  </button>
                  <button
                    onClick={() => navigate('/payroll')}
                    className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl hover:shadow-lg transition-all"
                  >
                    <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <h3 className="font-semibold text-gray-800">Payroll</h3>
                    <p className="text-sm text-gray-600 mt-2">View your salary information</p>
                  </button>
                </div>
              </>
            )}
          </>
        ) : null}
      </main>
    </div>
  );
};

export default EmployeeDashboard;
