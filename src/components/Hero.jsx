import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { PlayCircle, PauseCircle, Volume2, VolumeX, SlidersHorizontal, SkipBack, SkipForward } from 'lucide-react';
import { Influenced } from '../hooks/useDiskInfluence';
import { diskState } from '../systems/diskPosition';

// ── Interactive Studio Components ──

function StudioEqualizer({ barCount = 12, isPlaying }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '45px' }}>
      {Array.from({ length: barCount }).map((_, i) => {
        const base = 25 + Math.random() * 75;
        return (
          <motion.div
            key={i}
            animate={isPlaying ? { height: [`${base * 0.2}%`, `${base}%`, `${base * 0.4}%`, `${base * 0.8}%`, `${base * 0.2}%`] } : { height: '10%' }}
            transition={{ duration: 0.5 + Math.random() * 1.2, repeat: Infinity, ease: 'easeInOut', delay: i * 0.05 }}
            style={{
              width: '4px',
              borderRadius: '2px',
              background: isPlaying ? 'linear-gradient(to top, rgba(100,100,100,0.5), #ffffff)' : 'rgba(255,255,255,0.2)',
              opacity: 0.8
            }}
          />
        );
      })}
    </div>
  );
}

function LevelMeter({ isPlaying }) {
  const [level, setLevel] = useState(0);
  useEffect(() => {
    if (!isPlaying) { setLevel(0); return; }
    const int = setInterval(() => setLevel(Math.random() * 95), 100);
    return () => clearInterval(int);
  }, [isPlaying]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '120px' }}>
      <div style={{ fontSize: '10px', fontFamily: "'Syncopate', sans-serif", color: '#666', display: 'flex', justifyContent: 'space-between', letterSpacing: '1px' }}>
        <span>L</span><span>PEAK</span><span>R</span>
      </div>
      <div style={{ width: '100%', height: '3px', background: '#111', borderRadius: '2px', overflow: 'hidden' }}>
        <motion.div animate={{ width: `${level}%` }} transition={{ type: 'spring', bounce: 0, duration: 0.1 }} style={{ height: '100%', background: level > 85 ? '#ff3333' : 'linear-gradient(90deg, #333, #ccc, #fff)' }} />
      </div>
      <div style={{ width: '100%', height: '3px', background: '#111', borderRadius: '2px', overflow: 'hidden' }}>
        <motion.div animate={{ width: `${Math.min(100, level * 1.05)}%` }} transition={{ type: 'spring', bounce: 0, duration: 0.1 }} style={{ height: '100%', background: level * 1.05 > 85 ? '#ff3333' : 'linear-gradient(90deg, #333, #ccc, #fff)' }} />
      </div>
    </div>
  );
}

// ── Hero Component ──

