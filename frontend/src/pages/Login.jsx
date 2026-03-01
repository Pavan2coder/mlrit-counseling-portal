import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Lock, User, ArrowRight } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // 🌍 YOUR LIVE BACKEND URL
  const API_URL = "https://mlrit-counseling-portal.onrender.com";

  const handleLogin = async (e) => {
    e.preventDefault(); 
    const toastId = toast.loading("Verifying credentials...");
    
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email: email.trim(), 
        password: password.trim().toUpperCase() 
      });

      localStorage.setItem('studentHtNo', response.data.student.htNo);
      localStorage.setItem('studentName', response.data.student.name);

      toast.success(`Welcome back, ${response.data.student.name}!`, { id: toastId });
      navigate('/dashboard');
      
    } catch (error) {
      const message = error.response?.data?.message || "Invalid Email or Roll Number! ❌";
      toast.error(message, { id: toastId });
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
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="student@mlrit.ac.in" className="w-full p-4 pl-12 rounded-2xl border border-slate-200 bg-slate-50 outline-none font-bold" required />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Roll Number" className="w-full p-4 pl-12 rounded-2xl border border-slate-200 bg-slate-50 outline-none uppercase font-bold" required />
          </div>
          <button type="submit" className="w-full bg-[#1a4d2e] text-white font-black py-4 rounded-2xl shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
            ACCESS PORTAL <ArrowRight size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}