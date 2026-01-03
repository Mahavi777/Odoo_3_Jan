import mongoose from 'mongoose';
const { Schema } = mongoose;

const salaryAndBankInfoSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  bankName: {
    type: String,
  },
  accountNumber: {
    type: String,
  },
  ifscCode: {
    type: String,
  },
  panNumber: {
    type: String,
  },
  uanNumber: {
    type: String,
  },
  employeeCode: {
    type: String,
  },
  salaryStructure: {
    type: Object,
  },
}, {
  timestamps: true,
});

export default mongoose.model('SalaryAndBankInfo', salaryAndBankInfoSchema);
