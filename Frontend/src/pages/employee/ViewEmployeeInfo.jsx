import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, Building2, MapPin, Calendar, CheckCircle, Plane, AlertCircle, Loader2 } from 'lucide-react';
import { getUserProfile } from '../../api/user.api';
import { getUserAttendance } from '../../api/attendance.api';
import { getAllLeaves } from '../../api/leave.api';
import { toast } from 'react-toastify';

const ViewEmployeeInfo = ({ user: currentUser }) => {
  const { employeeId } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEmployeeData();
  }, [employeeId]);

  const loadEmployeeData = async () => {
    try {
      setLoading(true);
      const [empData, attendanceData, leavesData] = await Promise.all([
        getUserProfile(employeeId),
        getUserAttendance(employeeId, new Date().getMonth() + 1, new Date().getFullYear()),
        getAllLeaves({ userId: employeeId }),
      ]);

      setEmployee(empData);
      setAttendance(attendanceData || []);
      setLeaves(leavesData || []);
    } catch (error) {
      console.error('Error loading employee data:', error);
      toast.error('Failed to load employee information');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const getInitials = () => {
    if (employee?.fullName) {
      const names = employee.fullName.split(' ');
      if (names.length >= 2) {
        return (names[0][0] + names[1][0]).toUpperCase();
      }
      return names[0][0].toUpperCase();
    }
    if (employee?.email) {
      return employee.email[0].toUpperCase();
    }
    return 'E';
  };

  const getTodayStatus = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayAttendance = attendance.find(a => {
      const attendanceDate = new Date(a.date);
      attendanceDate.setHours(0, 0, 0, 0);
      return attendanceDate.getTime() === today.getTime();
    });

    const todayLeave = leaves.find(l => {
      const startDate = new Date(l.startDate);
      const endDate = new Date(l.endDate);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);
      return today >= startDate && today <= endDate && l.status === 'Approved';
    });

    if (todayAttendance && todayAttendance.checkIn) {
      return { status: 'present', label: 'Present', icon: CheckCircle, color: 'text-green-600' };
    } else if (todayLeave) {
      return { status: 'leave', label: 'On Leave', icon: Plane, color: 'text-amber-600' };
    } else {
      return { status: 'absent', label: 'Absent', icon: AlertCircle, color: 'text-yellow-600' };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading employee information...</p>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Employee Not Found</h2>
          <p className="text-gray-600 mb-6">The employee you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const todayStatus = getTodayStatus();
  const StatusIcon = todayStatus.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Dashboard</span>
          </button>
        </div>

        {/* Employee Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Profile Picture */}
            <div className="relative">
              {employee.profileImage ? (
                <img
                  src={employee.profileImage}
                  alt={employee.fullName || employee.email}
                  className="w-32 h-32 rounded-full object-cover border-4 border-indigo-200"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center border-4 border-indigo-200">
                  <span className="text-white font-bold text-4xl">{getInitials()}</span>
                </div>
              )}
              {/* Status Badge */}
              <div className="absolute -bottom-2 -right-2">
                <div className={`w-8 h-8 rounded-full bg-white border-4 border-white flex items-center justify-center shadow-lg ${todayStatus.status === 'present' ? 'bg-green-500' : todayStatus.status === 'leave' ? 'bg-amber-500' : 'bg-yellow-500'}`}>
                  <StatusIcon className={`w-4 h-4 text-white`} />
                </div>
              </div>
            </div>

            {/* Employee Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {employee.fullName || employee.email}
                  </h1>
                  <div className="flex items-center gap-4 mb-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${
                      todayStatus.status === 'present' ? 'bg-green-100 text-green-800' :
                      todayStatus.status === 'leave' ? 'bg-amber-100 text-amber-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      <StatusIcon className={`w-4 h-4 ${todayStatus.color}`} />
                      {todayStatus.label}
                    </span>
                    {employee.role && (
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                        {employee.role}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {employee.email && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-5 h-5 text-indigo-600" />
                    <span>{employee.email}</span>
                  </div>
                )}
                {employee.phone && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-5 h-5 text-indigo-600" />
                    <span>{employee.phone}</span>
                  </div>
                )}
                {employee.department && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Building2 className="w-5 h-5 text-indigo-600" />
                    <span>{employee.department}</span>
                  </div>
                )}
                {employee.jobPosition && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <User className="w-5 h-5 text-indigo-600" />
                    <span>{employee.jobPosition}</span>
                  </div>
                )}
                {employee.location && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-5 h-5 text-indigo-600" />
                    <span>{employee.location}</span>
                  </div>
                )}
                {employee.dateOfJoining && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-5 h-5 text-indigo-600" />
                    <span>Joined: {new Date(employee.dateOfJoining).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <p className="text-sm text-gray-600 font-medium">Days Present (This Month)</p>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {attendance.filter(a => a.checkIn && a.status === 'PRESENT').length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-amber-500">
            <p className="text-sm text-gray-600 font-medium">Leaves Taken</p>
            <p className="text-3xl font-bold text-amber-600 mt-2">
              {leaves.filter(l => l.status === 'Approved').length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-indigo-500">
            <p className="text-sm text-gray-600 font-medium">Total Attendance Records</p>
            <p className="text-3xl font-bold text-indigo-600 mt-2">{attendance.length}</p>
          </div>
        </div>

        {/* Recent Attendance */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Attendance</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check In</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check Out</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {attendance.slice(0, 10).map((record) => (
                  <tr key={record._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {new Date(record.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {record.checkIn ? new Date(record.checkIn).toLocaleTimeString() : '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {record.checkOut ? new Date(record.checkOut).toLocaleTimeString() : '-'}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        record.status === 'PRESENT' ? 'bg-green-100 text-green-800' :
                        record.status === 'ABSENT' ? 'bg-red-100 text-red-800' :
                        record.status === 'ON_LEAVE' ? 'bg-amber-100 text-amber-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {attendance.length === 0 && (
              <p className="text-center text-gray-500 py-8">No attendance records found</p>
            )}
          </div>
        </div>

        {/* Recent Leaves */}
        {leaves.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Leave History</h2>
            <div className="space-y-3">
              {leaves.slice(0, 5).map((leave) => (
                <div key={leave._id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{leave.leaveType || 'Leave'}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      leave.status === 'Approved' ? 'bg-green-100 text-green-800' :
                      leave.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                      leave.status === 'Pending' ? 'bg-amber-100 text-amber-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {leave.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewEmployeeInfo;

