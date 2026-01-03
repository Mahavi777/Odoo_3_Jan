import express from 'express';
const router = express.Router();
import * as authController from '../controllers/auth.controller.js';

router.post('/signup', authController.signup);
router.post('/signin', authController.signin);
router.post('/verify-otp', authController.verifyOtp);
router.post('/google-signin', authController.googleSignin);
router.get('/google', authController.googleAuth);
router.get('/google/callback', authController.googleAuthCallback);
router.get('/github/callback', authController.githubCallback);

export default router;