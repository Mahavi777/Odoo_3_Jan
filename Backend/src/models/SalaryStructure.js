import mongoose from 'mongoose';
const { Schema } = mongoose;

const salaryComponentSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  computationType: {
    type: String,
    enum: ['FIXED', 'PERCENTAGE'],
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
});

const deductionSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
});

const salaryStructureSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  wage: {
    wageType: {
      type: String,
      enum: ['FIXED', 'HOURLY'],
      default: 'FIXED',
    },
    monthlyWage: {
      type: Number,
      required: true,
    },
    yearlyWage: {
      type: Number,
    },
    workingDaysPerWeek: {
      type: Number,
      default: 5,
    },
    breakTime: {
      type: Number,
      default: 1,
    },
  },
  components: [salaryComponentSchema],
  pfConfiguration: {
    pfPercentage: {
      type: Number,
      default: 12,
    },
    employerContribution: {
      type: Number,
    },
    employeeContribution: {
      type: Number,
    },
  },
  deductions: [deductionSchema],
  summary: {
    monthlyGrossSalary: {
      type: Number,
    },
    totalDeductions: {
      type: Number,
    },
    netSalary: {
      type: Number,
    },
  },
}, {
  timestamps: true,
});

// Middleware to calculate and update fields before saving
salaryStructureSchema.pre('save', function(next) {
  // Calculate yearly wage
  if (this.wage.monthlyWage) {
    this.wage.yearlyWage = this.wage.monthlyWage * 12;
  }

  // Calculate salary components
  let monthlyGrossSalary = 0;
  let basicSalary = 0;
  this.components.forEach(component => {
    let componentValue = 0;
    if (component.computationType === 'PERCENTAGE') {
      componentValue = (this.wage.monthlyWage * component.value) / 100;
    } else {
      componentValue = component.value;
    }
    monthlyGrossSalary += componentValue;
    if (component.name.toLowerCase() === 'basic salary') {
      basicSalary = componentValue;
    }
  });

  this.summary.monthlyGrossSalary = monthlyGrossSalary;

  // Calculate PF contributions
  if (basicSalary > 0 && this.pfConfiguration.pfPercentage > 0) {
    const pfAmount = (basicSalary * this.pfConfiguration.pfPercentage) / 100;
    this.pfConfiguration.employerContribution = pfAmount;
    this.pfConfiguration.employeeContribution = pfAmount;
  }

  // Calculate total deductions
  let totalDeductions = this.pfConfiguration.employeeContribution || 0;
  this.deductions.forEach(deduction => {
    totalDeductions += deduction.amount;
  });
  this.summary.totalDeductions = totalDeductions;

  // Calculate net salary
  this.summary.netSalary = this.summary.monthlyGrossSalary - this.summary.totalDeductions;
  
  // Validation
  if (monthlyGrossSalary > this.wage.monthlyWage) {
    const err = new Error('Total of all salary components cannot exceed the defined wage.');
    next(err);
  } else {
    next();
  }
});


export default mongoose.model('SalaryStructure', salaryStructureSchema);
