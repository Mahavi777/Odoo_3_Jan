import express from 'express';
const router = express.Router();
import { protect } from '../middleware/auth.middleware.js';
import { checkRole } from '../middleware/role.middleware.js';
import * as payrollController from '../controllers/payroll.controller.js';

// Employee routes (read-only)
router.get('/me', protect, payrollController.getMyPayroll);

// Admin/HR routes
router.get('/all', protect, checkRole(['ADMIN', 'HR']), payrollController.getAllPayroll);
router.get('/user/:userId', protect, checkRole(['ADMIN', 'HR']), payrollController.getUserPayroll);
router.post('/', protect, checkRole(['ADMIN', 'HR']), payrollController.createPayroll);
router.put('/:id', protect, checkRole(['ADMIN', 'HR']), payrollController.updatePayroll);
router.put('/user/:userId', protect, checkRole(['ADMIN', 'HR']), payrollController.updatePayrollByUserId);

export default router;

