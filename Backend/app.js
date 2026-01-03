import dotenv from 'dotenv';
import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import path from 'path';
import passport from 'passport';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

import aiRoutes from './src/routes/ai.routes.js';
import otpRoutes from './src/routes/otp.routes.js';
import passwordResetRoutes from './src/routes/passwordReset.routes.js';
import authRoutes from './src/routes/auth.routes.js';
import profileRoutes from './src/routes/profile.routes.js';
import userRoutes from './src/routes/user.routes.js';
import attendanceRoutes from './src/routes/attendance.routes.js';
import dashboardRoutes from './src/routes/dashboard.routes.js';
import leaveRoutes from './src/routes/leave.routes.js';
import payrollRoutes from './src/routes/payroll.routes.js';
import connectDB from './src/config/db.js';

const app = express();

// Initialize Passport
app.use(passport.initialize());

// Allow requests from your frontend development server
const corsOptions = {
  origin: 'http://localhost:5174', // or your frontend's port
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// after app.use(express.json())...
app.use("/api/ai", aiRoutes);

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// this line to enable your OTP routes
app.use('/api/otp', otpRoutes);
app.use('/api/password-reset', passwordResetRoutes);


connectDB();

// Handle other connection events
mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB runtime error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️  MongoDB disconnected');
});

// Mount the auth routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/users', userRoutes);
// Mount attendance and dashboard routes
app.use('/api/attendance', attendanceRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/leave', leaveRoutes);
app.use('/api/payroll', payrollRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));