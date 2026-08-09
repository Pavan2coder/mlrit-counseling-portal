import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, GraduationCap, LineChart, ShieldCheck } from 'lucide-react';

// §4 — critically damped (bounce 0), response 0.4s. Nothing here carried momentum,
// so nothing here overshoots.
const spring = { type: 'spring', bounce: 0, duration: 0.5 };

const stack = {
  animate: { transition: { staggerChildren: 0.055 } },
};
const item = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0, transition: spring },
};

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
      <motion.div
        variants={stack}
        initial="initial"
        animate="animate"
        className="brand-panel hidden lg:flex flex-col justify-between p-14"
      >
        {/* Depth, not decoration: soft light sources behind the content */}
        <div className="absolute -top-40 -right-40 w-[34rem] h-[34rem] rounded-full bg-white/[0.04] blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-[30rem] h-[30rem] rounded-full border border-white/10" />
        <div className="absolute bottom-0 right-0 w-44 h-44 bg-accent/70 blur-[1px] [clip-path:polygon(100%_0,100%_100%,0_100%)]" />

        <motion.div
          variants={item}
          className="relative z-10 material rounded-2xl p-4 w-40 h-24 flex items-center justify-center"
          style={{ boxShadow: 'var(--shadow-card)' }}
        >
          <img src="/mlrit-logo.png" alt="MLRIT Logo" className="max-h-full max-w-full object-contain" />
        </motion.div>

        <div className="relative z-10">
          <motion.p
            variants={item}
            className="text-accent font-semibold text-xs uppercase mb-4"
            style={{ letterSpacing: '0.25em' }}
          >
            MLR Institute of Technology
          </motion.p>
          {/* §15 — large text gets negative tracking and tight leading */}
          <motion.h2
            variants={item}
            className="text-[2.75rem] font-bold vib-primary"
            style={{ letterSpacing: '-0.03em', lineHeight: 1.05 }}
          >
            One place for every student's academic journey.
          </motion.h2>
          <motion.p variants={item} className="vib-secondary mt-5 max-w-sm leading-relaxed">
            Records, analytics, certificates and counseling history — organized,
            secure and always within reach.
          </motion.p>
        </div>

        <motion.p variants={item} className="relative z-10 vib-tertiary text-xs">
          UGC Autonomous · NBA Tier-1 · NAAC 'A' Grade
        </motion.p>
      </motion.div>

      {/* RIGHT — entry */}
      <div className="flex flex-col items-center justify-center p-8 sm:p-14 bg-canvas">
        <motion.div
          variants={stack}
          initial="initial"
          animate="animate"
          className="w-full max-w-md"
        >
          <motion.div
            variants={item}
            className="lg:hidden card p-4 w-36 h-20 flex items-center justify-center mb-10"
          >
            <img src="/mlrit-logo.png" alt="MLRIT Logo" className="max-h-full max-w-full object-contain" />
          </motion.div>

          <motion.span
            variants={item}
            className="inline-block text-primary bg-primary/10 font-semibold text-xs uppercase px-3 py-1.5 rounded-full mb-6"
            style={{ letterSpacing: '0.08em' }}
          >
            Student Counseling Portal
          </motion.span>

          <motion.h1
            variants={item}
            className="text-6xl sm:text-7xl font-bold text-slate-900"
            style={{ letterSpacing: '-0.045em', lineHeight: 0.95 }}
          >
            MLRIT
            <span className="block text-primary">Portal</span>
          </motion.h1>

          <motion.div variants={item} className="h-1 w-16 bg-accent rounded-full mt-6 mb-6" />

          <motion.p variants={item} className="text-slate-500 leading-relaxed mb-10">
            Sign in with your college account to open your counseling book and
            track your academic progress.
          </motion.p>

          <motion.div variants={item}>
            <button onClick={() => navigate('/login')} className="btn-primary text-base">
              Open Counseling Book
              <ArrowRight size={20} />
            </button>
          </motion.div>

          <motion.div variants={item} className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {features.map((f) => (
              <div key={f.label} className="flex items-center gap-2 text-slate-600 text-sm font-medium">
                <span className="text-primary">{f.icon}</span>
                {f.label}
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
