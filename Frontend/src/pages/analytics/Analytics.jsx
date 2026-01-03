import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, Download, FileText, Calendar, Users, TrendingUp, Filter, Loader2, AlertCircle } from 'lucide-react';
import { getAllAttendance } from '../../api/attendance.api';
import { getAllLeaves } from '../../api/leave.api';
import { getAllPayrolls } from '../../api/payroll.api';
import { getAllUsers } from '../../api/user.api';
import { getAttendanceReport } from '../../api/dashboard.api';
import { toast } from 'react-toastify';

export default function Analytics({ user }) {
  const navigate = useNavigate();
  
  // Check if user is Admin or HR
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
  const isAdminOrHR = userRole === 'ADMIN' || userRole === 'HR';

  // Redirect if not admin/HR
  React.useEffect(() => {
    if (!isAdminOrHR) {
      toast.error('Access denied. Admin/HR only.');
      navigate('/dashboard');
    }
  }, [isAdminOrHR, navigate]);

  if (!isAdminOrHR) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
          <p className="text-gray-600">This page is only accessible to Admin and HR users.</p>
        </div>
      </div>
    );
  }
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('attendance');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });
  const [selectedEmployee, setSelectedEmployee] = useState('all');
  const [attendanceData, setAttendanceData] = useState([]);
  const [leaveData, setLeaveData] = useState([]);
  const [payrollData, setPayrollData] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [summary, setSummary] = useState({
    totalEmployees: 0,
    presentToday: 0,
    onLeave: 0,
    absent: 0,
    totalLeaves: 0,
    pendingLeaves: 0,
    totalPayroll: 0,
  });

  useEffect(() => {
    loadData();
  }, [dateRange, selectedEmployee]);

  const loadData = async () => {
    try {
      setLoading(true);
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();

      const [attendance, leaves, payrolls, users] = await Promise.all([
        getAllAttendance({ 
          month: currentMonth, 
          year: currentYear,
          userId: selectedEmployee !== 'all' ? selectedEmployee : undefined,
        }),
        getAllLeaves({
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
        }),
        getAllPayrolls(),
        getAllUsers(),
      ]);

      setAttendanceData(attendance);
      setLeaveData(leaves);
      setPayrollData(payrolls);
      setEmployees(users.filter(u => u.role === 'EMPLOYEE'));

      // Calculate summary
      const today = new Date().toISOString().split('T')[0];
      const todayAttendance = attendance.filter(a => 
        new Date(a.date).toISOString().split('T')[0] === today
      );

      setSummary({
        totalEmployees: users.filter(u => u.role === 'EMPLOYEE').length,
        presentToday: todayAttendance.filter(a => a.status === 'PRESENT').length,
        onLeave: todayAttendance.filter(a => a.status === 'ON_LEAVE').length,
        absent: todayAttendance.filter(a => a.status === 'ABSENT').length,
        totalLeaves: leaves.length,
        pendingLeaves: leaves.filter(l => l.status === 'Pending').length,
        totalPayroll: payrolls.reduce((sum, p) => sum + (p.salaryStructure?.netSalary || 0), 0),
      });
    } catch (error) {
      console.error('Error loading analytics data:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = (data, filename) => {
    if (!data || data.length === 0) {
      toast.error('No data to export');
      return;
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => {
        const value = row[header];
        if (value && typeof value === 'object') {
          return JSON.stringify(value);
        }
        return value || '';
      }).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('CSV file downloaded successfully');
  };

  const exportToPDF = (type) => {
    toast.info('PDF export feature coming soon');
    // Implementation for PDF generation would go here
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount || 0);
  };

  const getAttendanceStats = () => {
    const stats = {
      present: 0,
      absent: 0,
      onLeave: 0,
      halfDay: 0,
    };

    attendanceData.forEach(record => {
      if (record.status === 'PRESENT') stats.present++;
      else if (record.status === 'ABSENT') stats.absent++;
      else if (record.status === 'ON_LEAVE') stats.onLeave++;
      else if (record.status === 'HALF_DAY') stats.halfDay++;
    });

    return stats;
  };

  const getLeaveStats = () => {
    const stats = {
      approved: 0,
      rejected: 0,
      pending: 0,
      cancelled: 0,
    };

    leaveData.forEach(leave => {
      if (leave.status === 'Approved') stats.approved++;
      else if (leave.status === 'Rejected') stats.rejected++;
      else if (leave.status === 'Pending') stats.pending++;
      else if (leave.status === 'Cancelled') stats.cancelled++;
    });

    return stats;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  const attendanceStats = getAttendanceStats();
  const leaveStats = getLeaveStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <BarChart3 className="w-8 h-8 text-indigo-600" />
                Analytics & Reports
              </h1>
              <p className="text-gray-600 mt-1">Comprehensive insights and reports</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => exportToPDF(activeTab)}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                <Download className="w-5 h-5" />
                Export PDF
              </button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Employees</p>
                <p className="text-3xl font-bold text-indigo-600 mt-1">{summary.totalEmployees}</p>
              </div>
              <Users className="w-12 h-12 text-indigo-100" />
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Present Today</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{summary.presentToday}</p>
              </div>
              <TrendingUp className="w-12 h-12 text-green-100" />
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">On Leave</p>
                <p className="text-3xl font-bold text-amber-600 mt-1">{summary.onLeave}</p>
              </div>
              <Calendar className="w-12 h-12 text-amber-100" />
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Payroll</p>
                <p className="text-2xl font-bold text-purple-600 mt-1">{formatCurrency(summary.totalPayroll)}</p>
              </div>
              <FileText className="w-12 h-12 text-purple-100" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Filters:</span>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Start Date</label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">End Date</label>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Employee</label>
              <select
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Employees</option>
                {employees.map(emp => (
                  <option key={emp._id} value={emp._id}>
                    {emp.fullName || emp.email}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg mb-6">
          <div className="border-b border-gray-200">
            <div className="flex gap-1 px-6">
              {[
                { id: 'attendance', label: 'Attendance Reports' },
                { id: 'leaves', label: 'Leave Summaries' },
                { id: 'salary', label: 'Salary Slips' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 font-medium transition-all rounded-t-lg ${
                    activeTab === tab.id
                      ? 'text-indigo-700 bg-indigo-50 border-b-2 border-indigo-600'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'attendance' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Attendance Report</h2>
                  <button
                    onClick={() => exportToCSV(attendanceData, 'attendance_report')}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Export CSV
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-green-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Present</p>
                    <p className="text-2xl font-bold text-green-600">{attendanceStats.present}</p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Absent</p>
                    <p className="text-2xl font-bold text-red-600">{attendanceStats.absent}</p>
                  </div>
                  <div className="bg-amber-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">On Leave</p>
                    <p className="text-2xl font-bold text-amber-600">{attendanceStats.onLeave}</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Half Day</p>
                    <p className="text-2xl font-bold text-blue-600">{attendanceStats.halfDay}</p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check In</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check Out</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hours</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {attendanceData.slice(0, 50).map((record) => (
                        <tr key={record._id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {new Date(record.date).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {record.user?.fullName || record.user?.email || 'N/A'}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              record.status === 'PRESENT' ? 'bg-green-100 text-green-800' :
                              record.status === 'ABSENT' ? 'bg-red-100 text-red-800' :
                              record.status === 'ON_LEAVE' ? 'bg-amber-100 text-amber-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {record.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {record.checkIn ? new Date(record.checkIn).toLocaleTimeString() : 'N/A'}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {record.checkOut ? new Date(record.checkOut).toLocaleTimeString() : 'N/A'}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {record.workHours || 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'leaves' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Leave Summary</h2>
                  <button
                    onClick={() => exportToCSV(leaveData, 'leave_summary')}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Export CSV
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-green-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Approved</p>
                    <p className="text-2xl font-bold text-green-600">{leaveStats.approved}</p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Rejected</p>
                    <p className="text-2xl font-bold text-red-600">{leaveStats.rejected}</p>
                  </div>
                  <div className="bg-amber-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-amber-600">{leaveStats.pending}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Cancelled</p>
                    <p className="text-2xl font-bold text-gray-600">{leaveStats.cancelled}</p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Leave Type</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Start Date</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">End Date</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Days</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {leaveData.map((leave) => (
                        <tr key={leave._id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {leave.user?.fullName || leave.user?.email || 'N/A'}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">{leave.leaveType || 'N/A'}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {new Date(leave.startDate).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {new Date(leave.endDate).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">{leave.totalDays || 'N/A'}</td>
                          <td className="px-4 py-3 text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              leave.status === 'Approved' ? 'bg-green-100 text-green-800' :
                              leave.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                              leave.status === 'Pending' ? 'bg-amber-100 text-amber-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {leave.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">{leave.reason || 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'salary' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Salary Slips</h2>
                  <button
                    onClick={() => exportToCSV(payrollData, 'salary_slips')}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Export CSV
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {payrollData.map((payroll) => {
                    const employee = payroll.user;
                    const salary = payroll.salaryStructure || {};
                    
                    return (
                      <div key={payroll._id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">
                              {employee?.fullName || employee?.email || 'Unknown'}
                            </h3>
                            <p className="text-sm text-gray-500">{employee?.email}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">Net Salary</p>
                            <p className="text-2xl font-bold text-indigo-600">{formatCurrency(salary.netSalary)}</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-4 border-t border-gray-200">
                          <div>
                            <p className="text-xs text-gray-500">Basic</p>
                            <p className="text-sm font-semibold">{formatCurrency(salary.basicSalary)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">HRA</p>
                            <p className="text-sm font-semibold text-green-600">+ {formatCurrency(salary.hra)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Allowances</p>
                            <p className="text-sm font-semibold text-green-600">+ {formatCurrency(salary.allowances)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Deductions</p>
                            <p className="text-sm font-semibold text-red-600">- {formatCurrency(salary.deductions)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Tax</p>
                            <p className="text-sm font-semibold text-red-600">- {formatCurrency(salary.tax)}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

