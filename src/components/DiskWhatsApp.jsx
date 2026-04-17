import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, MessageCircle, Mic, ArrowRight } from 'lucide-react';

/* ── CONFIG ── */
const CONFIG = {
  w: 750,    // Wide layout
  y: 12,     // distance from bottom (vh)
  accent: '#25d366'
};

/**
 * DiskWhatsApp — A premium, studio-grade glassmorphic form.
 * Features: 
 * - Gradient-border scan animation
 * - Staggered entrance
 * - Minimalist audio-visualizer decoration
 * - Interactive focus states
 */
export default function DiskWhatsApp() {
  const [active, setActive] = useState(false);
  const [name, setName] = useState('');
  const [msg, setMsg] = useState('');
  const [sent, setSent] = useState(false);
  const [focused, setFocused] = useState(null);

  // Absolute end of page trigger
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight;
      const totalHeight = document.body.scrollHeight;
      
      // Ensure we've actually scrolled a significant amount (e.g., > 500px) 
      // AND we are within the final stretch of the page.
      const isAtEnd = scrollPos >= totalHeight - 20;
      const hasScrolledSufficiently = window.scrollY > 500;
      
      setActive(isAtEnd && hasScrolledSufficiently);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const onSend = (e) => {
    e.preventDefault();
    if (!name.trim() || !msg.trim()) return;
    window.open(`https://wa.me/919999999999?text=${encodeURIComponent(`Hi, I'm ${name}. ${msg}`)}`, '_blank');
    setSent(true);
    setTimeout(() => { setSent(false); setName(''); setMsg(''); }, 3000);
  };

  return (
    <AnimatePresence>
      {active && (
        <div style={{
          position: 'fixed',
          bottom: `${CONFIG.y}vh`,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 999,
          pointerEvents: 'none'
        }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: 'spring', stiffness: 180, damping: 20 }}
            style={{
              width: `${CONFIG.w}px`,
              pointerEvents: 'all',
              position: 'relative',
              borderRadius: '24px',
              overflow: 'hidden',
              padding: '1px' // For the gradient border
            }}
          >
            {/* ── Animated Gradient Border ── */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              style={{
                position: 'absolute',
                inset: '-100%',
                background: `conic-gradient(from 0deg, transparent 60%, ${CONFIG.accent} 80%, transparent 100%)`,
                zIndex: 0
              }}
            />

            {/* ── Main Content Container ── */}
            <div style={{
              position: 'relative',
              zIndex: 1,
              background: 'rgba(5, 5, 8, 0.94)',
              backdropFilter: 'blur(30px)',
              borderRadius: '23px',
              padding: '2.2rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.8rem',
              boxShadow: 'inset 0 0 40px rgba(0,0,0,0.8), 0 25px 60px rgba(0,0,0,0.8)'
            }}>
              
              {/* Header: Brand & Audio Decoration */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '45px', height: '45px', borderRadius: '12px',
                    background: 'rgba(37, 211, 102, 0.1)',
                    border: '1px solid rgba(37, 211, 102, 0.25)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <Mic size={20} color={CONFIG.accent} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, color: '#fff', fontSize: '1.1rem', fontWeight: 700, fontFamily: "'Outfit', sans-serif" }}>Get in Touch</h3>
                    <p style={{ margin: 0, color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', fontFamily: "'DM Sans', sans-serif" }}>Ready to start your next masterpiece?</p>
                  </div>
                </div>

                {/* Animated Waveform Decoration */}
                <div style={{ display: 'flex', gap: '3px', alignItems: 'flex-end', height: '24px' }}>
                  {[1,2,3,4,5,6].map(i => (
                    <motion.div
                      key={i}
                      animate={{ height: ['4px', '22px', '8px', '24px', '6px'] }}
                      transition={{ duration: 0.8 + (i*0.2), repeat: Infinity, ease: 'easeInOut' }}
                      style={{ width: '3px', background: CONFIG.accent, borderRadius: '4px', opacity: 0.6 }}
                    />
                  ))}
                </div>
              </div>

              <AnimatePresence mode="wait">
                {sent ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ textAlign: 'center', padding: '1rem 0' }}
                  >
                    <div style={{ color: CONFIG.accent, marginBottom: '0.8rem' }}><CheckCircle size={48} style={{ margin: '0 auto' }} /></div>
                    <h4 style={{ color: '#fff', margin: '0 0 0.4rem', fontSize: '1.2rem' }}>Message Sent!</h4>
                    <p style={{ color: 'rgba(255,255,255,0.5)', margin: 0 }}>Opening WhatsApp to finalize...</p>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={onSend}
                    style={{ display: 'flex', gap: '1.2rem', alignItems: 'flex-end' }}
                  >
                    {/* Name Field */}
                    <div style={{ flex: 1, position: 'relative' }}>
                      <label style={{ 
                        display: 'block', fontSize: '0.65rem', textTransform: 'uppercase', 
                        letterSpacing: '0.1em', color: focused === 'name' ? CONFIG.accent : 'rgba(255,255,255,0.3)',
                        marginBottom: '8px', transition: 'color 0.3s' 
                      }}>Artist / Client Name</label>
                      <div style={{ position: 'relative' }}>
                        <User size={16} color="rgba(255,255,255,0.2)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={e => setName(e.target.value)}
                          onFocus={() => setFocused('name')}
                          onBlur={() => setFocused(null)}
                          placeholder="Your identity..."
                          style={{
                            width: '100%',
                            background: 'rgba(255,255,255,0.03)',
                            border: `1px solid ${focused === 'name' ? CONFIG.accent : 'rgba(255,255,255,0.08)'}`,
                            borderRadius: '12px',
                            padding: '14px 14px 14px 45px',
                            color: '#fff',
                            fontSize: '0.9rem',
                            outline: 'none',
                            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                          }}
                        />
                      </div>
                    </div>

                    {/* Message Field */}
                    <div style={{ flex: 2, position: 'relative' }}>
                      <label style={{ 
                        display: 'block', fontSize: '0.65rem', textTransform: 'uppercase', 
                        letterSpacing: '0.1em', color: focused === 'msg' ? CONFIG.accent : 'rgba(255,255,255,0.3)',
                        marginBottom: '8px', transition: 'color 0.3s' 
                      }}>The Vibe / Project Idea</label>
                      <div style={{ position: 'relative' }}>
                        <MessageCircle size={16} color="rgba(255,255,255,0.2)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                        <input
                          type="text"
                          required
                          value={msg}
                          onChange={e => setMsg(e.target.value)}
                          onFocus={() => setFocused('msg')}
                          onBlur={() => setFocused(null)}
                          placeholder="Tell us about the project..."
                          style={{
                            width: '100%',
                            background: 'rgba(255,255,255,0.03)',
                            border: `1px solid ${focused === 'msg' ? CONFIG.accent : 'rgba(255,255,255,0.08)'}`,
                            borderRadius: '12px',
                            padding: '14px 14px 14px 45px',
                            color: '#fff',
                            fontSize: '0.9rem',
                            outline: 'none',
                            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                          }}
                        />
                      </div>
                    </div>

                    {/* Dynamic Submit Button */}
                    <motion.button
                      whileHover={{ scale: 1.05, background: CONFIG.accent, color: '#000' }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      style={{
                        height: '52px',
                        padding: '0 2rem',
                        borderRadius: '12px',
                        border: `1px solid ${CONFIG.accent}`,
                        background: 'transparent',
                        color: CONFIG.accent,
                        fontSize: '0.9rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        transition: 'all 0.3s ease',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      Connect <ArrowRight size={18} />
                    </motion.button>
                  </motion.form>
                )}
              </AnimatePresence>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function CheckCircle({ size, style }) {
  return (
    <svg 
      width={size} height={size} viewBox="0 0 24 24" fill="none" 
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" 
      strokeLinejoin="round" style={style}
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
