import express from 'express';
const router = express.Router();
import * as aiController from '../controllers/ai.controller.js';

router.post('/chat', aiController.chat);

export default router;