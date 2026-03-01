import Student from '../models/Student.js';

// 🌟 THE LOGIN LOGIC
export const loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    // We check the database for a student with this email AND this roll number
    const student = await Student.findOne({ 
      studentEmail: email, 
      htNo: password.toUpperCase() // Ensure it checks in Uppercase
    });
    
    if (student) {
      res.status(200).json({ message: "Login successful!", student });
    } else {
      res.status(401).json({ message: "Invalid Email or Roll Number! ❌" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error during login", error: error.message });
  }
};

// 🌟 THE SIGNUP LOGIC
export const signupStudent = async (req, res) => {
  try {
    const { name, studentEmail, htNo } = req.body;

    // Check if this Roll Number is already in the database
    const existingStudent = await Student.findOne({ htNo: htNo.toUpperCase() });
    
    if (existingStudent) {
      return res.status(400).json({ message: "This Roll Number is already registered! ❌" });
    }

    // Create the new student record
    const newStudent = new Student({
      name,
      studentEmail,
      htNo: htNo.toUpperCase(),
      branch: "CSE" // Default branch
    });

    await newStudent.save();
    res.status(201).json({ message: "Account created successfully! ✅", student: newStudent });
  } catch (error) {
    // If it fails, the error message will be sent to your frontend toast
    res.status(500).json({ message: "Signup failed: " + error.message });
  }
};