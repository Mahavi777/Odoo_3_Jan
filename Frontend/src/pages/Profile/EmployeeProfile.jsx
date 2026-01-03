import React, { useState, useEffect } from 'react';

import { User, Mail, Phone, Building2, MapPin, Calendar, Edit2, Save, X } from 'lucide-react';
import { getProfile, updateProfile } from '../../api/auth.api';
import { updatePersonalInfo } from '../../api/auth.api';
import { toast } from 'react-toastify';
import api from '../../services/api';

export default function EmployeeProfile() {
  const [activeTab, setActiveTab] = useState('resume');
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await getProfile();
      setProfileData(data);
      
      // Prepare form data
      const firstName = data.firstName || (data.fullName ? data.fullName.split(' ')[0] : '');
      const lastName = data.lastName || (data.fullName ? data.fullName.split(' ').slice(1).join(' ') : '');
      
      setFormData({
        firstName,
        lastName,
        fullName: data.fullName || '',
        email: data.email || '',
        phone: data.phone || '',
        jobPosition: data.jobPosition || '',
        department: data.department || '',
        location: data.location || '',
        address: data.personalInfo?.address || '',
        personalEmail: data.personalInfo?.personalEmail || '',
        gender: data.personalInfo?.gender || '',
        dateOfBirth: data.personalInfo?.dateOfBirth ? new Date(data.personalInfo.dateOfBirth).toISOString().split('T')[0] : '',
        maritalStatus: data.personalInfo?.maritalStatus || '',
        nationality: data.personalInfo?.nationality || '',
        dateOfJoining: data.dateOfJoining ? new Date(data.dateOfJoining).toISOString().split('T')[0] : '',
        profileImage: data.profileImage || '',
      });
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Update main profile (employees can only update limited fields)
      const profileUpdate = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        location: formData.location,
      };

      await updateProfile(profileUpdate);

      // Update personal info
      if (formData.address || formData.personalEmail || formData.gender || formData.dateOfBirth || formData.maritalStatus || formData.nationality) {
        try {
          await api.put('/profile/me/personal', {
            address: formData.address,
            phone: formData.phone,
            personalEmail: formData.personalEmail,
            gender: formData.gender,
            dateOfBirth: formData.dateOfBirth,
            maritalStatus: formData.maritalStatus,
            nationality: formData.nationality,
          });
        } catch (error) {
          console.error('Error updating personal info:', error);
        }
      }

      toast.success('Profile updated successfully!');
      setIsEditing(false);
      loadProfile(); // Reload to get updated data
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getProfile();
        setProfileData(prev => ({
          ...prev,
          name: data.fullName || prev.name,
          jobPosition: data.jobPosition || prev.jobPosition,
          email: data.email || prev.email,
          mobile: data.phone || prev.mobile,
          company: data.company?.name || prev.company,
          department: data.department || prev.department,
          manager: (data.manager && (data.manager.fullName || data.manager)) || prev.manager,
          location: data.location || prev.location,
          dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth).toISOString().slice(0,10) : prev.dateOfBirth,
          dateOfJoining: data.dateOfJoining ? new Date(data.dateOfJoining).toISOString().slice(0,10) : prev.dateOfJoining,
          accountNumber: data.accountNumber || prev.accountNumber,
          bankName: data.bankName || prev.bankName,
          ifscCode: data.ifscCode || prev.ifscCode,
          panNo: data.panNo || prev.panNo,
          uanNo: data.uanNo || prev.uanNo,
          empCode: data.empCode || prev.empCode,
        }));
      } catch (err) {
        console.error('Failed to load profile', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const tabs = [
    { id: 'resume', label: 'Resume' },
    { id: 'private', label: 'Private Info' },
    { id: 'salary', label: 'Salary Info' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <Loader2 className="animate-spin text-purple-500" size={48} />
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <p className="text-white text-xl">Failed to load profile</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-t-3xl shadow-2xl p-8 border border-white/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
                <div className="relative w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-2xl">
                  {profileData.profileImage ? (
                    <img src={profileData.profileImage} alt="Profile" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    (formData.firstName || profileData.fullName || 'U').charAt(0).toUpperCase()
                  )}
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                  {formData.firstName && formData.lastName ? `${formData.firstName} ${formData.lastName}` : profileData.fullName || 'My Profile'}
                </h1>
                <p className="text-purple-200 text-sm mt-1">Employee Profile</p>
              </div>
            </div>
            <button
              onClick={() => isEditing ? setIsEditing(false) : setIsEditing(true)}
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
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-b-3xl shadow-2xl border-x border-b border-white/20">
          {/* Profile Header Section */}
          <div className="p-8 border-b border-white/10">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Left Side - Avatar */}
              <div className="flex flex-col items-center">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000"></div>
                  <div className="relative w-40 h-40 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl overflow-hidden">
                    {profileData.profileImage ? (
                      <img src={profileData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User size={64} className="text-white" />
                    )}
                  </div>
                </div>
                <div className="mt-4 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                  <span className="text-purple-200 text-sm font-medium">{profileData.employeeId || profileData.email}</span>
                </div>
              </div>

              {/* Right Side - Basic Info */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group">
                  <label className="text-sm font-semibold text-purple-200 mb-2 block flex items-center gap-2">
                    <User size={16} />
                    First Name
                  </label>
                  <input
                    type="text"
                    value={formData.firstName || ''}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-white/5 text-white placeholder-purple-300 transition-all"
                  />
                </div>
                <div className="group">
                  <label className="text-sm font-semibold text-purple-200 mb-2 block flex items-center gap-2">
                    <User size={16} />
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={formData.lastName || ''}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
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
                    value={formData.email || ''}
                    disabled
                    className="w-full px-4 py-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl text-white/70 cursor-not-allowed"
                  />
                </div>
                <div className="group">
                  <label className="text-sm font-semibold text-purple-200 mb-2 block flex items-center gap-2">
                    <Phone size={16} />
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
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
                    value={formData.jobPosition || ''}
                    disabled
                    className="w-full px-4 py-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl text-white/70 cursor-not-allowed"
                  />
                </div>
                <div className="group">
                  <label className="text-sm font-semibold text-purple-200 mb-2 block flex items-center gap-2">
                    <Building2 size={16} />
                    Department
                  </label>
                  <input
                    type="text"
                    value={formData.department || ''}
                    disabled
                    className="w-full px-4 py-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl text-white/70 cursor-not-allowed"
                  />
                </div>
                <div className="group">
                  <label className="text-sm font-semibold text-purple-200 mb-2 block flex items-center gap-2">
                    <MapPin size={16} />
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location || ''}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-white/5 text-white placeholder-purple-300 transition-all"
                  />
                </div>
                <div className="group">
                  <label className="text-sm font-semibold text-purple-200 mb-2 block flex items-center gap-2">
                    <Calendar size={16} />
                    Date of Joining
                  </label>
                  <input
                    type="date"
                    value={formData.dateOfJoining || ''}
                    disabled
                    className="w-full px-4 py-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl text-white/70 cursor-not-allowed"
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
                    value={formData.dateOfBirth || ''}
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
                    value={formData.gender || ''}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-white/5 text-white"
                  >
                    <option value="" className="bg-slate-800">Select Gender</option>
                    <option value="Male" className="bg-slate-800">Male</option>
                    <option value="Female" className="bg-slate-800">Female</option>
                    <option value="Other" className="bg-slate-800">Other</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-semibold text-purple-200 mb-2 block flex items-center gap-2">
                    <MapPin size={16} />
                    Address
                  </label>
                  <input
                    type="text"
                    value={formData.address || ''}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-white/5 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-purple-200 mb-2 block">Marital Status</label>
                  <select
                    value={formData.maritalStatus || ''}
                    onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-white/5 text-white"
                  >
                    <option value="" className="bg-slate-800">Select Status</option>
                    <option value="Single" className="bg-slate-800">Single</option>
                    <option value="Married" className="bg-slate-800">Married</option>
                    <option value="Divorced" className="bg-slate-800">Divorced</option>
                    <option value="Widowed" className="bg-slate-800">Widowed</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-purple-200 mb-2 block">Nationality</label>
                  <input
                    type="text"
                    value={formData.nationality || ''}
                    onChange={(e) => handleInputChange('nationality', e.target.value)}
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
                    value={formData.personalEmail || ''}
                    onChange={(e) => handleInputChange('personalEmail', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-white/5 text-white"
                  />
                </div>
              </div>
            )}

            {activeTab === 'salary' && (
              <div className="text-center py-12">
                <div className="relative inline-flex items-center justify-center w-24 h-24 mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur opacity-75 animate-pulse"></div>
                  <div className="relative bg-gradient-to-br from-purple-500 to-pink-500 rounded-full w-24 h-24 flex items-center justify-center">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Salary Information</h3>
                <p className="text-purple-200 mb-8 max-w-md mx-auto">
                  {profileData.payroll ? 'Your salary information is available. Contact HR for details.' : 'Salary information not available. Please contact HR.'}
                </p>
              </div>
            )}
          </div>

          {/* Save Button */}
          {isEditing && (
            <div className="px-8 pb-8">
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full md:w-auto px-10 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-bold rounded-xl transition-all transform hover:scale-105 flex items-center justify-center gap-3 shadow-lg shadow-emerald-500/50 disabled:opacity-60"
              >
                <Save size={22} />
                {saving ? 'Saving...' : 'Save Changes'}
                className="w-full md:w-auto px-10 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-bold rounded-xl transition-all transform hover:scale-105 flex items-center justify-center gap-3 shadow-lg shadow-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                {saving ? (
                  <>
                    <Loader2 className="animate-spin" size={22} />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={22} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
