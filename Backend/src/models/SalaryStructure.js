import mongoose from 'mongoose';

const salaryComponentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    computationType: { type: String, enum: ['PERCENTAGE', 'FIXED'], required: true },
    value: { type: Number, required: true },
});

const deductionSchema = new mongoose.Schema({
    name: { type: String, required: true },
    amount: { type: Number, required: true },
});

const salaryStructureSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    wage: {
        monthlyWage: { type: Number, default: 0 },
        workingDaysPerWeek: { type: Number, default: 5 },
    },
    components: [salaryComponentSchema],
    pfConfiguration: {
        pfPercentage: { type: Number, default: 12 },
    },
    deductions: [deductionSchema],
}, { timestamps: true });

const SalaryStructure = mongoose.model('SalaryStructure', salaryStructureSchema);

export default SalaryStructure;