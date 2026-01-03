import asyncHandler from 'express-async-handler';
import SalaryStructure from '../models/SalaryStructure.js';
import User from '../models/User.js';

// @desc    Create a salary structure
// @route   POST /api/salary
// @access  Admin/HR
const createSalaryStructure = asyncHandler(async (req, res) => {
    const { userId, wage, components, pfConfiguration, deductions } = req.body;

    const user = await User.findById(userId);
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    const salaryStructureExists = await SalaryStructure.findOne({ user: userId });
    if (salaryStructureExists) {
        res.status(400);
        throw new Error('Salary structure already exists for this user');
    }

    const salaryStructure = new SalaryStructure({
        user: userId,
        wage,
        components,
        pfConfiguration,
        deductions,
    });

    const createdSalaryStructure = await salaryStructure.save();
    res.status(201).json(createdSalaryStructure);
});

// @desc    Update a salary structure
// @route   PUT /api/salary/:userId
// @access  Admin/HR
const updateSalaryStructure = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { wage, components, pfConfiguration, deductions } = req.body;

    const salaryStructure = await SalaryStructure.findOne({ user: userId });

    if (salaryStructure) {
        salaryStructure.wage = wage || salaryStructure.wage;
        salaryStructure.components = components || salaryStructure.components;
        salaryStructure.pfConfiguration = pfConfiguration || salaryStructure.pfConfiguration;
        salaryStructure.deductions = deductions || salaryStructure.deductions;

        const updatedSalaryStructure = await salaryStructure.save();
        res.json(updatedSalaryStructure);
    } else {
        res.status(404);
        throw new Error('Salary structure not found');
    }
});

// @desc    Get a salary structure
// @route   GET /api/salary/:userId
// @access  Admin/HR
const getSalaryStructure = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const salaryStructure = await SalaryStructure.findOne({ user: userId }).populate('user', 'fullName email');

    if (salaryStructure) {
        res.json(salaryStructure);
    } else {
        res.status(404);
        throw new Error('Salary structure not found');
    }
});

export {
    createSalaryStructure,
    updateSalaryStructure,
    getSalaryStructure,
};
