import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Heart, Disc3 } from 'lucide-react';

const samples = [
  {
    id: 1, num: '01', title: 'Opus One',       genre: 'Symphonic · Cinematic', duration: '3:42', bpm: '72 BPM',
    accent: '#5b8af0', chipBg: 'rgba(91,138,240,0.2)',  border: 'rgba(91,138,240,0.45)', solid: '#0a1228',
    bars: [4,8,10,6,12,8,10,5,9,7,6,8,5,10],
  },
  {
    id: 2, num: '02', title: 'Midnight Drive', genre: 'Electronic · Synth',    duration: '4:15', bpm: '128 BPM',
    accent: '#9b63dd', chipBg: 'rgba(155,99,221,0.2)', border: 'rgba(155,99,221,0.45)', solid: '#0f0a1c',
    bars: [8,10,7,9,10,12,8,10,6,9,8,10,7,11],
  },
  {
    id: 3, num: '03', title: 'Golden Archive', genre: 'Acoustic · Jazz',       duration: '2:58', bpm: '88 BPM',
    accent: '#d4961e', chipBg: 'rgba(212,150,30,0.2)',  border: 'rgba(212,150,30,0.45)', solid: '#160d00',
    bars: [6,8,5,8,6,10,6,9,8,7,5,8,6,7],
  },
  {
    id: 4, num: '04', title: 'Raw Frequency',  genre: 'Industrial · Bass',     duration: '3:30', bpm: '145 BPM',
    accent: '#d45070', chipBg: 'rgba(212,80,112,0.2)',  border: 'rgba(212,80,112,0.45)', solid: '#180810',
    bars: [10,7,12,8,10,5,10,8,7,10,8,6,12,5],
  },
];

function Waveform({ bars, accent, isPlaying }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '2.5px', height: '28px' }}>
      {bars.map((h, i) => (
        <motion.div key={i}
          animate={isPlaying ? { height: [`${h}px`, `${h * 2.6}px`, `${h}px`] } : { height: `${h * 0.8}px` }}
          transition={{ repeat: Infinity, duration: 0.45 + i * 0.04, ease: 'easeInOut' }}
          style={{ width: '3px', background: isPlaying ? accent : 'rgba(255,255,255,0.12)', borderRadius: '3px', minHeight: '3px', transition: 'background 0.4s' }}
        />
      ))}
    </div>
  );
}

// Vinyl cross-section accent panel (the round-side of each card)
function VinylAccent({ accent, chipBg, isPlaying, trackNum }) {
  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '80px', flexShrink: 0 }}>
      {/* Concentric groove rings */}
      {[56, 44, 32, 20].map((r, i) => (
        <div key={i} style={{ position: 'absolute', width: `${r}px`, height: `${r}px`, borderRadius: '50%', border: `1px solid ${isPlaying ? accent.replace(')', ', 0.35)').replace('rgb', 'rgba') : 'rgba(255,255,255,0.07)'}`, transition: 'border-color 0.5s' }} />
      ))}
      {/* Center disc */}
      <motion.div
        animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
        transition={isPlaying ? { repeat: Infinity, duration: 4, ease: 'linear' } : { duration: 0.5 }}
        style={{ width: '20px', height: '20px', borderRadius: '50%', background: isPlaying ? `radial-gradient(circle, ${accent}, ${chipBg.replace('0.2', '0.8')})` : 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: isPlaying ? `0 0 14px ${chipBg.replace('0.2', '0.9')}` : 'none', transition: 'all 0.4s ease' }}
      >
        <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: isPlaying ? '#000' : 'rgba(255,255,255,0.2)' }} />
      </motion.div>
      {/* Track number watermark */}
      <span style={{ position: 'absolute', bottom: '6px', fontSize: '0.55rem', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, color: 'rgba(255,255,255,0.15)', letterSpacing: '0.1em' }}>
        {trackNum}
      </span>
    </div>
  );
}

