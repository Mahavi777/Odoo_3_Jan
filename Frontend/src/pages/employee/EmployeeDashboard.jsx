import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, LogOut, User, Loader2, Users, DollarSign } from 'lucide-react';
import EmployeeCard from '../../components/employee/EmployeeCard';
import { getAllUsers } from '../../api/user.api';
import { getAllAttendance } from '../../api/attendance.api';
import { getAllLeaves } from '../../api/leave.api';
import { toast } from 'react-toastify';

const EmployeeDashboard = ({ user, onLogout }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const [allUsers, attendanceData, leavesData] = await Promise.all([
        getAllUsers(),
        getAllAttendance({
          month: new Date().getMonth() + 1,
          year: new Date().getFullYear(),
        }),
        getAllLeaves({
          status: 'Approved',
        }),
      ]);

      // Filter only employees
      const employeeList = allUsers.filter(u => u.role === 'EMPLOYEE');

      // Get today's date
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayStr = today.toISOString().split('T')[0];

      // Map employees with attendance status
      const employeesWithStatus = employeeList.map(emp => {
        // Check if employee has checked in today
        const todayAttendance = attendanceData.find(a => {
          const attendanceDate = new Date(a.date);
          attendanceDate.setHours(0, 0, 0, 0);
          return (
            a.user?._id === emp._id || a.user === emp._id
          ) && attendanceDate.getTime() === today.getTime();
        });

        // Check if employee has approved leave today
        const todayLeave = leavesData.find(l => {
          const startDate = new Date(l.startDate);
          const endDate = new Date(l.endDate);
          startDate.setHours(0, 0, 0, 0);
          endDate.setHours(0, 0, 0, 0);
          return (
            (l.user?._id === emp._id || l.user === emp._id) &&
            today >= startDate &&
            today <= endDate &&
            l.status === 'Approved'
          );
        });

        // Determine status
        let status = 'absent';
        if (todayAttendance && todayAttendance.checkIn) {
          status = 'present';
        } else if (todayLeave) {
          status = 'leave';
        }

        return {
          ...emp,
          attendanceStatus: status,
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

  const handleEmployeeClick = (employeeId) => {
    navigate(`/employee/${employeeId}`);
  };

  const filteredEmployees = employees.filter(emp =>
    (emp.fullName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (emp.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (emp.employeeId || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getInitials = () => {
    if (user?.fullName) {
      const names = user.fullName.split(' ');
      if (names.length >= 2) {
        return (names[0][0] + names[1][0]).toUpperCase();
      }
      return names[0][0].toUpperCase();
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo and Title */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Employee Dashboard
                </h1>
                <p className="text-xs text-gray-500">Manage and view all employees</p>
              </div>
            </div>

            {/* Profile Section */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-3 hover:bg-gray-50 rounded-xl px-3 py-2 transition-all duration-200"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-orange-500 rounded-full flex items-center justify-center shadow-md">
                  {user?.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.fullName || user.email}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-white font-semibold text-sm">{getInitials()}</span>
                  )}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-semibold text-gray-900">{user?.fullName || user?.email || 'User'}</p>
                  <p className="text-xs text-gray-500">{user?.role || 'Admin'}</p>
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
                  {user?.role === 'ADMIN' && (
                    <button
                        onClick={() => {
                            navigate('/manage-salary');
                            setShowProfileMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 flex items-center space-x-2 transition-colors"
                    >
                        <DollarSign className="w-4 h-4" />
                        <span>Manage Salaries</span>
                    </button>
                  )}
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
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search employees by name, email, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-indigo-500">
            <p className="text-sm text-gray-600 font-medium">Total Employees</p>
            <p className="text-2xl font-bold text-indigo-600 mt-1">{employees.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-green-500">
            <p className="text-sm text-gray-600 font-medium">Present Today</p>
            <p className="text-2xl font-bold text-green-600 mt-1">
              {employees.filter(e => e.attendanceStatus === 'present').length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-amber-500">
            <p className="text-sm text-gray-600 font-medium">On Leave</p>
            <p className="text-2xl font-bold text-amber-600 mt-1">
              {employees.filter(e => e.attendanceStatus === 'leave').length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-yellow-500">
            <p className="text-sm text-gray-600 font-medium">Absent</p>
            <p className="text-2xl font-bold text-yellow-600 mt-1">
              {employees.filter(e => e.attendanceStatus === 'absent').length}
            </p>
          </div>
        </div>

        {/* Employee Cards Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading employees...</p>
            </div>
          </div>
        ) : filteredEmployees.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredEmployees.map((employee) => (
              <EmployeeCard
                key={employee._id || employee.id}
                employee={employee}
                attendanceStatus={employee.attendanceStatus}
                onClick={() => handleEmployeeClick(employee._id || employee.id)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Employees Found</h3>
            <p className="text-gray-600">
              {searchQuery ? 'Try adjusting your search query' : 'No employees in the system yet'}
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default EmployeeDashboard;

