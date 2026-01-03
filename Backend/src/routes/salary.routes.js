import express from 'express';
const router = express.Router();
import * as salaryController from '../controllers/salary.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { checkRole } from '../middleware/role.middleware.js';

const adminOnly = [protect, checkRole(['ADMIN', 'HR'])];

// Routes for simple salary management
router.get('/', adminOnly, salaryController.getAllSalaries);
router.get('/:userId', adminOnly, salaryController.getSalary);
router.post('/:userId', adminOnly, salaryController.setOrUpdateSalary);
router.put('/:userId', adminOnly, salaryController.setOrUpdateSalary);

// Routes for complex salary structure management
router.get('/structure/:userId', adminOnly, salaryController.getSalaryStructure);
router.post('/structure', adminOnly, salaryController.createSalaryStructure);
router.put('/structure/:userId', adminOnly, salaryController.updateSalaryStructure);


export default router;