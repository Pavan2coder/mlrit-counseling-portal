import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  // Basic Profile Info
  name: { type: String, required: true },
  htNo: { type: String, required: true, unique: true },
  branch: { type: String, default: "CSE" },
  year: String,
  dob: String,
  phone: String,
  studentEmail: String,
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