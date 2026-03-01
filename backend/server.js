import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// 🚨 CRITICAL: Importing your actual route files from your folder
import authRoutes from './routes/authRoutes.js';
import studentRoutes from './routes/studentRoutes.js';

// Configure environment variables
dotenv.config();

// Initialize Express
const app = express();

// Allow Vercel to talk to this backend safely
app.use(cors({
    origin: [
        "https://mlrit-counseling-portal.vercel.app", 
        "http://localhost:5173",                      
        "http://192.168.1.8:5173"                     
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

// Middleware to parse JSON
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// 🌟 THE MISSING PIECE: Connecting the routes so login and signup actually work!
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);

// Start Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`🚀 Backend Server is running on port ${PORT}`);
});