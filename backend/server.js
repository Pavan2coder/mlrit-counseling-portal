import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet'; // 🛡️ Adds essential security headers
import rateLimit from 'express-rate-limit'; // 🚦 Prevents traffic spikes from crashing the server

// Import your route files
import authRoutes from './routes/authRoutes.js';
import studentRoutes from './routes/studentRoutes.js';

dotenv.config();

const app = express();

// 🛡️ SECURITY LAYER 1: Helmet blocks common web vulnerabilities
app.use(helmet());

// 🌟 CORS CONFIGURATION: Allow Vercel and Localhost
app.use(cors({
    origin: [
        "https://mlrit-counseling-portal.vercel.app", 
        "http://localhost:5173",
        "http://localhost:5174",                      
        "http://192.168.1.8:5173"                     
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

// Middleware to parse JSON bodies
app.use(express.json());

// 🚦 SECURITY LAYER 2: Rate Limiting ("The Bouncer")
// If 500 students spam the login button, this stops the server from freezing.
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minute window
    max: 150, // Limit each IP to 150 requests per 15 minutes
    message: { message: "Traffic is high! Please wait a moment and try again." },
    standardHeaders: true, 
    legacyHeaders: false,
});

// Apply the rate limiter strictly to your API routes
app.use('/api', apiLimiter);

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas (Production Mode)'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// Connect your endpoints
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);

// Start Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`🚀 Production Backend Server is running on port ${PORT}`);
});