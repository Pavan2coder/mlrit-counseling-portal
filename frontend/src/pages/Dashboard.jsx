import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion, AnimatePresence, useAnimationControls } from 'framer-motion';
import { User, BookOpen, BarChart2, History, LogOut, Award, Home, Menu, X, Landmark, Trophy, ChevronRight } from 'lucide-react';
import { PageHeader, Hero } from '../components/ui';
import { drawerSpring, uiSpring, project } from '../motion';

// Component Imports
import CandidateProfile from '../components/CandidateProfile';
import PerformanceEntry from '../components/PerformanceEntry';
import CounselingLogs from '../components/CounselingLogs';
import ActivitiesCerts from '../components/ActivitiesCerts';
import Analytics from '../components/Analytics';

const RAIL = 288; // w-72

// §16 — name items for their contents, not vague umbrellas. "Overview", not "Home".
const NAV = [
  { id: 'home', label: 'Overview', icon: <Home size={19} /> },
  { id: 'profile', label: 'Profile', icon: <User size={19} /> },
  { id: 'performance', label: 'Records', icon: <BookOpen size={19} /> },
  { id: 'analytics', label: 'Analytics', icon: <BarChart2 size={19} /> },
  { id: 'activities', label: 'Achievements', icon: <Award size={19} /> },
  { id: 'counseling', label: 'Counseling', icon: <History size={19} /> },
];

