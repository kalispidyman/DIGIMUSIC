import { useState, useCallback, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ReactLenis } from 'lenis/react';
import Background3D from './components/Background3D';
import MusicBackground from './components/MatrixRain';
import GlassOverlay from './components/GlassOverlay';
import ScrollHighlight from './components/ScrollHighlight';
import Hero from './components/Hero';
import OccasionTiers from './components/OccasionTiers';
import VibeTiers from './components/VibeTiers';
import SampleMusic from './components/SampleMusic';
import Loader from './components/Loader';
import DiskWhatsApp from './components/DiskWhatsApp';
import './App.css';

gsap.registerPlugin(ScrollTrigger);

/* ── particle colours for the blast ── */
const BLAST_COLORS = ['#a78bfa', '#38bdf8', '#f472b6', '#34d399', '#fbbf24', '#e879f9', '#60a5fa'];

/* single particle — position set via left/top offset, no CSS transform conflict */
function BlastParticle({ x, y, angle, dist, color, size, dur, onDone }) {
  const rad = (angle * Math.PI) / 180;
  const tx = Math.cos(rad) * dist;
  const ty = Math.sin(rad) * dist;
  return (
    <motion.div
      initial={{ opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 }}
      animate={{ opacity: 0, x: tx, y: ty, scale: 0, rotate: angle * 2 }}
      transition={{ duration: dur, ease: [0.2, 0.8, 0.4, 1] }}
      onAnimationComplete={onDone}
      style={{
        position: 'fixed',
        left: x - size / 2,   /* center on origin without CSS transform */
        top: y - size / 2,
        width: size, height: size,
        borderRadius: '50%',
        background: color,
        pointerEvents: 'none',
        zIndex: 9999,
        boxShadow: `0 0 ${size * 2}px ${color}`,
      }}
    />
  );
}

/* ── Designer @NEET badge — hover coords + click blast ── */
function DesignerBadge() {
  const [hov, setHov] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState([]);
  const badgeRef = useRef(null);
  let pid = useRef(0);

  /* track live screen coords */
  const onMouseMove = e => setCoords({ x: Math.round(e.clientX), y: Math.round(e.clientY) });

  /* spawn radial particle burst from badge center */
  const blast = () => {
    const rect = badgeRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const count = 22;
    const newParticles = Array.from({ length: count }, (_, i) => ({
      id: ++pid.current,
      x: cx, y: cy,
      angle: (360 / count) * i + Math.random() * 14,
      dist: 60 + Math.random() * 110,
      dur: 0.55 + Math.random() * 0.35,   /* pre-calculated — never changes after mount */
      color: BLAST_COLORS[i % BLAST_COLORS.length],
      size: 4 + Math.random() * 7,
    }));
    setParticles(p => [...p, ...newParticles]);
  };

  const removeParticle = id => setParticles(p => p.filter(pt => pt.id !== id));

  return (
    <>
      {/* Particles rendered in fixed-position portal above everything */}
      {particles.map(pt => (
        <BlastParticle key={pt.id} {...pt} onDone={() => removeParticle(pt.id)} />
      ))}

      <motion.div
        drag
        dragConstraints={{ top: -window.innerHeight, left: -window.innerWidth, right: window.innerWidth, bottom: window.innerHeight }}
        dragElastic={0.1}
        ref={badgeRef}
        onHoverStart={() => setHov(true)}
        onHoverEnd={() => setHov(false)}
        onMouseMove={onMouseMove}
        onTap={blast}
        animate={{
          scale: hov ? 1.05 : 1,
          y: hov ? -4 : [0, -6, 0],
          boxShadow: hov
            ? '0 0 35px rgba(167,139,250,0.3)'
            : '0 0 0px rgba(0,0,0,0)',
        }}
        transition={{
          y: hov ? { type: 'spring', stiffness: 300 } : { repeat: Infinity, duration: 4, ease: 'easeInOut' },
          scale: { type: 'spring', stiffness: 400, damping: 25 },
          boxShadow: { duration: 0.3 }
        }}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '10px',
          padding: '6px 20px',
          background: hov ? 'rgba(167,139,250,0.06)' : 'rgba(255,255,255,0.03)',
          border: 'none', // Border removed as requested
          borderRadius: '50px',
          cursor: 'grab',
          position: 'relative', overflow: 'hidden',
          zIndex: 1000,
          touchAction: 'none',
          userSelect: 'none',
        }}
      >
        {/* Prismatic Shimmer Sweep on Hover */}
        <motion.div
          animate={hov ? { x: ['-150%', '150%'] } : { x: '-150%' }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
            pointerEvents: 'none'
          }}
        />

        {/* Underline grow on hover */}
        <motion.div
          animate={{ scaleX: hov ? 1 : 0, opacity: hov ? 1 : 0 }}
          style={{ position: 'absolute', bottom: '0px', left: '10%', right: '10%', height: '1px', background: 'linear-gradient(90deg, transparent, #a78bfa, transparent)', transformOrigin: 'center' }}
        />

        {/* Pulse dot */}
        <motion.div
          animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ repeat: Infinity, duration: 2 }}
          style={{ width: '6px', height: '6px', borderRadius: '50%', background: hov ? '#a78bfa' : 'rgba(167,139,250,0.4)', flexShrink: 0 }}
        />
        <motion.span
          animate={{ letterSpacing: hov ? '0.15em' : '0.1em' }}
          style={{ fontSize: '0.66rem', fontFamily: "'DM Sans', sans-serif", fontWeight: 500, color: hov ? '#fff' : 'rgba(255,255,255,0.3)', textTransform: 'uppercase', transition: 'color 0.3s' }}
        >
          Designer
        </motion.span>
        <motion.span
          animate={hov ? { backgroundPosition: ['0% center', '200% center'] } : { backgroundPosition: '0% center' }}
          transition={hov ? { repeat: Infinity, duration: 2, ease: 'linear' } : {}}
          style={{ fontSize: '0.75rem', fontFamily: "'Outfit', sans-serif", fontWeight: 800, letterSpacing: '0.04em', background: 'linear-gradient(90deg, #a78bfa, #38bdf8, #f472b6, #a78bfa)', backgroundSize: '200% auto', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
        >
          @NEET
        </motion.span>

        {/* Live X Y coordinate tooltip — shows on hover */}
        <AnimatePresence>
          {hov && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.9 }}
              style={{
                position: 'absolute', bottom: 'calc(100% + 15px)', left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(8,6,14,0.96)', border: '1px solid rgba(167,139,250,0.2)',
                borderRadius: '8px', padding: '4px 12px',
                fontFamily: 'monospace', fontSize: '0.65rem',
                color: '#a78bfa', whiteSpace: 'nowrap', pointerEvents: 'none',
                backdropFilter: 'blur(12px)', boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
              }}
            >
              x: {coords.x}  y: {coords.y}
              <div style={{ position: 'absolute', bottom: '-5px', left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '5px solid rgba(167,139,250,0.2)' }} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}

