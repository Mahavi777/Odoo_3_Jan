import React, { useState, useEffect } from 'react';
import { Calendar, Upload, X, Plus, Clock, CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { getMyLeaves, applyForLeave, cancelLeave } from '../../api/leave.api';
import { toast } from 'react-toastify';

export default function EmployeeTimeOff() {
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userName, setUserName] = useState('');
  
  const [formData, setFormData] = useState({
    leaveType: 'Paid',
    startDate: '',
    endDate: '',
    reason: ''
  });

  const [timeOffRequests, setTimeOffRequests] = useState([]);

  useEffect(() => {
    loadLeaves();
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setUserName(user.fullName || user.firstName + ' ' + user.lastName || 'Employee');
    }
  }, []);

  const loadLeaves = async () => {
    try {
      setLoading(true);
      const leaves = await getMyLeaves();
      setTimeOffRequests(leaves);
    } catch (error) {
      console.error('Error loading leaves:', error);
      toast.error('Failed to load leave requests');
    } finally {
      setLoading(false);
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

  const calculateDays = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const handleSubmit = async () => {
    if (!formData.startDate || !formData.endDate || !formData.reason) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      toast.error('Start date must be before end date');
      return;
    }

    try {
      setSubmitting(true);
      await applyForLeave({
        leaveType: formData.leaveType,
        startDate: formData.startDate,
        endDate: formData.endDate,
        reason: formData.reason,
      });
      toast.success('Leave request submitted successfully!');
      setShowRequestModal(false);
      setFormData({
        leaveType: 'Paid',
        startDate: '',
        endDate: '',
        reason: ''
      });
      setSelectedFile(null);
      loadLeaves();
    } catch (error) {
      console.error('Error submitting leave:', error);
      toast.error(error.response?.data?.message || 'Failed to submit leave request');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async (leaveId) => {
    if (!window.confirm('Are you sure you want to cancel this leave request?')) {
      return;
    }

    try {
      await cancelLeave(leaveId);
      toast.success('Leave request cancelled successfully');
      loadLeaves();
    } catch (error) {
      console.error('Error cancelling leave:', error);
      toast.error(error.response?.data?.message || 'Failed to cancel leave request');
    }
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
            <button
              onClick={() => setShowRequestModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium rounded-lg transition-all shadow-md"
            >
              <Plus size={20} />
              New Request
            </button>
          </div>
        </div>

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
              </div>
            </div>
          </div>

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
                onClick={() => setActiveTab('all')}
                className={`px-6 py-3 font-medium transition-all border-b-2 ${
                  activeTab === 'all'
                    ? 'text-indigo-600 border-indigo-600 bg-indigo-50'
                    : 'text-gray-500 border-transparent hover:text-gray-700'
                }`}
              >
                <div className="text-center">
                  <div className="text-lg font-bold">All Leaves</div>
                  <div className="text-xs mt-1">{timeOffRequests.length} Total</div>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('paid')}
                className={`px-6 py-3 font-medium transition-all border-b-2 ${
                  activeTab === 'paid'
                    ? 'text-blue-600 border-blue-600 bg-blue-50'
                    : 'text-gray-500 border-transparent hover:text-gray-700'
                }`}
              >
                <div className="text-center">
                  <div className="text-lg font-bold">Paid</div>
                  <div className="text-xs mt-1">{timeOffRequests.filter(l => l.leaveType === 'Paid').length} Requests</div>
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
                  <div className="text-lg font-bold">Sick</div>
                  <div className="text-xs mt-1">{timeOffRequests.filter(l => l.leaveType === 'Sick').length} Requests</div>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('unpaid')}
                className={`px-6 py-3 font-medium transition-all border-b-2 ${
                  activeTab === 'unpaid'
                    ? 'text-red-600 border-red-600 bg-red-50'
                    : 'text-gray-500 border-transparent hover:text-gray-700'
                }`}
              >
                <div className="text-center">
                  <div className="text-lg font-bold">Unpaid</div>
                  <div className="text-xs mt-1">{timeOffRequests.filter(l => l.leaveType === 'Unpaid').length} Requests</div>
                </div>
              </button>
            </div>
          </div>

          {/* Time Off Table */}
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="animate-spin text-indigo-600" size={32} />
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Start Date</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">End Date</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Days</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Leave Type</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Reason</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {timeOffRequests
                      .filter(req => {
                        if (activeTab === 'all') return true;
                        if (activeTab === 'paid') return req.leaveType === 'Paid';
                        if (activeTab === 'sick') return req.leaveType === 'Sick';
                        if (activeTab === 'unpaid') return req.leaveType === 'Unpaid';
                        return true;
                      })
                      .map((request) => {
                        const days = calculateDays(request.startDate, request.endDate);
                        return (
                          <tr key={request._id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {new Date(request.startDate).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-700">
                              {new Date(request.endDate).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-700">{days}</td>
                            <td className="px-6 py-4">
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {request.leaveType}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate" title={request.reason}>
                              {request.reason}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                {getStatusIcon(request.status)}
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
                                  {request.status}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              {request.status === 'Pending' && (
                                <button
                                  onClick={() => handleCancel(request._id)}
                                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                                >
                                  Cancel
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    {timeOffRequests.filter(req => {
                      if (activeTab === 'all') return true;
                      if (activeTab === 'paid') return req.leaveType === 'Paid';
                      if (activeTab === 'sick') return req.leaveType === 'Sick';
                      if (activeTab === 'unpaid') return req.leaveType === 'Unpaid';
                      return true;
                    }).length === 0 && (
                      <tr>
                        <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                          No leave requests found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
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
                  value={userName}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-blue-600 font-medium"
                />
              </div>

              {/* Time off Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Leave Type <span className="text-red-500">*</span></label>
                <select
                  value={formData.leaveType}
                  onChange={(e) => handleInputChange('leaveType', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="Paid">Paid Leave</option>
                  <option value="Sick">Sick Leave</option>
                  <option value="Unpaid">Unpaid Leave</option>
                </select>
              </div>

              {/* Validity Period */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Validity Period <span className="text-red-500">*</span></label>
                <div className="flex items-center gap-3">
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />
                  <span className="text-gray-500 font-medium">To</span>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    min={formData.startDate || new Date().toISOString().split('T')[0]}
                  />
                </div>
                {formData.startDate && formData.endDate && (
                  <p className="mt-2 text-sm text-gray-600">
                    Total Days: {calculateDays(formData.startDate, formData.endDate)}
                  </p>
                )}
              </div>

              {/* Reason */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reason <span className="text-red-500">*</span></label>
                <textarea
                  value={formData.reason}
                  onChange={(e) => handleInputChange('reason', e.target.value)}
                  placeholder="Enter reason for leave..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                  required
                />
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
                disabled={submitting}
                className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium rounded-lg transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    Submitting...
                  </>
                ) : (
                  'Submit'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}