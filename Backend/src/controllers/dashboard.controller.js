import Attendance from '../models/Attendance.js';
import Activity from '../models/Activity.js';
import User from '../models/User.js';

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

// GET /api/dashboard
export const getDashboard = async (req, res) => {
  try {
    const today = startOfDay(new Date());

    const totalUsers = await User.countDocuments();
    const presentToday = await Attendance.countDocuments({ date: today, checkIn: { $exists: true } });
    const leaveToday = await Attendance.countDocuments({ date: today, status: 'Leave' });
    const absentToday = Math.max(0, totalUsers - presentToday - leaveToday);

    const recentActivities = await Activity.find({}).sort({ createdAt: -1 }).limit(10).populate('user', 'firstName lastName username');

    res.json({
      totalUsers,
      presentToday,
      leaveToday,
      absentToday,
      recentActivities,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

