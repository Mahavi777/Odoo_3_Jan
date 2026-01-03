import mongoose from 'mongoose';
const { Schema } = mongoose;

const payrollSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  salaryStructure: {
    basicSalary: {
      type: Number,
      default: 0,
    },
    hra: {
      type: Number,
      default: 0,
    },
    allowances: {
      type: Number,
      default: 0,
    },
    deductions: {
      type: Number,
      default: 0,
    },
    tax: {
      type: Number,
      default: 0,
    },
    netSalary: {
      type: Number,
      default: 0,
    },
  },
  bankDetails: {
    bankName: {
      type: String,
    },
    accountNumber: {
      type: String,
    },
    ifscCode: {
      type: String,
    },
  },
  payFrequency: {
    type: String,
    enum: ['Monthly', 'Bi-weekly', 'Weekly'],
    default: 'Monthly',
  },
  currency: {
    type: String,
    default: 'INR',
  },
  effectiveDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'INACTIVE'],
    default: 'ACTIVE',
  },
}, {
  timestamps: true,
});

// Calculate net salary before saving
payrollSchema.pre('save', function(next) {
  const { basicSalary = 0, hra = 0, allowances = 0, deductions = 0, tax = 0 } = this.salaryStructure;
  this.salaryStructure.netSalary = basicSalary + hra + allowances - deductions - tax;
  next();
});

export default mongoose.model('Payroll', payrollSchema);

