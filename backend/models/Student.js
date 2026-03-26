import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  // --- 1. Basic Profile Info ---
  name: { 
    type: String, 
    required: true, 
    trim: true 
  },
  htNo: { 
    type: String, 
    unique: true, 
    sparse: true,
    index: true, 
    trim: true, 
    uppercase: true 
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true
  },
  branch: { type: String, default: "CSE" },
  year: String,
  dob: String,
  phone: String,
  studentEmail: { 
    type: String, 
    unique: true, 
    index: true, 
    trim: true, 
    lowercase: true 
  },
  parentName: String,
  parentMobile: String,
  address: String,

  // --- 2. Detailed Performance & Attendance Record (From physical forms) ---
  academicRecords: [{
    semesterName: String, // e.g., "I-Year I-Semester"
    subjects: [{
      subjectCodeAndName: String,
      attendance: {
        month1: { name: String, percentage: String }, // e.g., { name: "Sep", percentage: "92.86" }
        month2: { name: String, percentage: String },
        month3: { name: String, percentage: String },
        month4: { name: String, percentage: String }
      },
      cie1: String, // 35 Marks
      cie2: String, // 35 Marks
      viva: String, // 5 Marks
      cieAvg: String, // 40M
      univMarks: String, // 60M
      totalMarks: String, // 100M
      grade: String // e.g., "A+", "B"
    }],
    cumulativeMonthlyAttendance: String,
    cumulativeSemesterAttendance: String,
    totalPercentageMarks: String
  }],

  // --- 3. Overall Academic Summary & Backlogs ---
  academicSummary: [{
    semester: String, // e.g., "1st - 1st Sem"
    percentage: String,
    backlogs: String
  }],

  // --- 4. Project Details ---
  projects: {
    miniProject: { title: String, guide: String, organization: String },
    majorProject: { title: String, guide: String, organization: String }
  },

  // --- 5. Competitive Exams ---
  competitiveExams: {
    gate: String, 
    gre: String, 
    toefl: String, 
    ielts: String, 
    cat: String, 
    gmat: String
  },

  // --- 6. Activities, Visits & Certifications ---
  industrialVisits: [{ companyName: String, date: String }],
  certifications: [{
    courseName: String, 
    issuer: String,     
    date: String        
  }],
  activities: [{
    eventName: String,  
    role: String,       
    date: String        
  }],

  // --- 7. Interaction / Counseling Logs ---
  interactionLogs: [{
    date: String, counselor: String, remarks: String
  }]

}, { timestamps: true });

export default mongoose.model('Student', studentSchema);