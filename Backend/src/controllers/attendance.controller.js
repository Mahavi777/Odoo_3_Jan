import Attendance from '../models/Attendance.js';
import Activity from '../models/Activity.js';
import User from '../models/User.js';
<<<<<<< HEAD
import { startOfDay } from '../utils/date.util.js';
import { generateDailyAttendance } from '../services/attendance.service.js';
=======

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}
>>>>>>> 2d8b04120d7fd7b709cfea99b3a6f39997900c6b

// POST /api/attendance/checkin
export const checkIn = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = startOfDay(new Date());
    const checkInTime = new Date();

    let attendance = await Attendance.findOne({ user: userId, date: today });
    if (attendance && attendance.checkIn) {
      return res.status(400).json({ message: 'Already checked in for today' });
    }

    if (!attendance) {
      attendance = new Attendance({ 
        user: userId, 
        date: today, 
        checkIn: checkInTime,
        checkInTime: checkInTime,
        status: 'Present' 
      });
    } else {
      attendance.checkIn = checkInTime;
      attendance.checkInTime = checkInTime;
      attendance.status = 'Present';
    }

    await attendance.save();

    // log activity
    await Activity.create({ user: userId, activityType: 'login', description: 'Checked in' });

    res.json({ message: 'Checked in successfully', attendance });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/attendance/checkout
export const checkOut = async (req, res) => {
  try {
    const userId = req.user.id;
    const { breakTime } = req.body; // breakTime in minutes
    const today = startOfDay(new Date());
    const checkOutTime = new Date();

    let attendance = await Attendance.findOne({ user: userId, date: today });
    if (!attendance) {
      return res.status(400).json({ message: 'No check-in found for today' });
    }
    if (!attendance.checkIn) {
      return res.status(400).json({ message: 'Please check in first before checking out' });
    }
    if (attendance.checkOut) {
      return res.status(400).json({ message: 'Already checked out for today' });
    }

<<<<<<< HEAD
    attendance.checkOut = new Date();
    attendance.breakTime = breakTime || 0;

    if (attendance.checkIn) {
      const checkInTime = attendance.checkIn.getTime();
      const checkOutTime = attendance.checkOut.getTime();
      const totalDuration = (checkOutTime - checkInTime) / (1000 * 60 * 60); // in hours
      const totalWork = totalDuration - (attendance.breakTime / 60);
      attendance.totalWorkingHours = totalWork > 0 ? totalWork : 0;
    }
    
    // if checkIn exists ensure status is Present
    attendance.status = attendance.status || 'Present';
=======
    attendance.checkOut = checkOutTime;
    attendance.checkOutTime = checkOutTime;
    attendance.status = 'Present';
    
    // Calculate total working hours
    if (attendance.checkIn && attendance.checkOut) {
      const diffMs = attendance.checkOut - attendance.checkIn;
      attendance.totalWorkingHours = parseFloat((diffMs / (1000 * 60 * 60)).toFixed(2));
    }
>>>>>>> 2d8b04120d7fd7b709cfea99b3a6f39997900c6b

    await attendance.save();

    await Activity.create({ user: userId, activityType: 'login', description: 'Checked out' });

    res.json({ message: 'Checked out successfully', attendance });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/attendance/me?month=MM&year=YYYY
export const getMyAttendance = async (req, res) => {
  try {
    const userId = req.user.id;
    const { month, year } = req.query;

    let filter = { user: userId };
    if (month && year) {
      const m = parseInt(month, 10) - 1; // JS months 0-11
      const y = parseInt(year, 10);
      const from = new Date(y, m, 1);
      const to = new Date(y, m + 1, 1);
      filter.date = { $gte: from, $lt: to };
    }

    const records = await Attendance.find(filter).sort({ date: -1 });
    res.json(records);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/attendance/user/:id?month=MM&year=YYYY
export const getAttendanceForUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { month, year } = req.query;

    let filter = { user: userId };
    if (month && year) {
      const m = parseInt(month, 10) - 1;
      const y = parseInt(year, 10);
      const from = new Date(y, m, 1);
      const to = new Date(y, m + 1, 1);
      filter.date = { $gte: from, $lt: to };
    }

    const records = await Attendance.find(filter).sort({ date: -1 });
    res.json(records);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/attendance/today - Get today's attendance for logged-in user
export const getTodayAttendance = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = startOfDay(new Date());

    const attendance = await Attendance.findOne({ user: userId, date: today });
    
    if (!attendance) {
      return res.json({ 
        attendance: null, 
        status: 'not_checked_in',
        message: 'No attendance record for today' 
      });
    }

    res.json({ 
      attendance,
      status: attendance.checkOut ? 'checked_out' : attendance.checkIn ? 'checked_in' : 'not_checked_in'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/attendance/all?month=MM&year=YYYY&userId=...
export const getAllAttendance = async (req, res) => {
  try {
    const { month, year, userId } = req.query;
    let filter = {};
    if (userId) filter.user = userId;
    if (month && year) {
      const m = parseInt(month, 10) - 1;
      const y = parseInt(year, 10);
      const from = new Date(y, m, 1);
      const to = new Date(y, m + 1, 1);
      filter.date = { $gte: from, $lt: to };
    }

    const records = await Attendance.find(filter).populate('user', 'fullName email profileImage role').sort({ date: -1 });
    res.json(records);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const generateDailyAttendanceRecords = async (req, res) => {
    try {
        await generateDailyAttendance();
        res.status(200).json({ message: 'Daily attendance generated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

