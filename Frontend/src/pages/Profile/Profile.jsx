import React from 'react';
import EmployeeProfile from './EmployeeProfile';
import AdminProfile from './AdminProfile';

<<<<<<< HEAD

  const Profile = ({ user, onLogout }) => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
      // Fetch user profile from server; fall back to localStorage
      const load = async () => {
        try {
          const data = await getProfile();
          setProfile(data);

          // Ensure we have firstName and lastName
          const firstName = data.firstName || (data.fullName ? data.fullName.split(' ')[0] : '');
          const lastName = data.lastName || (data.fullName ? data.fullName.split(' ').slice(1).join(' ') : '');

          setFormData({
            ...data,
            firstName,
            lastName,
          });

          // keep local cache in sync
          localStorage.setItem('user', JSON.stringify(data));
        } catch (err) {
          const userData = localStorage.getItem('user');
          if (userData) {
            const parsedUser = JSON.parse(userData);
            setProfile(parsedUser);

            // Ensure we have firstName and lastName
            const firstName = parsedUser.firstName || (parsedUser.fullName ? parsedUser.fullName.split(' ')[0] : '');
            const lastName = parsedUser.lastName || (parsedUser.fullName ? parsedUser.fullName.split(' ').slice(1).join(' ') : '');

            setFormData({
              ...parsedUser,
              firstName,
              lastName,
            });
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
      setError('');
      setLoading(true);

      try {
        const updated = await updateProfile(formData);
        setProfile(updated);

        // Ensure we have firstName and lastName
        const firstName = updated.firstName || (updated.fullName ? updated.fullName.split(' ')[0] : '');
        const lastName = updated.lastName || (updated.fullName ? updated.fullName.split(' ').slice(1).join(' ') : '');

        setFormData({
          ...updated,
          firstName,
          lastName,
        });

        localStorage.setItem('user', JSON.stringify(updated));
        setEditing(false);
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to update profile');
        console.error('Profile update error:', err);
      } finally {
        setLoading(false);
      }
    };

    const handleEditClick = () => {
      // Ensure formData is populated when entering edit mode
      if ((!formData.firstName || !formData.lastName) && profile) {
        const firstName = profile.firstName || (profile.fullName ? profile.fullName.split(' ')[0] : '');
        const lastName = profile.lastName || (profile.fullName ? profile.fullName.split(' ').slice(1).join(' ') : '');
        setFormData({
          ...profile,
          firstName,
          lastName,
        });
      }
      setEditing(true);
    };

    const handleCancel = () => {
      // Reset form data when canceling
      if (profile) {
        const firstName = profile.firstName || (profile.fullName ? profile.fullName.split(' ')[0] : '');
        const lastName = profile.lastName || (profile.fullName ? profile.fullName.split(' ').slice(1).join(' ') : '');
        setFormData({
          ...profile,
          firstName,
          lastName,
        });
      }
      setEditing(false);
    };

    const handleLogout = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      onLogout();
      navigate('/signin');
    };

    if (loading && !profile) {
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

          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}

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
                onClick={handleEditClick}
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
                value={formData?.firstName || ''}
                onChange={handleChange}
                placeholder="Enter first name"
              />
=======
const Profile = ({ user, onLogout }) => {
  // Get user role from localStorage if not provided
  const getUserRole = () => {
    if (user?.role) return user.role;
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        return parsedUser.role;
      } catch (e) {
        return 'EMPLOYEE';
      }
    }
    return 'EMPLOYEE';
  };

  const userRole = getUserRole();

  // Render appropriate profile based on role
  if (userRole === 'ADMIN' || userRole === 'HR') {
    return <AdminProfile user={user} onLogout={onLogout} />;
  }

  return <EmployeeProfile user={user} onLogout={onLogout} />;
};
>>>>>>> 671ca5dd7e29650f2df2e7d4b72449c8de40e9af

              <Input
                label="Last Name"
                type="text"
                name="lastName"
                value={formData?.lastName || ''}
                onChange={handleChange}
                placeholder="Enter last name"
              />

              <Input
                label="Email"
                type="email"
                name="email"
                value={formData?.email || ''}
                onChange={handleChange}
                disabled
                placeholder="Enter email"
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
                  onClick={handleCancel}
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
}

export default Profile;