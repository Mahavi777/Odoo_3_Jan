import React from 'react';
import { CheckCircle, Plane, AlertCircle, User } from 'lucide-react';

const EmployeeCard = ({ employee, attendanceStatus, onClick }) => {
  const getStatusIndicator = () => {
    switch (attendanceStatus) {
      case 'present':
        return (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-xs text-green-700 font-medium">Present</span>
          </div>
        );
      case 'leave':
        return (
          <div className="flex items-center gap-2">
            <Plane className="w-4 h-4 text-amber-600" />
            <span className="text-xs text-amber-700 font-medium">On Leave</span>
          </div>
        );
      case 'absent':
        return (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-xs text-yellow-700 font-medium">Absent</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-400"></div>
            <span className="text-xs text-gray-600 font-medium">Unknown</span>
          </div>
        );
    }
  };

  const getCardBorderColor = () => {
    switch (attendanceStatus) {
      case 'present':
        return 'border-green-200 hover:border-green-400';
      case 'leave':
        return 'border-amber-200 hover:border-amber-400';
      case 'absent':
        return 'border-yellow-200 hover:border-yellow-400';
      default:
        return 'border-gray-200 hover:border-gray-400';
    }
  };

  const getInitials = () => {
    if (employee.fullName) {
      const names = employee.fullName.split(' ');
      if (names.length >= 2) {
        return (names[0][0] + names[1][0]).toUpperCase();
      }
      return names[0][0].toUpperCase();
    }
    if (employee.email) {
      return employee.email[0].toUpperCase();
    }
    return 'E';
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl shadow-md border-2 p-6 cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 ${getCardBorderColor()}`}
    >
      <div className="flex items-start justify-between mb-4">
        {/* Profile Picture */}
        <div className="relative">
          {employee.profileImage ? (
            <img
              src={employee.profileImage}
              alt={employee.fullName || employee.email}
              className="w-16 h-16 rounded-full object-cover border-2 border-indigo-200"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center border-2 border-indigo-200">
              <span className="text-white font-bold text-xl">{getInitials()}</span>
            </div>
          )}
          {/* Status Badge */}
          <div className="absolute -bottom-1 -right-1">
            {attendanceStatus === 'present' && (
              <div className="w-5 h-5 rounded-full bg-green-500 border-2 border-white flex items-center justify-center">
                <CheckCircle className="w-3 h-3 text-white" />
              </div>
            )}
            {attendanceStatus === 'leave' && (
              <div className="w-5 h-5 rounded-full bg-amber-500 border-2 border-white flex items-center justify-center">
                <Plane className="w-3 h-3 text-white" />
              </div>
            )}
            {attendanceStatus === 'absent' && (
              <div className="w-5 h-5 rounded-full bg-yellow-500 border-2 border-white flex items-center justify-center">
                <AlertCircle className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
        </div>

        {/* Status Indicator */}
        <div className="text-right">
          {getStatusIndicator()}
        </div>
      </div>

      {/* Employee Info */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-1">
          {employee.fullName || employee.email || 'Unknown'}
        </h3>
        <p className="text-sm text-gray-500 mb-2">{employee.email}</p>
        {employee.department && (
          <p className="text-xs text-gray-400">{employee.department}</p>
        )}
        {employee.jobPosition && (
          <p className="text-xs text-indigo-600 font-medium mt-1">{employee.jobPosition}</p>
        )}
      </div>

      {/* Click Indicator */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <p className="text-xs text-indigo-600 font-medium flex items-center gap-1">
          <User className="w-3 h-3" />
          Click to view details
        </p>
      </div>
    </div>
  );
};

export default EmployeeCard;

