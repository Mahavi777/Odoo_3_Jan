import express from 'express';
const router = express.Router();
import * as userController from '../controllers/user.controller.js';
import { protect } from '../middleware/auth.middleware.js';

router.get('/', protect, userController.getAllUsers);

export default router;
