<<<<<<< HEAD
import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, ChevronDown, LogOut, User, Calendar, Clock, TrendingUp, CheckCircle, XCircle, Coffee } from 'lucide-react';

const EmployeeAttendanceView = () => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [activeTab, setActiveTab] = useState('attendance');
  const [selectedMonth, setSelectedMonth] = useState('October');
  const [selectedYear, setSelectedYear] = useState('2025');

  // Sample attendance data for the logged-in employee
  const attendanceRecords = [
    {
      date: '28/10/2025',
      checkIn: '10:00',
      checkOut: '19:00',
      workHours: '09:00',
      extraHours: '01:00',
      status: 'present'
    },
    {
      date: '29/10/2025',
      checkIn: '10:00',
      checkOut: '19:00',
      workHours: '09:00',
      extraHours: '01:00',
      status: 'present'
    },
    {
      date: '30/10/2025',
      checkIn: '09:45',
      checkOut: '18:30',
      workHours: '08:45',
      extraHours: '00:45',
      status: 'present'
    },
    {
      date: '31/10/2025',
      checkIn: '10:15',
      checkOut: '18:00',
      workHours: '07:45',
      extraHours: '00:00',
      status: 'present'
    },
    {
      date: '01/11/2025',
      checkIn: '-',
      checkOut: '-',
      workHours: '-',
      extraHours: '-',
      status: 'leave'
    },
    {
      date: '02/11/2025',
      checkIn: '10:00',
      checkOut: '18:00',
      workHours: '08:00',
      extraHours: '00:00',
      status: 'present'
    },
  ];

  // Calculate statistics
  const daysPresent = attendanceRecords.filter(r => r.status === 'present').length;
  const leavesCount = attendanceRecords.filter(r => r.status === 'leave').length;
  const totalWorkingDays = attendanceRecords.length;

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
                  <span className="text-white font-semibold text-sm">JD</span>
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-semibold text-gray-900">John Doe</p>
                  <p className="text-xs text-gray-500">Employee</p>
                </div>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
                  <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>My Profile</span>
                  </button>
                  <div className="my-1 border-t border-gray-200"></div>
                  <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2">
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
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Attendance</h1>
          <p className="text-gray-600 mt-1">View your daily attendance records and work hours</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-md border border-emerald-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Count of Days Present</p>
                <p className="text-3xl font-bold text-emerald-600 mt-1">{daysPresent}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md border border-amber-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Leaves Count</p>
                <p className="text-3xl font-bold text-amber-600 mt-1">{leavesCount}</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <Coffee className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md border border-indigo-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Working Days</p>
                <p className="text-3xl font-bold text-indigo-600 mt-1">{totalWorkingDays}</p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-indigo-600" />
              </div>
