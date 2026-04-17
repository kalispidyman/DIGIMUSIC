import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, CheckCircle } from 'lucide-react';

/* ─────────────────────────────────────────────────────
   FORM POSITION & SIZE CONFIG — tweak these values:

   X  →  horizontal offset from viewport center (px)
          0   = perfectly centered
          +ve = moves RIGHT,  -ve = moves LEFT

   Y  →  distance from BOTTOM of viewport (vh units)
          higher number = further from bottom edge

   W  →  form width in px
          recommended range: 520 – 900

   ───────────────────────────────────────────────── */
const FORM_CONFIG = {
  x: 0,     // px   — horizontal offset from center
  y: 20,    // vh   — distance up from bottom edge
  w: 780,   // px   — form width
  h: 420, // px  — form height ('auto' = fit content, or set e.g. 420)
};

/* ── Cassette reel decorative component ── */
function Reel({ filled = 0.4 }) {
  return (
    <div style={{
      width: '72px', height: '72px', borderRadius: '50%', flexShrink: 0,
      background: 'radial-gradient(circle at 38% 38%, #2e2e34 0%, #1a1a1e 55%, #0c0c0e 100%)',
      border: '2px solid rgba(255,255,255,0.08)',
      boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.7)',
      position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{ position: 'absolute', inset: '4px', borderRadius: '50%', border: `${Math.round(filled * 16)}px solid #3a2010`, opacity: 0.85 }} />
      {[0, 60, 120].map(deg => (
        <div key={deg} style={{ position: 'absolute', width: '1.5px', height: '42%', background: 'rgba(255,255,255,0.07)', top: '8%', left: 'calc(50% - 0.75px)', transformOrigin: 'bottom center', transform: `rotate(${deg}deg)`, borderRadius: '1px' }} />
      ))}
      <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'linear-gradient(135deg, #444, #222)', border: '1px solid rgba(255,255,255,0.12)', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#666' }} />
      </div>
    </div>
  );
}