// Desktop keeps the rail pinned; only the mobile drawer is a gesture surface.
function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(() => window.matchMedia('(min-width: 768px)').matches);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const onChange = (e) => setIsDesktop(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return isDesktop;
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('home');
  const [studentName, setStudentName] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isDesktop = useIsDesktop();
  const drawer = useAnimationControls();
  const navigate = useNavigate();

  // The drawer is driven imperatively, not by an `animate` prop: a release that
  // doesn't change the open state still has to spring back from wherever the
  // finger left it.
  useEffect(() => {
    drawer.start({
      x: isDesktop || isMobileMenuOpen ? 0 : -RAIL,
      transition: drawerSpring,
    });
  }, [isMobileMenuOpen, isDesktop, drawer]);

  useEffect(() => {
    const name = localStorage.getItem('studentName');
    if (name) setStudentName(name);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logged out successfully. See you next time!");
    navigate('/');
  };

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
  };

  // §6 + §5 — decide on the *projected* endpoint, then hand the release velocity
  // to the spring so there's no seam between dragging and animating.
  const handleDragEnd = (_, info) => {
    const open = info.offset.x + project(info.velocity.x) > -RAIL / 2;
    drawer.start({
      x: open ? 0 : -RAIL,
      transition: { ...drawerSpring, velocity: info.velocity.x },
    });
    setIsMobileMenuOpen(open);
  };

  return (
    <div className="min-h-screen flex bg-canvas">

      {/* MOBILE HEADER — floating material, content scrolls underneath (§12) */}
      <div className="md:hidden fixed top-0 w-full material z-40 px-6 py-4 flex justify-between items-center">
        <img src="/mlrit-logo.png" alt="MLRIT Logo" className="h-8 object-contain" />
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          className="p-2 bg-slate-900/[0.06] rounded-xl text-primary active:scale-90 transition-transform duration-100"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* SCRIM — dim to focus. Fades with the drawer, never blocks the gesture. */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-slate-900/30 backdrop-blur-[2px] z-30 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* SIDEBAR — structural material. On mobile it's a grab-anywhere drawer. */}
      <motion.aside
        initial={{ x: isDesktop ? 0 : -RAIL }}
        animate={drawer}
        drag={isDesktop ? false : 'x'}
        dragConstraints={{ left: -RAIL, right: 0 }}
        dragElastic={{ left: 0, right: 0.55 }} /* §9 — rubber-band past the open edge */
        dragMomentum={false}
        onDragEnd={handleDragEnd}
        style={{ width: RAIL, touchAction: 'pan-y' }}
        className="brand-panel flex flex-col fixed h-full z-40 p-5 print:hidden"
      >
        <div className="absolute -top-40 -left-24 w-[28rem] h-[28rem] rounded-full bg-white/[0.05] blur-3xl pointer-events-none" />

        <div className="relative z-10 mb-8 flex items-center gap-3 px-2">
          <div className="bg-white p-2 rounded-xl flex items-center justify-center w-14 h-14 shrink-0">
            <img src="/mlrit-logo.png" alt="MLRIT Logo" className="max-h-full max-w-full object-contain" />
          </div>
          <div>
            <p className="vib-primary leading-tight">MLRIT Portal</p>
            <span className="text-[10px] vib-tertiary uppercase" style={{ letterSpacing: '0.2em' }}>Student</span>
          </div>
        </div>

        <nav className="relative z-10 flex-1 space-y-1 overflow-y-auto pr-1 pb-4">
          {NAV.map((item) => {
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`relative flex items-center gap-3 px-4 py-3 w-full rounded-xl font-medium text-sm cursor-pointer
                  active:scale-[0.98] transition-[transform,color] duration-100
                  ${active ? 'text-white' : 'text-white/60 hover:text-white'}`}
              >
                {/* §7 — one pill that travels between items, so the selection has a path */}
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    transition={uiSpring}
                    className="absolute inset-0 rounded-xl bg-white/15 border-l-2 border-accent"
                  />
                )}
                <span className="relative z-10 flex items-center gap-3">{item.icon} {item.label}</span>
              </button>
            );
          })}
        </nav>

        <button
          onClick={handleLogout}
          className="relative z-10 mt-4 flex items-center justify-center gap-2 py-3 text-white/80 font-semibold text-sm
                     bg-white/[0.07] rounded-xl hover:bg-red-500/25 hover:text-white cursor-pointer
                     active:scale-[0.97] transition-[background-color,color,transform] duration-150"
        >
          <LogOut size={18} /> Exit Portal
        </button>

        {/* Grab handle — tells you the edge is draggable (§10) */}
        <div className="md:hidden absolute right-1.5 top-1/2 -translate-y-1/2 h-12 w-1 rounded-full bg-white/25" />
      </motion.aside>

      {/* MAIN */}
      {/* overflow-x-CLIP, not hidden: `hidden` would make this a scroll container
          and silently break every `position: sticky` header inside it. */}
      <main className="flex-1 w-full p-6 pt-24 md:p-10 md:ml-72 overflow-x-clip print:ml-0 print:p-0">

        {activeTab === 'home' && (
          <div className="animate-fade-in max-w-6xl mx-auto">
            <PageHeader title="Overview" subtitle="Your academic progress at a glance" />

            <Hero
              eyebrow="MLR Institute of Technology"
              title={`Hello, ${(studentName || 'Scholar').split(' ')[0]}`}
              aside={
                <div className="hidden sm:flex flex-col items-end gap-2">
                  <span className="chip !bg-white/15 !text-white/90">UGC Autonomous</span>
                  <span className="chip !bg-white/15 !text-white/90">NAAC 'A' Grade</span>
                </div>
              }
            >
              <p className="vib-secondary max-w-md leading-relaxed">
                Everything in your counseling book — records, analytics, certificates
                and session history — lives here.
              </p>
            </Hero>

            {/* Jump straight to the work — the four things you actually came to do */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
              {NAV.filter((n) => n.id !== 'home').slice(0, 4).map((n, i) => (
                <button
                  key={n.id}
                  onClick={() => setActiveTab(n.id)}
                  className="card card-interactive p-5 text-left"
                >
                  <span className={`tile-lg t-${['blue', 'violet', 'orange', 'teal'][i]}`}>{n.icon}</span>
                  <p className="mt-3 font-semibold text-slate-900">{n.label}</p>
                  <span className="text-sm text-slate-400 flex items-center gap-1 mt-0.5">
                    Open <ChevronRight size={14} />
                  </span>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="card p-6 flex items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold text-slate-400 uppercase" style={{ letterSpacing: '0.07em' }}>Institution status</p>
                  <h3 className="text-xl font-bold text-slate-900 mt-1.5" style={{ letterSpacing: '-0.025em' }}>UGC Autonomous</h3>
                  <p className="text-slate-500 text-sm mt-1">NBA Tier-1 &amp; NAAC 'A' Grade</p>
                </div>
                <span className="tile-lg t-green"><Landmark size={22} /></span>
              </div>

              <div className="card p-6 flex items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold text-slate-400 uppercase" style={{ letterSpacing: '0.07em' }}>National recognition</p>
                  <h3 className="text-xl font-bold text-slate-900 mt-1.5" style={{ letterSpacing: '-0.025em' }}>NIRF Ranked</h3>
                  <p className="text-slate-500 text-sm mt-1">Top engineering institute</p>
                </div>
                <span className="tile-lg t-orange"><Trophy size={22} /></span>
              </div>
            </div>

            <div className="mt-5 card p-8 md:p-10 relative overflow-hidden">
               <div className="absolute top-0 left-0 h-full w-1 bg-accent" />
               <div className="relative z-10">
                 <h3
                   className="text-2xl md:text-3xl font-bold text-primary mb-4 max-w-2xl"
                   style={{ letterSpacing: '-0.03em', lineHeight: 1.15 }}
                 >
                   Industry integrated curriculum, blended with sports
                 </h3>
                 <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-3xl">
                   Established in 2005 by the KMR Education Trust, MLR Institute of Technology is dedicated to providing an environment where academics, employable skills, and physical fitness go hand-in-hand.
                 </p>
                 <div className="mt-6 flex flex-wrap gap-2">
                    {['Top placements', 'Center of excellence', 'Innovation labs'].map((tag) => (
                      <span key={tag} className="chip">{tag}</span>
                    ))}
                 </div>
               </div>
               <div className="absolute -bottom-8 -right-6 text-8xl md:text-9xl text-primary/[0.04] font-black rotate-12 select-none pointer-events-none">MLRIT</div>
            </div>
          </div>
        )}

        {/* key => each tab remounts and plays its own entry. No exit wait, no latency (§1). */}
        <div key={activeTab} className="max-w-6xl mx-auto w-full">
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
