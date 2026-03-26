import express from 'express';
import { loginStudent, signupStudent } from '../controllers/authController.js';
import { googleAuth } from '../controllers/googleAuthController.js';

const router = express.Router();

router.post('/login', loginStudent);
router.post('/signup', signupStudent);
router.post('/google', googleAuth);

export default router;