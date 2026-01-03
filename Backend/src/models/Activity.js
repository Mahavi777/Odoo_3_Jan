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
        enum: ['login', 'profile_update'],
    },
    description: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

export default mongoose.model('Activity', ActivitySchema);
