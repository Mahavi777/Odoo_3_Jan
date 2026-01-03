import express from 'express';
const router = express.Router();
import * as salaryController from '../controllers/salary.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { checkRole } from '../middleware/role.middleware.js';

// @route   POST api/salary
// @desc    Create a salary structure for a user
// @access  Admin
router.post('/', protect, checkRole(['ADMIN', 'HR']), salaryController.createSalaryStructure);

// @route   PUT api/salary/:userId
// @desc    Update a salary structure for a user
// @access  Admin
router.put('/:userId', protect, checkRole(['ADMIN', 'HR']), salaryController.updateSalaryStructure);

// @route   GET api/salary/:userId
// @desc    Get a salary structure for a user
// @access  Admin
router.get('/:userId', protect, checkRole(['ADMIN', 'HR']), salaryController.getSalaryStructure);

export default router;
