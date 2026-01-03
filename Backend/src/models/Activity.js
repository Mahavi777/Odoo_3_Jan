import mongoose from 'mongoose';

const ActivitySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    activityType: {
        type: String,
        required: true,
        enum: [
            'login', 
            'profile_update', 
            'leave_apply', 
            'leave_approve', 
            'leave_reject', 
            'leave_cancel',
            'payroll_create',
            'payroll_update',
            'attendance_checkin',
            'attendance_checkout'
        ],
    },
    description: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

export default mongoose.model('Activity', ActivitySchema);
