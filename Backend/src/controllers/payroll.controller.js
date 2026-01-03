import Payroll from '../models/Payroll.js';
import User from '../models/User.js';
import Activity from '../models/Activity.js';
import SalaryAndBankInfo from '../models/SalaryAndBankInfo.js';

// @route   GET /api/payroll/me
// @desc    Get current user's payroll (read-only for employees)
// @access  Private
export const getMyPayroll = async (req, res) => {
  try {
    const userId = req.user.id;
    let payroll = await Payroll.findOne({ user: userId });

    // If no payroll exists, try to get from SalaryAndBankInfo
    if (!payroll) {
      const salaryInfo = await SalaryAndBankInfo.findOne({ user: userId });
      if (salaryInfo) {
        payroll = {
          user: userId,
          salaryStructure: salaryInfo.salaryStructure || {},
          bankDetails: {
            bankName: salaryInfo.bankName,
            accountNumber: salaryInfo.accountNumber,
            ifscCode: salaryInfo.ifscCode,
          },
        };
      }
    }

    if (!payroll) {
      return res.status(404).json({ message: 'Payroll information not found' });
    }

    res.json(payroll);
  } catch (err) {
    console.error('Get payroll error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @route   GET /api/payroll/all
// @desc    Get all employees' payroll (Admin/HR only)
// @access  Private (Admin/HR)
export const getAllPayroll = async (req, res) => {
  try {
    const payrolls = await Payroll.find({})
      .populate('user', 'fullName email employeeId role profileImage')
      .sort({ createdAt: -1 });

    res.json(payrolls);
  } catch (err) {
    console.error('Get all payroll error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @route   GET /api/payroll/user/:userId
// @desc    Get specific user's payroll (Admin/HR only)
// @access  Private (Admin/HR)
export const getUserPayroll = async (req, res) => {
  try {
    const { userId } = req.params;
    const payroll = await Payroll.findOne({ user: userId })
      .populate('user', 'fullName email employeeId role profileImage');

    if (!payroll) {
      return res.status(404).json({ message: 'Payroll information not found' });
    }

    res.json(payroll);
  } catch (err) {
    console.error('Get user payroll error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @route   POST /api/payroll
// @desc    Create payroll for a user (Admin/HR only)
// @access  Private (Admin/HR)
export const createPayroll = async (req, res) => {
  try {
    const { userId, salaryStructure, bankDetails, payFrequency, currency, effectiveDate } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Check if payroll already exists
    const existingPayroll = await Payroll.findOne({ user: userId });
    if (existingPayroll) {
      return res.status(400).json({ message: 'Payroll already exists for this user' });
    }

    const payroll = new Payroll({
      user: userId,
      salaryStructure: salaryStructure || {},
      bankDetails: bankDetails || {},
      payFrequency: payFrequency || 'Monthly',
      currency: currency || 'INR',
      effectiveDate: effectiveDate || new Date(),
    });

    await payroll.save();

    // Update SalaryAndBankInfo if it exists
    await SalaryAndBankInfo.findOneAndUpdate(
      { user: userId },
      {
        bankName: bankDetails?.bankName,
        accountNumber: bankDetails?.accountNumber,
        ifscCode: bankDetails?.ifscCode,
        salaryStructure: salaryStructure,
      },
      { upsert: true }
    );

    await Activity.create({
      user: req.user.id,
      activityType: 'payroll_create',
      description: `Created payroll for user ${userId}`,
    });

    res.status(201).json(payroll);
  } catch (err) {
    console.error('Create payroll error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @route   PUT /api/payroll/:id
// @desc    Update payroll (Admin/HR only)
// @access  Private (Admin/HR)
export const updatePayroll = async (req, res) => {
  try {
    const { id } = req.params;
    const { salaryStructure, bankDetails, payFrequency, currency, effectiveDate, status } = req.body;

    const payroll = await Payroll.findById(id);
    if (!payroll) {
      return res.status(404).json({ message: 'Payroll not found' });
    }

    if (salaryStructure) {
      payroll.salaryStructure = { ...payroll.salaryStructure, ...salaryStructure };
    }
    if (bankDetails) {
      payroll.bankDetails = { ...payroll.bankDetails, ...bankDetails };
    }
    if (payFrequency) payroll.payFrequency = payFrequency;
    if (currency) payroll.currency = currency;
    if (effectiveDate) payroll.effectiveDate = effectiveDate;
    if (status) payroll.status = status;

    await payroll.save();

    // Update SalaryAndBankInfo
    await SalaryAndBankInfo.findOneAndUpdate(
      { user: payroll.user },
      {
        bankName: payroll.bankDetails?.bankName,
        accountNumber: payroll.bankDetails?.accountNumber,
        ifscCode: payroll.bankDetails?.ifscCode,
        salaryStructure: payroll.salaryStructure,
      },
      { upsert: true }
    );

    await Activity.create({
      user: req.user.id,
      activityType: 'payroll_update',
      description: `Updated payroll for user ${payroll.user}`,
    });

    res.json(payroll);
  } catch (err) {
    console.error('Update payroll error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @route   PUT /api/payroll/user/:userId
// @desc    Update payroll by user ID (Admin/HR only)
// @access  Private (Admin/HR)
export const updatePayrollByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const { salaryStructure, bankDetails, payFrequency, currency, effectiveDate, status } = req.body;

    let payroll = await Payroll.findOne({ user: userId });

    if (!payroll) {
      // Create new payroll if it doesn't exist
      payroll = new Payroll({
        user: userId,
        salaryStructure: salaryStructure || {},
        bankDetails: bankDetails || {},
        payFrequency: payFrequency || 'Monthly',
        currency: currency || 'INR',
        effectiveDate: effectiveDate || new Date(),
      });
    } else {
      // Update existing payroll
      if (salaryStructure) {
        payroll.salaryStructure = { ...payroll.salaryStructure, ...salaryStructure };
      }
      if (bankDetails) {
        payroll.bankDetails = { ...payroll.bankDetails, ...bankDetails };
      }
      if (payFrequency) payroll.payFrequency = payFrequency;
      if (currency) payroll.currency = currency;
      if (effectiveDate) payroll.effectiveDate = effectiveDate;
      if (status) payroll.status = status;
    }

    await payroll.save();

    // Update SalaryAndBankInfo
    await SalaryAndBankInfo.findOneAndUpdate(
      { user: userId },
      {
        bankName: payroll.bankDetails?.bankName,
        accountNumber: payroll.bankDetails?.accountNumber,
        ifscCode: payroll.bankDetails?.ifscCode,
        salaryStructure: payroll.salaryStructure,
      },
      { upsert: true }
    );

    await Activity.create({
      user: req.user.id,
      activityType: 'payroll_update',
      description: `Updated payroll for user ${userId}`,
    });

    res.json(payroll);
  } catch (err) {
    console.error('Update payroll error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

