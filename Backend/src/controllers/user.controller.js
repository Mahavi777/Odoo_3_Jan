import User from '../models/User.js';
import PersonalInfo from '../models/PersonalInfo.js';

// @desc    Get all users
// @route   GET /api/users
// @access  Private
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update user profile by admin
// @route   PUT /api/users/:userId
// @access  Private (Admin, HR)
export const updateUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const {
            firstName,
            lastName,
            phone,
            location,
            jobPosition,
            department,
            dateOfJoining,
            personalInfo: personalInfoData,
        } = req.body;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.fullName = `${user.firstName} ${user.lastName}`;
        user.phone = phone || user.phone;
        user.location = location || user.location;
        user.jobPosition = jobPosition || user.jobPosition;
        user.department = department || user.department;
        user.dateOfJoining = dateOfJoining || user.dateOfJoining;

        await user.save();

        if (personalInfoData) {
            let personalInfo = await PersonalInfo.findOne({ user: userId });
            if (!personalInfo) {
                personalInfo = new PersonalInfo({ user: userId });
            }

            personalInfo.address = personalInfoData.address || personalInfo.address;
            personalInfo.personalEmail = personalInfoData.personalEmail || personalInfo.personalEmail;
            personalInfo.gender = personalInfoData.gender || personalInfo.gender;
            personalInfo.dateOfBirth = personalInfoData.dateOfBirth || personalInfo.dateOfBirth;
            personalInfo.maritalStatus = personalInfoData.maritalStatus || personalInfo.maritalStatus;
            personalInfo.nationality = personalInfoData.nationality || personalInfo.nationality;

            await personalInfo.save();
        }

        const updatedUser = await User.findById(userId).populate('personalInfo');

        res.json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};
