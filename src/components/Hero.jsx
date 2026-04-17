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

  // Parallax effects
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
        style={{ y, opacity, scale, zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left', width: '55%' }}
      >
        {/* Superior typography label */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: "'Syncopate', sans-serif",
            textTransform: 'uppercase',
            letterSpacing: '0.6em',
            fontSize: 'clamp(0.6rem, 1.2vw, 0.8rem)',
            color: 'rgba(255,255,255,0.4)',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '15px'
          }}
        >
          <div style={{ width: '40px', height: '1px', background: 'rgba(255,255,255,0.2)' }} />
          <span>Interactive Audio</span>
        </motion.div>

        {/* Elegant Title Lockup */}
        <Influenced influenceRadius={350} maxDisplacement={18} intensity={0.5} scaleEffect={0} rotationEffect={0.3}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', margin: '0 0 1rem 0', position: 'relative' }}>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{
                opacity: 1,
                y: 0,
                // Cycle the background gradient position when playing
                backgroundPosition: isPlaying
                  ? ['0% center', '200% center', '0% center']
                  : '0% center',
              }}
              transition={{
                opacity: { duration: 1.4, delay: 0.4, ease: [0.16, 1, 0.3, 1] },
                y:       { duration: 1.4, delay: 0.4, ease: [0.16, 1, 0.3, 1] },
                backgroundPosition: isPlaying
                  ? { repeat: Infinity, duration: 2.8, ease: 'linear' }
                  : { duration: 0.6 },
              }}
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: 'clamp(4.5rem, 8vw, 8rem)',
                fontWeight: 900,
                lineHeight: 1,
                margin: 0,
                letterSpacing: '-0.04em',
                textTransform: 'uppercase',
                // When playing: sweep gradient; when paused: solid white
                background: isPlaying
                  ? 'linear-gradient(90deg, #ffffff 0%, #a78bfa 25%, #38bdf8 50%, #ffffff 75%, #a78bfa 100%)'
                  : '#ffffff',
                backgroundSize: isPlaying ? '200% auto' : 'auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: isPlaying ? 'drop-shadow(0 0 18px rgba(167,139,250,0.45))' : 'none',
                transition: 'filter 0.6s ease',
              }}
            >
              Origin
            </motion.h1>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.4, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontFamily: "'Syncopate', sans-serif",
                fontSize: 'clamp(2rem, 3.5vw, 3.5rem)',
                fontWeight: 400,
                lineHeight: 1.2,
                margin: 0,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                color: '#bbbbbb',
                display: 'flex',
                alignItems: 'baseline',
                gap: '10px'
              }}
            >
              <span style={{ color: '#ffffff', fontWeight: 700 }}>Music</span>HUB
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
            fontWeight: 300,
            fontSize: 'clamp(1rem, 1.5vw, 1.2rem)',
            color: 'rgba(255,255,255,0.5)',
            marginTop: '1rem',
            letterSpacing: '0.15em',
            maxWidth: '500px',
            lineHeight: 1.6
          }}
        >
          Premium Music Production Hub. Crafting state-of-the-art auditory experiences.
        </motion.h2>

        {/* ── INTERACTIVE STUDIO DASHBOARD (original style) ── */}
        <motion.div
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

          <div style={{ width: '1px', height: '40px', background: 'rgba(255,255,255,0.1)' }} />

          {/* Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
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
        @keyframes liquidChrome {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
      `}</style>
    </section>
  );
}
