import Student from '../models/Student.js';
import jwt from 'jsonwebtoken';

// Generate JWT token
const generateToken = (studentId) => {
  return jwt.sign({ id: studentId }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

// Google OAuth Login/Signup
export const googleAuth = async (req, res) => {
  try {
    const { email, name, googleId } = req.body;

    // Check if email is from mlrit.ac.in domain
    if (!email.toLowerCase().endsWith('@mlrit.ac.in')) {
      return res.status(403).json({ 
        message: "Access denied! Only MLRIT college emails (@mlrit.ac.in) are allowed. ❌" 
      });
    }

    // Check if student already exists
    let student = await Student.findOne({ studentEmail: email.toLowerCase() });

    if (student) {
      // Update Google ID if not set
      if (!student.googleId) {
        student.googleId = googleId;
        await student.save();
      }

      const token = generateToken(student._id);
      
      return res.status(200).json({
        message: "Login successful!",
        student,
        token
      });
    } else {
      // Extract roll number from email (e.g. 24r21a05gw@mlrit.ac.in -> 24R21A05GW)
      const htNo = email.split('@')[0].toUpperCase();

      // Create new student account
      const newStudent = new Student({
        name,
        studentEmail: email.toLowerCase(),
        googleId,
        htNo,
        branch: "CSE" // Default branch
      });

      await newStudent.save();
      const token = generateToken(newStudent._id);

      return res.status(201).json({
        message: "Account created successfully! ✅",
        student: newStudent,
        token
      });
    }
  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(500).json({ 
      message: "Authentication failed: " + error.message 
    });
  }
};
