import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
import { User, Mail, Phone, Building2, MapPin, Calendar, Edit2, Save, X, Plus, Trash2, Award, Briefcase } from 'lucide-react';
import { getProfile, updateProfile } from '../../api/auth.api';

=======
import { User, Mail, Phone, Building2, MapPin, Calendar, Edit2, Save, X, Loader2, Users, Search } from 'lucide-react';
import { getProfile, updateProfile, updatePersonalInfo } from '../../api/auth.api';
import api from '../../services/api';
import { toast } from 'react-toastify';
>>>>>>> dc5923f658d811feb9a2eb14cb10ec493e6b2d2d

const getUserProfile = async (userId) => {
  const res = await api.get(`/profile/user/${userId}`);
  return res.data;
};

const updateUserProfile = async (userId, data) => {
  const res = await api.put(`/profile/user/${userId}`, data);
  return res.data;
};

export default function AdminProfile({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('my-profile');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [formData, setFormData] = useState({});
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');



  useEffect(() => {
    const load = async () => {
      try {
        const data = await getProfile();
        // Map server fields to component fields
        setProfileData(prev => ({
          ...prev,
          name: data.fullName || prev.name,
          loginId: data.loginId || data.email || prev.loginId,
          email: data.email || prev.email,
          mobile: data.phone || prev.mobile,
          company: data.company?.name || prev.company,
          department: data.department || prev.department,
          manager: (data.manager && (data.manager.fullName || data.manager)) || prev.manager,
          location: data.location || prev.location,
          about: data.about || prev.about,
        }));
      } catch (err) {
        console.error('Failed to load profile', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        fullName: profileData.name,
        email: profileData.email,
        phone: profileData.mobile,
        department: profileData.department,
        manager: profileData.manager,
        location: profileData.location,
        // other fields can be added as needed
      };
      const updated = await updateProfile(payload);
      // Map back
      setProfileData(prev => ({
        ...prev,
        name: updated.fullName || prev.name,
        email: updated.email || prev.email,
        mobile: updated.phone || prev.mobile,
        department: updated.department || prev.department,
        location: updated.location || prev.location,
      }));
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to save profile', err);
      alert(err?.response?.data?.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const [newSkill, setNewSkill] = useState('');
  const [newCertification, setNewCertification] = useState('');
  useEffect(() => {
    loadProfile();
    if (activeTab === 'employees') {
      loadEmployees();
    }
  }, [activeTab]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await getProfile();
      setProfileData(data);
      
      const firstName = data.firstName || (data.fullName ? data.fullName.split(' ')[0] : '');
      const lastName = data.lastName || (data.fullName ? data.fullName.split(' ').slice(1).join(' ') : '');
      
      setFormData({
        firstName,
        lastName,
        fullName: data.fullName || '',
        email: data.email || '',
        phone: data.phone || '',
        employeeId: data.employeeId || '',
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
        role: data.role || '',
        status: data.status || 'ACTIVE',
        profileImage: data.profileImage || '',
      });
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const loadEmployees = async () => {
    try {
      const res = await api.get('/users/all');
      setEmployees(res.data);
    } catch (error) {
      console.error('Error loading employees:', error);
      toast.error('Failed to load employees');
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };


  const handleEmployeeSelect = async (employeeId) => {
    try {
      setLoading(true);
      const data = await getUserProfile(employeeId);
      setSelectedEmployee(data);
      setFormData({
        firstName: data.firstName || (data.fullName ? data.fullName.split(' ')[0] : ''),
        lastName: data.lastName || (data.fullName ? data.fullName.split(' ').slice(1).join(' ') : ''),
        fullName: data.fullName || '',
        email: data.email || '',
        phone: data.phone || '',
        employeeId: data.employeeId || '',
        jobPosition: data.jobPosition || '',
        department: data.department || '',
        location: data.location || '',
        dateOfJoining: data.dateOfJoining ? new Date(data.dateOfJoining).toISOString().split('T')[0] : '',
        role: data.role || '',
        status: data.status || 'ACTIVE',
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error loading employee:', error);
      toast.error('Failed to load employee profile');
    } finally {
      setLoading(false);
    }
  };

  const handleEmployeeSave = async () => {
    if (!selectedEmployee) return;
    
    try {
      setSaving(true);
      await updateUserProfile(selectedEmployee._id, {
        fullName: `${formData.firstName} ${formData.lastName}`.trim(),
        phone: formData.phone,
        jobPosition: formData.jobPosition,
        department: formData.department,
        location: formData.location,
        dateOfJoining: formData.dateOfJoining,
        status: formData.status,
        role: formData.role,
      });
      
      toast.success('Employee profile updated successfully!');
      setIsEditing(false);
      loadEmployees();
      handleEmployeeSelect(selectedEmployee._id);
    } catch (error) {
      console.error('Error updating employee:', error);
      toast.error(error.response?.data?.message || 'Failed to update employee profile');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'my-profile', label: 'My Profile' },
    { id: 'employees', label: 'Manage Employees' },
  ];

  if (loading && !profileData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center">
        <Loader2 className="animate-spin text-purple-500" size={48} />
      </div>
    );
  }

  const currentData = selectedEmployee || profileData;
  const isManagingEmployee = !!selectedEmployee;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-800/40 to-indigo-800/40 backdrop-blur-lg rounded-t-2xl shadow-2xl p-6 border-b border-purple-400/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {currentData?.profileImage ? (
                  <img src={currentData.profileImage} alt="Profile" className="w-full h-full rounded-full object-cover" />
                ) : (
                  (formData.firstName || currentData?.fullName || 'A').charAt(0).toUpperCase()
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  {isManagingEmployee ? `Manage: ${formData.firstName} ${formData.lastName}` : 'My Profile'}
                </h1>
                <p className="text-purple-200 text-sm">Admin & HR Management</p>
              </div>
            </div>
            <div className="flex gap-3">
              {isManagingEmployee && (
                <button
                  onClick={() => {
                    setSelectedEmployee(null);
                    loadProfile();
                  }}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-all"
                >
                  Back to My Profile
                </button>
              )}
              <button
                onClick={() => isEditing ? setIsEditing(false) : setIsEditing(true)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg ${
                  isEditing 
                    ? 'bg-red-500 hover:bg-red-600 text-white' 
                    : 'bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white'
                }`}
              >
                {isEditing ? <X size={18} /> : <Edit2 size={18} />}
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white/95 backdrop-blur-sm rounded-b-2xl shadow-2xl">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex gap-1 px-8">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSelectedEmployee(null);
                    setIsEditing(false);
                    if (tab.id === 'my-profile') {
                      loadProfile();
                    }
                  }}
                  className={`px-6 py-3 font-medium transition-all rounded-t-lg ${
                    activeTab === tab.id
                      ? 'text-purple-700 bg-purple-50 border-b-2 border-purple-600'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {activeTab === 'my-profile' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-600 mb-1 block">First Name</label>
                    <input
                      type="text"
                      value={formData.firstName || ''}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-700"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 mb-1 block">Last Name</label>
                    <input
                      type="text"
                      value={formData.lastName || ''}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-700"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 mb-1 block">Email</label>
                    <input
                      type="email"
                      value={formData.email || ''}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 mb-1 block">Employee ID</label>
                    <input
                      type="text"
                      value={formData.employeeId || ''}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 mb-1 block">Phone</label>
                    <input
                      type="tel"
                      value={formData.phone || ''}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-700"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 mb-1 block">Job Position</label>
                    <input
                      type="text"
                      value={formData.jobPosition || ''}
                      onChange={(e) => handleInputChange('jobPosition', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-700"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 mb-1 block">Department</label>
                    <input
                      type="text"
                      value={formData.department || ''}
                      onChange={(e) => handleInputChange('department', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-700"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 mb-1 block">Location</label>
                    <input
                      type="text"
                      value={formData.location || ''}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-700"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 mb-1 block">Date of Joining</label>
                    <input
                      type="date"
                      value={formData.dateOfJoining || ''}
                      onChange={(e) => handleInputChange('dateOfJoining', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-700"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 mb-1 block">Status</label>
                    <select
                      value={formData.status || 'ACTIVE'}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-700"
                    >
                      <option value="ACTIVE">Active</option>
                      <option value="INACTIVE">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'employees' && (
              <div className="space-y-6">
                {!selectedEmployee ? (
                  <>
                    <div className="relative mb-6">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="text"
                        placeholder="Search employees..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {employees
                        .filter(emp => 
                          emp.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          emp.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          emp.employeeId?.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                        .map((employee) => (
                          <div
                            key={employee._id}
                            onClick={() => handleEmployeeSelect(employee._id)}
                            className="p-4 border border-gray-200 rounded-lg hover:border-purple-500 hover:shadow-lg cursor-pointer transition-all"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                                {employee.fullName?.charAt(0) || 'E'}
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900">{employee.fullName || 'N/A'}</p>
                                <p className="text-sm text-gray-500">{employee.email || ''}</p>
                                <p className="text-xs text-gray-400">{employee.role || ''}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-sm font-medium text-gray-600 mb-1 block">First Name</label>
                        <input
                          type="text"
                          value={formData.firstName || ''}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          disabled={!isEditing}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-700"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600 mb-1 block">Last Name</label>
                        <input
                          type="text"
                          value={formData.lastName || ''}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          disabled={!isEditing}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-700"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600 mb-1 block">Email</label>
                        <input
                          type="email"
                          value={formData.email || ''}
                          disabled
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600 mb-1 block">Role</label>
                        <select
                          value={formData.role || ''}
                          onChange={(e) => handleInputChange('role', e.target.value)}
                          disabled={!isEditing}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-700"
                        >
                          <option value="EMPLOYEE">Employee</option>
                          <option value="HR">HR</option>
                          <option value="ADMIN">Admin</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600 mb-1 block">Job Position</label>
                        <input
                          type="text"
                          value={formData.jobPosition || ''}
                          onChange={(e) => handleInputChange('jobPosition', e.target.value)}
                          disabled={!isEditing}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-700"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600 mb-1 block">Department</label>
                        <input
                          type="text"
                          value={formData.department || ''}
                          onChange={(e) => handleInputChange('department', e.target.value)}
                          disabled={!isEditing}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-700"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600 mb-1 block">Status</label>
                        <select
                          value={formData.status || 'ACTIVE'}
                          onChange={(e) => handleInputChange('status', e.target.value)}
                          disabled={!isEditing}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-700"
                        >
                          <option value="ACTIVE">Active</option>
                          <option value="INACTIVE">Inactive</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Save Button */}
          {isEditing && (
            <div className="px-8 pb-8">
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium rounded-lg transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <Save size={20} />
                {saving ? 'Saving...' : 'Save Changes'}
                onClick={isManagingEmployee ? handleEmployeeSave : handleSave}
                disabled={saving}
                className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium rounded-lg transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                {saving ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={20} />
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