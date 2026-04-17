import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, User, Music } from 'lucide-react';

/**
 * DiskPortal — floats as a vinyl-disk-styled button when the user
 * reaches the last section. On click, morphs into a WhatsApp contact form.
 */
export default function DiskPortal() {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [msg, setMsg] = useState('');
  const [sent, setSent] = useState(false);

  // Show portal when user is in the last ~22% of the page
  useEffect(() => {
    const check = () => {
      const scrolled = window.scrollY + window.innerHeight;
      const total = document.body.scrollHeight;
      setVisible(scrolled / total > 0.78);
    };
    window.addEventListener('scroll', check, { passive: true });
    check();
    return () => window.removeEventListener('scroll', check);
  }, []);

  const handleSend = (e) => {
    e.preventDefault();
    if (!name.trim() || !msg.trim()) return;
    const text = encodeURIComponent(`Hi, I'm ${name}. ${msg}`);
    window.open(`https://wa.me/919999999999?text=${text}`, '_blank');
    setSent(true);
    setTimeout(() => { setSent(false); setOpen(false); setName(''); setMsg(''); }, 2500);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="portal"
          initial={{ opacity: 0, scale: 0.4, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.3, y: 20 }}
          transition={{ type: 'spring', stiffness: 280, damping: 22 }}
          style={{ position: 'fixed', bottom: '2.2rem', right: '2.2rem', zIndex: 9000 }}
        >
          <AnimatePresence mode="wait">
            {!open ? (
              /* ── Vinyl disk trigger button ── */
              <motion.button
                key="disk-btn"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1, rotate: [0, 360] }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.5, rotate: { repeat: Infinity, duration: 4, ease: 'linear' } }}
                whileHover={{ scale: 1.12, boxShadow: '0 0 32px rgba(37,211,102,0.55)' }}
                whileTap={{ scale: 0.92 }}
                onClick={() => setOpen(true)}
                title="Connect on WhatsApp"
                style={{
                  width: '64px', height: '64px', borderRadius: '50%',
                  background: 'radial-gradient(circle at 35% 35%, #1a1a24, #06060e)',
                  border: '2px solid rgba(37,211,102,0.55)',
                  boxShadow: '0 0 18px rgba(37,211,102,0.3), 0 8px 30px rgba(0,0,0,0.7)',
                  cursor: 'pointer', outline: 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  position: 'relative', overflow: 'hidden',
                }}
              >
                {/* Concentric groove rings */}
                {[48, 36, 24].map((d, i) => (
                  <div key={i} style={{ position: 'absolute', width: `${d}px`, height: `${d}px`, borderRadius: '50%', border: '1px solid rgba(37,211,102,0.2)' }} />
                ))}
                <MessageCircle size={22} color="#25d366" strokeWidth={2} style={{ position: 'relative', zIndex: 1 }} />
                {/* Pulsing ring */}
                <motion.div
                  animate={{ scale: [1, 1.8], opacity: [0.5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.8, ease: 'easeOut' }}
                  style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2px solid rgba(37,211,102,0.5)' }}
                />
              </motion.button>
            ) : (
              /* ── Expanded WhatsApp form ── */
              <motion.div
                key="form-card"
                initial={{ scale: 0.1, borderRadius: '50%', opacity: 0, originX: 1, originY: 1 }}
                animate={{ scale: 1, borderRadius: '20px', opacity: 1 }}
                exit={{ scale: 0.1, borderRadius: '50%', opacity: 0 }}
                transition={{ type: 'spring', stiffness: 240, damping: 22 }}
                style={{
                  width: '300px',
                  background: 'rgba(8,8,14,0.97)',
                  border: '1px solid rgba(37,211,102,0.3)',
                  borderRadius: '20px',
                  padding: '1.4rem',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.8), 0 0 30px rgba(37,211,102,0.15)',
                }}
              >
                {sent ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.8rem', padding: '1rem 0', textAlign: 'center' }}
                  >
                    <motion.div animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }} transition={{ duration: 0.5 }}>
                      <MessageCircle size={40} color="#25d366" />
                    </motion.div>
                    <p style={{ color: '#fff', fontFamily: "'Outfit', sans-serif", fontWeight: 600, margin: 0, fontSize: '1rem' }}>Opening WhatsApp…</p>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontFamily: "'DM Sans', sans-serif", fontSize: '0.75rem', margin: 0 }}>We'll be in touch shortly.</p>
                  </motion.div>
                ) : (
                  <>
                    {/* Header */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(37,211,102,0.15)', border: '1px solid rgba(37,211,102,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Music size={16} color="#25d366" />
                        </div>
                        <div>
                          <p style={{ margin: 0, fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '0.88rem', color: '#fff' }}>Origin MusicHUB</p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#25d366' }} />
                            <span style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.45)', fontFamily: "'DM Sans', sans-serif" }}>Online</span>
                          </div>
                        </div>
                      </div>
                      <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
                        onClick={() => setOpen(false)}
                        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', outline: 'none' }}
                      >
                        <X size={14} color="rgba(255,255,255,0.5)" />
                      </motion.button>
                    </div>

                    <p style={{ margin: '0 0 1rem', fontSize: '0.72rem', color: 'rgba(255,255,255,0.38)', fontFamily: "'DM Sans', sans-serif", lineHeight: 1.5 }}>
                      Tell us about your project — we'll respond on WhatsApp.
                    </p>

                    <form onSubmit={handleSend} style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                      <div style={{ position: 'relative' }}>
                        <User size={13} color="rgba(255,255,255,0.3)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                        <input
                          type="text"
                          placeholder="Your name"
                          value={name}
                          onChange={e => setName(e.target.value)}
                          required
                          style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '0.6rem 0.8rem 0.6rem 2rem', color: '#fff', fontFamily: "'DM Sans', sans-serif", fontSize: '0.8rem', outline: 'none', boxSizing: 'border-box' }}
                        />
                      </div>
                      <textarea
                        placeholder="What's the vibe? Tell us about your project…"
                        value={msg}
                        onChange={e => setMsg(e.target.value)}
                        required
                        rows={3}
                        style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '0.6rem 0.8rem', color: '#fff', fontFamily: "'DM Sans', sans-serif", fontSize: '0.8rem', outline: 'none', resize: 'none', boxSizing: 'border-box' }}
                      />
                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.04, boxShadow: '0 6px 24px rgba(37,211,102,0.4)' }}
                        whileTap={{ scale: 0.96 }}
                        style={{ background: 'linear-gradient(135deg, #25d366, #128c7e)', border: 'none', borderRadius: '10px', padding: '0.7rem', color: '#fff', fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '0.82rem', letterSpacing: '0.04em', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', outline: 'none' }}
                      >
                        <Send size={14} /> Connect on WhatsApp
                      </motion.button>
                    </form>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
