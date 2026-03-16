import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
// 🌟 Added Eye and EyeOff to your imports here:
import { Lock, User, ArrowRight, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // 🌟 Added state to track if the password is visible or hidden:
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
              
              {/* 🌟 Changed type dynamically to toggle between 'password' and 'text' */}
              <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Roll Number" 
                className="w-full p-4 pl-12 pr-12 rounded-2xl border border-slate-200 bg-slate-50 outline-none uppercase font-bold text-slate-700"
                required
              />

              {/* 🌟 Added the clickable Eye icon button here: */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>

            </div>
          </div>

          <button type="submit" className="w-full bg-[#1a4d2e] text-white font-black py-4 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer text-lg">
            ACCESS PORTAL <ArrowRight size={20} />
          </button>
        </form>

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