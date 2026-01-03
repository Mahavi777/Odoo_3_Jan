import express from 'express';
const router = express.Router();
import { protect } from '../middleware/auth.middleware.js';
import * as profileController from '../controllers/profile.controller.js';

router.put('/avatar', protect, profileController.updateAvatar);
router.get('/me', protect, profileController.getProfile);
router.put('/me', protect, profileController.updateProfile);
router.get('/activity', protect, profileController.getActivity);
router.get('/usernames', protect, profileController.getAllUsernames);

export default router;