export default function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  // Start disk spinning immediately on mount
  useEffect(() => { diskState.isPlaying = true; }, []);

  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;

  // Parallax effects (disabled natively on mobile wrapper)
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);

  // Toggle play and sync to disk spin
  const togglePlay = () => {
    const next = !isPlaying;
    setIsPlaying(next);
    diskState.isPlaying = next; // ← drives the vinyl disk spin speed
  };

  return (
    <section
      ref={ref}
      style={{
        height: '100vh', width: '100%',
        display: 'flex', flexDirection: 'column',
        alignItems: 'flex-start', justifyContent: 'center',
        padding: '0 8vw', position: 'relative',
        overflow: 'hidden', zIndex: 10, background: 'transparent',
      }}
    >
      {/* Cinematic noise overlay */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none', opacity: 0.04, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />

      <motion.div
        style={{
          y: isMobile ? 0 : y,
          opacity: isMobile ? 1 : opacity,
          scale: isMobile ? 1 : scale,
          zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left', width: '100%', maxWidth: '800px',
          willChange: 'transform, opacity'
        }}
      >
        {/* Superior typography label */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            textTransform: 'uppercase',
            letterSpacing: '0.6em',
            fontSize: 'clamp(0.85rem, 1.8vw, 1.1rem)',
            color: 'rgba(255,255,255,0.8)',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '15px'
          }}
        >
          <div style={{ width: '50px', height: '2px', background: 'rgba(255,255,255,0.9)' }} />
          <span style={{ color: '#ffffff', fontWeight: 800, textShadow: '0 4px 20px rgba(0,0,0,0.9), 0 0 50px rgba(0,0,0,1)' }}>Interactive Audio</span>
        </motion.div>

        {/* Elegant Title Lockup */}
        <Influenced influenceRadius={350} maxDisplacement={18} intensity={0.5} scaleEffect={0} rotationEffect={0.3}>
          <div className="hero-title-wrap" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', margin: '0 0 1.5rem 0', position: 'relative' }}>

            {/* Deep Contrast Aura — Isolates text from background perfectly */}
            <div style={{
              position: 'absolute',
              inset: '-40px -100px -40px -60px',
              background: 'radial-gradient(ellipse at 40% 50%, rgba(5, 5, 8, 0.88) 0%, rgba(5, 5, 8, 0.5) 45%, transparent 75%)',
              filter: 'blur(30px)',
              zIndex: -1,
              pointerEvents: 'none',
              transform: 'translateZ(0)',
              willChange: 'transform',
            }} />
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.4, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontStyle: 'italic',
                fontSize: 'clamp(4rem, 15vw, 10rem)', // Increased size
                fontWeight: 900, lineHeight: 1, margin: 0,
                letterSpacing: '-0.04em', textTransform: 'uppercase',
                display: 'flex',
              }}
            >
              {'ORIGIN'.split('').map((letter, i) => (
                <span key={i} style={{
                  // Each letter gets a different hue stop — creates spectrum cascade
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  backgroundImage: isPlaying
                    ? `linear-gradient(160deg,
                        hsl(${200 + i * 28}, 90%, 75%) 0%,
                        hsl(${280 + i * 22}, 85%, 85%) 40%,
                        hsl(${340 + i * 18}, 95%, 90%) 70%,
                        hsl(${200 + i * 28}, 90%, 75%) 100%)`
                    : 'linear-gradient(160deg, #ffffff, #e0e0e0, #c0c0c0)',
                  backgroundSize: '300% 100%',
                  animation: isPlaying
                    ? `cascade 3s linear infinite`
                    : 'none',
                  animationDelay: `${i * -0.42}s`,
                  display: 'inline-block',
                  paddingRight: '0.18em',  // Fixes italic crop clipping gracefully!
                  marginRight: '-0.18em',  // Compresses the spacer so layout spacing doesn't break
                }}>{letter}</span>
              ))}
            </motion.h1>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.4, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              style={{ fontFamily: "'Syncopate', sans-serif", fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 700, lineHeight: 1.2, margin: 0, letterSpacing: '0.05em', textTransform: 'uppercase', display: 'flex', alignItems: 'baseline', gap: '10px' }}
            >
              <span style={{
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                backgroundImage: isPlaying
                  ? 'linear-gradient(90deg, #f472b6, #a78bfa, #38bdf8, #34d399, #f472b6)'
                  : 'linear-gradient(90deg, #ffffff, #ffffff)',
                backgroundSize: '300% 100%',
                animation: isPlaying ? 'cascade 2.2s linear infinite' : 'none',
                fontWeight: 900,
                display: 'inline-block',
              }}>Music</span>
              <span style={{ color: isPlaying ? '#e0d4fc' : '#ffffff', textShadow: '0 5px 25px rgba(0,0,0,1)', transition: 'color 0.6s', fontWeight: 600, filter: 'drop-shadow(0 10px 40px rgba(0,0,0,1))' }}>HUB</span>
            </motion.h1>
          </div>
        </Influenced>

        {/* Clean Subtitle */}
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 400,
            fontSize: 'clamp(1.2rem, 2.2vw, 1.6rem)',
            color: '#ffffff',
            marginTop: '1.5rem',
            letterSpacing: '0.15em',
            maxWidth: '650px',
            lineHeight: 1.7,
            textShadow: '0 5px 25px rgba(0,0,0,1), 0 0 60px rgba(0,0,0,1)'
          }}
        >
          Premium Music Production Hub. Crafting state-of-the-art auditory experiences.
        </motion.h2>

        {/* ── INTERACTIVE STUDIO DASHBOARD (original style) ── */}
        <motion.div
          className="hero-panel"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
          style={{
            marginTop: '3.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '30px',
            background: 'rgba(10, 10, 12, 0.6)',
            border: '1px solid rgba(255,255,255,0.08)',
            padding: '20px 30px',
            borderRadius: '100px',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
          }}
        >
          {/* Audio Visualization */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <StudioEqualizer barCount={10} isPlaying={isPlaying && !isMuted} />
            <div style={{ width: '1px', height: '30px', background: 'rgba(255,255,255,0.1)' }} />
            <LevelMeter isPlaying={isPlaying && !isMuted} />
          </div>

          <div style={{ width: '1px', height: '40px', background: 'rgba(255,255,255,0.1)', display: 'none' /* hidden on mobile via flex-wrap naturally */ }} />

          {/* Controls */}
          <div className="hero-controls-wrap" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <motion.div
              onClick={() => setIsMuted(!isMuted)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              style={{ cursor: 'pointer', display: 'flex' }}
            >
              {isMuted ? <VolumeX size={20} color="rgba(255,255,255,0.6)" strokeWidth={1.5} /> : <Volume2 size={20} color="rgba(255,255,255,0.6)" strokeWidth={1.5} />}
            </motion.div>

            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} style={{ cursor: 'pointer', display: 'flex' }}>
              <SkipBack size={20} color="rgba(255,255,255,0.6)" strokeWidth={1.5} />
            </motion.div>

            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} style={{ cursor: 'pointer', display: 'flex' }}>
              <SkipForward size={20} color="rgba(255,255,255,0.6)" strokeWidth={1.5} />
            </motion.div>

            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} style={{ cursor: 'pointer', display: 'flex' }}>
              <SlidersHorizontal size={20} color="rgba(255,255,255,0.6)" strokeWidth={1.5} />
            </motion.div>

            {/* Master Action — now linked to disk spin */}
            <motion.button
              onClick={togglePlay}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                background: isPlaying ? '#222' : '#ffffff',
                color: isPlaying ? '#fff' : '#000000',
                border: isPlaying ? '1px solid rgba(255,255,255,0.3)' : 'none',
                padding: '12px 20px',
                borderRadius: '50px',
                fontFamily: "'Syncopate', sans-serif",
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: isPlaying ? 'none' : '0 0 20px rgba(255,255,255,0.2)',
                marginLeft: '10px',
                outline: 'none',
              }}
            >
              {isPlaying ? <PauseCircle size={18} strokeWidth={2} /> : <PlayCircle size={18} strokeWidth={2} />}
              {isPlaying ? 'PAUSE' : 'ENGAGE'}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 2, duration: 2 }}
        style={{ position: 'absolute', bottom: '40px', left: '10vw', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <div style={{ height: '70px', width: '1px', background: 'rgba(255,255,255,0.1)', position: 'relative', overflow: 'hidden' }}>
          <motion.div
            animate={{ y: ['-100%', '100%'] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '50%', background: 'linear-gradient(to bottom, transparent, #fff)' }}
          />
        </div>
      </motion.div>

      <style>{`
        /*
         * cascade — sweeps the background-position left-to-right.
         * Each letter has a different animationDelay so they hit
         * different gradient stops at the same moment = chromatic cascade.
         */
        @keyframes cascade {
          0%   { background-position: 100% 50%; }
          100% { background-position:   0% 50%; }
        }
      `}</style>
    </section>
  );
}
