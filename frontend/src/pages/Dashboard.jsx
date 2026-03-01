import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { User, BookOpen, BarChart2, History, LogOut, Award, Home } from 'lucide-react'; 

// Component Imports (Make sure these files exist in your components folder!)
import CandidateProfile from '../components/CandidateProfile';
import PerformanceEntry from '../components/PerformanceEntry';
import CounselingLogs from '../components/CounselingLogs';
import ActivitiesCerts from '../components/ActivitiesCerts';
import Analytics from '../components/Analytics';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('home');
  const [studentName, setStudentName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieving the student's name from memory for the personalized header
    const name = localStorage.getItem('studentName');
    if (name) setStudentName(name);
  }, []);

  const handleLogout = () => {
    localStorage.clear(); 
    toast.success("Logged out successfully. See you next time! 👋");
    navigate('/');
  };

  return (
    <div className="min-h-screen flex bg-slate-100">
      
      {/* 🌟 SIDEBAR - Professional Green Theme */}
      <aside className="w-80 bg-white/90 backdrop-blur-2xl border-r border-white shadow-2xl flex flex-col fixed h-full z-20 p-6 print:hidden">
        <div className="mb-10 flex flex-col items-center">
          <div className="bg-white p-3 rounded-2xl shadow-md mb-4 flex items-center justify-center w-28 h-20">
            <img src="/mlrit-logo.png" alt="MLRIT Logo" className="max-h-full object-contain" />
          </div>
          <span className="text-[10px] font-black tracking-[0.3em] text-slate-400 uppercase">
            Student Portal
          </span>
        </div>
        
        <nav className="flex-1 space-y-2">
          {[
            { id: 'home', label: 'Dashboard Home', icon: <Home size={20} /> },
            { id: 'profile', label: 'My Profile', icon: <User size={20} /> },
            { id: 'performance', label: 'Academic Records', icon: <BookOpen size={20} /> },
            { id: 'analytics', label: 'Performance Analytics', icon: <BarChart2 size={20} /> },
            { id: 'activities', label: 'Certificates & Activities', icon: <Award size={20} /> },
            { id: 'counseling', label: 'Counseling History', icon: <History size={20} /> },
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)} 
              className={`flex items-center gap-4 p-4 w-full rounded-2xl transition-all font-bold ${activeTab === item.id ? 'bg-[#1a4d2e] text-white shadow-lg shadow-green-900/30 scale-105' : 'text-slate-500 hover:bg-white hover:shadow-md'}`}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </nav>

        <button 
          onClick={handleLogout} 
          className="mt-8 flex items-center justify-center gap-2 p-4 text-red-500 font-black bg-red-50 rounded-2xl hover:bg-red-100 transition-all cursor-pointer"
        >
          <LogOut size={20} /> Exit Portal
        </button>
      </aside>

      {/* 🌟 MAIN CONTENT AREA */}
      <main className="ml-80 flex-1 p-10 overflow-y-auto print:ml-0 print:p-0">
        
        {/* HOMEPAGE TAB */}
        {activeTab === 'home' && (
          <div className="animate-fade-in">
            <div className="mb-12">
              <h2 className="text-5xl font-black text-slate-800 tracking-tight">
                Welcome, <span className="text-[#1a4d2e]">{studentName || "Scholar"}</span>!
              </h2>
              <p className="text-slate-400 font-medium text-lg mt-2">Manage your academic progress and counseling records.</p>
            </div>

            {/* MLRIT HIGHLIGHTS CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Institution Status Card */}
              <div className="glass-card p-8 border-l-8 border-[#1a4d2e] flex items-center justify-between hover:-translate-y-2 transition-all">
                <div>
                  <p className="label-text">Institution Status</p>
                  <h3 className="text-2xl font-black text-slate-800 mt-1">UGC Autonomous</h3>
                  <p className="text-slate-500 font-medium text-sm mt-1">NBA Tier-1 & NAAC 'A' Grade</p>
                </div>
                <div className="h-16 w-16 bg-green-500/10 rounded-3xl flex items-center justify-center text-[#1a4d2e] text-3xl">🏛️</div>
              </div>

              {/* National Rankings Card */}
              <div className="glass-card p-8 border-l-8 border-[#d67b27] flex items-center justify-between hover:-translate-y-2 transition-all">
                <div>
                  <p className="label-text">National Recognition</p>
                  <h3 className="text-2xl font-black text-slate-800 mt-1 uppercase">NIRF Ranked</h3>
                  <p className="text-slate-500 font-medium text-sm mt-1">Top Engineering Institute</p>
                </div>
                <div className="h-16 w-16 bg-orange-500/10 rounded-3xl flex items-center justify-center text-[#d67b27] text-3xl">🏆</div>
              </div>
            </div>

            {/* MLRIT VISION & PROGRESS BOARD */}
            <div className="mt-12 glass-card p-10 bg-gradient-to-br from-green-50 to-white border-2 border-white relative overflow-hidden">
               <div className="relative z-10">
                 <h3 className="text-2xl font-black text-[#1a4d2e] mb-2 uppercase tracking-tight">
                   Industry Integrated Curriculum Blended With Sports
                 </h3>
                 <p className="text-slate-600 leading-relaxed max-w-3xl mt-4">
                   Established in 2005 by the KMR Education Trust, MLR Institute of Technology is dedicated to providing an environment where academics, employable skills, and physical fitness go hand-in-hand. 
                 </p>
                 <div className="mt-6 flex flex-wrap gap-4">
                    <span className="bg-white px-4 py-2 rounded-xl text-sm font-bold text-slate-600 shadow-sm border border-slate-100">Top Placements</span>
                    <span className="bg-white px-4 py-2 rounded-xl text-sm font-bold text-slate-600 shadow-sm border border-slate-100">Center of Excellence</span>
                    <span className="bg-white px-4 py-2 rounded-xl text-sm font-bold text-slate-600 shadow-sm border border-slate-100">Innovation Labs</span>
                 </div>
               </div>
               
               {/* Background Watermark */}
               <div className="absolute -bottom-10 -right-10 text-9xl text-[#1a4d2e]/5 font-black rotate-12 select-none">MLRIT</div>
            </div>
          </div>
        )}

        {/* DYNAMIC TAB CONTENT (Renders based on sidebar selection) */}
        {activeTab === 'profile' && <CandidateProfile />}
        {activeTab === 'performance' && <PerformanceEntry />}
        {activeTab === 'analytics' && <Analytics />}
        {activeTab === 'activities' && <ActivitiesCerts />}
        {activeTab === 'counseling' && <CounselingLogs />}
      </main>
      
    </div>
  );
}