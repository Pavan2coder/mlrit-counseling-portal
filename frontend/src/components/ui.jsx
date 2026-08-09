import { useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useAnimationControls } from 'framer-motion';
import { X } from 'lucide-react';
import { uiSpring, sheetSpring, project } from '../motion';

/* ------------------------------------------------------------------ *
 * PageHeader — the iOS large title. Full size at rest; on scroll it
 * shrinks into a translucent toolbar and the material fades in behind
 * it, so chrome only appears where it actually overlaps content (§12).
 * ------------------------------------------------------------------ */
export function PageHeader({ title, subtitle, actions }) {
  const { scrollY } = useScroll();
  const scale = useTransform(scrollY, [0, 90], [1, 0.66]);
  const y = useTransform(scrollY, [0, 90], [0, -4]);
  const subOpacity = useTransform(scrollY, [0, 45], [1, 0]);
  const subHeight = useTransform(scrollY, [0, 45], [24, 0]);
  const barOpacity = useTransform(scrollY, [45, 95], [0, 1]);

  return (
    <div className="sticky top-16 md:top-0 z-20 -mx-6 md:-mx-10 mb-6">
      {/* The material lives behind the title and only materializes on scroll.
          Full-bleed via w-screen so it spans past the max-width content column. */}
      <motion.div
        style={{ opacity: barOpacity }}
        className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-screen material"
      />

      <div className="relative px-6 md:px-10 pt-2 pb-3 flex items-end justify-between gap-4">
        <div className="min-w-0">
          <motion.h2
            style={{ scale, y, transformOrigin: 'left bottom' }}
            className="text-4xl md:text-5xl font-bold text-slate-900 truncate"
            /* §15 — big text needs negative tracking and tight leading */
          >
            <span style={{ letterSpacing: '-0.04em', display: 'inline-block' }}>{title}</span>
          </motion.h2>
          {subtitle && (
            <motion.p
              style={{ opacity: subOpacity, height: subHeight }}
              className="text-slate-500 text-sm overflow-hidden"
            >
              {subtitle}
            </motion.p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2 shrink-0 pb-1">{actions}</div>}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Grouped list
 * ------------------------------------------------------------------ */
export function ListGroup({ title, children, className = '' }) {
  return (
    <div className={className}>
      {title && <span className="list-title">{title}</span>}
      <div className="list-group">{children}</div>
    </div>
  );
}

export function Field({ label, icon, tone = 'slate', hint, ...props }) {
  return (
    <label className="list-row">
      {icon && <span className={`tile-icon t-${tone}`}>{icon}</span>}
      <span className="list-label">{label}</span>
      <input className="list-input" {...props} />
      {hint && <span className="text-xs text-slate-400 shrink-0">{hint}</span>}
    </label>
  );
}

export function AreaField({ label, icon, tone = 'slate', ...props }) {
  return (
    <label className="list-row !items-start">
      {icon && <span className={`tile-icon t-${tone} mt-3`}>{icon}</span>}
      <span className="list-label pt-3">{label}</span>
      <textarea className="list-input resize-none min-h-[5rem] text-left" {...props} />
    </label>
  );
}

/* One saturated surface per screen — carries the brand so the rest can stay calm */
export function Hero({ eyebrow, title, children, aside }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={uiSpring}
      className="hero p-7 md:p-9 mb-6"
    >
      <div className="absolute -top-28 -right-16 w-80 h-80 rounded-full bg-white/[0.07] blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-40 h-40 bg-accent/60 blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-wrap items-end justify-between gap-6">
        <div className="min-w-0">
          {eyebrow && (
            <p className="text-accent font-semibold text-[11px] uppercase mb-2" style={{ letterSpacing: '0.18em' }}>
              {eyebrow}
            </p>
          )}
          <h3 className="text-3xl md:text-4xl font-bold vib-primary" style={{ letterSpacing: '-0.035em', lineHeight: 1.05 }}>
            {title}
          </h3>
          {children && <div className="mt-4">{children}</div>}
        </div>
        {aside && <div className="shrink-0">{aside}</div>}
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ *
 * Segmented control — one pill travels between options (§7)
 * ------------------------------------------------------------------ */
export function Segmented({ value, onChange, options, layoutId = 'seg' }) {
  return (
    <div className="segmented">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          data-active={value === o.value}
          onClick={() => onChange(o.value)}
          className="segmented-item"
        >
          {value === o.value && (
            <motion.span
              layoutId={layoutId}
              transition={uiSpring}
              className="absolute inset-0 bg-white rounded-xl"
              style={{ boxShadow: 'var(--shadow-chip)' }}
            />
          )}
          <span className="relative z-10">{o.label}</span>
        </button>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Sheet — drag down to dismiss, with rubber-banding at the top edge,
 * momentum projection on release and velocity handed to the spring
 * (§3, §5, §6, §9). Grabbable mid-animation.
 * ------------------------------------------------------------------ */
export function Sheet({ open, onClose, title, children, footer }) {
  const controls = useAnimationControls();
  const sheetRef = useRef(null);

  useEffect(() => {
    if (open) controls.start({ y: 0, transition: sheetSpring });
  }, [open, controls]);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    if (open) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const handleDragEnd = (_, info) => {
    const height = sheetRef.current?.offsetHeight ?? 400;
    const projected = info.offset.y + project(info.velocity.y);
    if (projected > height * 0.4) onClose();
    // Didn't cross the threshold — spring back from wherever the finger let go.
    else controls.start({ y: 0, transition: { ...sheetSpring, velocity: info.velocity.y } });
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* §12 — dim to focus: this is a modal task, so the background goes back */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 z-50"
          />
          <motion.div
            ref={sheetRef}
            /* §7 — enters from the bottom, leaves to the bottom. Same path. */
            initial={{ y: '100%' }}
            animate={controls}
            exit={{ y: '100%', transition: { duration: 0.25, ease: [1, 0, 0.68, 0.28] } }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={{ top: 0.55, bottom: 0 }} /* §9 — resist, don't hard-stop */
            onDragEnd={handleDragEnd}
            className="sheet fixed inset-x-0 bottom-0 z-50 rounded-t-[1.75rem] max-h-[88vh] flex flex-col
                       sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-[34rem]"
          >
            <div className="pt-2.5 pb-1 cursor-grab active:cursor-grabbing shrink-0">
              <div className="grabber" />
            </div>
            <div className="flex items-center justify-between px-5 pt-2 pb-3 shrink-0">
              <h3 className="text-xl font-bold text-slate-900" style={{ letterSpacing: '-0.025em' }}>
                {title}
              </h3>
              <button onClick={onClose} className="icon-btn" aria-label="Close">
                <X size={20} />
              </button>
            </div>
            <div className="px-5 pb-4 overflow-y-auto">{children}</div>
            {footer && (
              <div className="px-5 py-4 border-t border-slate-900/[0.07] shrink-0">{footer}</div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ------------------------------------------------------------------ *
 * Stat tile + progress ring
 * ------------------------------------------------------------------ */
export function StatTile({ label, value, unit, icon, tone = 'green', foot }) {
  return (
    <div className="card p-5 relative overflow-hidden">
      {/* A wash of the tile's own colour so a row of tiles reads as a set, not a table */}
      <span className={`absolute -top-10 -right-10 h-24 w-24 rounded-full blur-2xl opacity-25 t-${tone}`} />
      <div className="relative flex items-start justify-between gap-3">
        <span className="text-[11px] font-semibold text-slate-400 uppercase" style={{ letterSpacing: '0.07em' }}>
          {label}
        </span>
        {icon && <span className={`tile-icon t-${tone}`}>{icon}</span>}
      </div>
      <p className="relative mt-3 text-3xl font-bold text-slate-900 tabular-nums" style={{ letterSpacing: '-0.035em' }}>
        {value}
        {unit && <span className="text-lg text-slate-400 font-semibold ml-0.5">{unit}</span>}
      </p>
      {foot && <p className="relative text-xs text-slate-400 mt-1">{foot}</p>}
    </div>
  );
}

export function ProgressRing({ value, size = 132, stroke = 12, label }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, value || 0));

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id="ring-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3f9a63" />
            <stop offset="55%" stopColor="#1a4d2e" />
            <stop offset="100%" stopColor="#d67b27" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} fill="none"
                className="stroke-slate-900/[0.07]" />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} fill="none" strokeLinecap="round"
          stroke="url(#ring-grad)"
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c - (pct / 100) * c }}
          transition={{ ...uiSpring, duration: 0.9 }}
          style={{ strokeDasharray: c }}
        />
      </svg>
      <div className="absolute text-center">
        <p className="text-3xl font-bold text-slate-900" style={{ letterSpacing: '-0.04em' }}>{pct}%</p>
        {label && <p className="text-[11px] text-slate-400 font-medium mt-0.5">{label}</p>}
      </div>
    </div>
  );
}

/* Empty state — says what's missing and how to fix it, never a bare dash (§16) */
export function EmptyState({ icon, title, hint, action, tone = 'green' }) {
  return (
    <div className="card p-12 text-center">
      {icon && <div className={`mx-auto mb-4 tile-lg t-${tone}`}>{icon}</div>}
      <p className="font-semibold text-slate-700">{title}</p>
      {hint && <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">{hint}</p>}
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  );
}
