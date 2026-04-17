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
const BLAST_COLORS = ['#a78bfa','#38bdf8','#f472b6','#34d399','#fbbf24','#e879f9','#60a5fa'];

/* single particle — position set via left/top offset, no CSS transform conflict */
function BlastParticle({ x, y, angle, dist, color, size, dur, onDone }) {
  const rad = (angle * Math.PI) / 180;
  const tx  = Math.cos(rad) * dist;
  const ty  = Math.sin(rad) * dist;
  return (
    <motion.div
      initial={{ opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 }}
      animate={{ opacity: 0, x: tx, y: ty, scale: 0, rotate: angle * 2 }}
      transition={{ duration: dur, ease: [0.2, 0.8, 0.4, 1] }}
      onAnimationComplete={onDone}
      style={{
        position: 'fixed',
        left: x - size / 2,   /* center on origin without CSS transform */
        top:  y - size / 2,
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
  const [hov,       setHov]       = useState(false);
  const [coords,    setCoords]    = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState([]);
  const badgeRef = useRef(null);
  let pid = useRef(0);

  /* track live screen coords */
  const onMouseMove = e => setCoords({ x: Math.round(e.clientX), y: Math.round(e.clientY) });

  /* spawn radial particle burst from badge center */
  const blast = () => {
    const rect = badgeRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;
    const count = 22;
    const newParticles = Array.from({ length: count }, (_, i) => ({
      id:    ++pid.current,
      x: cx, y: cy,
      angle: (360 / count) * i + Math.random() * 14,
      dist:  60 + Math.random() * 110,
      dur:   0.55 + Math.random() * 0.35,   /* pre-calculated — never changes after mount */
      color: BLAST_COLORS[i % BLAST_COLORS.length],
      size:  4 + Math.random() * 7,
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
        ref={badgeRef}
        onHoverStart={() => setHov(true)}
        onHoverEnd={() => setHov(false)}
        onMouseMove={onMouseMove}
        onClick={blast}
        animate={{
          scale: hov ? 1.08 : 1,
          boxShadow: hov
            ? '0 0 24px rgba(124,92,224,0.5), 0 8px 30px rgba(0,0,0,0.6)'
            : '0 4px 18px rgba(0,0,0,0.4)',
        }}
        transition={{ type: 'spring', stiffness: 320, damping: 22 }}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '9px',
          padding: '7px 18px 7px 12px', borderRadius: '50px',
          background: hov ? 'rgba(124,92,224,0.12)' : 'rgba(255,255,255,0.04)',
          border: `1px solid ${hov ? 'rgba(167,139,250,0.55)' : 'rgba(255,255,255,0.1)'}`,
          backdropFilter: 'blur(10px)', cursor: 'pointer',
          transition: 'background 0.3s, border-color 0.3s',
          position: 'relative', overflow: 'hidden',
        }}
      >
        {/* Shimmer sweep */}
        <motion.div
          animate={hov ? { x: ['-100%', '200%'] } : { x: '-100%' }}
          transition={hov ? { duration: 0.7, ease: 'easeInOut' } : {}}
          style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, transparent, rgba(167,139,250,0.18), transparent)', pointerEvents: 'none' }}
        />
        {/* Pulse dot */}
        <motion.div
          animate={{ scale: [1, 1.5, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ repeat: Infinity, duration: 1.8 }}
          style={{ width: '7px', height: '7px', borderRadius: '50%', background: hov ? '#a78bfa' : '#7c5ce0', flexShrink: 0 }}
        />
        <span style={{ fontSize: '0.66rem', fontFamily: "'DM Sans', sans-serif", fontWeight: 500, letterSpacing: '0.1em', color: hov ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.35)', textTransform: 'uppercase', transition: 'color 0.3s' }}>
          Designer
        </span>
        <motion.span
          animate={hov ? { backgroundPosition: ['0% center', '200% center'] } : { backgroundPosition: '0% center' }}
          transition={hov ? { repeat: Infinity, duration: 1.8, ease: 'linear' } : {}}
          style={{ fontSize: '0.75rem', fontFamily: "'Outfit', sans-serif", fontWeight: 800, letterSpacing: '0.04em', background: 'linear-gradient(90deg, #a78bfa, #38bdf8, #f472b6, #a78bfa)', backgroundSize: '200% auto', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
        >
          @NEET
        </motion.span>

        {/* Live X Y coordinate tooltip — shows on hover */}
        <AnimatePresence>
          {hov && (
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.9 }}
              animate={{ opacity: 1, y: 0,  scale: 1   }}
              exit={{    opacity: 0, y: 4,  scale: 0.9 }}
              style={{
                position: 'absolute', bottom: 'calc(100% + 8px)', left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(8,6,14,0.92)', border: '1px solid rgba(167,139,250,0.3)',
                borderRadius: '8px', padding: '4px 10px',
                fontFamily: 'monospace', fontSize: '0.62rem',
                color: '#a78bfa', whiteSpace: 'nowrap', pointerEvents: 'none',
                backdropFilter: 'blur(8px)', letterSpacing: '0.04em',
              }}
            >
              x: {coords.x}  y: {coords.y}
              {/* tooltip arrow */}
              <div style={{ position: 'absolute', bottom: '-5px', left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '5px solid rgba(167,139,250,0.3)' }} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}

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
              initial={{ opacity: 0, filter: 'blur(6px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
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
                  <section style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', paddingBottom: '3rem', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -60%)', textAlign: 'center', pointerEvents: 'none' }}>
                      <p style={{ margin: '0 0 8px', fontSize: '0.65rem', letterSpacing: '0.25em', color: 'rgba(255,255,255,0.2)', fontFamily: "'DM Sans', sans-serif", textTransform: 'uppercase' }}>04 — Commission</p>
                      <h2 style={{ margin: 0, fontFamily: "'Outfit', sans-serif", fontSize: 'clamp(1.8rem,3vw,2.8rem)', fontWeight: 700, color: 'rgba(255,255,255,0.06)', letterSpacing: '-0.02em' }}>Start Your Project</h2>
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

      {/* Disk WhatsApp form — sits on the vinyl label when page ends */}
      <DiskWhatsApp />
    </div>
  );
}

export default App;
