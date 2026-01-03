import express from 'express';
const router = express.Router();
import { protect, requireRole } from '../middleware/auth.middleware.js';
import * as attendanceController from '../controllers/attendance.controller.js';

router.post('/checkin', protect, attendanceController.checkIn);
router.post('/checkout', protect, attendanceController.checkOut);
router.get('/today', protect, attendanceController.getTodayAttendance);
router.get('/me', protect, attendanceController.getMyAttendance);
router.get('/user/:id', protect, attendanceController.getAttendanceForUser);

// Admin/HR: list all attendance (optional filters)
router.get('/all', protect, requireRole(['ADMIN', 'HR']), attendanceController.getAllAttendance);

router.post('/generate-daily', protect, requireRole(['ADMIN', 'HR']), attendanceController.generateDailyAttendanceRecords);

export default router;
