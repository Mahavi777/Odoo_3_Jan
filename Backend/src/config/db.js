import mongoose from 'mongoose';

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/odooxgcet_dev';
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB connected successfully (${uri})`);
  } catch (err) {
    console.error('❌ MongoDB connection error: Could not connect.');
    console.error(err);
    process.exit(1);
  }
};

export default connectDB;