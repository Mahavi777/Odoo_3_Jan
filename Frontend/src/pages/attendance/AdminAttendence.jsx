import React, { useState } from 'react';
import { Search, CheckCircle, XCircle, AlertCircle, Filter, Calendar, Users } from 'lucide-react';

export default function AdminHRTimeOff() {
  const [activeTab, setActiveTab] = useState('paid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAllocation, setSelectedAllocation] = useState('');
  
  const [timeOffRequests, setTimeOffRequests] = useState([
    {
      id: 1,
      name: 'John Doe',
      startDate: '28/10/2025',
      endDate: '28/10/2025',
      type: 'Paid time Off',
      status: 'Pending',
      days: 1
    },
    {
      id: 2,
      name: 'Jane Smith',
      startDate: '15/11/2025',
      endDate: '18/11/2025',
      type: 'Paid time Off',
      status: 'Pending',
      days: 4
    },
    {
      id: 3,
      name: 'Mike Johnson',
      startDate: '20/11/2025',
      endDate: '22/11/2025',
      type: 'Sick time off',
      status: 'Approved',
      days: 3
    },
    {
      id: 4,
      name: 'Sarah Williams',
      startDate: '25/11/2025',
      endDate: '26/11/2025',
      type: 'Sick time off',
      status: 'Rejected',
      days: 2
    }
  ]);

  const handleApprove = (id) => {
    setTimeOffRequests(prev =>
      prev.map(req =>
        req.id === id ? { ...req, status: 'Approved' } : req
      )
    );
  };

  const handleReject = (id) => {
    setTimeOffRequests(prev =>
      prev.map(req =>
        req.id === id ? { ...req, status: 'Rejected' } : req
      )
    );
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
    .filter(req => 
      activeTab === 'paid' 
        ? req.type.includes('Paid') 
        : req.type.includes('Sick')
    )
    .filter(req =>
      req.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(req =>
      selectedAllocation === '' || req.days.toString() === selectedAllocation
    );

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
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-all shadow-md">
                <XCircle size={18} />
                Reject
              </button>
              <button className="flex items-center gap-2 px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-all shadow-md">
                <CheckCircle size={18} />
                Approve
              </button>
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
              <button className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-lg transition-all">
                <Calendar size={18} />
                VIEW
              </button>
              
              <div className="flex flex-col md:flex-row gap-4 flex-1 md:ml-6 w-full md:w-auto">
                {/* Search Bar */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search by name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* Allocation Filter */}
                <select
                  value={selectedAllocation}
                  onChange={(e) => setSelectedAllocation(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                >
                  <option value="">Allocation (All)</option>
                  <option value="1">1 Day</option>
                  <option value="2">2 Days</option>
                  <option value="3">3 Days</option>
                  <option value="4">4 Days</option>
                  <option value="5+">5+ Days</option>
                </select>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="px-6 pt-4">
            <div className="flex gap-2 border-b border-gray-200">
              <button
                onClick={() => setActiveTab('paid')}
                className={`px-6 py-3 font-medium transition-all border-b-2 ${
                  activeTab === 'paid'
                    ? 'text-blue-600 border-blue-600 bg-blue-50'
                    : 'text-gray-500 border-transparent hover:text-gray-700'
                }`}
              >
                <div className="text-center">
                  <div className="text-lg font-bold">Paid time Off</div>
                  <div className="text-xs mt-1">24 Days Available</div>
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
                  <div className="text-lg font-bold">Sick time off</div>
                  <div className="text-xs mt-1">07 Days Available</div>
                </div>
              </button>
            </div>
          </div>

          {/* Time Off Table */}
          <div className="p-6">
            <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-purple-100 to-pink-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Start Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">End Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Time off Type</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredRequests.length > 0 ? (
                    filteredRequests.map((request) => (
                      <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{request.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{request.startDate}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{request.endDate}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {request.type}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
                            {request.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleReject(request.id)}
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
                              onClick={() => handleApprove(request.id)}
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
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
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
                    <p className="text-2xl font-bold mt-1">
                      {timeOffRequests.filter(r => r.status === 'Pending').length}
                    </p>
                  </div>
                  <AlertCircle size={32} className="text-yellow-200" />
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-white shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Approved</p>
                    <p className="text-2xl font-bold mt-1">
                      {timeOffRequests.filter(r => r.status === 'Approved').length}
                    </p>
                  </div>
                  <CheckCircle size={32} className="text-green-200" />
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg p-4 text-white shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-100 text-sm">Rejected</p>
                    <p className="text-2xl font-bold mt-1">
                      {timeOffRequests.filter(r => r.status === 'Rejected').length}
                    </p>
                  </div>
                  <XCircle size={32} className="text-red-200" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}