import express from 'express';
const router = express.Router();
import { protect } from '../middleware/auth.middleware.js';
import * as dashboardController from '../controllers/dashboard.controller.js';

// GET /api/dashboard
router.get('/', protect, dashboardController.getDashboard);

export default router;

 
