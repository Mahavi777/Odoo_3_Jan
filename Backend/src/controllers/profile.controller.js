import multer from 'multer';
import path from 'path';
import { protect } from '../middleware/auth.middleware.js';
import User from '../models/User.js';
import Activity from '../models/Activity.js';

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
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

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}

// @route   PUT /api/profile/avatar
// @desc    Update user avatar
// @access  Private
const updateAvatar = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err });
    }
    if (req.file == undefined) {
      return res.status(400).json({ message: 'Error: No File Selected!' });
    }

    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // The path should be accessible from the frontend
      const avatarPath = `/uploads/${req.file.filename}`;
      // store in `profileImage` field (matches User model)
      user.profileImage = avatarPath;
      await user.save();

      res.json({
        message: 'Avatar updated successfully',
        profileImage: avatarPath,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  });
};

// @route   GET api/profile/me
// @desc    Get current user's profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    // req.user is attached by the protect middleware
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Derive firstName/lastName from fullName for frontend compatibility
    const userObj = user.toObject();
    if (userObj.fullName) {
      const parts = userObj.fullName.split(' ');
      userObj.firstName = parts.shift();
      userObj.lastName = parts.join(' ');
    } else {
      userObj.firstName = userObj.firstName || '';
      userObj.lastName = userObj.lastName || '';
    }

    // Normalize profile image property
    userObj.profileImage = userObj.profileImage || '';

    res.json(userObj);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   PUT api/profile/me
// @desc    Update user profile
// @access  Private
const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { fullName, email, phone, jobPosition, department, manager, location, dateOfJoining, status } = req.body;
        
        const updatedFields = {
            fullName: fullName || user.fullName,
            email: email || user.email,
            phone: phone || user.phone,
            jobPosition: jobPosition || user.jobPosition,
            department: department || user.department,
            manager: manager || user.manager,
            location: location || user.location,
            dateOfJoining: dateOfJoining || user.dateOfJoining,
            status: status || user.status,
        };

        const updatedUser = await User.findByIdAndUpdate(req.user.id, { $set: updatedFields }, { new: true }).select('-password');

        await Activity.create({ user: user._id, activityType: 'profile_update', description: 'User updated their profile.' });

        res.json(updatedUser);
    } catch (err) {
        // Log full error for debugging
        console.error('Update profile error:', err);

        // Handle common duplicate key error (e.g., email unique index)
        if (err.code === 11000) {
          return res.status(400).json({ message: 'Duplicate field value', details: err.keyValue });
        }

        // Return more detailed error in non-production for easier debugging
        if (process.env.NODE_ENV !== 'production') {
          return res.status(500).json({ message: 'Server Error', error: err.message });
        }

        res.status(500).send('Server Error');
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
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};


// @route   GET api/profile/usernames
// @desc    Get all usernames (for technician list)
// @access  Private (assuming protect middleware is applied)
const getAllUsernames = async (req, res) => {
  try {
    const users = await User.find({}).select('_id username firstName lastName'); // Select _id, username, firstName, lastName
    res.json(users.map(user => ({
      _id: user._id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
    })));
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// primary exports are declared at bottom after admin utilities

// ===== Admin utilities: get all users, get user by id, update user by id =====
// @route   GET api/profile
// @desc    Get all users (admin)
// @access  Private (ADMIN)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (err) {
    console.error(err.message);
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
    console.error(err.message);
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

    const {
      fullName,
      email,
      phone,
      jobPosition,
      department,
      manager,
      location,
      dateOfJoining,
      status,
      role,
    } = req.body;

    const updatedFields = {
      fullName: fullName ?? user.fullName,
      email: email ?? user.email,
      phone: phone ?? user.phone,
      jobPosition: jobPosition ?? user.jobPosition,
      department: department ?? user.department,
      manager: manager ?? user.manager,
      location: location ?? user.location,
      dateOfJoining: dateOfJoining ?? user.dateOfJoining,
      status: status ?? user.status,
      role: role ?? user.role,
    };

    const updatedUser = await User.findByIdAndUpdate(req.params.id, { $set: updatedFields }, { new: true }).select('-password');

    // Use existing activityType 'profile_update' which is in Activity enum
    await Activity.create({ user: req.user._id, activityType: 'profile_update', description: `Admin ${req.user._id} updated user ${user._id}` });

    res.json(updatedUser);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

export { updateAvatar, getProfile, updateProfile, getActivity, getAllUsernames, getAllUsers, getUserById, updateUserById };