import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  // Basic Profile Info
  name: { 
    type: String, 
    required: true, 
    trim: true // Removes accidental spaces
  },
  htNo: { 
    type: String, 
    required: true, 
    unique: true, 
    index: true, // 🚀 Creates a fast-search B-Tree in MongoDB
    trim: true, 
    uppercase: true // Forces all roll numbers to match perfectly
  },
  branch: { type: String, default: "CSE" },
  year: String,
  dob: String,
  phone: String,
  studentEmail: { 
    type: String, 
    unique: true, 
    index: true, // 🚀 Lightning-fast searches during login
    trim: true, 
    lowercase: true // Forces emails to be lowercase for perfect matching
  },
  parentName: String,
  parentMobile: String,
  address: String,
  
  // Performance Entry
  academicRecord: [{
    subjectName: String, month: String, attendance: String,
    cie1: String, cie2: String, viva: String,
    cieAvg: String, univMarks: String, totalMarks: String
  }],

  // Interaction / Counseling Logs
  interactionLogs: [{
    date: String, counselor: String, remarks: String
  }],

  // 🌟 NEW: Activities & Certifications
  certifications: [{
    courseName: String, // e.g., "AWS Cloud Practitioner"
    issuer: String,     // e.g., "Amazon"
    date: String        // e.g., "Nov 2025"
  }],
  activities: [{
    eventName: String,  // e.g., "College Hackathon"
    role: String,       // e.g., "Team Lead"
    date: String        // e.g., "Oct 2025"
  }]

}, { timestamps: true });

export default mongoose.model('Student', studentSchema);