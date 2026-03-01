import express from 'express';
// 1. Add getDashboardStats to the import list
import { saveStudentRecord, getStudent, getDashboardStats } from '../controllers/studentController.js';

const router = express.Router();

router.post('/save', saveStudentRecord);

// 🌟 NEW: Route for Dashboard Stats (MUST BE ABOVE /:htNo)
router.get('/stats', getDashboardStats);

// Route to fetch a specific student
router.get('/:htNo', getStudent);

export default router;