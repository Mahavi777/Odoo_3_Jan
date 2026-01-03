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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Decorative Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        </div>

        {/* Header */}
        <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-t-3xl shadow-2xl p-8 border border-white/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
                <div className="relative w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-2xl">
                  {profileData.name.charAt(0)}
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">My Profile</h1>
                <p className="text-purple-200 text-sm mt-1">Manage your personal information</p>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all transform hover:scale-105 ${
                isEditing 
                  ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-lg shadow-red-500/50' 
                  : 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-lg shadow-purple-500/50'
              }`}
            >
              {isEditing ? <X size={20} /> : <Edit2 size={20} />}
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-b-3xl shadow-2xl border-x border-b border-white/20">
          {/* Profile Header Section */}
          <div className="p-8 border-b border-white/10">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Left Side - Avatar */}
              <div className="flex flex-col items-center">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000"></div>
                  <div className="relative w-40 h-40 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl">
                    <User size={64} className="text-white" />
                  </div>
                  {isEditing && (
                    <button className="absolute bottom-2 right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform">
                      <Edit2 size={18} />
                    </button>
                  )}
                </div>
                <div className="mt-4 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                  <span className="text-purple-200 text-sm font-medium">{profileData.empCode}</span>
                </div>
              </div>

              {/* Right Side - Basic Info */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group">
                  <label className="text-sm font-semibold text-purple-200 mb-2 block flex items-center gap-2">
                    <User size={16} />
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-white/5 text-white placeholder-purple-300 transition-all"
                  />
                </div>
                <div className="group">
                  <label className="text-sm font-semibold text-purple-200 mb-2 block flex items-center gap-2">
                    <Building2 size={16} />
                    Company
                  </label>
                  <input
                    type="text"
                    value={profileData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-white/5 text-white placeholder-purple-300 transition-all"
                  />
                </div>
                <div className="group">
                  <label className="text-sm font-semibold text-purple-200 mb-2 block flex items-center gap-2">
                    <Building2 size={16} />
                    Job Position
                  </label>
                  <input
                    type="text"
                    value={profileData.jobPosition}
                    onChange={(e) => handleInputChange('jobPosition', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-white/5 text-white placeholder-purple-300 transition-all"
                  />
                </div>
                <div className="group">
                  <label className="text-sm font-semibold text-purple-200 mb-2 block flex items-center gap-2">
                    <Building2 size={16} />
                    Department
                  </label>
                  <input
                    type="text"
                    value={profileData.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-white/5 text-white placeholder-purple-300 transition-all"
                  />
                </div>
                <div className="group">
                  <label className="text-sm font-semibold text-purple-200 mb-2 block flex items-center gap-2">
                    <Mail size={16} />
                    Email
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-white/5 text-white placeholder-purple-300 transition-all"
                  />
                </div>
                <div className="group">
                  <label className="text-sm font-semibold text-purple-200 mb-2 block flex items-center gap-2">
                    <User size={16} />
                    Manager
                  </label>
                  <input
                    type="text"
                    value={profileData.manager}
                    onChange={(e) => handleInputChange('manager', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-white/5 text-white placeholder-purple-300 transition-all"
                  />
                </div>
                <div className="group">
                  <label className="text-sm font-semibold text-purple-200 mb-2 block flex items-center gap-2">
                    <Phone size={16} />
                    Mobile
                  </label>
                  <input
                    type="tel"
                    value={profileData.mobile}
                    onChange={(e) => handleInputChange('mobile', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-white/5 text-white placeholder-purple-300 transition-all"
                  />
                </div>
                <div className="group">
                  <label className="text-sm font-semibold text-purple-200 mb-2 block flex items-center gap-2">
                    <MapPin size={16} />
                    Location
                  </label>
                  <input
                    type="text"
                    value={profileData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-white/5 text-white placeholder-purple-300 transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-white/10">
            <div className="flex gap-2 px-8 overflow-x-auto">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 font-semibold transition-all whitespace-nowrap relative ${
                    activeTab === tab.id
                      ? 'text-white'
                      : 'text-purple-300 hover:text-white'
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {activeTab === 'resume' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-semibold text-purple-200 mb-2 block flex items-center gap-2">
                    <Calendar size={16} />
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={profileData.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-white/5 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-purple-200 mb-2 block flex items-center gap-2">
                    <User size={16} />
                    Gender
                  </label>
                  <select
                    value={profileData.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-white/5 text-white"
                  >
                    <option className="bg-slate-800">Male</option>
                    <option className="bg-slate-800">Female</option>
                    <option className="bg-slate-800">Other</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-semibold text-purple-200 mb-2 block flex items-center gap-2">
                    <MapPin size={16} />
                    Residing Address
                  </label>
                  <input
                    type="text"
                    value={profileData.residingAddress}
                    onChange={(e) => handleInputChange('residingAddress', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-white/5 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-purple-200 mb-2 block">Marital Status</label>
                  <select
                    value={profileData.maritalStatus}
                    onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-white/5 text-white"
                  >
                    <option className="bg-slate-800">Single</option>
                    <option className="bg-slate-800">Married</option>
                    <option className="bg-slate-800">Divorced</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-purple-200 mb-2 block">Nationality</label>
                  <input
                    type="text"
                    value={profileData.nationality}
                    onChange={(e) => handleInputChange('nationality', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-white/5 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-purple-200 mb-2 block flex items-center gap-2">
                    <Calendar size={16} />
                    Date of Joining
                  </label>
                  <input
                    type="date"
                    value={profileData.dateOfJoining}
                    onChange={(e) => handleInputChange('dateOfJoining', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-white/5 text-white"
                  />
                </div>
              </div>
            )}

            {activeTab === 'private' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-semibold text-purple-200 mb-2 block flex items-center gap-2">
                    <Mail size={16} />
                    Personal Email
                  </label>
                  <input
                    type="email"
                    value={profileData.personalEmail}
                    onChange={(e) => handleInputChange('personalEmail', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-white/5 text-white"
                  />
                </div>
              </div>
            )}

            {activeTab === 'salary' && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white">Bank Details</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-semibold text-purple-200 mb-2 block">Account Number</label>
                    <input
                      type="text"
                      value={profileData.accountNumber}
                      onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-white/5 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-purple-200 mb-2 block">Bank Name</label>
                    <input
                      type="text"
                      value={profileData.bankName}
                      onChange={(e) => handleInputChange('bankName', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-white/5 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-purple-200 mb-2 block">IFSC Code</label>
                    <input
                      type="text"
                      value={profileData.ifscCode}
                      onChange={(e) => handleInputChange('ifscCode', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-white/5 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-purple-200 mb-2 block">PAN No</label>
                    <input
                      type="text"
                      value={profileData.panNo}
                      onChange={(e) => handleInputChange('panNo', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-white/5 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-purple-200 mb-2 block">UAN No</label>
                    <input
                      type="text"
                      value={profileData.uanNo}
                      onChange={(e) => handleInputChange('uanNo', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-white/5 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-purple-200 mb-2 block">Employee Code</label>
                    <input
                      type="text"
                      value={profileData.empCode}
                      onChange={(e) => handleInputChange('empCode', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-white/5 text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="text-center py-12">
                <div className="relative inline-flex items-center justify-center w-24 h-24 mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur opacity-75 animate-pulse"></div>
                  <div className="relative bg-gradient-to-br from-purple-500 to-pink-500 rounded-full w-24 h-24 flex items-center justify-center">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Security Settings</h3>
                <p className="text-purple-200 mb-8 max-w-md mx-auto">Manage your password and security preferences to keep your account safe</p>
                <button className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg shadow-purple-500/50">
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
                className="w-full md:w-auto px-10 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-bold rounded-xl transition-all transform hover:scale-105 flex items-center justify-center gap-3 shadow-lg shadow-emerald-500/50"
              >
                <Save size={22} />
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}