/* ─────────────────────────────────────────────────────
   FOOTER & FORM POSITION CONTROLS
   ───────────────────────────────────────────────── */
const FOOTER_CONFIG = {
  sectionPaddingBottom: '6vh', // Removed large gap (previously 35vh) to "crop" the bottom
  formBottomMargin: '8rem',    // Increased this to keep the form shifted up
};

function App() {
  const [loading, setLoading] = useState(true);
  const [themeColor, setThemeColor] = useState('#aaaaaa');

  const handleThemeChange = useCallback((color) => {
    setThemeColor(color);
  }, []);

  return (
    <div style={{ minHeight: '100vh', width: '100vw', background: '#030308' }}>
      <AnimatePresence mode="wait">
        {loading && <Loader key="loader" onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      {!loading && (
        <ReactLenis root options={{ lerp: 0.05, duration: 1.5, smoothWheel: true, smoothTouch: false }}>
          <div className="app-container">
            {/* ── Layer 0: Distant Music Background (behind glass) ── */}
            <MusicBackground />

            {/* ── Layer 2: Frosted Glass Pane ── */}
            <GlassOverlay themeColor={themeColor} />

            {/* ── Layer 5: Fixed 3D Vinyl ── */}
            <div className="canvas-container">
              <Background3D />
            </div>

            {/* ── Layer 10: All scrollable content with scroll highlights ── */}
            <motion.main
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              style={{ position: 'relative', zIndex: 10, overflowX: 'hidden' }}
            >
              <div style={{ maxWidth: '1600px', margin: '0 auto', display: 'flex', flexDirection: 'column' }}>
                {/* Hero doesn't need scroll highlight — it's the first thing visible */}
                <Hero />

                <ScrollHighlight>
                  <OccasionTiers />
                </ScrollHighlight>

                <ScrollHighlight>
                  <VibeTiers onThemeChange={handleThemeChange} />
                </ScrollHighlight>

                <ScrollHighlight>
                  <SampleMusic />
                </ScrollHighlight>

                {/* Bottom ambient section — gives the disk scroll space to reach the bottom.
                      The 3D disk converts to the WhatsApp form via DiskWhatsApp overlay. */}
                <section style={{
                  height: '40vh', // Further reduced to stop scrolling even earlier
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  paddingBottom: FOOTER_CONFIG.sectionPaddingBottom,
                  position: 'relative'
                }}>
                  <div style={{ position: 'absolute', top: '42%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', pointerEvents: 'none' }}>
                    <p style={{ margin: '0 0 8px', fontSize: '0.65rem', letterSpacing: '0.25em', color: 'rgba(255,255,255,0.2)', fontFamily: "'DM Sans', sans-serif", textTransform: 'uppercase' }}>04 — Commission</p>
                    <h2 style={{ margin: 0, fontFamily: "'Outfit', sans-serif", fontSize: 'clamp(1.8rem,3vw,2.8rem)', fontWeight: 700, color: 'rgba(255,255,255,0.06)', letterSpacing: '-0.02em' }}>Start Your Project</h2>
                  </div>

                  {/* Disk WhatsApp form — shifted up */}
                  <div style={{ width: '100%', marginBottom: FOOTER_CONFIG.formBottomMargin }}>
                    <DiskWhatsApp />
                  </div>

                  {/* Footer */}
                  <footer style={{ width: '100%', maxWidth: '1200px', padding: '0 5vw', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxSizing: 'border-box' }}>
                    {/* Left wordmark */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{ fontSize: '0.72rem', fontFamily: "'Outfit', sans-serif", fontWeight: 600, color: 'rgba(255,255,255,0.28)', letterSpacing: '0.05em' }}>Origin MusicHUB © 2026</span>
                      <span style={{ fontSize: '0.52rem', fontFamily: "'DM Sans', sans-serif", color: 'rgba(255,255,255,0.14)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>Studio‑Quality Audio Engineering</span>
                    </div>

                    {/* Designer @NEET badge — hover effect via CSS */}
                    <DesignerBadge />
                  </footer>
                </section>
              </div>
            </motion.main>
          </div>
        </ReactLenis>
      )}
    </div>
  );
}

export default App;