// LEFT card — rounded left edge, sharp right
function LeftCard({ track, isPlaying, isHov, liked, onPlay, onLike, onHoverStart, onHoverEnd, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
      whileHover={{ x: 6, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      style={{
        display: 'flex', alignItems: 'center',
        background: track.solid,
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        // D-shape: huge radius on the LEFT side only
        borderRadius: '90px 16px 16px 90px',
        border: `1px solid ${isPlaying || isHov ? track.border.replace('0.45', '0.85') : track.border}`,
        borderLeft: `2px solid ${isPlaying || isHov ? track.accent : track.border}`,
        overflow: 'hidden',
        boxShadow: isPlaying
          ? `0 0 0 1px ${track.border}, 0 16px 40px ${track.chipBg.replace('0.2', '0.6')}, -8px 0 30px ${track.chipBg.replace('0.2', '0.4')}`
          : isHov ? `0 8px 30px ${track.chipBg.replace('0.2', '0.4')}` : '0 4px 18px rgba(0,0,0,0.55)',
        transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
        position: 'relative',
        cursor: 'pointer',
        minHeight: '110px',
      }}
    >
      {/* Glow on rounded left side */}
      <div style={{ position: 'absolute', left: -20, top: '50%', transform: 'translateY(-50%)', width: '130px', height: '130px', background: `radial-gradient(circle, ${track.chipBg.replace('0.2', isHov || isPlaying ? '0.55' : '0.25')}, transparent 70%)`, pointerEvents: 'none', transition: 'all 0.4s ease' }} />

      {/* Vinyl groove panel (left rounded section) */}
      <div style={{ width: '88px', display: 'flex', alignItems: 'center', justifyContent: 'center', alignSelf: 'stretch', background: `linear-gradient(90deg, ${track.chipBg.replace('0.2', '0.35')}, transparent)`, flexShrink: 0 }}>
        <VinylAccent accent={track.accent} chipBg={track.chipBg} isPlaying={isPlaying} trackNum={track.num} />
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: '1rem 1.1rem 1rem 0.6rem', display: 'flex', flexDirection: 'column', gap: '0.7rem', zIndex: 1 }}>
        {/* Title + like */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '6px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.96rem', fontFamily: "'Outfit', sans-serif", fontWeight: 700, color: '#fff', letterSpacing: '-0.01em' }}>{track.title}</span>
              {isPlaying && <Disc3 size={12} color={track.accent} style={{ animation: 'spin 3s linear infinite' }} />}
            </div>
            <span style={{ fontSize: '0.63rem', fontFamily: "'DM Sans', sans-serif", color: 'rgba(255,255,255,0.38)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.09em' }}>{track.genre}</span>
          </div>
          <motion.div whileHover={{ scale: 1.2 }} onClick={e => { e.stopPropagation(); onLike(); }} style={{ cursor: 'pointer', paddingTop: '2px' }}>
            <Heart size={14} color={liked ? track.accent : 'rgba(255,255,255,0.2)'} fill={liked ? track.accent : 'none'} strokeWidth={1.8} />
          </motion.div>
        </div>

        {/* Controls row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
          <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }} onClick={e => { e.stopPropagation(); onPlay(); }}
            style={{ width: '32px', height: '32px', borderRadius: '50%', background: isPlaying ? track.accent : track.chipBg, border: `1px solid ${track.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', outline: 'none', transition: 'all 0.3s', flexShrink: 0, boxShadow: isPlaying ? `0 4px 14px ${track.chipBg.replace('0.2', '0.7')}` : 'none' }}
          >
            {isPlaying ? <Pause size={12} color="#fff" fill="#fff" /> : <Play size={12} color={track.accent} fill={track.accent} style={{ marginLeft: '1px' }} />}
          </motion.button>
          <Waveform bars={track.bars} accent={track.accent} isPlaying={isPlaying} />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px', flexShrink: 0 }}>
            <span style={{ fontSize: '0.58rem', color: track.accent, background: track.chipBg, border: `1px solid ${track.border}`, padding: '1px 7px', borderRadius: '20px', fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>{track.bpm}</span>
            <span style={{ fontSize: '0.6rem', fontFamily: 'monospace', color: 'rgba(255,255,255,0.22)' }}>{track.duration}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// RIGHT card — sharp left edge, rounded right
function RightCard({ track, isPlaying, isHov, liked, onPlay, onLike, onHoverStart, onHoverEnd, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
      whileHover={{ x: -6, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      style={{
        display: 'flex', alignItems: 'center',
        background: track.solid,
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        // D-shape: huge radius on the RIGHT side only
        borderRadius: '16px 90px 90px 16px',
        border: `1px solid ${isPlaying || isHov ? track.border.replace('0.45', '0.85') : track.border}`,
        borderRight: `2px solid ${isPlaying || isHov ? track.accent : track.border}`,
        overflow: 'hidden',
        boxShadow: isPlaying
          ? `0 0 0 1px ${track.border}, 0 16px 40px ${track.chipBg.replace('0.2', '0.6')}, 8px 0 30px ${track.chipBg.replace('0.2', '0.4')}`
          : isHov ? `0 8px 30px ${track.chipBg.replace('0.2', '0.4')}` : '0 4px 18px rgba(0,0,0,0.55)',
        transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
        position: 'relative',
        cursor: 'pointer',
        minHeight: '110px',
      }}
    >
      {/* Glow on rounded right side */}
      <div style={{ position: 'absolute', right: -20, top: '50%', transform: 'translateY(-50%)', width: '130px', height: '130px', background: `radial-gradient(circle, ${track.chipBg.replace('0.2', isHov || isPlaying ? '0.55' : '0.25')}, transparent 70%)`, pointerEvents: 'none', transition: 'all 0.4s ease' }} />

      {/* Content (left of the rounded side) */}
      <div style={{ flex: 1, padding: '1rem 0.6rem 1rem 1.1rem', display: 'flex', flexDirection: 'column', gap: '0.7rem', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '6px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.96rem', fontFamily: "'Outfit', sans-serif", fontWeight: 700, color: '#fff', letterSpacing: '-0.01em' }}>{track.title}</span>
              {isPlaying && <Disc3 size={12} color={track.accent} style={{ animation: 'spin 3s linear infinite' }} />}
            </div>
            <span style={{ fontSize: '0.63rem', fontFamily: "'DM Sans', sans-serif", color: 'rgba(255,255,255,0.38)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.09em' }}>{track.genre}</span>
          </div>
          <motion.div whileHover={{ scale: 1.2 }} onClick={e => { e.stopPropagation(); onLike(); }} style={{ cursor: 'pointer', paddingTop: '2px' }}>
            <Heart size={14} color={liked ? track.accent : 'rgba(255,255,255,0.2)'} fill={liked ? track.accent : 'none'} strokeWidth={1.8} />
          </motion.div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
          <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }} onClick={e => { e.stopPropagation(); onPlay(); }}
            style={{ width: '32px', height: '32px', borderRadius: '50%', background: isPlaying ? track.accent : track.chipBg, border: `1px solid ${track.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', outline: 'none', transition: 'all 0.3s', flexShrink: 0, boxShadow: isPlaying ? `0 4px 14px ${track.chipBg.replace('0.2', '0.7')}` : 'none' }}
          >
            {isPlaying ? <Pause size={12} color="#fff" fill="#fff" /> : <Play size={12} color={track.accent} fill={track.accent} style={{ marginLeft: '1px' }} />}
          </motion.button>
          <Waveform bars={track.bars} accent={track.accent} isPlaying={isPlaying} />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px', flexShrink: 0 }}>
            <span style={{ fontSize: '0.58rem', color: track.accent, background: track.chipBg, border: `1px solid ${track.border}`, padding: '1px 7px', borderRadius: '20px', fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>{track.bpm}</span>
            <span style={{ fontSize: '0.6rem', fontFamily: 'monospace', color: 'rgba(255,255,255,0.22)' }}>{track.duration}</span>
          </div>
        </div>
      </div>

      {/* Vinyl groove panel (right rounded section) */}
      <div style={{ width: '88px', display: 'flex', alignItems: 'center', justifyContent: 'center', alignSelf: 'stretch', background: `linear-gradient(270deg, ${track.chipBg.replace('0.2', '0.35')}, transparent)`, flexShrink: 0 }}>
        <VinylAccent accent={track.accent} chipBg={track.chipBg} isPlaying={isPlaying} trackNum={track.num} />
      </div>
    </motion.div>
  );
}

export default function SampleMusic() {
  const [playingId, setPlayingId] = useState(null);
  const [liked, setLiked] = useState({});
  const [hovered, setHovered] = useState(null);

  const leftTracks  = samples.slice(0, 2);
  const rightTracks = samples.slice(2, 4);

  return (
    <section style={{
      height: '100vh', padding: '0 4vw',
      display: 'flex', alignItems: 'center',
      position: 'relative', gap: '2vw',
    }}>
      {/* LEFT column — D-shape cards (rounded left) */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.6rem', zIndex: 10 }}>
        <div>
          <p style={{ margin: 0, fontSize: '0.68rem', letterSpacing: '0.22em', color: 'rgba(255,255,255,0.38)', fontFamily: "'DM Sans', sans-serif", textTransform: 'uppercase', fontWeight: 500 }}>
            03 — Work Samples
          </p>
          <h2 style={{ margin: '6px 0 0', fontFamily: "'Outfit', sans-serif", fontSize: 'clamp(1.4rem, 2vw, 1.9rem)', fontWeight: 700, color: '#fff', letterSpacing: '-0.01em' }}>
            Listen to Our Work
          </h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {leftTracks.map((track, i) => (
            <LeftCard key={track.id} track={track} index={i}
              isPlaying={playingId === track.id}
              isHov={hovered === track.id}
              liked={liked[track.id]}
              onPlay={() => setPlayingId(playingId === track.id ? null : track.id)}
              onLike={() => setLiked(p => ({ ...p, [track.id]: !p[track.id] }))}
              onHoverStart={() => setHovered(track.id)}
              onHoverEnd={() => setHovered(null)}
            />
          ))}
        </div>
      </div>

      {/* CENTER gap — disk floats here */}
      <div style={{ flex: '0 0 18%' }} />

      {/* RIGHT column — D-shape cards (rounded right) */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.6rem', zIndex: 10 }}>
        <div style={{ height: '72px' }} /> {/* align with left column cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {rightTracks.map((track, i) => (
            <RightCard key={track.id} track={track} index={i + 2}
              isPlaying={playingId === track.id}
              isHov={hovered === track.id}
              liked={liked[track.id]}
              onPlay={() => setPlayingId(playingId === track.id ? null : track.id)}
              onLike={() => setLiked(p => ({ ...p, [track.id]: !p[track.id] }))}
              onHoverStart={() => setHovered(track.id)}
              onHoverEnd={() => setHovered(null)}
            />
          ))}
        </div>
      </div>

      <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
    </section>
  );
}
