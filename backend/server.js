import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Configure environment variables
dotenv.config();

// Initialize Express
const app = express();

// 🌟 THE FIX FOR YOUR PHONE: Open CORS completely for local testing
app.use(cors({
    origin: '*', // Allows your phone's IP to bypass security blocks
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
// ⚠️ IMPORTANT: Since you are using "type": "module", your route files must also use imports!
// Example: 
// import authRoutes from './routes/auth.js';
// app.use('/api/auth', authRoutes);


// Start Server - Listening on 0.0.0.0 allows network access
const PORT = process.env.PORT || 8000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Backend Server is running on port ${PORT}`);
    console.log(`📱 Access from phone via your laptop's IP address!`);
});