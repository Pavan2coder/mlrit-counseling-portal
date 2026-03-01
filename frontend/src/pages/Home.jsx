import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'; // For that smooth "React Bits" movement

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#030712]">
      
      {/* 🌟 THE AURORA BACKGROUND (React Bits Style) */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-green-500/20 blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-orange-500/20 blur-[120px] animate-pulse"></div>
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-indigo-500/10 blur-[100px]"></div>
      </div>

      {/* 🧊 THE MAIN GLASS CARD */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 glass-card max-w-2xl w-full p-12 flex flex-col items-center border border-white/10 bg-white/5 backdrop-blur-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)]"
      >
        
        {/* Logo with Glow */}
        <div className="relative mb-10 group">
          <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-orange-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
          <div className="relative bg-white p-6 rounded-2xl shadow-xl flex items-center justify-center w-64 h-32">
            <img 
              src="/mlrit-logo.png" 
              alt="MLRIT Logo" 
              className="max-h-full max-w-full object-contain"
            />
          </div>
        </div>

        {/* Futuristic Text */}
        <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">
          MLRIT PORTAL
        </h1>
        
        <div className="flex items-center gap-4 mb-12">
          <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-green-500"></div>
          <p className="text-green-400 font-mono tracking-[0.3em] text-xs md:text-sm uppercase">
            Interactive Counseling System • 2025-29
          </p>
          <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-orange-500"></div>
        </div>

        {/* The Action Button (React Bits Glow Style) */}
        <button 
          onClick={() => navigate('/login')}
          className="group relative px-12 py-5 bg-white text-black font-black text-xl rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.2)] cursor-pointer overflow-hidden"
        >
          <span className="relative z-10 flex items-center gap-3">
            OPEN COUNSELING BOOK
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              →
            </motion.span>
          </span>
          {/* Hover effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-orange-400/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </button>

      </motion.div>

      {/* Subtle Grid Overlay */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>
    </div>
  );
}