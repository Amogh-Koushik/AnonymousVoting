// ============================================================
// Intro Animation Component
// Full-screen animated intro — "An Amogh Koushik Project"
// Shows once per session, then auto-transitions to main app
// ============================================================

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const IntroAnimation = ({ onComplete }) => {
  const [phase, setPhase] = useState(0); // 0=enter, 1=hold, 2=exit

  useEffect(() => {
    // Phase 1: Hold after entrance animation (at ~1.5s)
    const holdTimer = setTimeout(() => setPhase(1), 1500);
    // Phase 2: Start exit animation (at ~2.8s)
    const exitTimer = setTimeout(() => setPhase(2), 2800);
    // Phase 3: Complete and unmount (at ~3.5s)
    const completeTimer = setTimeout(() => {
      sessionStorage.setItem('introShown', 'true');
      onComplete();
    }, 3500);

    return () => {
      clearTimeout(holdTimer);
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  // Skip button handler
  const handleSkip = () => {
    sessionStorage.setItem('introShown', 'true');
    onComplete();
  };

  return (
    <AnimatePresence>
      {phase < 2 && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
          style={{ background: '#030014' }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
        >
          {/* Animated gradient background orbs */}
          <motion.div
            className="absolute w-[600px] h-[600px] rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
              top: '-200px',
              right: '-200px',
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute w-[500px] h-[500px] rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)',
              bottom: '-150px',
              left: '-150px',
            }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Subtle grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                               linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: '60px 60px',
            }}
          />

          {/* Main content */}
          <div className="relative z-10 text-center px-6">
            {/* Small decorative line */}
            <motion.div
              className="w-12 h-[2px] mx-auto mb-8 rounded-full"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.8), transparent)',
              }}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
            />

            {/* "An" text */}
            <motion.p
              className="text-sm sm:text-base tracking-[0.3em] uppercase mb-3"
              style={{ color: 'rgba(148,163,184,0.7)', fontFamily: "'Inter', sans-serif" }}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
            >
              An
            </motion.p>

            {/* Main name */}
            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-3"
              style={{
                fontFamily: "'Inter', sans-serif",
                background: 'linear-gradient(135deg, #e2e8f0 0%, #a78bfa 40%, #818cf8 60%, #6366f1 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              Amogh Koushik
            </motion.h1>

            {/* "Project" text */}
            <motion.p
              className="text-sm sm:text-base tracking-[0.3em] uppercase"
              style={{ color: 'rgba(148,163,184,0.7)', fontFamily: "'Inter', sans-serif" }}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9, ease: 'easeOut' }}
            >
              Project
            </motion.p>

            {/* Bottom decorative line */}
            <motion.div
              className="w-12 h-[2px] mx-auto mt-8 rounded-full"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.6), transparent)',
              }}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 1.1, ease: 'easeOut' }}
            />

            {/* Glow effect behind name */}
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-32 rounded-full pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse, rgba(99,102,241,0.15) 0%, transparent 70%)',
                filter: 'blur(40px)',
              }}
              animate={{
                opacity: [0.4, 0.7, 0.4],
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>

          {/* Skip button */}
          <motion.button
            onClick={handleSkip}
            className="absolute top-6 right-6 text-xs tracking-wider uppercase px-4 py-2 rounded-full border transition-all duration-300 hover:bg-white/10"
            style={{
              color: 'rgba(148,163,184,0.5)',
              borderColor: 'rgba(148,163,184,0.15)',
              fontFamily: "'Inter', sans-serif",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.5 }}
            whileHover={{ color: 'rgba(148,163,184,0.9)', borderColor: 'rgba(148,163,184,0.3)' }}
          >
            Skip
          </motion.button>

          {/* Bottom loading bar */}
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/5">
            <motion.div
              className="h-full rounded-full"
              style={{
                background: 'linear-gradient(90deg, #6366f1, #a78bfa)',
              }}
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 3.5, ease: 'linear' }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IntroAnimation;
