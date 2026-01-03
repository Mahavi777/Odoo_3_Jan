import mongoose from 'mongoose';

const salarySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  wage: {
    type: Number,
    required: true,
    min: 0,
  },
  basic: { type: Number, default: 0 },
  hra: { type: Number, default: 0 },
  allowances: { type: Number, default: 0 },
  pf: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  netSalary: { type: Number, default: 0 },
  ctc: {type: Number, default: 0}
}, { timestamps: true });

const Salary = mongoose.model('Salary', salarySchema);

export default Salary;
