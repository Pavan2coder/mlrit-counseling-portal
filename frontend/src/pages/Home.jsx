import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, GraduationCap, LineChart, ShieldCheck } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  const features = [
    { icon: <GraduationCap size={18} />, label: 'Academic Records' },
    { icon: <LineChart size={18} />, label: 'Performance Analytics' },
    { icon: <ShieldCheck size={18} />, label: 'Secure Counseling Logs' },
  ];

  return (
    <div className="min-h-screen w-full grid lg:grid-cols-2">

      {/* LEFT — brand panel */}
      <div className="brand-panel hidden lg:flex flex-col justify-between p-14">
        {/* decorative geometry */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full border border-white/10" />
        <div className="absolute -bottom-32 -left-16 w-[28rem] h-[28rem] rounded-full border border-white/10" />
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-accent/80 [clip-path:polygon(100%_0,100%_100%,0_100%)]" />

        <div className="relative z-10 bg-white/95 p-4 rounded-xl w-40 h-24 flex items-center justify-center">
          <img src="/mlrit-logo.png" alt="MLRIT Logo" className="max-h-full max-w-full object-contain" />
        </div>

        <div className="relative z-10">
          <p className="text-accent font-semibold tracking-[0.25em] text-xs uppercase mb-4">
            MLR Institute of Technology
          </p>
          <h2 className="text-4xl font-extrabold leading-tight text-white/95">
            One place for every<br />student's academic<br />journey.
          </h2>
          <p className="text-white/60 mt-5 max-w-sm leading-relaxed">
            Records, analytics, certificates and counseling history — organized,
            secure and always within reach.
          </p>
        </div>

        <p className="relative z-10 text-white/40 text-xs">
          UGC Autonomous · NBA Tier-1 · NAAC 'A' Grade
        </p>
      </div>

      {/* RIGHT — entry */}
      <div className="flex flex-col items-center justify-center p-8 sm:p-14 bg-canvas">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* logo on mobile only */}
          <div className="lg:hidden bg-white border border-slate-200 p-4 rounded-xl w-36 h-20 flex items-center justify-center mb-10">
            <img src="/mlrit-logo.png" alt="MLRIT Logo" className="max-h-full max-w-full object-contain" />
          </div>

          <span className="inline-block text-primary bg-primary/10 font-semibold text-xs tracking-wider uppercase px-3 py-1 rounded-full mb-6">
            Student Counseling Portal
          </span>

          <h1 className="text-5xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.05]">
            MLRIT
            <span className="block text-primary">Portal</span>
          </h1>

          <div className="h-1 w-16 bg-accent rounded-full mt-6 mb-6" />

          <p className="text-slate-500 leading-relaxed mb-10">
            Sign in with your college account to open your counseling book and
            track your academic progress.
          </p>

          <button onClick={() => navigate('/login')} className="btn-primary text-base">
            Open Counseling Book
            <ArrowRight size={20} />
          </button>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {features.map((f) => (
              <div key={f.label} className="flex items-center gap-2 text-slate-600 text-sm font-medium">
                <span className="text-primary">{f.icon}</span>
                {f.label}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
