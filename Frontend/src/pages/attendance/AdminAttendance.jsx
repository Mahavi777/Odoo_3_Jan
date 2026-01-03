import React, { useState, useEffect } from 'react';
import { getAllAttendance } from '../../api/attendance.api';
import { getAllUsers } from '../../api/user.api.js';
import { Search, ChevronLeft, ChevronRight, ChevronDown, Calendar, Clock, User } from 'lucide-react';

const AdminAttendance = () => {
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [users, setUsers] = useState([]);
    const [filters, setFilters] = useState({
        date: new Date().toISOString().split('T')[0],
        userId: ''
    });
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchInitialData = async () => {
            setLoading(true);
            try {
                const [allUsers, records] = await Promise.all([
                    getAllUsers(),
                    getAllAttendance({
                        year: new Date(filters.date).getFullYear(),
                        month: new Date(filters.date).getMonth() + 1
                    })
                ]);
                setUsers(allUsers || []);
                setAttendanceRecords(records || []);
            } catch (error) {
                console.error("Failed to fetch initial data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchInitialData();
    }, []);

    useEffect(() => {
        const fetchAttendance = async () => {
            setLoading(true);
            try {
                const date = new Date(filters.date);
                const records = await getAllAttendance({ 
                    userId: filters.userId,
                    year: date.getFullYear(),
                    month: date.getMonth() + 1,
                });
                const day = date.getDate();
                const filteredByDay = records.filter(r => new Date(r.date).getDate() === day);
                setAttendanceRecords(filteredByDay);
            } catch (error) {
                console.error("Failed to fetch attendance data", error);
                setAttendanceRecords([]);
            } finally {
                setLoading(false);
            }
        };

        if (filters.date || filters.userId) {
            fetchAttendance();
        }
    }, [filters]);

    const handleFilterChange = (e) => {
        setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const stats = {
        totalEmployees: users.length,
        presentToday: attendanceRecords.filter(r => r.status === 'Present').length,
        onLeave: attendanceRecords.filter(r => r.status === 'Leave').length,
        absent: attendanceRecords.filter(r => r.status === 'Absent').length,
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Attendance</h1>
                
                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-white rounded-lg shadow">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Date</label>
                        <input type="date" name="date" value={filters.date} onChange={handleFilterChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Employee</label>
                        <select name="userId" value={filters.userId} onChange={handleFilterChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                            <option value="">All Employees</option>
                            {users.map(user => (
                                <option key={user._id} value={user._id}>{user.fullName}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow"><p>Total Employees: {stats.totalEmployees}</p></div>
                    <div className="bg-white p-6 rounded-lg shadow"><p>Present Today: {stats.presentToday}</p></div>
                    <div className="bg-white p-6 rounded-lg shadow"><p>On Leave: {stats.onLeave}</p></div>
                    <div className="bg-white p-6 rounded-lg shadow"><p>Absent: {stats.absent}</p></div>
                </div>

                {/* Attendance Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check In</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check Out</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Work Hours</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {loading ? (
                                    <tr><td colSpan="5" className="text-center py-4">Loading...</td></tr>
                                ) : attendanceRecords.length > 0 ? (
                                    attendanceRecords.map(record => (
                                        <tr key={record._id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">{record.user?.fullName}</div>
                                                        <div className="text-sm text-gray-500">{record.user?.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${record.status === 'Present' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{record.status}</span></td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.checkIn ? new Date(record.checkIn).toLocaleTimeString() : '-'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.checkOut ? new Date(record.checkOut).toLocaleTimeString() : '-'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.totalWorkingHours?.toFixed(2) || '-'}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="5" className="text-center py-4">No records found</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminAttendance;