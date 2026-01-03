import mongoose from 'mongoose';
const { Schema } = mongoose;

const companySchema = new Schema({
  companyName: {
    type: String,
    required: true,
  },
  companyCode: {
    type: String,
    required: true,
    unique: true,
  },
  companyLogo: {
    type: String,
  },
}, {
  timestamps: true,
});

export default mongoose.model('Company', companySchema);
