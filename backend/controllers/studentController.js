import Student from '../models/Student.js'; // Keep this at the very top!

// Logic to Save or Update a Student Record
export const saveStudentRecord = async (req, res) => {
  try {
    const { htNo, studentEmail } = req.body;
    
    // Use htNo if available, otherwise use email (for Google OAuth users)
    const query = htNo ? { htNo } : { studentEmail: studentEmail.toLowerCase() };
    
    const student = await Student.findOneAndUpdate(
      query, 
      req.body, 
      { new: true, upsert: true }
    );
    
    res.status(200).json({ message: "Student Record Saved Successfully! ✅", student });
  } catch (error) {
    res.status(500).json({ message: "Error saving record", error: error.message });
  }
};

// 🌟 Logic to Fetch a Student by Hall Ticket Number or Email
export const getStudent = async (req, res) => {
  try {
    const identifier = req.params.htNo;
    
    // Try to find by htNo first, then by email
    let student = await Student.findOne({ htNo: identifier });
    
    if (!student) {
      // If not found by htNo, try email (for Google OAuth users)
      student = await Student.findOne({ studentEmail: identifier.toLowerCase() });
    }
    
    if (!student) {
      return res.status(404).json({ message: "Student not found in database! ❌" });
    }
    
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: "Error fetching record", error: error.message });
  }
};

// 🌟 NEW: Logic to get total stats for the Dashboard
export const getDashboardStats = async (req, res) => {
  try {
    // This tells MongoDB to count every single document in the 'students' collection
    const totalStudents = await Student.countDocuments();
    
    res.status(200).json({ totalStudents });
  } catch (error) {
    res.status(500).json({ message: "Error fetching stats", error: error.message });
  }
};