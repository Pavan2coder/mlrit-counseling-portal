import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { User, BookOpen, BarChart2, History, LogOut, Award, Home, Menu, X, Landmark, Trophy } from 'lucide-react';

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
    toast.success("Logged out successfully. See you next time!");
    navigate('/');
  };

  // Helper to close menu on mobile when a link is clicked
  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false); 
  };

  return (
    <div className="min-h-screen flex bg-canvas">

      {/* 🌟 MOBILE HEADER (Only shows on small screens) */}
      <div className="md:hidden fixed top-0 w-full bg-white border-b border-slate-200 z-40 px-6 py-4 flex justify-between items-center">
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
          className="fixed inset-0 bg-black/30 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* 🌟 SIDEBAR - Deep green rail (Responsive) */}
      <aside className={`w-72 bg-primary text-white flex flex-col fixed h-full z-40 p-5 transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 print:hidden`}>
        <div className="mb-8 flex items-center gap-3 px-2">
          <div className="bg-white p-2 rounded-lg flex items-center justify-center w-14 h-14 shrink-0">
            <img src="/mlrit-logo.png" alt="MLRIT Logo" className="max-h-full max-w-full object-contain" />
          </div>
          <div>
            <p className="font-bold leading-tight">MLRIT Portal</p>
            <span className="text-[10px] font-medium tracking-[0.2em] text-white/50 uppercase">Student</span>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto pr-1 pb-4">
          {[
            { id: 'home', label: 'Dashboard Home', icon: <Home size={19} /> },
            { id: 'profile', label: 'My Profile', icon: <User size={19} /> },
            { id: 'performance', label: 'Academic Records', icon: <BookOpen size={19} /> },
            { id: 'analytics', label: 'Performance Analytics', icon: <BarChart2 size={19} /> },
            { id: 'activities', label: 'Certificates & Activities', icon: <Award size={19} /> },
            { id: 'counseling', label: 'Counseling History', icon: <History size={19} /> },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`flex items-center gap-3 px-4 py-3 w-full rounded-xl transition-colors font-medium text-sm ${activeTab === item.id ? 'bg-white/15 text-white border-l-2 border-accent' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="mt-4 flex items-center justify-center gap-2 py-3 text-white/80 font-semibold text-sm bg-white/5 rounded-xl hover:bg-red-500/20 hover:text-white transition-colors cursor-pointer"
        >
          <LogOut size={18} /> Exit Portal
        </button>
      </aside>

      {/* 🌟 MAIN CONTENT AREA (Responsive margins and padding) */}
      <main className="flex-1 w-full p-6 pt-24 md:p-10 md:ml-72 overflow-y-auto overflow-x-hidden print:ml-0 print:p-0">
        
        {/* HOMEPAGE TAB */}
        {activeTab === 'home' && (
          <div className="animate-fade-in max-w-6xl mx-auto">
            <div className="mb-8 md:mb-10">
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight break-words">
                Welcome, <span className="text-primary">{studentName || "Scholar"}</span>
              </h2>
              <p className="text-slate-500 text-base mt-2">Manage your academic progress and counseling records.</p>
            </div>

            {/* MLRIT HIGHLIGHTS CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* Institution Status Card */}
              <div className="card p-6 flex items-center justify-between hover:-translate-y-0.5 transition-transform">
                <div>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Institution Status</p>
                  <h3 className="text-xl font-bold text-slate-900 mt-1">UGC Autonomous</h3>
                  <p className="text-slate-500 text-sm mt-1">NBA Tier-1 &amp; NAAC 'A' Grade</p>
                </div>
                <div className="h-14 w-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0"><Landmark size={26} /></div>
              </div>

              {/* National Rankings Card */}
              <div className="card p-6 flex items-center justify-between hover:-translate-y-0.5 transition-transform">
                <div>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">National Recognition</p>
                  <h3 className="text-xl font-bold text-slate-900 mt-1">NIRF Ranked</h3>
                  <p className="text-slate-500 text-sm mt-1">Top Engineering Institute</p>
                </div>
                <div className="h-14 w-14 bg-accent/10 rounded-xl flex items-center justify-center text-accent shrink-0"><Trophy size={26} /></div>
              </div>
            </div>

            {/* MLRIT VISION & PROGRESS BOARD */}
            <div className="mt-6 card p-8 md:p-10 relative overflow-hidden">
               <div className="absolute top-0 left-0 h-full w-1 bg-accent" />
               <div className="relative z-10">
                 <h3 className="text-xl md:text-2xl font-bold text-primary mb-4 tracking-tight leading-snug">
                   Industry Integrated Curriculum Blended With Sports
                 </h3>
                 <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-3xl">
                   Established in 2005 by the KMR Education Trust, MLR Institute of Technology is dedicated to providing an environment where academics, employable skills, and physical fitness go hand-in-hand.
                 </p>
                 <div className="mt-6 flex flex-wrap gap-2.5">
                    <span className="bg-slate-50 px-4 py-2 rounded-lg text-sm font-medium text-slate-600 border border-slate-200">Top Placements</span>
                    <span className="bg-slate-50 px-4 py-2 rounded-lg text-sm font-medium text-slate-600 border border-slate-200">Center of Excellence</span>
                    <span className="bg-slate-50 px-4 py-2 rounded-lg text-sm font-medium text-slate-600 border border-slate-200">Innovation Labs</span>
                 </div>
               </div>
               <div className="absolute -bottom-8 -right-6 text-8xl md:text-9xl text-primary/[0.04] font-black rotate-12 select-none pointer-events-none">MLRIT</div>
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