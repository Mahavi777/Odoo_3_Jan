import React, { useState } from 'react';
import { User, Mail, Phone, Building2, MapPin, Calendar, Edit2, Save, X } from 'lucide-react';

export default function EmployeeProfile() {
  const [activeTab, setActiveTab] = useState('resume');
  const [isEditing, setIsEditing] = useState(false);
  
  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    jobPosition: 'Senior Developer',
    email: 'john.doe@company.com',
    mobile: '+1 234 567 8900',
    company: 'Tech Solutions Inc.',
    department: 'Engineering',
    manager: 'Jane Smith',
    location: 'New York, USA',
    dateOfBirth: '1990-05-15',
    residingAddress: '123 Main Street, New York, NY 10001',
    nationality: 'American',
    personalEmail: 'john.personal@email.com',
    gender: 'Male',
    maritalStatus: 'Single',
    dateOfJoining: '2020-03-15',
    accountNumber: '1234567890',
    bankName: 'First National Bank',
    ifscCode: 'FNBK0001234',
    panNo: 'ABCDE1234F',
    uanNo: '100123456789',
    empCode: 'EMP001'
  });

  const tabs = [
    { id: 'resume', label: 'Resume' },
    { id: 'private', label: 'Private Info' },
    { id: 'salary', label: 'Salary Info' },
    { id: 'security', label: 'Security' }
  ];

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-t-2xl shadow-lg p-6 border-b-2 border-indigo-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {profileData.name.charAt(0)}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
                <p className="text-gray-500 text-sm">Manage your personal information</p>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                isEditing 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'bg-indigo-500 hover:bg-indigo-600 text-white'
              }`}
            >
              {isEditing ? <X size={18} /> : <Edit2 size={18} />}
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-b-2xl shadow-lg">
          {/* Profile Header Section */}
          <div className="p-8 border-b border-gray-200">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Left Side - Avatar */}
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div className="w-32 h-32 bg-gradient-to-br from-pink-300 to-pink-400 rounded-full flex items-center justify-center shadow-xl">
                    <Edit2 size={40} className="text-white" />
                  </div>
                  {isEditing && (
                    <button className="absolute bottom-0 right-0 bg-indigo-500 text-white p-2 rounded-full shadow-lg hover:bg-indigo-600">
                      <Edit2 size={16} />
                    </button>
                  )}
                </div>
              </div>

              {/* Right Side - Basic Info */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">Full Name</label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-700"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">Company</label>
                  <input
                    type="text"
                    value={profileData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-700"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">Job Position</label>
                  <input
                    type="text"
                    value={profileData.jobPosition}
                    onChange={(e) => handleInputChange('jobPosition', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-700"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">Department</label>
                  <input
                    type="text"
                    value={profileData.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-700"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">Email</label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-700"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">Manager</label>
                  <input
                    type="text"
                    value={profileData.manager}
                    onChange={(e) => handleInputChange('manager', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-700"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">Mobile</label>
                  <input
                    type="tel"
                    value={profileData.mobile}
                    onChange={(e) => handleInputChange('mobile', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-700"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">Location</label>
                  <input
                    type="text"
                    value={profileData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-700"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex gap-1 px-8">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 font-medium transition-all ${
                    activeTab === tab.id
                      ? 'text-indigo-600 border-b-2 border-indigo-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {activeTab === 'resume' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">Date of Birth</label>
                  <input
                    type="date"
                    value={profileData.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">Gender</label>
                  <select
                    value={profileData.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50"
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">Residing Address</label>
                  <input
                    type="text"
                    value={profileData.residingAddress}
                    onChange={(e) => handleInputChange('residingAddress', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">Marital Status</label>
                  <select
                    value={profileData.maritalStatus}
                    onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50"
                  >
                    <option>Single</option>
                    <option>Married</option>
                    <option>Divorced</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">Nationality</label>
                  <input
                    type="text"
                    value={profileData.nationality}
                    onChange={(e) => handleInputChange('nationality', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">Date of Joining</label>
                  <input
                    type="date"
                    value={profileData.dateOfJoining}
                    onChange={(e) => handleInputChange('dateOfJoining', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50"
                  />
                </div>
              </div>
            )}

            {activeTab === 'private' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">Personal Email</label>
                  <input
                    type="email"
                    value={profileData.personalEmail}
                    onChange={(e) => handleInputChange('personalEmail', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50"
                  />
                </div>
              </div>
            )}

            {activeTab === 'salary' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Bank Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-600 mb-1 block">Account Number</label>
                    <input
                      type="text"
                      value={profileData.accountNumber}
                      onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 mb-1 block">Bank Name</label>
                    <input
                      type="text"
                      value={profileData.bankName}
                      onChange={(e) => handleInputChange('bankName', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 mb-1 block">IFSC Code</label>
                    <input
                      type="text"
                      value={profileData.ifscCode}
                      onChange={(e) => handleInputChange('ifscCode', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 mb-1 block">PAN No</label>
                    <input
                      type="text"
                      value={profileData.panNo}
                      onChange={(e) => handleInputChange('panNo', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 mb-1 block">UAN No</label>
                    <input
                      type="text"
                      value={profileData.uanNo}
                      onChange={(e) => handleInputChange('uanNo', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 mb-1 block">Employee Code</label>
                    <input
                      type="text"
                      value={profileData.empCode}
                      onChange={(e) => handleInputChange('empCode', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
                  <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Security Settings</h3>
                <p className="text-gray-500 mb-6">Manage your password and security preferences</p>
                <button className="px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors">
                  Change Password
                </button>
              </div>
            )}
          </div>

          {/* Save Button */}
          {isEditing && (
            <div className="px-8 pb-8">
              <button
                onClick={() => setIsEditing(false)}
                className="w-full md:w-auto px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Save size={20} />
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}