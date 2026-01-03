import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import LandingPage from './pages/Landing';
import SignIn from './pages/auth/Login';
import SignUp from './pages/auth/SignUp';
import Profile from './pages/profile/Profile';
import ForgotPassword from './pages/auth/ForgotPassword';
import VerifyOtp from './pages/auth/VerifyOtp';
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
          path="/activity"
          element={<PrivateRoute><ActivityPage /></PrivateRoute>}
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;
