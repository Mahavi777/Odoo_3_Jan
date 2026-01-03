import Attendance from '../models/Attendance.js';
import Activity from '../models/Activity.js';
import User from '../models/User.js';

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

// POST /api/attendance/checkin
export const checkIn = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = startOfDay(new Date());

    let attendance = await Attendance.findOne({ user: userId, date: today });
    if (attendance && attendance.checkIn) {
      return res.status(400).json({ message: 'Already checked in for today' });
    }

    if (!attendance) {
      attendance = new Attendance({ user: userId, date: today, checkIn: new Date(), status: 'Present' });
    } else {
      attendance.checkIn = new Date();
      attendance.status = 'Present';
    }

    await attendance.save();

    // log activity
    await Activity.create({ user: userId, activityType: 'login', description: 'Checked in' });

    res.json({ message: 'Checked in', attendance });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/attendance/checkout
export const checkOut = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = startOfDay(new Date());

    let attendance = await Attendance.findOne({ user: userId, date: today });
    if (!attendance) {
      return res.status(400).json({ message: 'No check-in found for today' });
    }
    if (attendance.checkOut) {
      return res.status(400).json({ message: 'Already checked out for today' });
    }

    attendance.checkOut = new Date();
    // if checkIn exists ensure status is Present
    attendance.status = attendance.status || 'Present';

    await attendance.save();

    await Activity.create({ user: userId, activityType: 'login', description: 'Checked out' });

    res.json({ message: 'Checked out', attendance });
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

