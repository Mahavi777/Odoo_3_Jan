import React, { useState, useEffect } from 'react';
import { checkIn as apiCheckIn, checkOut as apiCheckOut, getMyAttendance } from '../../api/attendance.api';
import { Search, ChevronLeft, ChevronRight, ChevronDown, LogOut, User, Calendar, Clock, TrendingUp, CheckCircle, XCircle, Coffee, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';

export default function EmployeeAttendance() {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const loadAttendance = async () => {
      try {
        const records = await getMyAttendance(selectedMonth, selectedYear);
        setAttendanceRecords(records || []);
        // find today's record
        const todayStr = new Date().toDateString();
        const todayRec = records?.find(r => new Date(r.date).toDateString() === todayStr) || null;
        setTodayAttendance(todayRec);
      } catch (err) {
        console.error('Failed to load attendance', err);
      }
    };
    loadAttendance();
  }, [selectedMonth, selectedYear]);

  const handleCheckIn = async () => {
    try {
      const res = await apiCheckIn();
      setTodayAttendance(res.attendance || res);
      toast.success('Checked in successfully!');
      // Reload attendance data
      const records = await getMyAttendance(selectedMonth, selectedYear);
      setAttendanceRecords(records || []);
      const todayStr = new Date().toDateString();
      const todayRec = records?.find(r => new Date(r.date).toDateString() === todayStr) || null;
      setTodayAttendance(todayRec);
    } catch (err) {
      console.error('Check-in failed', err);
      toast.error(err?.response?.data?.message || 'Check-in failed');
    }
  };

  const handleCheckOut = async () => {
    try {
      const res = await apiCheckOut();
      setTodayAttendance(res.attendance || res);
      toast.success('Checked out successfully!');
      // Reload attendance data
      const records = await getMyAttendance(selectedMonth, selectedYear);
      setAttendanceRecords(records || []);
      const todayStr = new Date().toDateString();
      const todayRec = records?.find(r => new Date(r.date).toDateString() === todayStr) || null;
      setTodayAttendance(todayRec);
    } catch (err) {
      console.error('Check-out failed', err);
      toast.error(err?.response?.data?.message || 'Check-out failed');
    }
  };

  // Calculate statistics
  const daysPresent = attendanceRecords.filter(r => r.status === 'present' || (r.checkIn && r.checkIn !== '-')).length;
  const leavesCount = attendanceRecords.filter(r => r.status === 'leave').length;
  const totalWorkingDays = attendanceRecords.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Attendance</h1>
          <p className="text-gray-600 mt-1">View your daily attendance records and work hours</p>
        </div>

        {/* Check In/Out Component */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border-2 border-indigo-100">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Status Indicator */}
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                todayAttendance?.checkIn 
                  ? 'bg-green-100 border-4 border-green-500' 
                  : 'bg-gray-100 border-4 border-gray-300'
              }`}>
                {todayAttendance?.checkIn ? (
                  <CheckCircle className="w-8 h-8 text-green-600" />
                ) : (
                  <Clock className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Current Status</p>
                <p className={`text-xl font-bold ${
                  todayAttendance?.checkIn ? 'text-green-600' : 'text-gray-400'
                }`}>
                  {todayAttendance?.checkIn ? 'Checked In' : 'Not Checked In'}
                </p>
                {todayAttendance?.checkIn && (
                  <p className="text-xs text-gray-500 mt-1">
                    Checked in at: {new Date(todayAttendance.checkIn).toLocaleTimeString()}
                  </p>
                )}
                {todayAttendance?.checkOut && (
                  <p className="text-xs text-gray-500 mt-1">
                    Checked out at: {new Date(todayAttendance.checkOut).toLocaleTimeString()}
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleCheckIn}
                disabled={todayAttendance?.checkIn}
                className={`px-8 py-4 rounded-xl font-bold text-white transition-all shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                  todayAttendance?.checkIn 
                    ? 'bg-gray-400' 
                    : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>Check In</span>
                </div>
              </button>
              <button
                onClick={handleCheckOut}
                disabled={!todayAttendance?.checkIn || todayAttendance?.checkOut}
                className={`px-8 py-4 rounded-xl font-bold text-white transition-all shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                  !todayAttendance?.checkIn || todayAttendance?.checkOut
                    ? 'bg-gray-400'
                    : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <XCircle className="w-5 h-5" />
                  <span>Check Out</span>
                </div>
              </button>
            </div>
          </div>
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
              <button 
                onClick={() => {
                  if (selectedMonth > 1) {
                    setSelectedMonth(selectedMonth - 1);
                  } else {
                    setSelectedMonth(12);
                    setSelectedYear(selectedYear - 1);
                  }
                }}
                className="p-2 hover:bg-white rounded-lg transition-colors shadow-sm"
              >
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </button>
              <button 
                onClick={() => {
                  if (selectedMonth < 12) {
                    setSelectedMonth(selectedMonth + 1);
                  } else {
                    setSelectedMonth(1);
                    setSelectedYear(selectedYear + 1);
                  }
                }}
                className="p-2 hover:bg-white rounded-lg transition-colors shadow-sm"
              >
                <ChevronRight className="w-5 h-5 text-gray-700" />
              </button>
              
              <button className="flex items-center space-x-2 px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium shadow-sm">
                <Calendar className="w-4 h-4" />
                <span>{new Date(selectedYear, selectedMonth - 1).toLocaleString('default', { month: 'short' })}</span>
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
                {attendanceRecords.length > 0 ? (
                  attendanceRecords.map((record, index) => {
                    const recordDate = new Date(record.date);
                    const checkIn = record.checkIn || record.check_in || '-';
                    const checkOut = record.checkOut || record.check_out || '-';
                    const workHours = record.workHours || record.work_hours || '-';
                    const extraHours = record.extraHours || record.extra_hours || '-';
                    const status = record.status || (checkIn !== '-' ? 'present' : 'leave');
                    
                    return (
                      <tr 
                        key={index}
                        className={`hover:bg-indigo-50 transition-colors ${
                          status === 'leave' ? 'bg-amber-50' : ''
                        }`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-indigo-500" />
                            <span className="font-medium text-gray-900">
                              {recordDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center space-x-1 ${
                            checkIn === '-' ? 'text-gray-400' : 'text-gray-900 font-medium'
                          }`}>
                            {checkIn !== '-' && <Clock className="w-4 h-4 text-emerald-500" />}
                            <span>{checkIn}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center space-x-1 ${
                            checkOut === '-' ? 'text-gray-400' : 'text-gray-900 font-medium'
                          }`}>
                            {checkOut !== '-' && <Clock className="w-4 h-4 text-rose-500" />}
                            <span>{checkOut}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-lg text-sm font-medium ${
                            workHours === '-' 
                              ? 'bg-gray-100 text-gray-400'
                              : 'bg-emerald-100 text-emerald-700'
                          }`}>
                            {workHours}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-lg text-sm font-medium ${
                            extraHours === '-' || extraHours === '00:00'
                              ? 'bg-gray-100 text-gray-400'
                              : 'bg-indigo-100 text-indigo-700'
                          }`}>
                            {extraHours !== '-' && extraHours !== '00:00' && (
                              <TrendingUp className="w-4 h-4" />
                            )}
                            <span>{extraHours}</span>
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      No attendance records found for this month
                    </td>
                  </tr>
                )}
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
}
