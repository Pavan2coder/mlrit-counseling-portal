import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
// 🌟 Added Eye and EyeOff to your imports here:
import { Lock, User, ArrowRight, Eye, EyeOff } from 'lucide-react';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); 
    const toastId = toast.loading("Verifying with database...");
    
    try {
      const payload = {
        email: email.trim().toLowerCase(),
        studentEmail: email.trim().toLowerCase(),
        password: password.trim().toUpperCase(),
        htNo: password.trim().toUpperCase()
      };

      const response = await axios.post("https://mlrit-counseling-portal.onrender.com/api/auth/login", payload);

      localStorage.setItem('studentHtNo', response.data.student?.htNo || payload.htNo);
      localStorage.setItem('studentName', response.data.student?.name || 'Student');

      toast.success(`Login Successful!`, { id: toastId });
      navigate('/dashboard');
      
    } catch (error) {
      console.error("Login Error:", error.response?.data || error.message);
      
      if (error.response) {
        toast.error(error.response.data.message || "Invalid Email or Roll Number! ❌", { id: toastId });
      } else {
        toast.error("Server is waking up... Please wait 30 seconds and try again! ⏳", { id: toastId });
      }
    }
  };

  // Google OAuth using useGoogleLogin hook
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const toastId = toast.loading("Signing in with Google...");
      
      try {
        // Get user info from Google
        const userInfo = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
        });

        const response = await axios.post("https://mlrit-counseling-portal.onrender.com/api/auth/google", {
          email: userInfo.data.email,
          name: userInfo.data.name,
          googleId: userInfo.data.sub
        });

        localStorage.setItem('studentHtNo', response.data.student?.htNo || '');
        localStorage.setItem('studentName', response.data.student?.name || userInfo.data.name);
        localStorage.setItem('authToken', response.data.token);

        toast.success(`Welcome ${userInfo.data.name}!`, { id: toastId });
        navigate('/dashboard');
        
      } catch (error) {
        console.error("Google Login Error:", error.response?.data || error.message);
        toast.error(error.response?.data?.message || "Google login failed! ❌", { id: toastId });
      }
    },
    onError: () => {
      toast.error("Google login failed! Please try again.");
    }
  });

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="absolute top-0 left-0 w-full h-[400px] bg-[#1a4d2e] rounded-b-[100px] z-0"></div>
      
      <div className="bg-white max-w-md w-full p-10 rounded-[40px] relative z-10 shadow-2xl border border-white">
        <div className="flex flex-col items-center mb-10">
          <div className="bg-white p-4 rounded-2xl shadow-lg mb-6 flex items-center justify-center w-32 h-20">
            <img src="/mlrit-logo.png" alt="MLRIT Logo" className="max-h-full object-contain" />
          </div>
          <h1 className="text-3xl font-black text-slate-800 text-center uppercase tracking-tight">Student Portal</h1>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-2 block">College Email</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@mlrit.ac.in" 
                className="w-full p-4 pl-12 rounded-2xl border border-slate-200 bg-slate-50 outline-none font-bold text-slate-700"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-2 block">Password (Roll Number)</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              
              <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Roll Number" 
                className="w-full p-4 pl-12 pr-12 rounded-2xl border border-slate-200 bg-slate-50 outline-none uppercase font-bold text-slate-700"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button type="submit" className="w-full bg-[#1a4d2e] text-white font-black py-4 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer text-lg hover:bg-[#153d24] hover:scale-[1.02] active:scale-[0.98]">
            ACCESS PORTAL <ArrowRight size={20} />
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
            onClick={() => googleLogin()}
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
            <span className="text-base relative z-10 group-hover:text-[#1a4d2e] transition-colors duration-300">Sign in with Google</span>
          </button>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-100 text-center">
          <p className="text-slate-500 text-sm font-bold">Don't have an account yet?</p>
          <Link to="/signup" className="text-[#1a4d2e] font-black hover:underline mt-2 inline-block">
            CREATE STUDENT ACCOUNT
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function Login() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID"}>
      <LoginForm />
    </GoogleOAuthProvider>
  );
}