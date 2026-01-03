import Attendance from '../models/Attendance.js';
import Activity from '../models/Activity.js';
import User from '../models/User.js';
import Leave from '../models/Leave.js';
import * as analyticsService from '../services/analytics.service.js';

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

// GET /api/dashboard
export const getDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const analytics = await analyticsService.getDashboardAnalytics(user.role, req.user.id);
    const today = startOfDay(new Date());

    let recentActivities;
    if (user.role === 'ADMIN' || user.role === 'HR') {
      recentActivities = await Activity.find({}).sort({ createdAt: -1 }).limit(10).populate('user', 'fullName email');
    } else {
      recentActivities = await Activity.find({ user: req.user.id }).sort({ createdAt: -1 }).limit(10);
    }

    res.json({
      ...analytics,
      recentActivities,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/dashboard/attendance-report
export const getAttendanceReport = async (req, res) => {
  try {
    const { userId, startDate, endDate } = req.query;
    const user = await User.findById(req.user.id);
    
    // Employees can only view their own reports
    const targetUserId = (user.role === 'ADMIN' || user.role === 'HR') && userId ? userId : req.user.id;
    
    const report = await analyticsService.generateAttendanceReport(targetUserId, startDate, endDate);
    res.json(report);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/dashboard/salary-slip
export const getSalarySlip = async (req, res) => {
  try {
    const { userId, month, year } = req.query;
    const user = await User.findById(req.user.id);
    
    // Employees can only view their own salary slips
    const targetUserId = (user.role === 'ADMIN' || user.role === 'HR') && userId ? userId : req.user.id;
    
    const salarySlip = await analyticsService.generateSalarySlip(targetUserId, month, year);
    res.json(salarySlip);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

