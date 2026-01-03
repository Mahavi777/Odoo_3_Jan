import express from 'express';
const router = express.Router();
import { protect } from '../middleware/auth.middleware.js';
import { checkRole } from '../middleware/role.middleware.js';
import * as profileController from '../controllers/profile.controller.js';

router.put('/avatar', protect, profileController.updateAvatar);
router.get('/me', protect, profileController.getProfile);
router.put('/me', protect, profileController.updateProfile);
router.put('/me/personal', protect, profileController.updatePersonalInfo);
router.get('/activity', protect, profileController.getActivity);
router.get('/usernames', protect, profileController.getAllUsernames);

// Admin/HR routes
router.get('/user/:userId', protect, checkRole(['ADMIN', 'HR']), profileController.getUserProfile);
router.put('/user/:userId', protect, checkRole(['ADMIN', 'HR']), profileController.updateUserProfile);

export default router;