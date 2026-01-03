import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
const { Schema } = mongoose;

const userSchema = new Schema({
  company: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
  },
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  phone: {
    type: String,
  },
  role: {
    type: String,
    enum: ['ADMIN', 'HR', 'EMPLOYEE'],
    required: true,
  },
  loginId: {
    type: String,
    unique: true,
    index: true,
  },
  password: {
    type: String,
    required: true,
  },
  jobPosition: {
    type: String,
  },
  department: {
    type: String,
  },
  manager: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  location: {
    type: String,
  },
  dateOfJoining: {
    type: Date,
  },
  isFirstLogin: {
    type: Boolean,
    default: true,
  },
  profileImage: {
    type: String,
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'INACTIVE'],
    default: 'ACTIVE',
  },
}, {
  timestamps: true,
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Auto-generate loginId
userSchema.pre('save', function(next) {
    if (!this.loginId) {
        // Simple example: use a portion of the user's name and a random number
        const namePart = this.fullName.split(' ')[0].toLowerCase();
        const randomPart = Math.floor(1000 + Math.random() * 9000);
        this.loginId = `${namePart}${randomPart}`;
    }
    next();
});

// Method to compare passwords
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);
