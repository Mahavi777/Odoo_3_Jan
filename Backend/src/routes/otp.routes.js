import express from 'express';
const router = express.Router();
import { requestOtp, verifyOtp, changePassword, otpRequestLimiter, otpVerifyLimiter } from '../controllers/otp.controller.js';

router.post('/request-otp', otpRequestLimiter, requestOtp);
router.post('/verify-otp', otpVerifyLimiter, verifyOtp);
router.post('/change-password', changePassword);

export default router;