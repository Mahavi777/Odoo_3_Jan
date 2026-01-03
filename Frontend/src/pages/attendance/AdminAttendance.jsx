import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, ChevronDown, LogOut, User, Calendar, Clock, TrendingUp, AlertCircle } from 'lucide-react';

const AttendanceListView = () => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [activeTab, setActiveTab] = useState('attendance');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState('23 October 2025');
  const [viewMode, setViewMode] = useState('day');
  const [showNote, setShowNote] = useState(true);

  // Sample attendance data
  const attendanceData = [
    { 
      id: 1, 
      name: 'Sarah Johnson', 
      avatar: 'SJ',
      checkIn: '10:00',
      checkOut: '18:00',
      workHours: '08:00',
      extraHours: '01:00',
      status: 'present'
    },
    { 
      id: 2, 
      name: 'Michael Chen', 
      avatar: 'MC',
      checkIn: '10:00',
      checkOut: '19:00',
      workHours: '09:00',
      extraHours: '01:00',
      status: 'present'
    },
    { 
      id: 3, 
      name: 'Emma Williams', 
      avatar: 'EW',
      checkIn: '09:45',
      checkOut: '18:30',
      workHours: '08:45',
      extraHours: '00:45',
      status: 'present'
    },
    { 
      id: 4, 
      name: 'James Brown', 
      avatar: 'JB',
      checkIn: '10:15',
      checkOut: '18:15',
      workHours: '08:00',
      extraHours: '00:00',
      status: 'present'
    },
    { 
      id: 5, 
      name: 'Olivia Davis', 
      avatar: 'OD',
      checkIn: '-',
      checkOut: '-',
      workHours: '-',
      extraHours: '-',
      status: 'absent'
    },
  ];

  const filteredData = attendanceData.filter(emp =>
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
                  <span className="text-white font-semibold text-sm">HR</span>
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-semibold text-gray-900">Admin/HR Officer</p>
                  <p className="text-xs text-gray-500">Administrator</p>
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
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Side - Note Card */}
          {showNote && (
            <div className="lg:w-1/3">
              <div className="bg-white rounded-2xl shadow-lg border border-amber-200 p-6 sticky top-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                      <AlertCircle className="w-5 h-5 text-amber-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">NOTE</h3>
                  </div>
                  <button 
                    onClick={() => setShowNote(false)}
                    className="text-gray-400 hover:text-gray-600 text-xl"
                  >
                    ×
                  </button>
                </div>
                
                <div className="space-y-4 text-sm text-gray-700">
                  <p className="leading-relaxed">
                    If the employee's working source is based on the assigned attendance
                  </p>
                  
                  <p className="leading-relaxed">
                    On the Attendance page, users should see a day-wise attendance of themselves by default for ongoing month, displaying details based on their working time, including breaks.
                  </p>
                  
                  <p className="leading-relaxed">
                    <span className="font-semibold text-indigo-600">For Admins/Time off officers:</span> They can see attendance of all the employees present on the current day.
                  </p>
                  
                  <p className="leading-relaxed">
                    Attendance data serves as the basis for payslip generation.
                  </p>
                  
                  <p className="leading-relaxed">
                    The system should use the generated attendance records to determine the total number of payable days for each employee.
                  </p>
                  
                  <p className="leading-relaxed border-l-4 border-amber-400 pl-3 bg-amber-50 py-2 rounded">
                    Any unpaid leave or missing attendance days should automatically reduce the number of payable days during payslip computation
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Right Side - Attendance List */}
          <div className={`flex-1 ${showNote ? 'lg:w-2/3' : 'w-full'}`}>
            {/* Controls Bar */}
            <div className="bg-white rounded-2xl shadow-lg border border-indigo-100 p-6 mb-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 gap-4">
                {/* Date Navigation */}
                <div className="flex items-center space-x-3">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <ChevronLeft className="w-5 h-5 text-gray-700" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <ChevronRight className="w-5 h-5 text-gray-700" />
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors font-medium">
                    <Calendar className="w-4 h-4" />
                    <span>Date</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                    <span>Day</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>

                {/* Search */}
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search employees..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Current Date Display */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-center">
                  <span className="text-lg font-semibold text-gray-900">{selectedDate}</span>
                </div>
              </div>
            </div>

            {/* Attendance Table */}
            <div className="bg-white rounded-2xl shadow-lg border border-indigo-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-100">
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Emp
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
                    {filteredData.map((employee, index) => (
                      <tr 
                        key={employee.id}
                        className={`hover:bg-indigo-50 transition-colors ${
                          employee.status === 'absent' ? 'bg-rose-50' : ''
                        }`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-md">
                              <span className="text-white font-semibold text-sm">{employee.avatar}</span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{employee.name}</p>
                              <p className="text-xs text-gray-500">Employee</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center space-x-1 ${
                            employee.checkIn === '-' ? 'text-gray-400' : 'text-gray-900 font-medium'
                          }`}>
                            {employee.checkIn !== '-' && <Clock className="w-4 h-4 text-emerald-500" />}
                            <span>{employee.checkIn}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center space-x-1 ${
                            employee.checkOut === '-' ? 'text-gray-400' : 'text-gray-900 font-medium'
                          }`}>
                            {employee.checkOut !== '-' && <Clock className="w-4 h-4 text-rose-500" />}
                            <span>{employee.checkOut}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-lg text-sm font-medium ${
                            employee.workHours === '-' 
                              ? 'bg-gray-100 text-gray-400'
                              : 'bg-emerald-100 text-emerald-700'
                          }`}>
                            {employee.workHours}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-lg text-sm font-medium ${
                            employee.extraHours === '-' || employee.extraHours === '00:00'
                              ? 'bg-gray-100 text-gray-400'
                              : 'bg-indigo-100 text-indigo-700'
                          }`}>
                            {employee.extraHours !== '-' && employee.extraHours !== '00:00' && (
                              <TrendingUp className="w-4 h-4" />
                            )}
                            <span>{employee.extraHours}</span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Summary Footer */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4 border-t border-indigo-100">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">
                    Total Employees: <span className="text-indigo-600 font-bold">{filteredData.length}</span>
                  </span>
                  <span className="text-sm font-medium text-gray-700">
                    Present: <span className="text-emerald-600 font-bold">{filteredData.filter(e => e.status === 'present').length}</span>
                  </span>
                  <span className="text-sm font-medium text-gray-700">
                    Absent: <span className="text-rose-600 font-bold">{filteredData.filter(e => e.status === 'absent').length}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AttendanceListView;