import React, { useState } from 'react';
import { User, Mail, Phone, Building2, MapPin, Calendar, Edit2, Save, X, Plus, Trash2, Award, Briefcase } from 'lucide-react';

export default function AdminProfile() {
  const [activeTab, setActiveTab] = useState('resume');
  const [isEditing, setIsEditing] = useState(false);
  
  const [profileData, setProfileData] = useState({
    name: 'Admin User',
    loginId: 'admin@company.com',
    email: 'admin@company.com',
    mobile: '+1 234 567 8900',
    company: 'Tech Solutions Inc.',
    department: 'Administration',
    manager: 'CEO',
    location: 'New York, USA',
    about: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s.',
    interests: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard.',
    
    // Salary Info
    monthlyWage: 50000,
    yearlyWage: 600000,
    workingDays: 22,
    breakTime: 1,
    
    salaryComponents: [
      { name: 'Basic Salary', amount: 250000, frequency: 'month', percentage: 50, type: 'fixed' },
      { name: 'House Rent Allowance', amount: 125000, frequency: 'month', percentage: 50, type: 'fixed' },
      { name: 'Standard Allowance', amount: 9167, frequency: 'month', percentage: 15.67, type: 'variable' },
      { name: 'Performance Bonus', amount: 20982, frequency: 'month', percentage: 8.33, type: 'variable' },
      { name: 'Leave Travel Allowance', amount: 20982, frequency: 'month', percentage: 8.33, type: 'variable' },
      { name: 'Food Allowance', amount: 2918, frequency: 'month', percentage: 11.67, type: 'variable' }
    ],
    
    providentFund: [
      { name: 'Employee', amount: 30000, frequency: 'month', percentage: 12 },
      { name: 'Employer', amount: 30000, frequency: 'month', percentage: 12 }
    ],
    
    taxDeductions: [
      { name: 'Professional Tax', amount: 200, frequency: 'month' }
    ],
    
    skills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
    certifications: ['AWS Certified', 'PMP Certified']
  });

  const [newSkill, setNewSkill] = useState('');
  const [newCertification, setNewCertification] = useState('');

  const tabs = [
    { id: 'resume', label: 'Resume' },
    { id: 'private', label: 'Private Info' },
    { id: 'salary', label: 'Salary Info' }
  ];

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setProfileData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (index) => {
    setProfileData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const addCertification = () => {
    if (newCertification.trim()) {
      setProfileData(prev => ({
        ...prev,
        certifications: [...prev.certifications, newCertification.trim()]
      }));
      setNewCertification('');
    }
  };

  const removeCertification = (index) => {
    setProfileData(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-t-2xl shadow-lg p-6 border-b-2 border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-slate-600 to-slate-800 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                A
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Admin Profile</h1>
                <p className="text-gray-500 text-sm">For Admin: Full Access to All Information</p>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                isEditing 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'bg-slate-600 hover:bg-slate-700 text-white'
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
                    <button className="absolute bottom-0 right-0 bg-slate-600 text-white p-2 rounded-full shadow-lg hover:bg-slate-700">
                      <Edit2 size={16} />
                    </button>
                  )}
                </div>
              </div>

              {/* Right Side - Basic Info */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">My Name</label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-700"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">Company</label>
                  <input
                    type="text"
                    value={profileData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-700"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">Login ID</label>
                  <input
                    type="text"
                    value={profileData.loginId}
                    onChange={(e) => handleInputChange('loginId', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-700"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">Department</label>
                  <input
                    type="text"
                    value={profileData.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-700"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">Email</label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-700"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">Manager</label>
                  <input
                    type="text"
                    value={profileData.manager}
                    onChange={(e) => handleInputChange('manager', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-700"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">Mobile</label>
                  <input
                    type="tel"
                    value={profileData.mobile}
                    onChange={(e) => handleInputChange('mobile', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-700"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">Location</label>
                  <input
                    type="text"
                    value={profileData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-700"
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
                      ? 'text-slate-600 border-b-2 border-slate-600'
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
              <div className="space-y-8">
                {/* About Section */}
                <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Briefcase size={20} className="text-slate-600" />
                    <h3 className="text-lg font-semibold text-gray-800">About</h3>
                  </div>
                  <textarea
                    value={profileData.about}
                    onChange={(e) => handleInputChange('about', e.target.value)}
                    disabled={!isEditing}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent disabled:bg-white disabled:text-gray-700 resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Skills Section */}
                  <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                    <div className="flex items-center gap-2 mb-4">
                      <Award size={20} className="text-blue-600" />
                      <h3 className="text-lg font-semibold text-gray-800">Skills</h3>
                    </div>
                    <div className="space-y-3">
                      {profileData.skills.map((skill, index) => (
                        <div key={index} className="flex items-center justify-between bg-white px-4 py-2 rounded-lg">
                          <span className="text-gray-700">{skill}</span>
                          {isEditing && (
                            <button
                              onClick={() => removeSkill(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      ))}
                      {isEditing && (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                            placeholder="Add new skill"
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                          />
                          <button
                            onClick={addSkill}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                          >
                            <Plus size={20} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Certifications Section */}
                  <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                    <div className="flex items-center gap-2 mb-4">
                      <Award size={20} className="text-green-600" />
                      <h3 className="text-lg font-semibold text-gray-800">Certification</h3>
                    </div>
                    <div className="space-y-3">
                      {profileData.certifications.map((cert, index) => (
                        <div key={index} className="flex items-center justify-between bg-white px-4 py-2 rounded-lg">
                          <span className="text-gray-700">{cert}</span>
                          {isEditing && (
                            <button
                              onClick={() => removeCertification(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      ))}
                      {isEditing && (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newCertification}
                            onChange={(e) => setNewCertification(e.target.value)}
                            placeholder="Add certification"
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            onKeyPress={(e) => e.key === 'Enter' && addCertification()}
                          />
                          <button
                            onClick={addCertification}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                          >
                            <Plus size={20} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Interests Section */}
                <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">My interests and hobbies</h3>
                  <textarea
                    value={profileData.interests}
                    onChange={(e) => handleInputChange('interests', e.target.value)}
                    disabled={!isEditing}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-white disabled:text-gray-700 resize-none"
                  />
                </div>
              </div>
            )}

            {activeTab === 'private' && (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
                  <User className="w-8 h-8 text-slate-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Private Information</h3>
                <p className="text-gray-500">Admin private information section</p>
              </div>
            )}

            {activeTab === 'salary' && (
              <div className="space-y-6">
                <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
                  <p className="text-amber-800 font-medium">🔒 Admin Only: This tab is only visible to administrators</p>
                </div>

                {/* Salary Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                    <p className="text-blue-100 text-sm mb-1">Monthly Wage</p>
                    <p className="text-3xl font-bold">₹{profileData.monthlyWage.toLocaleString()}</p>
                    <p className="text-blue-100 text-sm mt-1">/ Month</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
                    <p className="text-green-100 text-sm mb-1">Yearly Wage</p>
                    <p className="text-3xl font-bold">₹{profileData.yearlyWage.toLocaleString()}</p>
                    <p className="text-green-100 text-sm mt-1">/ Yearly</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                    <p className="text-purple-100 text-sm mb-1">Working Days</p>
                    <p className="text-3xl font-bold">{profileData.workingDays}</p>
                    <p className="text-purple-100 text-sm mt-1">days/week</p>
                  </div>
                  <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-6 text-white">
                    <p className="text-orange-100 text-sm mb-1">Break Time</p>
                    <p className="text-3xl font-bold">{profileData.breakTime}</p>
                    <p className="text-orange-100 text-sm mt-1">hours</p>
                  </div>
                </div>

                {/* Salary Components */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-slate-600 to-slate-700 px-6 py-4">
                    <h3 className="text-lg font-semibold text-white">Salary Components</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Component</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Frequency</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Percentage</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {profileData.salaryComponents.map((component, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm text-gray-900">{component.name}</td>
                            <td className="px-6 py-4 text-sm text-gray-900 text-right font-medium">₹{component.amount.toLocaleString()}</td>
                            <td className="px-6 py-4 text-sm text-gray-600 text-center">/ {component.frequency}</td>
                            <td className="px-6 py-4 text-sm text-gray-900 text-right">{component.percentage}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="bg-gray-50 px-6 py-3 text-xs text-gray-500 italic">
                    Define basic salary from company cost compute & based on monthly wages
                  </div>
                </div>

                {/* Provident Fund */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                    <h3 className="text-lg font-semibold text-white">Provident Fund (PF) Contribution</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Frequency</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Percentage</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {profileData.providentFund.map((pf, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm text-gray-900">{pf.name}</td>
                            <td className="px-6 py-4 text-sm text-gray-900 text-right font-medium">₹{pf.amount.toLocaleString()}</td>
                            <td className="px-6 py-4 text-sm text-gray-600 text-center">/ {pf.frequency}</td>
                            <td className="px-6 py-4 text-sm text-gray-900 text-right">{pf.percentage}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="bg-gray-50 px-6 py-3 text-xs text-gray-500 italic">
                    PF is calculated based on the basic salary
                  </div>
                </div>

                {/* Tax Deductions */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4">
                    <h3 className="text-lg font-semibold text-white">Tax Deductions</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Frequency</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {profileData.taxDeductions.map((tax, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm text-gray-900">{tax.name}</td>
                            <td className="px-6 py-4 text-sm text-gray-900 text-right font-medium">₹{tax.amount.toLocaleString()}</td>
                            <td className="px-6 py-4 text-sm text-gray-600 text-center">/ {tax.frequency}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="bg-gray-50 px-6 py-3 text-xs text-gray-500 italic">
                    Professional Tax deducted from the Gross Salary
                  </div>
                </div>
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