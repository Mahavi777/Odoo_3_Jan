import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, Loader2 } from 'lucide-react';
import { checkIn, checkOut, getTodayAttendance } from '../../api/attendance.api';
import { toast } from 'react-toastify';

const CheckInOut = ({ onStatusChange }) => {
  const [attendance, setAttendance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [status, setStatus] = useState('not_checked_in'); // 'not_checked_in', 'checked_in', 'checked_out'

  useEffect(() => {
    loadTodayAttendance();
    // Poll every 30 seconds to update status
    const interval = setInterval(loadTodayAttendance, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadTodayAttendance = async () => {
    try {
      const data = await getTodayAttendance();
      setAttendance(data.attendance);
      setStatus(data.status || 'not_checked_in');
      if (onStatusChange) {
        onStatusChange(data.status || 'not_checked_in', data.attendance);
      }
    } catch (error) {
      console.error('Error loading today attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    try {
      setActionLoading(true);
      const res = await checkIn();
      setAttendance(res.attendance);
      setStatus('checked_in');
      toast.success('✅ Checked in successfully!');
      if (onStatusChange) {
        onStatusChange('checked_in', res.attendance);
      }
      // Reload to get latest data
      await loadTodayAttendance();
    } catch (error) {
      console.error('Check-in failed:', error);
      toast.error(error?.response?.data?.message || 'Check-in failed. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOut = async () => {
    try {
      setActionLoading(true);
      const res = await checkOut();
      setAttendance(res.attendance);
      setStatus('checked_out');
      toast.success('✅ Checked out successfully!');
      if (onStatusChange) {
        onStatusChange('checked_out', res.attendance);
      }
      // Reload to get latest data
      await loadTodayAttendance();
    } catch (error) {
      console.error('Check-out failed:', error);
      toast.error(error?.response?.data?.message || 'Check-out failed. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  // Determine status indicator color and text
  const getStatusConfig = () => {
    switch (status) {
      case 'checked_in':
        return {
          dotColor: 'bg-green-500',
          borderColor: 'border-green-500',
          bgColor: 'bg-green-50',
          textColor: 'text-green-700',
          statusText: 'Working',
          showSince: true,
        };
      case 'checked_out':
        return {
          dotColor: 'bg-red-500',
          borderColor: 'border-red-500',
          bgColor: 'bg-red-50',
          textColor: 'text-red-700',
          statusText: 'Not Working',
          showSince: false,
        };
      default: // not_checked_in
        return {
          dotColor: 'bg-red-500',
          borderColor: 'border-red-500',
          bgColor: 'bg-red-50',
          textColor: 'text-red-700',
          statusText: 'Not Working',
          showSince: false,
        };
    }
  };

  const statusConfig = getStatusConfig();

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-200">
        <div className="flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          <span className="ml-3 text-gray-600">Loading attendance status...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-2xl shadow-lg p-6 border-2 ${statusConfig.borderColor} transition-all duration-300`}>
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Status Indicator Section */}
        <div className="flex items-center gap-4 flex-1">
          {/* Status Dot */}
          <div className="relative">
            <div className={`w-20 h-20 rounded-full ${statusConfig.bgColor} border-4 ${statusConfig.borderColor} flex items-center justify-center transition-all duration-300`}>
              <div className={`w-12 h-12 rounded-full ${statusConfig.dotColor} flex items-center justify-center shadow-lg`}>
                {status === 'checked_in' ? (
                  <CheckCircle className="w-8 h-8 text-white" />
                ) : (
                  <XCircle className="w-8 h-8 text-white" />
                )}
              </div>
            </div>
            {/* Pulse animation for active status */}
            {status === 'checked_in' && (
              <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-20"></div>
            )}
          </div>

          {/* Status Text */}
          <div className="flex-1">
            <p className="text-sm text-gray-600 font-medium mb-1">Current Status</p>
            <p className={`text-2xl font-bold ${statusConfig.textColor} mb-2`}>
              {statusConfig.statusText}
            </p>
            {statusConfig.showSince && attendance?.checkIn && (
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">
                  Since {formatTime(attendance.checkIn)}
                </span>
              </div>
            )}
            {status === 'checked_out' && attendance?.checkOut && (
              <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                <span>Checked out at {formatTime(attendance.checkOut)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons Section */}
        <div className="flex gap-4">
          {/* Check In Button */}
          <button
            onClick={handleCheckIn}
            disabled={status === 'checked_in' || status === 'checked_out' || actionLoading}
            className={`px-8 py-4 rounded-xl font-bold text-white transition-all shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
              status === 'checked_in' || status === 'checked_out'
                ? 'bg-gray-400'
                : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
            }`}
          >
            {actionLoading && status !== 'checked_in' ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Processing...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>Check In</span>
              </div>
            )}
          </button>

          {/* Check Out Button */}
          <button
            onClick={handleCheckOut}
            disabled={status !== 'checked_in' || actionLoading}
            className={`px-8 py-4 rounded-xl font-bold text-white transition-all shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
              status !== 'checked_in'
                ? 'bg-gray-400'
                : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700'
            }`}
          >
            {actionLoading && status === 'checked_in' ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Processing...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <XCircle className="w-5 h-5" />
                <span>Check Out</span>
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Additional Info */}
      {attendance && status === 'checked_in' && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Check-in Time: <strong className="text-gray-900">{formatTime(attendance.checkIn)}</strong></span>
            {attendance.checkOut && (
              <span>Check-out Time: <strong className="text-gray-900">{formatTime(attendance.checkOut)}</strong></span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckInOut;

