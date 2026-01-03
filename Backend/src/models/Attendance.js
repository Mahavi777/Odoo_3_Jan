import mongoose from 'mongoose';
const { Schema } = mongoose;

const attendanceSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  checkIn: {
    type: Date,
  },
  checkOut: {
    type: Date,
  },
  breakTime: {
    type: Number, // in minutes
    default: 0,
  },
  checkInTime: {
    type: Date,
  },
  checkOutTime: {
    type: Date,
  },
  totalWorkingHours: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['Present', 'Absent', 'Half-Day', 'Leave', 'ON_LEAVE'],
    default: 'Absent',
  },
}, {
  timestamps: true,
});

// Calculate total working hours before saving
attendanceSchema.pre('save', function(next) {
  // Use checkInTime/checkOutTime if available, otherwise fall back to checkIn/checkOut
  const checkInTime = this.checkInTime || this.checkIn;
  const checkOutTime = this.checkOutTime || this.checkOut;
  
  if (checkInTime && checkOutTime) {
    const diffMs = new Date(checkOutTime) - new Date(checkInTime);
    this.totalWorkingHours = parseFloat((diffMs / (1000 * 60 * 60)).toFixed(2)); // Convert to hours
  }
  next();
});

attendanceSchema.index({ user: 1, date: 1 }, { unique: true });

export default mongoose.model('Attendance', attendanceSchema);
