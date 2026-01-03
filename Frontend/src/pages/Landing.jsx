import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          Welcome to Odoo
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Manage your employee attendance, leave, and payroll all in one place
        </p>
        
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            to="/signin"
            className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            Sign In
          </Link>
          <Link
            to="/signup"
            className="px-8 py-3 bg-white text-indigo-600 border-2 border-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition"
          >
            Sign Up
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Dashboard
            </h3>
            <p className="text-gray-600">
              Get insights into attendance and performance metrics
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="text-4xl mb-4">📅</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Leave Management
            </h3>
            <p className="text-gray-600">
              Request and track your leaves seamlessly
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Payroll
            </h3>
            <p className="text-gray-600">
              View and manage your salary information
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
