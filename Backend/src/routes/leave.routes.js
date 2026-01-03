import express from 'express';
const router = express.Router();
import { protect } from '../middleware/auth.middleware.js';
import { checkRole } from '../middleware/role.middleware.js';
import * as leaveController from '../controllers/leave.controller.js';

// Employee routes
router.post('/', protect, leaveController.applyForLeave);
router.get('/me', protect, leaveController.getMyLeaves);
router.delete('/:id', protect, leaveController.cancelLeave);

// Admin/HR routes
router.get('/all', protect, checkRole(['ADMIN', 'HR']), leaveController.getAllLeaves);
router.put('/:id/approve', protect, checkRole(['ADMIN', 'HR']), leaveController.approveLeave);
router.put('/:id/reject', protect, checkRole(['ADMIN', 'HR']), leaveController.rejectLeave);

export default router;