=======
import React, { useState, useEffect } from 'react';
import { checkIn as apiCheckIn, checkOut as apiCheckOut, getMyAttendance } from '../../api/attendance.api';
import { Calendar, Upload, X, Plus, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function EmployeeTimeOff() {
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [activeTab, setActiveTab] = useState('paid');
  
  const [formData, setFormData] = useState({
    employee: 'John Doe',
    timeOffType: 'Paid time off',
    startDate: '',
    endDate: '',
    allocation: '',
    reason: ''
  });

  const [timeOffRequests, setTimeOffRequests] = useState([
    {
      id: 1,
      name: 'John Doe',
      startDate: '24/10/2025',
      endDate: '26/10/2025',
      type: 'Paid time Off',
      status: 'Approved',
      days: 3
    },
    {
      id: 2,
      name: 'John Doe',
      startDate: '15/11/2025',
      endDate: '18/11/2025',
      type: 'Sick Leave',
      status: 'Pending',
      days: 4
    }
  ]);

  const [todayAttendance, setTodayAttendance] = useState(null);

  useEffect(() => {
    const loadToday = async () => {
      try {
        const now = new Date();
        const month = now.getMonth() + 1;
        const year = now.getFullYear();
        const records = await getMyAttendance(month, year);
        // find today's record
        const todayStr = new Date().toDateString();
        const todayRec = records.find(r => new Date(r.date).toDateString() === todayStr) || null;
        setTodayAttendance(todayRec);
      } catch (err) {
        console.error('Failed to load attendance', err);
      }
    };
    loadToday();
  }, []);

  const handleCheckIn = async () => {
    try {
      const res = await apiCheckIn();
      setTodayAttendance(res.attendance || res);
    } catch (err) {
      console.error('Check-in failed', err);
      alert(err?.response?.data?.message || 'Check-in failed');
    }
  };

  const handleCheckOut = async () => {
    try {
      const res = await apiCheckOut();
      setTodayAttendance(res.attendance || res);
    } catch (err) {
      console.error('Check-out failed', err);
      alert(err?.response?.data?.message || 'Check-out failed');
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = () => {
    // Add new request logic here
    console.log('Submitting request:', formData);
    setShowRequestModal(false);
    // Reset form
    setFormData({
      employee: 'John Doe',
      timeOffType: 'Paid time off',
      startDate: '',
      endDate: '',
      allocation: '',
      reason: ''
    });
    setSelectedFile(null);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Approved':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'Rejected':
        return <XCircle className="text-red-500" size={20} />;
      case 'Pending':
        return <AlertCircle className="text-yellow-500" size={20} />;
      default:
        return <Clock className="text-gray-500" size={20} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'Rejected':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-t-2xl shadow-lg p-6 border-b-2 border-indigo-100">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Time Off</h1>
              <p className="text-gray-500 text-sm mt-1">For Employees View</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleCheckIn}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Check In
                </button>
                <button
                  onClick={handleCheckOut}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Check Out
                </button>
              </div>

              <button
                onClick={() => setShowRequestModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium rounded-lg transition-all shadow-md"
              >
                <Plus size={20} />
                New Request
              </button>
>>>>>>> d26480e22e855fdb9f1f5c564123b11a65b43538
            </div>
          </div>
        </div>

<<<<<<< HEAD
        {/* Attendance Table Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-indigo-100 overflow-hidden">
          {/* Controls Bar */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 border-b border-indigo-100">
            <div className="flex flex-wrap items-center gap-3">
              <button className="p-2 hover:bg-white rounded-lg transition-colors shadow-sm">
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </button>
              <button className="p-2 hover:bg-white rounded-lg transition-colors shadow-sm">
                <ChevronRight className="w-5 h-5 text-gray-700" />
              </button>
              
              <button className="flex items-center space-x-2 px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium shadow-sm">
                <Calendar className="w-4 h-4" />
                <span>Oct</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              <div className="flex items-center space-x-3 px-4 py-2 bg-white rounded-lg shadow-sm">
                <span className="text-sm font-medium text-gray-700">Count of days present</span>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-bold">
                  {daysPresent}
                </span>
              </div>

              <div className="flex items-center space-x-3 px-4 py-2 bg-white rounded-lg shadow-sm">
                <span className="text-sm font-medium text-gray-700">Leaves count</span>
                <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-bold">
                  {leavesCount}
                </span>
              </div>

              <div className="flex items-center space-x-3 px-4 py-2 bg-white rounded-lg shadow-sm">
                <span className="text-sm font-medium text-gray-700">Total working days</span>
                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-bold">
                  {totalWorkingDays}
                </span>
              </div>
            </div>

            {/* Current Date Display */}
            <div className="mt-4 pt-4 border-t border-indigo-200">
              <div className="flex items-center justify-center">
                <span className="text-lg font-semibold text-gray-900">22 October 2025</span>
=======
        {/* Main Content */}
        <div className="bg-white rounded-b-2xl shadow-lg">
          {/* Info Note */}
          <div className="p-6 border-b border-gray-200">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
              <div className="flex items-start">
                <AlertCircle className="text-yellow-600 mr-3 mt-0.5" size={20} />
                <div>
                  <h3 className="text-lg font-semibold text-yellow-900 mb-1">Note</h3>
                  <p className="text-yellow-800 text-sm leading-relaxed">
                    Employees can view only their own time off records, while Admins and HR Officers can view time off records & approve/reject them for all employees.
                  </p>
                </div>
>>>>>>> d26480e22e855fdb9f1f5c564123b11a65b43538
              </div>
            </div>
          </div>

<<<<<<< HEAD
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Check In
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Check Out
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Work Hours
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Extra Hours
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {attendanceRecords.map((record, index) => (
                  <tr 
                    key={index}
                    className={`hover:bg-indigo-50 transition-colors ${
                      record.status === 'leave' ? 'bg-amber-50' : ''
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-indigo-500" />
                        <span className="font-medium text-gray-900">{record.date}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center space-x-1 ${
                        record.checkIn === '-' ? 'text-gray-400' : 'text-gray-900 font-medium'
                      }`}>
                        {record.checkIn !== '-' && <Clock className="w-4 h-4 text-emerald-500" />}
                        <span>{record.checkIn}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center space-x-1 ${
                        record.checkOut === '-' ? 'text-gray-400' : 'text-gray-900 font-medium'
                      }`}>
                        {record.checkOut !== '-' && <Clock className="w-4 h-4 text-rose-500" />}
                        <span>{record.checkOut}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-lg text-sm font-medium ${
                        record.workHours === '-' 
                          ? 'bg-gray-100 text-gray-400'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {record.workHours}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-lg text-sm font-medium ${
                        record.extraHours === '-' || record.extraHours === '00:00'
                          ? 'bg-gray-100 text-gray-400'
                          : 'bg-indigo-100 text-indigo-700'
                      }`}>
                        {record.extraHours !== '-' && record.extraHours !== '00:00' && (
                          <TrendingUp className="w-4 h-4" />
                        )}
                        <span>{record.extraHours}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer Summary */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4 border-t border-indigo-100">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">Total Records:</span>
                <span className="px-3 py-1 bg-white rounded-full text-sm font-bold text-indigo-600 shadow-sm">
                  {attendanceRecords.length}
                </span>
              </div>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <span className="text-sm text-gray-700">Present: <span className="font-bold text-emerald-600">{daysPresent}</span></span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <span className="text-sm text-gray-700">Leave: <span className="font-bold text-amber-600">{leavesCount}</span></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EmployeeAttendanceView;
=======
          {/* View Toggle */}
          <div className="px-6 pt-6">
            <button className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-lg transition-all">
              <Calendar size={18} />
              VIEW
            </button>
          </div>

          {/* Tabs */}
          <div className="px-6 pt-4">
            <div className="flex gap-2 border-b border-gray-200">
              <button
                onClick={() => setActiveTab('paid')}
                className={`px-6 py-3 font-medium transition-all border-b-2 ${
                  activeTab === 'paid'
                    ? 'text-blue-600 border-blue-600 bg-blue-50'
                    : 'text-gray-500 border-transparent hover:text-gray-700'
                }`}
              >
                <div className="text-center">
                  <div className="text-lg font-bold">Paid time Off</div>
                  <div className="text-xs mt-1">24 Days Available</div>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('sick')}
                className={`px-6 py-3 font-medium transition-all border-b-2 ${
                  activeTab === 'sick'
                    ? 'text-orange-600 border-orange-600 bg-orange-50'
                    : 'text-gray-500 border-transparent hover:text-gray-700'
                }`}
              >
                <div className="text-center">
                  <div className="text-lg font-bold">Sick time off</div>
                  <div className="text-xs mt-1">07 Days Available</div>
                </div>
              </button>
            </div>
          </div>

          {/* Time Off Table */}
          <div className="p-6">
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Start Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">End Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Time off Type</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {timeOffRequests
                    .filter(req => 
                      activeTab === 'paid' 
                        ? req.type.includes('Paid') 
                        : req.type.includes('Sick')
                    )
                    .map((request) => (
                      <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm text-gray-900">{request.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{request.startDate}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{request.endDate}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {request.type}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(request.status)}
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
                              {request.status}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Time Off Types Info */}
          <div className="px-6 pb-6">
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">TimeOff Types:</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Paid Time off
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                  Sick Leave
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  Unpaid Leaves
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Request Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">Time off Type Request</h2>
              <button
                onClick={() => setShowRequestModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              {/* Employee */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Employee</label>
                <input
                  type="text"
                  value={formData.employee}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-blue-600 font-medium"
                />
              </div>

              {/* Time off Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time off Type</label>
                <select
                  value={formData.timeOffType}
                  onChange={(e) => handleInputChange('timeOffType', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-blue-600"
                >
                  <option>Paid time off</option>
                  <option>Sick Leave</option>
                  <option>Unpaid Leave</option>
                </select>
              </div>

              {/* Validity Period */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Validity Period</label>
                <div className="flex items-center gap-3">
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-blue-600"
                  />
                  <span className="text-gray-500 font-medium">To</span>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-blue-600"
                  />
                </div>
              </div>

              {/* Allocation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Allocation</label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={formData.allocation}
                    onChange={(e) => handleInputChange('allocation', e.target.value)}
                    placeholder="01:00"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-blue-600"
                  />
                  <span className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700 font-medium">
                    Days
                  </span>
                </div>
              </div>

              {/* Attachment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Attachment <span className="text-gray-400 text-xs">(For sick leave certificate)</span>
                </label>
                <div className="flex items-center gap-3">
                  <label className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors bg-blue-50">
                      <Upload size={20} className="text-blue-600" />
                      <span className="text-sm text-gray-600">
                        {selectedFile ? selectedFile.name : 'Choose file'}
                      </span>
                    </div>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
              <button
                onClick={() => setShowRequestModal(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors"
              >
                Discard
              </button>
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium rounded-lg transition-all shadow-md"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
>>>>>>> d26480e22e855fdb9f1f5c564123b11a65b43538
