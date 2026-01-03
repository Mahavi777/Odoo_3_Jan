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
            </div>
          </div>
        </div>

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
              </div>
            </div>
          </div>

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