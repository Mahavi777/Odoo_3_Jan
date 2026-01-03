import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { getProfile, updateProfile } from '../../api/auth.api';

const Profile = ({ user, onLogout }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user profile from server; fall back to localStorage
    const load = async () => {
      try {
        const data = await getProfile();
        setProfile(data);
        setFormData(data);
        // keep local cache in sync
        localStorage.setItem('user', JSON.stringify(data));
      } catch (err) {
        const userData = localStorage.getItem('user');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setProfile(parsedUser);
          setFormData(parsedUser);
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updated = await updateProfile(formData);
      setProfile(updated);
      setFormData(updated);
      localStorage.setItem('user', JSON.stringify(updated));
      setEditing(false);
    } catch (err) {
      console.error('Failed to update profile', err);
      alert(err?.response?.data?.message || 'Update failed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    onLogout();
    navigate('/signin');
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">My Profile</h2>
          <Button 
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700"
          >
            Logout
          </Button>
        </div>

        {!editing ? (
          <div className="space-y-6">
            {profile && (
              <>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700">First Name</label>
                    <p className="mt-2 text-gray-900">{profile.firstName || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700">Last Name</label>
                    <p className="mt-2 text-gray-900">{profile.lastName || 'N/A'}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700">Email</label>
                  <p className="mt-2 text-gray-900">{profile.email || 'N/A'}</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700">Role</label>
                  <p className="mt-2 text-gray-900">{profile.role || 'N/A'}</p>
                </div>
              </>
            )}

            <Button
              onClick={() => setEditing(true)}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              Edit Profile
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="First Name"
              type="text"
              name="firstName"
              value={formData.firstName || ''}
              onChange={handleChange}
            />

            <Input
              label="Last Name"
              type="text"
              name="lastName"
              value={formData.lastName || ''}
              onChange={handleChange}
            />

            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email || ''}
              onChange={handleChange}
              disabled
            />

            <div className="flex gap-4">
              <Button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                Save Changes
              </Button>
              <Button
                type="button"
                onClick={() => setEditing(false)}
                className="bg-gray-600 hover:bg-gray-700"
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;
