import Salary from '../models/Salary.js';
import User from '../models/User.js';
import SalaryStructure from '../models/SalaryStructure.js';
import { calculateSalaryComponents } from '../services/salary.service.js';

export const setOrUpdateSalary = async (req, res) => {
    try {
        const { userId } = req.params;
        const { wage } = req.body;

        if (!wage || isNaN(wage) || wage < 0) {
            return res.status(400).json({ message: 'Invalid wage amount' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const salaryComponents = calculateSalaryComponents(wage);

        let salary = await Salary.findOne({ user: userId });

        if (salary) {
            // Update existing salary
            salary.wage = wage;
            salary.basic = salaryComponents.basic;
            salary.hra = salaryComponents.hra;
            salary.allowances = salaryComponents.allowances;
            salary.pf = salaryComponents.pf;
            salary.tax = salaryComponents.tax;
            salary.netSalary = salaryComponents.netSalary;
            salary.ctc = salaryComponents.ctc;
        } else {
            // Create new salary
            salary = new Salary({
                user: userId,
                wage,
                ...salaryComponents,
            });
        }

        await salary.save();

        return res.status(200).json({ message: 'Salary updated successfully', data: salary });

    } catch (error) {
        console.error('Error in setOrUpdateSalary:', error);
        return res.status(500).json({ message: 'Server Error' });
    }
};

export const getSalary = async (req, res) => {
    try {
        const { userId } = req.params;
        const salary = await Salary.findOne({ user: userId }).populate('user', 'fullName email');

        if (!salary) {
            return res.status(404).json({ message: 'Salary information not found for this user' });
        }

        return res.status(200).json({ message: 'Salary details fetched', data: salary });
    } catch (error) {
        console.error('Error in getSalary:', error);
        return res.status(500).json({ message: 'Server Error' });
    }
};

export const getAllSalaries = async (req, res) => {
    try {
        const salaries = await Salary.find().populate('user', 'fullName email employeeId');
        return res.status(200).json({ message: 'All salaries fetched', data: salaries });
    } catch (error) {
        console.error('Error in getAllSalaries:', error);
        return res.status(500).json({ message: 'Server Error' });
    }
};

export const getSalaryStructure = async (req, res) => {
    try {
        const { userId } = req.params;
        const structure = await SalaryStructure.findOne({ user: userId });
        if (!structure) {
            return res.status(404).json({ message: 'Salary structure not found' });
        }
        res.json(structure);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createSalaryStructure = async (req, res) => {
    try {
        const { userId, ...structureData } = req.body;
        const user = await User.findById(userId);
        if(!user) return res.status(404).json({message: 'User not found'});

        const newStructure = new SalaryStructure({
            user: userId,
            ...structureData
        });

        await newStructure.save();
        res.status(201).json(newStructure);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateSalaryStructure = async (req, res) => {
    try {
        const { userId } = req.params;
        const structure = await SalaryStructure.findOneAndUpdate({ user: userId }, req.body, { new: true });
        if (!structure) {
            return res.status(404).json({ message: 'Salary structure not found' });
        }
        res.json(structure);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};