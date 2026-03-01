import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Configure environment variables
dotenv.config();

// Initialize Express
const app = express();

// 🌟 THE FIX FOR VERCEL: Proper CORS Configuration
// We replace '*' with an array containing your exact Vercel URL and Localhost
app.use(cors({
    origin: [
        "https://mlrit-counseling-portal.vercel.app", // Your live Vercel frontend
        "http://localhost:5173",                      // For local testing on your laptop
        "http://192.168.1.8:5173"                     // For local testing on your phone
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

// Middleware to parse JSON
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mlr_portal')
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// --- YOUR ROUTES GO HERE ---
// ⚠️ IMPORTANT: Make sure you uncomment your actual route files so the backend knows what to do!
// import authRoutes from './routes/authRoutes.js';
// import studentRoutes from './routes/studentRoutes.js';
// app.use('/api/auth', authRoutes);
// app.use('/api/students', studentRoutes);


// Start Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`🚀 Backend Server is running on port ${PORT}`);
    console.log(`🌍 Accepting requests from Vercel!`);
});