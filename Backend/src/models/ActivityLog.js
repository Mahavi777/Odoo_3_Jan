import mongoose from 'mongoose';
const { Schema } = mongoose;

const activityLogSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  action: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
}, {
  timestamps: true,
});

export default mongoose.model('ActivityLog', activityLogSchema);
