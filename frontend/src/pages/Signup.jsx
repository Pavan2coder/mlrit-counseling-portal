import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';

function SignupForm() {
  const [formData, setFormData] = useState({ name: '', email: '', rollNo: '' });
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    
    // Validate email domain before sending request
    if (!formData.email.toLowerCase().endsWith('@mlrit.ac.in')) {
      toast.error("Only MLRIT college emails (@mlrit.ac.in) are allowed! ❌");
      return;
    }
    
    const toastId = toast.loading("Creating your MLRIT account...");
    
    try {
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

  // Google OAuth using useGoogleLogin hook
  const googleSignup = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const toastId = toast.loading("Signing up with Google...");
      
      try {
        // Get user info from Google
        const userInfo = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
        });

        // Validate email domain after user selects account
        if (!userInfo.data.email.toLowerCase().endsWith('@mlrit.ac.in')) {
          toast.error("Access denied! Only MLRIT college emails (@mlrit.ac.in) are allowed. ❌", { id: toastId });
          return;
        }

        const response = await axios.post("https://mlrit-counseling-portal.onrender.com/api/auth/google", {
          email: userInfo.data.email,
          name: userInfo.data.name,
          googleId: userInfo.data.sub
        });

        localStorage.setItem('studentHtNo', response.data.student?.htNo || response.data.student?.studentEmail || '');
        localStorage.setItem('studentEmail', response.data.student?.studentEmail || userInfo.data.email);
        localStorage.setItem('studentName', response.data.student?.name || userInfo.data.name);
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('isGoogleAuth', 'true');

        toast.success(`Welcome ${userInfo.data.name}!`, { id: toastId });
        navigate('/dashboard');
        
      } catch (error) {
        console.error("Google Signup Error:", error.response?.data || error.message);
        toast.error(error.response?.data?.message || "Google signup failed! ❌", { id: toastId });
      }
    },
    onError: () => {
      toast.error("Google signup cancelled or failed!");
    },
    flow: 'implicit',
    prompt: 'select_account'
  });

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="absolute top-0 left-0 w-full h-[400px] bg-[#1a4d2e] rounded-b-[100px] z-0"></div>
      <div className="bg-white max-w-md w-full p-10 rounded-[40px] relative z-10 shadow-2xl border border-white">
        <h2 className="text-4xl font-black text-slate-800 text-center mb-10">New Student?</h2>
        
        <form onSubmit={handleSignup} className="space-y-5">
          <input 
            type="text" 
            placeholder="Full Name" 
            className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50 font-bold focus:border-[#1a4d2e] focus:ring-2 focus:ring-[#1a4d2e]/20 outline-none transition-all" 
            onChange={(e) => setFormData({...formData, name: e.target.value})} 
            required 
          />
          <input 
            type="email" 
            placeholder="student@mlrit.ac.in" 
            pattern="[a-zA-Z0-9._%+-]+@mlrit\.ac\.in$"
            title="Please enter a valid MLRIT email address (e.g., student@mlrit.ac.in)"
            className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50 font-bold focus:border-[#1a4d2e] focus:ring-2 focus:ring-[#1a4d2e]/20 outline-none transition-all" 
            onChange={(e) => setFormData({...formData, email: e.target.value})} 
            required 
          />
          <input 
            type="text" 
            placeholder="Roll Number (e.g. 24R21A...)" 
            className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50 font-bold uppercase focus:border-[#1a4d2e] focus:ring-2 focus:ring-[#1a4d2e]/20 outline-none transition-all" 
            onChange={(e) => setFormData({...formData, rollNo: e.target.value})} 
            required 
          />
          <button 
            type="submit" 
            className="w-full bg-[#1a4d2e] text-white font-black py-4 rounded-2xl shadow-xl flex items-center justify-center gap-2 mt-4 hover:bg-[#153d24] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
          >
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
              <span className="px-4 bg-white text-slate-500 font-bold">OR CONTINUE WITH</span>
            </div>
          </div>
          
          <button
            onClick={() => googleSignup()}
            type="button"
            className="w-full mt-6 bg-white border-2 border-slate-200 text-slate-700 font-bold py-4 px-6 rounded-2xl shadow-md hover:shadow-xl hover:border-[#1a4d2e] hover:bg-slate-50 transition-all duration-300 flex items-center justify-center gap-3 group cursor-pointer relative overflow-hidden hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#1a4d2e]/0 via-[#1a4d2e]/5 to-[#1a4d2e]/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            <svg className="w-6 h-6 group-hover:scale-110 group-hover:rotate-[360deg] transition-all duration-500 relative z-10" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="text-base relative z-10 group-hover:text-[#1a4d2e] transition-colors duration-300">Sign up with Google</span>
          </button>
        </div>

        <p className="mt-8 text-center text-slate-500 text-sm font-bold">
          Already have an account? <Link to="/login" className="text-[#1a4d2e] font-black hover:underline">Login here</Link>
        </p>
      </div>
    </div>
  );
}

export default function Signup() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID"}>
      <SignupForm />
    </GoogleOAuthProvider>
  );
}