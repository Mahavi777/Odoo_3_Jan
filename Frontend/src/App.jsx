import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import LandingPage from './pages/Landing';
import SignIn from './pages/auth/Login';
import SignUp from './pages/auth/SignUp';
import Profile from './pages/Profile/Profile';
import ForgotPassword from './pages/auth/ForgotPassword';
import VerifyOtp from './pages/auth/VerifyOtp';
import AuthCallback from './components/common/OAuthCallback';
import Dashboard from './pages/dashboard/Dashboard';
import ActivityPage from './pages/Activity';
import AttendancePage from './pages/AttendancePage';
import Payroll from './pages/payroll/Payroll';
import Analytics from './pages/analytics/Analytics';
import Salary from './pages/salary/Salary';
import ManageSalary from './pages/salary/ManageSalary';
import ViewEmployeeInfo from './pages/employee/ViewEmployeeInfo';
import EditEmployeeInfo from './pages/employee/EditEmployeeInfo'; // Import EditEmployeeInfo
import useAuth from './hooks/useAuth';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/signin" />;
};

const LandingRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? <Navigate to="/dashboard" /> : children;
};

function App() {
  const { user, loading, handleLogout } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Routes>
        <Route path="/" element={<LandingRoute><LandingPage /></LandingRoute>} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route
          path="/dashboard"
          element={<PrivateRoute><Dashboard user={user} onLogout={handleLogout} /></PrivateRoute>}
        />
        <Route
          path="/profile"
          element={<PrivateRoute><Profile user={user} onLogout={handleLogout} /></PrivateRoute>}
        />
        <Route
          path="/attendance"
          element={<PrivateRoute><AttendancePage /></PrivateRoute>}
        />
        <Route
          path="/activity"
          element={<PrivateRoute><ActivityPage /></PrivateRoute>}
        />
        <Route
          path="/payroll"
          element={<PrivateRoute><Payroll user={user} onLogout={handleLogout} /></PrivateRoute>}
        />
        <Route
          path="/analytics"
          element={<PrivateRoute><Analytics user={user} onLogout={handleLogout} /></PrivateRoute>}
        />
        <Route
          path="/salary"
          element={<PrivateRoute><Salary user={user} onLogout={handleLogout} /></PrivateRoute>}
        />
        <Route
          path="/manage-salary"
          element={<PrivateRoute><ManageSalary user={user} onLogout={handleLogout} /></PrivateRoute>}
        />
        <Route
          path="/employee/:employeeId"
          element={<PrivateRoute><ViewEmployeeInfo user={user} onLogout={handleLogout} /></PrivateRoute>}
        />
        <Route
          path="/employee/:employeeId/edit"
          element={<PrivateRoute><EditEmployeeInfo user={user} onLogout={handleLogout} /></PrivateRoute>}
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;
