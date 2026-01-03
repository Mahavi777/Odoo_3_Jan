import express from 'express';
const router = express.Router();
import * as userController from '../controllers/user.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { checkRole } from '../middleware/role.middleware.js';

router.get('/', protect, userController.getAllUsers);
router.get('/all', protect, checkRole(['ADMIN', 'HR']), userController.getAllUsers);
router.put('/:userId', protect, checkRole(['ADMIN', 'HR']), userController.updateUser);

export default router;
