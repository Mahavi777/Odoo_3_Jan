import React, { useState } from 'react';
import { Calendar, Upload, X, Plus, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function EmployeeTimeOff() {
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [activeTab, setActiveTab] = useState('paid');
  
  const [formData, setFormData] = useState({
    employee: 'John Doe',
    timeOffType: 'Paid time off',
    startDate: '',
    endDate: '',
    allocation: '',
    reason: ''
  });

  const [timeOffRequests, setTimeOffRequests] = useState([
    {
      id: 1,
      name: 'John Doe',
      startDate: '24/10/2025',
      endDate: '26/10/2025',
      type: 'Paid time Off',
      status: 'Approved',
      days: 3
    },
    {
      id: 2,
      name: 'John Doe',
      startDate: '15/11/2025',
      endDate: '18/11/2025',
      type: 'Sick Leave',
      status: 'Pending',
      days: 4
    }
  ]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = () => {
    // Add new request logic here
    console.log('Submitting request:', formData);
    setShowRequestModal(false);
    // Reset form
    setFormData({
      employee: 'John Doe',
      timeOffType: 'Paid time off',
      startDate: '',
      endDate: '',
      allocation: '',
      reason: ''
    });
    setSelectedFile(null);
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
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Start Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">End Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Time off Type</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {timeOffRequests
                    .filter(req => 
                      activeTab === 'paid' 
                        ? req.type.includes('Paid') 
                        : req.type.includes('Sick')
                    )
                    .map((request) => (
                      <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm text-gray-900">{request.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{request.startDate}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{request.endDate}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {request.type}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(request.status)}
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
                              {request.status}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
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
                  value={formData.employee}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-blue-600 font-medium"
                />
              </div>

              {/* Time off Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time off Type</label>
                <select
                  value={formData.timeOffType}
                  onChange={(e) => handleInputChange('timeOffType', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-blue-600"
                >
                  <option>Paid time off</option>
                  <option>Sick Leave</option>
                  <option>Unpaid Leave</option>
                </select>
              </div>

              {/* Validity Period */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Validity Period</label>
                <div className="flex items-center gap-3">
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-blue-600"
                  />
                  <span className="text-gray-500 font-medium">To</span>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-blue-600"
                  />
                </div>
              </div>

              {/* Allocation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Allocation</label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={formData.allocation}
                    onChange={(e) => handleInputChange('allocation', e.target.value)}
                    placeholder="01:00"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-blue-600"
                  />
                  <span className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700 font-medium">
                    Days
                  </span>
                </div>
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
                className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium rounded-lg transition-all shadow-md"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}