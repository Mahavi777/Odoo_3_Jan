const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const attendanceController = require('../controllers/attendance.controller');

router.post('/checkin', protect, attendanceController.checkIn);
router.post('/checkout', protect, attendanceController.checkOut);
router.get('/me', protect, attendanceController.getMyAttendance);
router.get('/user/:id', protect, attendanceController.getAttendanceForUser);

module.exports = router;
