import User from '../models/User.js';
import Attendance from '../models/Attendance.js';
import { startOfDay } from '../utils/date.util.js'; // I'll create this util file next

export const generateDailyAttendance = async () => {
    const today = startOfDay(new Date());
    const users = await User.find({ status: 'ACTIVE' });

    for (const user of users) {
        const attendance = await Attendance.findOne({ user: user._id, date: today });

        if (!attendance) {
            await Attendance.create({
                user: user._id,
                date: today,
                status: 'Absent',
            });
        }
    }
};
