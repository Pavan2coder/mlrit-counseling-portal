import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';

export default function Signup() {
  const [formData, setFormData] = useState({ name: '', email: '', rollNo: '' });
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Creating your MLRIT account...");
    
    try {
      // 🚀 DIRECT LIVE LINK TO RENDER
      await axios.post("https://mlrit-counseling-portal.onrender.com/api/auth/signup", {
        name: formData.name,
        studentEmail: formData.email.trim().toLowerCase(),
        htNo: formData.rollNo.trim().toUpperCase()
      });
      
      toast.success("Account Created! You can now login.", { id: toastId });
      navigate('/login');
    } catch (error) {
      console.error("Signup Error:", error);
      const message = error.response?.data?.message || "Signup failed! Server is waking up, try again in 30s.";
      toast.error(message, { id: toastId });
    }
  };

  // Google OAuth Success Handler
  const handleGoogleSuccess = async (credentialResponse) => {
    const toastId = toast.loading("Signing up with Google...");
    
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      
      const response = await axios.post("https://mlrit-counseling-portal.onrender.com/api/auth/google", {
        email: decoded.email,
        name: decoded.name,
        googleId: decoded.sub
      });

      localStorage.setItem('studentHtNo', response.data.student?.htNo || '');
      localStorage.setItem('studentName', response.data.student?.name || decoded.name);
      localStorage.setItem('authToken', response.data.token);

      toast.success(`Welcome ${decoded.name}!`, { id: toastId });
      navigate('/dashboard');
      
    } catch (error) {
      console.error("Google Signup Error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Google signup failed! ❌", { id: toastId });
    }
  };

  // Google OAuth Error Handler
  const handleGoogleError = () => {
    toast.error("Google signup failed! Please try again.");
  };

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID"}>
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="absolute top-0 left-0 w-full h-[400px] bg-[#1a4d2e] rounded-b-[100px] z-0"></div>
        <div className="bg-white max-w-md w-full p-10 rounded-[40px] relative z-10 shadow-2xl border border-white">
          <h2 className="text-4xl font-black text-slate-800 text-center mb-10">New Student?</h2>
          
          <form onSubmit={handleSignup} className="space-y-5">
            <input type="text" placeholder="Full Name" className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50 font-bold" onChange={(e) => setFormData({...formData, name: e.target.value})} required />
            <input type="email" placeholder="student@mlrit.ac.in" className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50 font-bold" onChange={(e) => setFormData({...formData, email: e.target.value})} required />
            <input type="text" placeholder="Roll Number (e.g. 24R21A...)" className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50 font-bold uppercase" onChange={(e) => setFormData({...formData, rollNo: e.target.value})} required />
            <button type="submit" className="w-full bg-[#1a4d2e] text-white font-black py-4 rounded-2xl shadow-xl flex items-center justify-center gap-2 mt-4">
              CREATE ACCOUNT <ArrowRight size={20} />
            </button>
          </form>

          {/* Google OAuth Button */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-slate-500 font-bold">OR</span>
              </div>
            </div>
            
            <div className="mt-6 flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                theme="outline"
                size="large"
                text="signup_with"
                shape="rectangular"
              />
            </div>
          </div>

          <p className="mt-8 text-center text-slate-500 text-sm font-bold">
            Already have an account? <Link to="/login" className="text-[#1a4d2e] font-black hover:underline">Login here</Link>
          </p>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}