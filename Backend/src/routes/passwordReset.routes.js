import express from 'express';
const router = express.Router();
import { forgotPassword, verifyCode, resetPassword } from '../controllers/passwordReset.controller.js';

// @route   POST api/password-reset/forgot-password
// @desc    Send password reset email
// @access  Public
router.post('/forgot-password', forgotPassword);

// @route   POST api/password-reset/verify-code
// @desc    Verify reset code
// @access  Public
router.post('/verify-code', verifyCode);

// @route   POST api/password-reset/reset-password
// @desc    Reset password after code verification
// @access  Public
router.post('/reset-password', resetPassword);

export default router;