export default function DiskWhatsApp() {
  const [active, setActive] = useState(false);
  const [name, setName] = useState('');
  const [msg, setMsg] = useState('');
  const [sent, setSent] = useState(false);
  const [focus, setFocus] = useState(null);

  /* Scroll-only trigger — no disk coordinate tracking, no RAF */
  useEffect(() => {
    const check = () => {
      const pct = (window.scrollY + window.innerHeight) / document.body.scrollHeight;
      setActive(pct > 0.82);
    };
    window.addEventListener('scroll', check, { passive: true });
    check();
    return () => window.removeEventListener('scroll', check);
  }, []);

  const handleSend = e => {
    e.preventDefault();
    if (!name.trim() || !msg.trim()) return;
    const text = encodeURIComponent(`Hi, I'm ${name}. ${msg}`);
    window.open(`https://wa.me/919999999999?text=${text}`, '_blank');
    setSent(true);
    setTimeout(() => { setSent(false); setName(''); setMsg(''); }, 3200);
  };

  return (
    <AnimatePresence>
      {active && (
        /* Fixed bottom-center of viewport — stable, never moves */
        <div style={{
          position: 'fixed',
          bottom: `${FORM_CONFIG.y}vh`,
          left: `calc(50% + ${FORM_CONFIG.x}px)`,
          transform: 'translateX(-50%)',
          zIndex: 90,
          pointerEvents: 'none',
        }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            style={{
              pointerEvents: 'all',
              width: `${FORM_CONFIG.w}px`,
              minHeight: FORM_CONFIG.h === 'auto' ? undefined : `${FORM_CONFIG.h}px`,
              height: FORM_CONFIG.h === 'auto' ? undefined : `${FORM_CONFIG.h}px`,
              overflowY: FORM_CONFIG.h === 'auto' ? 'visible' : 'auto',
              background: 'linear-gradient(170deg, #1e1e22 0%, #161618 100%)',
              borderRadius: '14px',
              border: '1px solid rgba(255,255,255,0.07)',
              boxShadow: '0 4px 0 rgba(255,255,255,0.03) inset, 0 24px 70px rgba(0,0,0,0.92)',
              overflow: 'hidden',
            }}
          >
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div key="sent"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  style={{ padding: '3rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.8rem', textAlign: 'center' }}
                >
                  <CheckCircle size={44} color="#25d366" strokeWidth={1.3} />
                  <p style={{ margin: 0, fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '1rem', color: '#fff' }}>Opening WhatsApp…</p>
                  <p style={{ margin: 0, fontSize: '0.7rem', color: 'rgba(255,255,255,0.38)', fontFamily: "'DM Sans', sans-serif" }}>We'll reply shortly.</p>
                </motion.div>
              ) : (
                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

                  {/* ── Cassette upper body ── */}
                  <div style={{ padding: '16px 24px 12px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>

                    {/* Top metadata strip */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#25d366' }} />
                        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.56rem', letterSpacing: '0.18em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase' }}>Origin MusicHUB · Online</span>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.5rem', color: 'rgba(255,255,255,0.2)', fontFamily: 'monospace', letterSpacing: '0.1em' }}>TYPE II · Cr02</span>
                        <div style={{ width: '28px', height: '10px', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '2px', position: 'relative', overflow: 'hidden' }}>
                          <div style={{ position: 'absolute', inset: '2px', background: '#25d366', borderRadius: '1px', width: '70%' }} />
                        </div>
                      </div>
                    </div>

                    {/* Reel window */}
                    <div style={{ background: '#080809', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.04)', boxShadow: 'inset 0 3px 10px rgba(0,0,0,0.8)', padding: '14px 22px', display: 'flex', alignItems: 'center' }}>
                      <Reel filled={0.35} />
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', padding: '0 18px' }}>
                        <div style={{ width: '100%', height: '10px', background: 'linear-gradient(to bottom, #3a2010, #2a1508)', borderRadius: '3px', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.6)' }} />
                        <div style={{ width: '100%', padding: '5px 10px', background: 'rgba(255,255,255,0.03)', borderLeft: '2px solid #25d366', textAlign: 'center' }}>
                          <p style={{ margin: 0, fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '0.64rem', color: 'rgba(255,255,255,0.22)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Start Your Project</p>
                        </div>
                        <div style={{ width: '100%', height: '10px', background: 'linear-gradient(to top, #3a2010, #2a1508)', borderRadius: '3px', boxShadow: 'inset 0 -2px 4px rgba(0,0,0,0.6)' }} />
                      </div>
                      <Reel filled={0.65} />
                    </div>

                    {/* Bottom cassette teeth */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                      <div style={{ display: 'flex', gap: '3px' }}>
                        {[0, 1, 2].map(i => <div key={i} style={{ width: '9px', height: '5px', background: 'rgba(255,255,255,0.05)', borderRadius: '1px' }} />)}
                      </div>
                      <div style={{ width: '60px', height: '5px', background: 'rgba(255,255,255,0.03)', borderRadius: '1px' }} />
                      <div style={{ display: 'flex', gap: '3px' }}>
                        {[0, 1, 2].map(i => <div key={i} style={{ width: '9px', height: '5px', background: 'rgba(255,255,255,0.05)', borderRadius: '1px' }} />)}
                      </div>
                    </div>
                  </div>

                  {/* ── Form fields ── */}
                  <div style={{ padding: '18px 24px 22px' }}>
                    <form onSubmit={handleSend}>
                      <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                        {/* Name */}
                        <div style={{ flex: '0 0 230px', position: 'relative' }}>
                          <User size={11} color={focus === 'name' ? '#25d366' : 'rgba(255,255,255,0.22)'} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', transition: 'color 0.2s' }} />
                          <input type="text" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} required
                            onFocus={() => setFocus('name')} onBlur={() => setFocus(null)}
                            style={{ width: '100%', background: focus === 'name' ? 'rgba(37,211,102,0.07)' : 'rgba(255,255,255,0.04)', border: `1px solid ${focus === 'name' ? 'rgba(37,211,102,0.45)' : 'rgba(255,255,255,0.08)'}`, borderRadius: '9px', padding: '0.58rem 0.7rem 0.58rem 2rem', color: '#fff', fontFamily: "'DM Sans', sans-serif", fontSize: '0.78rem', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.22s, background 0.22s' }}
                          />
                        </div>
                        {/* Message */}
                        <div style={{ flex: 1 }}>
                          <textarea placeholder="Describe your vibe, project idea…" value={msg} onChange={e => setMsg(e.target.value)} required rows={1}
                            onFocus={() => setFocus('msg')} onBlur={() => setFocus(null)}
                            style={{ width: '100%', background: focus === 'msg' ? 'rgba(37,211,102,0.07)' : 'rgba(255,255,255,0.04)', border: `1px solid ${focus === 'msg' ? 'rgba(37,211,102,0.45)' : 'rgba(255,255,255,0.08)'}`, borderRadius: '9px', padding: '0.58rem 0.7rem', color: '#fff', fontFamily: "'DM Sans', sans-serif", fontSize: '0.78rem', outline: 'none', resize: 'none', boxSizing: 'border-box', height: '40px', lineHeight: 1.5, transition: 'border-color 0.22s, background 0.22s' }}
                          />
                        </div>
                      </div>

                      <motion.button type="submit"
                        whileHover={{ scale: 1.02, boxShadow: '0 6px 24px rgba(37,211,102,0.4)' }}
                        whileTap={{ scale: 0.97 }}
                        style={{ width: '100%', background: 'linear-gradient(135deg, #25d366 0%, #1aaf55 55%, #128c7e 100%)', border: 'none', borderRadius: '9px', padding: '0.68rem', color: '#fff', fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '0.84rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', outline: 'none', boxShadow: '0 4px 18px rgba(37,211,102,0.28)', letterSpacing: '0.02em' }}
                      >
                        <Send size={13} /> Connect on WhatsApp
                      </motion.button>
                    </form>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
