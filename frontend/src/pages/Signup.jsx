import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';

export default function Signup() {
  const [formData, setFormData] = useState({ name: '', email: '', rollNo: '' });
  const navigate = useNavigate();

  // 🌍 YOUR LIVE BACKEND URL (From Render)
  const API_URL = "https://mlrit-counseling-portal.onrender.com";

  const handleSignup = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Creating your MLRIT account...");
    
    try {
      // Sending data to your live Render server
      await axios.post(`${API_URL}/api/auth/signup`, {
        name: formData.name,
        studentEmail: formData.email,
        htNo: formData.rollNo.toUpperCase() // Standardizing roll numbers to Uppercase
      });
      
      toast.success("Account Created! You can now login.", { id: toastId });
      navigate('/login');
    } catch (error) {
      console.error("Signup Error:", error);
      // Handling the case where the user might already exist
      const message = error.response?.data?.message || "Signup failed! Check your connection.";
      toast.error(message, { id: toastId });
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      {/* Visual Green Header Background */}
      <div className="absolute top-0 left-0 w-full h-[400px] bg-[#1a4d2e] rounded-b-[100px] z-0"></div>
      
      <div className="bg-white max-w-md w-full p-10 rounded-[40px] relative z-10 shadow-2xl animate-fade-in border border-white">
        <h2 className="text-4xl font-black text-slate-800 text-center mb-2">New Student?</h2>
        <p className="text-slate-400 font-bold text-center mb-10 uppercase tracking-widest text-[10px]">
           Register for the Digital Counseling Book
        </p>

        <form onSubmit={handleSignup} className="space-y-5">
          {/* Name Input */}
          <div className="space-y-1">
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-2 block">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Enter your full name" 
                className="w-full p-4 pl-12 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-green-500/10 focus:border-[#1a4d2e] outline-none transition-all font-bold text-slate-700"
                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                required 
              />
            </div>
          </div>

          {/* Email Input */}
          <div className="space-y-1">
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-2 block">College Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="email" 
                placeholder="student@mlrit.ac.in" 
                className="w-full p-4 pl-12 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-green-500/10 focus:border-[#1a4d2e] outline-none transition-all font-bold text-slate-700"
                onChange={(e) => setFormData({...formData, email: e.target.value})} 
                required 
              />
            </div>
          </div>

          {/* Roll Number Input (Used as Password) */}
          <div className="space-y-1">
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-2 block">Roll Number (Password)</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="e.g. 24R21A05XX" 
                className="w-full p-4 pl-12 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-green-500/10 focus:border-[#1a4d2e] outline-none uppercase transition-all font-bold text-slate-700"
                onChange={(e) => setFormData({...formData, rollNo: e.target.value})} 
                required 
              />
            </div>
          </div>

          <button type="submit" className="w-full bg-[#1a4d2e] text-white font-black py-4 rounded-2xl shadow-xl shadow-green-900/20 hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer mt-4 text-lg">
            CREATE ACCOUNT <ArrowRight size={20} />
          </button>
        </form>

        <p className="mt-8 text-center text-slate-500 text-sm font-bold">
          Already have an account? <Link to="/login" className="text-[#1a4d2e] font-black hover:underline">Login here</Link>
        </p>
      </div>
    </div>
  );
}