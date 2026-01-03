import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Building2, MapPin, Calendar, Save, X, Loader2, ArrowLeft } from 'lucide-react';
import { getUserProfile, updateUserProfileByAdmin } from '../../api/user.api';
import { toast } from 'react-toastify';

export default function EditEmployeeInfo() {
  const { employeeId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    loadProfile();
  }, [employeeId]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await getUserProfile(employeeId);
      
      setFormData({
        firstName: data.firstName || '',
        lastName: data.lastName || '',
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
      navigate(`/employee/${employeeId}`);
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
      
      const updatedData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        location: formData.location,
        jobPosition: formData.jobPosition,
        department: formData.department,
        dateOfJoining: formData.dateOfJoining,
        personalInfo: {
          address: formData.address,
          personalEmail: formData.personalEmail,
          gender: formData.gender,
          dateOfBirth: formData.dateOfBirth,
          maritalStatus: formData.maritalStatus,
          nationality: formData.nationality,
        }
      };

      await updateUserProfileByAdmin(employeeId, updatedData);

      toast.success('Profile updated successfully!');
      navigate(`/employee/${employeeId}`);
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <Loader2 className="animate-spin text-purple-500" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
            <button
                onClick={() => navigate(`/employee/${employeeId}`)}
                className="flex items-center gap-2 text-white hover:text-purple-300 transition-colors"
            >
                <ArrowLeft size={20} />
                Back to Profile
            </button>
        </div>
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-t-3xl shadow-2xl p-8 border border-white/20">
          <div className="flex items-center gap-6">
            <div className="relative w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-2xl">
                {formData.profileImage ? (
                <img src={formData.profileImage} alt="Profile" className="w-full h-full rounded-full object-cover" />
                ) : (
                (formData.firstName || 'U').charAt(0).toUpperCase()
                )}
            </div>
            <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                {`${formData.firstName} ${formData.lastName}`}
                </h1>
                <p className="text-purple-200 text-sm mt-1">Editing Employee Profile</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-b-3xl shadow-2xl border-x border-b border-white/20 p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="group">
              <label className="text-sm font-semibold text-purple-200 mb-2 block flex items-center gap-2">
                <User size={16} />
                First Name
              </label>
              <input
                type="text"
                value={formData.firstName || ''}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-purple-300 transition-all"
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
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-purple-300 transition-all"
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
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-purple-300 transition-all"
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
                onChange={(e) => handleInputChange('jobPosition', e.target.value)}
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-purple-300 transition-all"
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
                onChange={(e) => handleInputChange('department', e.target.value)}
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-purple-300 transition-all"
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
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-purple-300 transition-all"
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
                onChange={(e) => handleInputChange('dateOfJoining', e.target.value)}
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
              />
            </div>
            <div className="md:col-span-2">
                <h3 className="text-xl font-semibold text-white mt-6 mb-4 border-b border-white/20 pb-2">Personal Information</h3>
            </div>
            <div>
                <label className="text-sm font-semibold text-purple-200 mb-2 block">Date of Birth</label>
                <input
                    type="date"
                    value={formData.dateOfBirth || ''}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                />
            </div>
            <div>
                <label className="text-sm font-semibold text-purple-200 mb-2 block">Gender</label>
                <select
                    value={formData.gender || ''}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                >
                    <option value="" className="bg-slate-800">Select Gender</option>
                    <option value="Male" className="bg-slate-800">Male</option>
                    <option value="Female" className="bg-slate-800">Female</option>
                    <option value="Other" className="bg-slate-800">Other</option>
                </select>
            </div>
            <div className="md:col-span-2">
                <label className="text-sm font-semibold text-purple-200 mb-2 block">Address</label>
                <input
                    type="text"
                    value={formData.address || ''}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                />
            </div>
            <div>
                <label className="text-sm font-semibold text-purple-200 mb-2 block">Marital Status</label>
                <select
                    value={formData.maritalStatus || ''}
                    onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
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
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                />
            </div>
            <div>
                <label className="text-sm font-semibold text-purple-200 mb-2 block">Personal Email</label>
                <input
                    type="email"
                    value={formData.personalEmail || ''}
                    onChange={(e) => handleInputChange('personalEmail', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                />
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-8">
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full md:w-auto px-10 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-bold rounded-xl transition-all transform hover:scale-105 flex items-center justify-center gap-3 shadow-lg shadow-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
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
        </div>
      </div>
    </div>
  );
}
