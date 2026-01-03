import React, { useState, useEffect } from 'react';
import { Search, CheckCircle, XCircle, AlertCircle, Filter, Calendar, Users, Loader2, MessageSquare } from 'lucide-react';
import { getAllLeaves, approveLeave, rejectLeave } from '../../api/leave.api';
import { toast } from 'react-toastify';

export default function AdminHRTimeOff() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [comment, setComment] = useState('');
  const [actionType, setActionType] = useState(''); // 'approve' or 'reject'
  
  const [timeOffRequests, setTimeOffRequests] = useState([]);

  useEffect(() => {
    loadLeaves();
  }, [statusFilter]);

  const loadLeaves = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter) {
        params.status = statusFilter;
      }
      const leaves = await getAllLeaves(params);
      setTimeOffRequests(leaves);
    } catch (error) {
      console.error('Error loading leaves:', error);
      toast.error('Failed to load leave requests');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = (leave) => {
    setSelectedLeave(leave);
    setActionType('approve');
    setComment('');
    setShowCommentModal(true);
  };

  const handleReject = (leave) => {
    setSelectedLeave(leave);
    setActionType('reject');
    setComment('');
    setShowCommentModal(true);
  };

  const confirmAction = async () => {
    if (actionType === 'reject' && !comment.trim()) {
      toast.error('Comment is required when rejecting a leave request');
      return;
    }

    try {
      setProcessing(selectedLeave._id);
      if (actionType === 'approve') {
        await approveLeave(selectedLeave._id, comment);
        toast.success('Leave request approved successfully');
      } else {
        await rejectLeave(selectedLeave._id, comment);
        toast.success('Leave request rejected');
      }
      setShowCommentModal(false);
      setSelectedLeave(null);
      setComment('');
      loadLeaves();
    } catch (error) {
      console.error(`Error ${actionType}ing leave:`, error);
      toast.error(error.response?.data?.message || `Failed to ${actionType} leave request`);
    } finally {
      setProcessing(null);
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

  const filteredRequests = timeOffRequests
    .filter(req => {
      if (activeTab === 'all') return true;
      if (activeTab === 'paid') return req.leaveType === 'Paid';
      if (activeTab === 'sick') return req.leaveType === 'Sick';
      if (activeTab === 'unpaid') return req.leaveType === 'Unpaid';
      return true;
    })
    .filter(req => {
      if (!searchQuery) return true;
      const searchLower = searchQuery.toLowerCase();
      return (
        req.user?.fullName?.toLowerCase().includes(searchLower) ||
        req.user?.email?.toLowerCase().includes(searchLower) ||
        req.user?.employeeId?.toLowerCase().includes(searchLower)
      );
    });

  const pendingCount = timeOffRequests.filter(r => r.status === 'Pending').length;
  const approvedCount = timeOffRequests.filter(r => r.status === 'Approved').length;
  const rejectedCount = timeOffRequests.filter(r => r.status === 'Rejected').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-t-2xl shadow-lg p-6 border-b-2 border-purple-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                <Users size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Time Off Management</h1>
                <p className="text-gray-500 text-sm mt-1">For Admin & HR Officer</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-b-2xl shadow-lg">
          {/* Info Note */}
          <div className="p-6 border-b border-gray-200">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
              <div className="flex items-start">
                <AlertCircle className="text-yellow-600 mr-3 mt-0.5 flex-shrink-0" size={20} />
                <div>
                  <h3 className="text-lg font-semibold text-yellow-900 mb-1">Note</h3>
                  <p className="text-yellow-800 text-sm leading-relaxed">
                    Employees can view only their own time off records, while Admins and HR Officers can view time off records & approve/reject them for all employees.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* View Section & Filters */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <button 
                onClick={loadLeaves}
                className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-lg transition-all"
              >
                <Calendar size={18} />
                Refresh
              </button>
              
              <div className="flex flex-col md:flex-row gap-4 flex-1 md:ml-6 w-full md:w-auto">
                {/* Search Bar */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search by name, email, or employee ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                >
                  <option value="">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="px-6 pt-4">
            <div className="flex gap-2 border-b border-gray-200">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-6 py-3 font-medium transition-all border-b-2 ${
                  activeTab === 'all'
                    ? 'text-purple-600 border-purple-600 bg-purple-50'
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
                <Loader2 className="animate-spin text-purple-600" size={32} />
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-purple-100 to-pink-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Employee</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Start Date</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">End Date</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Days</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Leave Type</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Reason</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {filteredRequests.length > 0 ? (
                      filteredRequests.map((request) => {
                        const days = calculateDays(request.startDate, request.endDate);
                        const isProcessing = processing === request._id;
                        return (
                          <tr key={request._id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4">
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {request.user?.fullName || 'N/A'}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {request.user?.email || ''}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-700">
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
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
                                {request.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-center gap-2">
                                {isProcessing ? (
                                  <Loader2 className="animate-spin text-purple-600" size={20} />
                                ) : (
                                  <>
                                    <button
                                      onClick={() => handleReject(request)}
                                      disabled={request.status !== 'Pending'}
                                      className={`p-2 rounded-lg transition-all ${
                                        request.status === 'Pending'
                                          ? 'bg-red-100 hover:bg-red-200 text-red-600'
                                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                      }`}
                                      title="Reject"
                                    >
                                      <XCircle size={20} />
                                    </button>
                                    <button
                                      onClick={() => handleApprove(request)}
                                      disabled={request.status !== 'Pending'}
                                      className={`p-2 rounded-lg transition-all ${
                                        request.status === 'Pending'
                                          ? 'bg-green-100 hover:bg-green-200 text-green-600'
                                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                      }`}
                                      title="Approve"
                                    >
                                      <CheckCircle size={20} />
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                          <div className="flex flex-col items-center gap-3">
                            <Filter size={48} className="text-gray-300" />
                            <p className="text-lg font-medium">No time off requests found</p>
                            <p className="text-sm">Try adjusting your search or filters</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Results Summary */}
            {filteredRequests.length > 0 && (
              <div className="mt-4 text-sm text-gray-600">
                Showing {filteredRequests.length} request{filteredRequests.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>

          {/* Statistics Cards */}
          <div className="px-6 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Total Requests</p>
                    <p className="text-2xl font-bold mt-1">{timeOffRequests.length}</p>
                  </div>
                  <Calendar size={32} className="text-blue-200" />
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg p-4 text-white shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-100 text-sm">Pending</p>
                    <p className="text-2xl font-bold mt-1">{pendingCount}</p>
                  </div>
                  <AlertCircle size={32} className="text-yellow-200" />
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-white shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Approved</p>
                    <p className="text-2xl font-bold mt-1">{approvedCount}</p>
                  </div>
                  <CheckCircle size={32} className="text-green-200" />
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg p-4 text-white shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-100 text-sm">Rejected</p>
                    <p className="text-2xl font-bold mt-1">{rejectedCount}</p>
                  </div>
                  <XCircle size={32} className="text-red-200" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comment Modal */}
      {showCommentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">
                {actionType === 'approve' ? 'Approve Leave Request' : 'Reject Leave Request'}
              </h2>
              <button
                onClick={() => {
                  setShowCommentModal(false);
                  setSelectedLeave(null);
                  setComment('');
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XCircle size={24} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {selectedLeave && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Employee:</p>
                  <p className="font-medium text-gray-900">{selectedLeave.user?.fullName || 'N/A'}</p>
                  <p className="text-sm text-gray-600 mt-2 mb-1">Leave Type:</p>
                  <p className="font-medium text-gray-900">{selectedLeave.leaveType}</p>
                  <p className="text-sm text-gray-600 mt-2 mb-1">Period:</p>
                  <p className="font-medium text-gray-900">
                    {new Date(selectedLeave.startDate).toLocaleDateString()} - {new Date(selectedLeave.endDate).toLocaleDateString()}
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comment {actionType === 'reject' && <span className="text-red-500">*</span>}
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={actionType === 'approve' ? 'Add a comment (optional)...' : 'Enter reason for rejection...'}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows="4"
                  required={actionType === 'reject'}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
              <button
                onClick={() => {
                  setShowCommentModal(false);
                  setSelectedLeave(null);
                  setComment('');
                }}
                className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                disabled={processing === selectedLeave?._id || (actionType === 'reject' && !comment.trim())}
                className={`px-6 py-2 font-medium rounded-lg transition-all shadow-md flex items-center gap-2 ${
                  actionType === 'approve'
                    ? 'bg-green-500 hover:bg-green-600 text-white'
                    : 'bg-red-500 hover:bg-red-600 text-white'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {processing === selectedLeave?._id ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    Processing...
                  </>
                ) : (
                  actionType === 'approve' ? 'Approve' : 'Reject'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
