import mongoose from 'mongoose';

const counselorSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true } // In a production app, we would encrypt this!
}, { timestamps: true });

export default mongoose.model('Counselor', counselorSchema);