import multer from 'multer';
import path from 'path';
import { protect } from '../middleware/auth.middleware.js';
import User from '../models/User.js';
import Activity from '../models/Activity.js';
import PersonalInfo from '../models/PersonalInfo.js';
import SalaryAndBankInfo from '../models/SalaryAndBankInfo.js';
import Payroll from '../models/Payroll.js';
import { checkRole } from '../middleware/role.middleware.js';

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Save uploads in Backend/src/uploads/profile-pictures
    cb(null, 'src/uploads/profile-pictures');
  },
  filename: function (req, file, cb) {
    cb(null, `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB file size limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single('avatar');

function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) return cb(null, true);
  return cb(new Error('Images Only!'));
}

// @route   PUT /api/profile/avatar
// @desc    Update user avatar
// @access  Private
const updateAvatar = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error('Upload error:', err);
      return res.status(400).json({ message: err.message || err });
    }

    if (!req.file) return res.status(400).json({ message: 'Error: No File Selected!' });

    try {
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ message: 'User not found' });

      // Path exposed for frontend; ensure static middleware serves '/uploads'
      const avatarPath = `/uploads/profile-pictures/${req.file.filename}`;
      user.profileImage = avatarPath;
      await user.save();

      try {
        await Activity.create({ user: user._id, activityType: 'profile_update', description: 'User updated avatar.' });
      } catch (activityErr) {
        console.error('Activity log failed:', activityErr);
      }

      res.json({ message: 'Avatar updated successfully', profileImage: avatarPath });
    } catch (error) {
      console.error('updateAvatar error:', error);
      res.status(500).send('Server Error');
    }
  });
};

// @route   GET api/profile/me
// @desc    Get current user's profile with all related info
// @access  Private
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password').populate('manager', 'fullName email');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const personalInfo = await PersonalInfo.findOne({ user: req.user.id });
    const salaryInfo = await SalaryAndBankInfo.findOne({ user: req.user.id });
    const payroll = await Payroll.findOne({ user: req.user.id });

    const userObj = user.toObject();
    if (userObj.fullName) {
      const parts = userObj.fullName.split(' ');
      userObj.firstName = parts.shift();
      userObj.lastName = parts.join(' ');
    } else {
      userObj.firstName = userObj.firstName || '';
      userObj.lastName = userObj.lastName || '';
    }

    userObj.profileImage = userObj.profileImage || '';

    const profileData = { ...userObj, personalInfo: personalInfo || {}, salaryInfo: salaryInfo || {}, payroll: payroll || null };

    res.json(profileData);
  } catch (err) {
    console.error('getProfile error:', err.message || err);
    res.status(500).send('Server Error');
  }
};

// @route   PUT api/profile/me
// @desc    Update user profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { fullName, firstName, lastName, phone, jobPosition, department, manager, location, dateOfJoining, status, address } = req.body;

    let finalFullName = fullName;
    if (!finalFullName && (firstName || lastName)) finalFullName = `${firstName || ''} ${lastName || ''}`.trim();

    const updatedFields = {};
    if (finalFullName) updatedFields.fullName = finalFullName;
    if (phone !== undefined) updatedFields.phone = phone;
    if (jobPosition !== undefined) updatedFields.jobPosition = jobPosition;
    if (department !== undefined) updatedFields.department = department;
    if (manager !== undefined) updatedFields.manager = manager;
    if (location !== undefined) updatedFields.location = location;
    if (dateOfJoining !== undefined) updatedFields.dateOfJoining = dateOfJoining;
    if (status !== undefined) updatedFields.status = status;

    const updatedUser = await User.findByIdAndUpdate(req.user.id, { $set: updatedFields }, { new: true }).select('-password');

    if (address !== undefined) {
      try {
        await PersonalInfo.findOneAndUpdate({ user: req.user.id }, { $set: { address } }, { upsert: true, new: true });
      } catch (personalInfoError) {
        console.error('Error updating personal info:', personalInfoError);
      }
    }

    try {
      await Activity.create({ user: user._id, activityType: 'profile_update', description: 'User updated their profile.' });
    } catch (activityError) {
      console.error('Error logging activity:', activityError);
    }

    const userObj = updatedUser.toObject();
    if (userObj.fullName) {
      const parts = userObj.fullName.split(' ');
      userObj.firstName = parts.shift();
      userObj.lastName = parts.join(' ');
    }

    res.json(userObj);
  } catch (err) {
    console.error('Update profile error:', err);
    if (err.code === 11000) return res.status(400).json({ message: 'Duplicate field value', details: err.keyValue });
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @route   GET api/profile/activity
// @desc    Get user activity
// @access  Private
const getActivity = async (req, res) => {
  try {
    const activities = await Activity.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(activities);
  } catch (err) {
    console.error('getActivity error:', err.message || err);
    res.status(500).send('Server Error');
  }
};

// @route   GET api/profile/usernames
// @desc    Get all usernames (for technician list)
// @access  Private
const getAllUsernames = async (req, res) => {
  try {
    const users = await User.find({}).select('_id username firstName lastName');
    res.json(users.map((user) => ({ _id: user._id, username: user.username, firstName: user.firstName, lastName: user.lastName })));
  } catch (err) {
    console.error('getAllUsernames error:', err.message || err);
    res.status(500).send('Server Error');
  }
};

// ===== Admin utilities =====
// @route   GET api/profile
// @desc    Get all users (admin)
// @access  Private (ADMIN)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (err) {
    console.error('getAllUsers error:', err.message || err);
    res.status(500).send('Server Error');
  }
};

// @route   PUT api/profile/me/personal
// @desc    Update personal info (limited fields for employees, all for admin)
// @access  Private
const updatePersonalInfo = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    const isAdmin = user && (user.role === 'ADMIN' || user.role === 'HR');

    const { address, phone, personalEmail, gender, dateOfBirth, maritalStatus, nationality } = req.body;

    const updateData = {};
    if (isAdmin) {
      if (address !== undefined) updateData.address = address;
      if (phone !== undefined) updateData.phone = phone;
      if (personalEmail !== undefined) updateData.personalEmail = personalEmail;
      if (gender !== undefined) updateData.gender = gender;
      if (dateOfBirth !== undefined) updateData.dateOfBirth = dateOfBirth;
      if (maritalStatus !== undefined) updateData.maritalStatus = maritalStatus;
      if (nationality !== undefined) updateData.nationality = nationality;
    } else {
      if (address !== undefined) updateData.address = address;
      if (phone !== undefined) updateData.phone = phone;
    }

    if (phone && !isAdmin) {
      await User.findByIdAndUpdate(userId, { phone });
    }

    const personalInfo = await PersonalInfo.findOneAndUpdate({ user: userId }, { $set: updateData }, { new: true, upsert: true });

    try {
      await Activity.create({ user: userId, activityType: 'profile_update', description: 'Updated personal information' });
    } catch (activityError) {
      console.error('Error logging activity:', activityError);
    }

    res.json(personalInfo);
  } catch (err) {
    console.error('Update personal info error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @route   GET api/profile/user/:userId
// @desc    Get user profile by ID (Admin/HR only)
// @access  Private (Admin/HR)
const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select('-password').populate('manager', 'fullName email');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const personalInfo = await PersonalInfo.findOne({ user: userId });
    const salaryInfo = await SalaryAndBankInfo.findOne({ user: userId });
    const payroll = await Payroll.findOne({ user: userId });

    const userObj = user.toObject();
    if (userObj.fullName) {
      const parts = userObj.fullName.split(' ');
      userObj.firstName = parts.shift();
      userObj.lastName = parts.join(' ');
    }

    const profileData = { ...userObj, personalInfo: personalInfo || {}, salaryInfo: salaryInfo || {}, payroll: payroll || null };

    res.json(profileData);
  } catch (err) {
    console.error('getUserProfile error:', err.message || err);
    res.status(500).send('Server Error');
  }
};

// @route   GET api/profile/:id
// @desc    Get user by id (admin)
// @access  Private (ADMIN)
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('getUserById error:', err.message || err);
    res.status(500).send('Server Error');
  }
};

// @route   PUT api/profile/:id
// @desc    Update user by id (admin)
// @access  Private (ADMIN)
const updateUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const updatable = ['fullName', 'email', 'phone', 'jobPosition', 'department', 'manager', 'location', 'dateOfJoining', 'status', 'role', 'employeeId'];
    const updatedFields = {};
    updatable.forEach((key) => {
      if (req.body[key] !== undefined) updatedFields[key] = req.body[key];
    });

    const updatedUser = await User.findByIdAndUpdate(req.params.id, { $set: updatedFields }, { new: true }).select('-password');

    try {
      await Activity.create({ user: req.user.id, activityType: 'profile_update', description: `Admin updated user ${req.params.id}` });
    } catch (activityError) {
      console.error('Activity log error:', activityError);
    }

    res.json(updatedUser);
  } catch (err) {
    console.error('updateUserById error:', err.message || err);
    res.status(500).send('Server Error');
  }
};

// @route   PUT api/profile/user/:userId
// @desc    Update any user's profile (Admin/HR only)
// @access  Private (Admin/HR)
const updateUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const allowed = ['fullName', 'email', 'phone', 'jobPosition', 'department', 'manager', 'location', 'dateOfJoining', 'status', 'role', 'employeeId'];
    const updatedFields = {};
    allowed.forEach((k) => { if (req.body[k] !== undefined) updatedFields[k] = req.body[k]; });

    const updatedUser = await User.findByIdAndUpdate(userId, { $set: updatedFields }, { new: true }).select('-password');

    try {
      await Activity.create({ user: req.user.id, activityType: 'profile_update', description: `Admin ${req.user.id} updated user ${userId}` });
    } catch (activityError) {
      console.error('Activity log error:', activityError);
    }

    res.json(updatedUser);
  } catch (err) {
    console.error('updateUserProfile error:', err.message || err);
    res.status(500).send('Server Error');
  }
};

export {
  updateAvatar,
  getProfile,
  updateProfile,
  getActivity,
  getAllUsernames,
  getAllUsers,
  updatePersonalInfo,
  getUserProfile,
  getUserById,
  updateUserById,
  updateUserProfile,
};