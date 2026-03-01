import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Lock, User, ArrowRight } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); 
    const toastId = toast.loading("Verifying credentials...");
    
    try {
      // 🌟 PRO TRICK: Automatically uses localhost on laptop, and 192.168.1.8 on phone!
      const currentIP = window.location.hostname; 
      const response = await axios.post(`http://${currentIP}:8000/api/auth/login`, {
        email: email.trim(), 
        password: password.trim().toUpperCase() // Forcing uppercase to match database
      });

      // Save student session
      localStorage.setItem('studentHtNo', response.data.student.htNo);
      localStorage.setItem('studentName', response.data.student.name);

      toast.success(`Welcome back, ${response.data.student.name}!`, { id: toastId });
      navigate('/dashboard');
      
    } catch (error) {
      console.error("Login Error:", error);
      const message = error.response?.data?.message || "Invalid Email or Roll Number! ❌";
      toast.error(message, { id: toastId });
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      {/* Green Header Accent */}
      <div className="absolute top-0 left-0 w-full h-[400px] bg-[#1a4d2e] rounded-b-[100px] z-0"></div>
      
      <div className="bg-white max-w-md w-full p-10 rounded-[40px] relative z-10 shadow-2xl animate-fade-in border border-white">
        
        {/* Logo Branding */}
        <div className="flex flex-col items-center mb-10">
          <div className="bg-white p-4 rounded-2xl shadow-lg mb-6 flex items-center justify-center w-32 h-20">
            <img src="/mlrit-logo.png" alt="MLRIT Logo" className="max-h-full object-contain" />
          </div>
          <h1 className="text-3xl font-black text-slate-800 text-center uppercase tracking-tight">Student Portal</h1>
          <p className="text-slate-400 font-medium text-xs mt-2 tracking-[0.2em] uppercase">Digital Counseling System</p>
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
                className="w-full p-4 pl-12 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-green-500/10 focus:border-[#1a4d2e] outline-none transition-all text-slate-800 font-bold"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-2 block">Password (Roll Number)</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="e.g. 24R21A..." 
                className="w-full p-4 pl-12 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-green-500/10 focus:border-[#1a4d2e] outline-none uppercase transition-all text-slate-800 font-bold"
                required
              />
            </div>
          </div>

          <button type="submit" className="w-full bg-[#1a4d2e] text-white font-black py-4 rounded-2xl shadow-xl shadow-green-900/20 hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer text-lg mt-4">
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