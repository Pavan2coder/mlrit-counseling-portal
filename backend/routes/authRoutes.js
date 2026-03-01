import express from 'express';
import { loginStudent, signupStudent } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', loginStudent);
router.post('/signup', signupStudent);

export default router;