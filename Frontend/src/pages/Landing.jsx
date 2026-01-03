import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Zap, Moon, Sun } from 'lucide-react';

const LandingPageV2 = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
          Odoo
        </div>
        <nav className="flex items-center gap-6">
          <Link to="/signin" className="px-6 py-2 text-white font-semibold rounded-lg hover:bg-slate-800 transition-colors">
            Sign In
          </Link>
          <Link to="/signup" className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg shadow-lg hover:scale-105 transform transition-transform">
            Sign Up
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-24 text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-4 leading-tight">
          Modernize Your HR,
          <br />
          <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            Supercharge Your Team
          </span>
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
          The all-in-one platform for attendance, payroll, and leave management. Focus on your people, we'll handle the paperwork.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            to="/signup"
            className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg shadow-lg hover:scale-105 transform transition-transform"
          >
            Get Started for Free
          </Link>
          <Link
            to="#"
            className="px-8 py-4 bg-slate-800 text-white font-semibold rounded-lg hover:bg-slate-700 transition-colors"
          >
            Request a Demo
          </Link>
        </div>
      </main>

      {/* Features Section */}
      <section className="bg-slate-900 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-3">Why Odoo?</h2>
            <p className="text-slate-400">Everything you need, in one powerful package.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-2xl border border-slate-700 transform hover:-translate-y-2 transition-transform">
              <div className="text-purple-400 mb-4"><Zap size={32} /></div>
              <h3 className="text-2xl font-bold mb-3">Automated Attendance</h3>
              <p className="text-slate-400">
                Effortless time tracking with geo-fencing and automated check-ins.
              </p>
            </div>
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-2xl border border-slate-700 transform hover:-translate-y-2 transition-transform">
              <div className="text-green-400 mb-4"><CheckCircle size={32} /></div>
              <h3 className="text-2xl font-bold mb-3">Simplified Payroll</h3>
              <p className="text-slate-400">
                Generate payslips in minutes. Integrated with attendance and leave data.
              </p>
            </div>
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-2xl border border-slate-700 transform hover:-translate-y-2 transition-transform">
              <div className="text-pink-400 mb-4"><Moon size={32} /></div>
              <h3 className="text-2xl font-bold mb-3">Intelligent Leave Management</h3>
              <p className="text-slate-400">
                Customizable leave policies, easy application, and automated approvals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-3">Loved by Teams Worldwide</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-slate-800 p-8 rounded-2xl">
              <p className="text-slate-300 mb-6">"Odoo has been a game-changer for our HR processes. What used to take days now takes minutes. Highly recommended!"</p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex-shrink-0"></div>
                <div className="ml-4">
                  <p className="font-bold">Sarah Jones</p>
                  <p className="text-slate-400">HR Manager, TechCorp</p>
                </div>
              </div>
            </div>
            <div className="bg-slate-800 p-8 rounded-2xl">
              <p className="text-slate-300 mb-6">"The best all-in-one HR solution we've ever used. The UI is clean, intuitive, and the support is top-notch."</p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex-shrink-0"></div>
                <div className="ml-4">
                  <p className="font-bold">Mark Wilson</p>
                  <p className="text-slate-400">CEO, Innovate Ltd.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800">
        <div className="container mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <p className="text-slate-400">&copy; {new Date().getFullYear()} Odoo. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link to="#" className="text-slate-400 hover:text-white">Terms</Link>
            <Link to="#" className="text-slate-400 hover:text-white">Privacy</Link>
            <Link to="#" className="text-slate-400 hover:text-white">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPageV2;
