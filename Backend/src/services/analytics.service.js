import Attendance from '../models/Attendance.js';
import Leave from '../models/Leave.js';
import Payroll from '../models/Payroll.js';
import User from '../models/User.js';

// Generate attendance report
export const generateAttendanceReport = async (userId, startDate, endDate) => {
  try {
    const filter = { user: userId };
    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const attendance = await Attendance.find(filter).sort({ date: 1 });

    const report = {
      totalDays: attendance.length,
      present: attendance.filter(a => a.status === 'Present').length,
      absent: attendance.filter(a => a.status === 'Absent').length,
      halfDay: attendance.filter(a => a.status === 'Half-Day').length,
      leave: attendance.filter(a => a.status === 'Leave').length,
      attendanceRate: attendance.length > 0
        ? ((attendance.filter(a => a.status === 'Present' || a.status === 'Half-Day').length / attendance.length) * 100).toFixed(2)
        : 0,
      records: attendance,
    };

    return report;
  } catch (error) {
    console.error('Error generating attendance report:', error);
    throw error;
  }
};

// Generate salary slip
export const generateSalarySlip = async (userId, month, year) => {
  try {
    const payroll = await Payroll.findOne({ user: userId }).populate('user', 'fullName employeeId email');
    if (!payroll) {
      throw new Error('Payroll information not found');
    }

    const m = month ? parseInt(month, 10) - 1 : new Date().getMonth();
    const y = year ? parseInt(year, 10) : new Date().getFullYear();

    // Get attendance for the month
    const startDate = new Date(y, m, 1);
    const endDate = new Date(y, m + 1, 0);
    const attendance = await Attendance.find({
      user: userId,
      date: { $gte: startDate, $lte: endDate },
    });

    const workingDays = attendance.length;
    const presentDays = attendance.filter(a => a.status === 'Present' || a.status === 'Half-Day').length;

    const salaryStructure = payroll.salaryStructure || {};
    const {
      basicSalary = 0,
      hra = 0,
      allowances = 0,
      deductions = 0,
      tax = 0,
      netSalary = 0,
    } = salaryStructure;

    // Calculate prorated salary if needed
    const attendanceRatio = workingDays > 0 ? presentDays / workingDays : 0;
    const proratedNetSalary = netSalary * attendanceRatio;

    const salarySlip = {
      employee: {
        name: payroll.user.fullName,
        employeeId: payroll.user.employeeId || payroll.user.email,
        email: payroll.user.email,
      },
      period: {
        month: m + 1,
        year: y,
        monthName: new Date(y, m).toLocaleString('default', { month: 'long' }),
      },
      attendance: {
        workingDays,
        presentDays,
        absentDays: attendance.filter(a => a.status === 'Absent').length,
        leaveDays: attendance.filter(a => a.status === 'Leave').length,
        halfDays: attendance.filter(a => a.status === 'Half-Day').length,
      },
      earnings: {
        basicSalary,
        hra,
        allowances,
        totalEarnings: basicSalary + hra + allowances,
      },
      deductions: {
        tax,
        otherDeductions: deductions - tax,
        totalDeductions: deductions,
      },
      netSalary: proratedNetSalary,
      currency: payroll.currency || 'INR',
      bankDetails: payroll.bankDetails || {},
      generatedAt: new Date(),
    };

    return salarySlip;
  } catch (error) {
    console.error('Error generating salary slip:', error);
    throw error;
  }
};

// Get dashboard analytics
export const getDashboardAnalytics = async (userRole, userId) => {
  try {
    if (userRole === 'ADMIN' || userRole === 'HR') {
      // Admin/HR analytics
      const totalEmployees = await User.countDocuments({ role: 'EMPLOYEE' });
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const presentToday = await Attendance.countDocuments({
        date: today,
        status: 'Present',
      });

      const leaveToday = await Leave.countDocuments({
        startDate: { $lte: today },
        endDate: { $gte: today },
        status: 'Approved',
      });

      const pendingLeaves = await Leave.countDocuments({
        status: 'Pending',
      });

      return {
        totalEmployees,
        presentToday,
        leaveToday,
        pendingLeaves,
      };
    } else {
      // Employee analytics
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todayAttendance = await Attendance.findOne({
        user: userId,
        date: today,
      });

      const pendingLeaves = await Leave.countDocuments({
        user: userId,
        status: 'Pending',
      });

      const approvedLeaves = await Leave.countDocuments({
        user: userId,
        status: 'Approved',
      });

      return {
        todayAttendance,
        pendingLeaves,
        approvedLeaves,
      };
    }
  } catch (error) {
    console.error('Error getting dashboard analytics:', error);
    throw error;
  }
};

