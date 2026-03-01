import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { User, BookOpen, BarChart2, History, LogOut, Award, Home, Menu, X } from 'lucide-react'; 

// Component Imports 
import CandidateProfile from '../components/CandidateProfile';
import PerformanceEntry from '../components/PerformanceEntry';
import CounselingLogs from '../components/CounselingLogs';
import ActivitiesCerts from '../components/ActivitiesCerts';
import Analytics from '../components/Analytics';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('home');
  const [studentName, setStudentName] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // 🌟 New state for mobile menu
  const navigate = useNavigate();

  useEffect(() => {
    const name = localStorage.getItem('studentName');
    if (name) setStudentName(name);
  }, []);

  const handleLogout = () => {
    localStorage.clear(); 
    toast.success("Logged out successfully. See you next time! 👋");
    navigate('/');
  };

  // Helper to close menu on mobile when a link is clicked
  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false); 
  };

  return (
    <div className="min-h-screen flex bg-slate-100">
      
      {/* 🌟 MOBILE HEADER (Only shows on small screens) */}
      <div className="md:hidden fixed top-0 w-full bg-white shadow-md z-40 px-6 py-4 flex justify-between items-center">
        <img src="/mlrit-logo.png" alt="MLRIT Logo" className="h-8 object-contain" />
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 bg-slate-100 rounded-lg text-[#1a4d2e]"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* 🌟 BACKGROUND OVERLAY (Dims background on mobile when menu is open) */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* 🌟 SIDEBAR - Professional Green Theme (Responsive) */}
      <aside className={`w-80 bg-white/90 backdrop-blur-2xl border-r border-white shadow-2xl flex flex-col fixed h-full z-40 p-6 transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 print:hidden`}>
        <div className="mb-10 flex flex-col items-center">
          <div className="bg-white p-3 rounded-2xl shadow-md mb-4 flex items-center justify-center w-28 h-20">
            <img src="/mlrit-logo.png" alt="MLRIT Logo" className="max-h-full object-contain" />
          </div>
          <span className="text-[10px] font-black tracking-[0.3em] text-slate-400 uppercase">
            Student Portal
          </span>
        </div>
        
        <nav className="flex-1 space-y-2 overflow-y-auto pr-2 pb-4">
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
              onClick={() => handleTabClick(item.id)} 
              className={`flex items-center gap-4 p-4 w-full rounded-2xl transition-all font-bold ${activeTab === item.id ? 'bg-[#1a4d2e] text-white shadow-lg shadow-green-900/30 md:scale-105' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </nav>

        <button 
          onClick={handleLogout} 
          className="mt-4 flex items-center justify-center gap-2 p-4 text-red-500 font-black bg-red-50 rounded-2xl hover:bg-red-100 transition-all cursor-pointer"
        >
          <LogOut size={20} /> Exit Portal
        </button>
      </aside>

      {/* 🌟 MAIN CONTENT AREA (Responsive margins and padding) */}
      <main className="flex-1 w-full p-6 pt-24 md:p-10 md:ml-80 overflow-y-auto overflow-x-hidden print:ml-0 print:p-0">
        
        {/* HOMEPAGE TAB */}
        {activeTab === 'home' && (
          <div className="animate-fade-in max-w-6xl mx-auto">
            <div className="mb-10 md:mb-12">
              <h2 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tight break-words">
                Welcome, <span className="text-[#1a4d2e]">{studentName || "Scholar"}</span>!
              </h2>
              <p className="text-slate-400 font-medium text-base md:text-lg mt-2">Manage your academic progress and counseling records.</p>
            </div>

            {/* MLRIT HIGHLIGHTS CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              
              {/* Institution Status Card */}
              <div className="bg-white rounded-[30px] p-6 md:p-8 border-l-8 border-[#1a4d2e] shadow-xl shadow-slate-200/50 flex items-center justify-between hover:-translate-y-1 transition-transform">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Institution Status</p>
                  <h3 className="text-xl md:text-2xl font-black text-slate-800 mt-1">UGC Autonomous</h3>
                  <p className="text-slate-500 font-bold text-xs md:text-sm mt-1">NBA Tier-1 & NAAC 'A' Grade</p>
                </div>
                <div className="h-14 w-14 md:h-16 md:w-16 bg-green-500/10 rounded-2xl flex items-center justify-center text-[#1a4d2e] text-2xl md:text-3xl shrink-0">🏛️</div>
              </div>

              {/* National Rankings Card */}
              <div className="bg-white rounded-[30px] p-6 md:p-8 border-l-8 border-[#d67b27] shadow-xl shadow-slate-200/50 flex items-center justify-between hover:-translate-y-1 transition-transform">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">National Recognition</p>
                  <h3 className="text-xl md:text-2xl font-black text-slate-800 mt-1 uppercase">NIRF Ranked</h3>
                  <p className="text-slate-500 font-bold text-xs md:text-sm mt-1">Top Engineering Institute</p>
                </div>
                <div className="h-14 w-14 md:h-16 md:w-16 bg-orange-500/10 rounded-2xl flex items-center justify-center text-[#d67b27] text-2xl md:text-3xl shrink-0">🏆</div>
              </div>
            </div>

            {/* MLRIT VISION & PROGRESS BOARD */}
            <div className="mt-8 md:mt-12 bg-white rounded-[40px] p-8 md:p-10 bg-gradient-to-br from-green-50/50 to-white shadow-xl shadow-slate-200/50 relative overflow-hidden">
               <div className="relative z-10">
                 <h3 className="text-xl md:text-2xl font-black text-[#1a4d2e] mb-2 uppercase tracking-tight leading-snug">
                   Industry Integrated Curriculum Blended With Sports
                 </h3>
                 <p className="text-slate-600 font-medium text-sm md:text-base leading-relaxed max-w-3xl mt-4">
                   Established in 2005 by the KMR Education Trust, MLR Institute of Technology is dedicated to providing an environment where academics, employable skills, and physical fitness go hand-in-hand. 
                 </p>
                 <div className="mt-6 flex flex-wrap gap-3 md:gap-4">
                    <span className="bg-white px-3 py-2 md:px-4 md:py-2 rounded-xl text-xs md:text-sm font-bold text-slate-600 shadow-sm border border-slate-100">Top Placements</span>
                    <span className="bg-white px-3 py-2 md:px-4 md:py-2 rounded-xl text-xs md:text-sm font-bold text-slate-600 shadow-sm border border-slate-100">Center of Excellence</span>
                    <span className="bg-white px-3 py-2 md:px-4 md:py-2 rounded-xl text-xs md:text-sm font-bold text-slate-600 shadow-sm border border-slate-100">Innovation Labs</span>
                 </div>
               </div>
               <div className="absolute -bottom-10 -right-10 text-8xl md:text-9xl text-[#1a4d2e]/5 font-black rotate-12 select-none pointer-events-none">MLRIT</div>
            </div>
          </div>
        )}

        {/* DYNAMIC TAB CONTENT */}
        <div className="max-w-6xl mx-auto w-full">
          {activeTab === 'profile' && <CandidateProfile />}
          {activeTab === 'performance' && <PerformanceEntry />}
          {activeTab === 'analytics' && <Analytics />}
          {activeTab === 'activities' && <ActivitiesCerts />}
          {activeTab === 'counseling' && <CounselingLogs />}
        </div>
      </main>
      
    </div>
  );
}