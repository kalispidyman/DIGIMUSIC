import { useState } from 'react';
import { motion } from 'framer-motion';
import { Droplet, Zap, Flame, Sparkles, Wind, Moon } from 'lucide-react';

// Disk is on the LEFT (x=-7.8) for this section → cards go on the RIGHT
const vibes = [
  { genre: 'Emotional', icon: Droplet, accent: '#5b8af0', chipBg: 'rgba(91,138,240,0.18)', border: 'rgba(91,138,240,0.4)', solid: '#0f1835', desc: 'Orchestral depth and sentimental resonance. Swooping strings, piano, cinematic swells.', tags: ['Orchestral', 'Cinematic'] },
  { genre: 'Melancholic', icon: Moon, accent: '#9b63dd', chipBg: 'rgba(155,99,221,0.18)', border: 'rgba(155,99,221,0.4)', solid: '#130f22', desc: 'Slow, introspective frequencies for grief and quiet beauty.', tags: ['Lo-fi', 'Dark'] },
  { genre: 'Euphoric', icon: Zap, accent: '#38bdf8', chipBg: 'rgba(56,189,248,0.18)', border: 'rgba(56,189,248,0.4)', solid: '#071b2a', desc: 'High-vibration beats built for momentum and celebration.', tags: ['Pop', 'EDM'] },
  { genre: 'Romantic', icon: Sparkles, accent: '#f05080', chipBg: 'rgba(240,80,128,0.18)', border: 'rgba(240,80,128,0.4)', solid: '#200a12', desc: 'Warm, intimate sound for love stories and tender moments.', tags: ['Acoustic', 'Soft'] },
  { genre: 'High Energy', icon: Flame, accent: '#f0850a', chipBg: 'rgba(240,133,10,0.18)', border: 'rgba(240,133,10,0.4)', solid: '#1f0e00', desc: 'Aggressive drops, tight percussion and adrenaline-charged mixes.', tags: ['Club', 'Urban'] },
  { genre: 'Ambient', icon: Wind, accent: '#2dd4bf', chipBg: 'rgba(45,212,191,0.18)', border: 'rgba(45,212,191,0.4)', solid: '#041714', desc: 'Lush pads and frequency-tuned drones for calm focused work.', tags: ['Lo-fi', 'Meditative'] },
];

export default function VibeTiers({ onThemeChange }) {
  const [hovered, setHovered] = useState(null);

  return (
    <section className="responsive-tier-section" style={{
      height: '100vh', padding: '0 5vw',
      display: 'flex', alignItems: 'center',
      position: 'relative', gap: '5vw',
    }}>
      {/* LEFT — cards */}
      <div className="responsive-tier-cards" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.6rem', zIndex: 10 }}>
        {/* Section label */}
        <div>
          <p style={{ margin: 0, fontSize: '0.68rem', letterSpacing: '0.22em', color: 'rgba(255,255,255,0.38)', fontFamily: "'DM Sans', sans-serif", textTransform: 'uppercase', fontWeight: 500 }}>
            02 — Music Mood
          </p>
          <h2 style={{ margin: '6px 0 0', fontFamily: "'Outfit', sans-serif", fontSize: 'clamp(1.4rem, 2vw, 1.9rem)', fontWeight: 700, color: '#fff', letterSpacing: '-0.01em' }}>
            Choose Your Vibe
          </h2>
        </div>

        {/* 3 × 2 Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.95rem' }}>
          {vibes.map((v, i) => {
            const Icon = v.icon;
            const isHov = hovered === i;
            return (
              <motion.div
                key={i}
                className="tier-card"
                initial={{ opacity: 0, scale: 0.8, y: 30 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ type: "spring", stiffness: 120, damping: 14, delay: i * 0.08 }}
                onHoverStart={() => setHovered(i)}
                onHoverEnd={() => setHovered(null)}
                whileHover={{ y: -8, scale: 1.03, rotateX: 3, rotateY: -3 }}
                whileTap={{ scale: 0.96 }}
                style={{
                  border: `1px solid ${isHov ? v.border.replace('0.4', '0.75') : v.border}`,
                  borderRadius: '16px',
                  cursor: 'pointer',
                  transition: 'border 0.3s ease',
                  display: 'flex', flexDirection: 'column', gap: '0.9rem',
                  position: 'relative', overflow: 'hidden',
                }}
              >
                {/* Top accent bar */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: `linear-gradient(90deg, ${v.accent}, transparent)`, opacity: isHov ? 1 : 0.5, transition: 'opacity 0.3s' }} />
                {/* Glow blob */}
                <div style={{ position: 'absolute', top: -40, right: -40, width: '110px', height: '110px', background: `radial-gradient(circle, ${v.chipBg.replace('0.18', isHov ? '0.55' : '0.3')}, transparent 70%)`, pointerEvents: 'none', transition: 'all 0.4s ease' }} />

                {/* Icon row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', zIndex: 1 }}>
                  <motion.div
                    className="tier-icon"
                    animate={isHov ? { rotate: 360 } : { rotate: 0 }}
                    transition={{ duration: 0.6, ease: 'easeInOut' }}
                    style={{ width: '38px', height: '38px', borderRadius: '10px', background: v.chipBg, border: `1px solid ${v.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                  >
                    <Icon size={17} color={v.accent} strokeWidth={2} />
                  </motion.div>
                  <span className="tier-title" style={{ fontSize: '0.95rem', fontFamily: "'Outfit', sans-serif", fontWeight: 700, color: '#fff', letterSpacing: '-0.01em' }}>
                    {v.genre}
                  </span>
                </div>

                {/* Description */}
                <p style={{ margin: 0, fontSize: '0.76rem', fontFamily: "'DM Sans', sans-serif", fontWeight: 400, color: 'rgba(255,255,255,0.62)', lineHeight: 1.55, zIndex: 1 }}>
                  {v.desc}
                </p>

                {/* Tags */}
                <div style={{ display: 'flex', gap: '6px', zIndex: 1 }}>
                  {v.tags.map((t, ti) => (
                    <span key={ti} style={{ fontSize: '0.62rem', padding: '3px 10px', borderRadius: '20px', background: v.chipBg, color: v.accent, border: `1px solid ${v.border}`, fontFamily: "'DM Sans', sans-serif", fontWeight: 600, letterSpacing: '0.04em' }}>
                      {t}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
      {/* RIGHT SPACER — disk lives here */}
      <div className="tier-spacer" style={{ flex: '0 0 46%' }} />
    </section>
  );
}
