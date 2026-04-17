import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, User, Clock, Radio, MessageSquare } from 'lucide-react';

// Disk is on RIGHT (pos_Bottom x=3.2) → form centered, no competing side
const ACCENT = '#7c5ce0';
const ACCENT_CHIP = 'rgba(124,92,224,0.18)';
const ACCENT_BORDER = 'rgba(124,92,224,0.4)';

function Field({ label, icon: Icon, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
      <label style={{ display: 'flex', alignItems: 'center', gap: '7px', color: 'rgba(255,255,255,0.55)', fontSize: '0.7rem', fontFamily: "'DM Sans', sans-serif", textTransform: 'uppercase', letterSpacing: '0.14em', fontWeight: 600 }}>
        <Icon size={13} color="rgba(255,255,255,0.5)" /> {label}
      </label>
      {children}
    </div>
  );
}

export default function ContactForm() {
  const [formData, setFormData] = useState({ name: '', deadline: '', mood: '', projectDetails: '' });
  const [focused, setFocused] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const msg = `Hi ORIGIN! 👋%0AName: ${formData.name}%0AStyle: ${formData.mood}%0ATimeline: ${formData.deadline}%0ABrief: ${formData.projectDetails}`;
    window.open(`https://wa.me/919999999999?text=${msg}`, '_blank');
  };

  const inputStyle = (key) => ({
    width: '100%', padding: '0.85rem 1rem',
    background: focused === key ? 'rgba(124,92,224,0.08)' : '#0e0c1c',
    border: `1px solid ${focused === key ? ACCENT_BORDER.replace('0.4','0.75') : ACCENT_BORDER}`,
    borderRadius: '11px', color: '#fff',
    fontSize: '0.88rem', fontFamily: "'DM Sans', sans-serif", fontWeight: 400,
    outline: 'none',
    boxShadow: focused === key ? `0 0 0 3px ${ACCENT_CHIP}, 0 4px 20px rgba(124,92,224,0.2)` : 'none',
    transition: 'all 0.3s ease',
  });

  return (
    <section style={{
      height: '100vh', padding: '0 6vw',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: '2rem', position: 'relative', zIndex: 10,
    }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }} whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16,1,0.3,1] }} viewport={{ once: true }}
        style={{ textAlign: 'center' }}
      >
        <p style={{ margin: '0 0 6px', fontSize: '0.68rem', letterSpacing: '0.22em', color: 'rgba(255,255,255,0.38)', fontFamily: "'DM Sans', sans-serif", textTransform: 'uppercase', fontWeight: 500 }}>
          04 — Commission
        </p>
        <h2 style={{ margin: 0, fontFamily: "'Outfit', sans-serif", fontSize: 'clamp(1.5rem, 2.2vw, 2rem)', fontWeight: 700, color: '#fff', letterSpacing: '-0.01em' }}>
          Start Your Project
        </h2>
        <p style={{ margin: '8px auto 0', fontSize: '0.84rem', color: 'rgba(255,255,255,0.42)', fontFamily: "'DM Sans', sans-serif", fontWeight: 400, maxWidth: '360px', lineHeight: 1.6 }}>
          Fill in the details and we'll reach out on WhatsApp.
        </p>
      </motion.div>

      {/* Form card */}
      <motion.div
        initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, delay: 0.1, ease: [0.16,1,0.3,1] }} viewport={{ once: true }}
        style={{
          maxWidth: '740px', width: '100%',
          background: '#0d0b1a',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          border: `1px solid ${ACCENT_BORDER}`,
          borderRadius: '22px',
          padding: '2.4rem 2.5rem 2rem',
          boxShadow: `0 20px 60px rgba(0,0,0,0.65), 0 0 0 1px rgba(124,92,224,0.1), inset 0 1px 0 rgba(255,255,255,0.05)`,
          position: 'relative', overflow: 'hidden',
        }}
      >
        {/* Corner orbs */}
        <div style={{ position: 'absolute', top: -70, right: -70, width: '220px', height: '220px', background: 'radial-gradient(circle, rgba(124,92,224,0.2), transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -60, width: '180px', height: '180px', background: 'radial-gradient(circle, rgba(56,189,248,0.1), transparent 70%)', pointerEvents: 'none' }} />

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', position: 'relative', zIndex: 1 }}>

          {/* Row 1: Name + Timeline */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.1rem' }}>
            <Field label="Your Name" icon={User}>
              <input
                required type="text" placeholder="e.g. Arjun Mehta"
                value={formData.name}
                onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                onFocus={() => setFocused('name')} onBlur={() => setFocused(null)}
                style={inputStyle('name')}
              />
            </Field>
            <Field label="Timeline" icon={Clock}>
              <select
                required value={formData.deadline}
                onChange={e => setFormData(p => ({ ...p, deadline: e.target.value }))}
                onFocus={() => setFocused('deadline')} onBlur={() => setFocused(null)}
                style={{ ...inputStyle('deadline'), appearance: 'none', cursor: 'pointer', color: formData.deadline ? '#fff' : 'rgba(255,255,255,0.35)' }}
              >
                <option value="" disabled>Select a timeline...</option>
                <option value="Rush (24–48 hrs)" style={{ color: '#000' }}>Rush — within 48 hours</option>
                <option value="Standard (1 Week)" style={{ color: '#000' }}>Standard — within 1 week</option>
                <option value="Flexible" style={{ color: '#000' }}>Flexible — no rush</option>
              </select>
            </Field>
          </div>

          {/* Row 2: Music Style */}
          <Field label="Music Style & Mood" icon={Radio}>
            <input
              required type="text" placeholder="e.g. Melancholic cinematic with piano and strings"
              value={formData.mood}
              onChange={e => setFormData(p => ({ ...p, mood: e.target.value }))}
              onFocus={() => setFocused('mood')} onBlur={() => setFocused(null)}
              style={inputStyle('mood')}
            />
          </Field>

          {/* Row 3: Brief textarea */}
          <Field label="Project Brief" icon={MessageSquare}>
            <textarea
              required rows={3}
              placeholder="Describe the project — what's the moment, who is it for, what should the listener feel?"
              value={formData.projectDetails}
              onChange={e => setFormData(p => ({ ...p, projectDetails: e.target.value }))}
              onFocus={() => setFocused('brief')} onBlur={() => setFocused(null)}
              style={{ ...inputStyle('brief'), resize: 'none' }}
            />
          </Field>

          {/* Submit */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '0.4rem' }}>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05, background: ACCENT_CHIP.replace('0.18','0.35'), boxShadow: `0 8px 26px ${ACCENT_CHIP.replace('0.18','0.6')}` }}
              whileTap={{ scale: 0.96 }}
              style={{
                display: 'flex', alignItems: 'center', gap: '9px',
                padding: '0.85rem 2.2rem', borderRadius: '50px',
                background: ACCENT_CHIP, border: `1px solid ${ACCENT_BORDER}`, color: '#fff',
                fontFamily: "'DM Sans', sans-serif", fontSize: '0.85rem', fontWeight: 600,
                letterSpacing: '0.06em', cursor: 'pointer', outline: 'none',
                boxShadow: `0 4px 16px ${ACCENT_CHIP.replace('0.18','0.5')}`,
                transition: 'all 0.3s ease',
              }}
            >
              <Send size={15} /> Send on WhatsApp
            </motion.button>
          </div>
        </form>
      </motion.div>

      {/* Footer */}
      <footer style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 0.5rem' }}>
        {/* Origin wordmark — left */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '18px', height: '18px', borderRadius: '5px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontWeight: 900, fontSize: '0.6rem', color: '#0a0a0f' }}>O</span>
          </div>
          <div>
            <span style={{ fontSize: '0.78rem', fontFamily: "'Outfit', sans-serif", fontWeight: 600, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.05em', display: 'block' }}>Origin MusicHUB</span>
            <p style={{ margin: 0, color: 'rgba(255,255,255,0.14)', fontSize: '0.52rem', fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              © 2026 Studio-Quality Audio
            </p>
          </div>
        </div>

        {/* Designer @NEET badge — right, with hover */}
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          whileHover={{ scale: 1.1, boxShadow: '0 8px 30px rgba(124,92,224,0.4)', borderColor: 'rgba(167,139,250,0.5)' }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '6px 16px 6px 10px',
            borderRadius: '50px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
            cursor: 'default',
            transition: 'border-color 0.3s',
          }}
        >
          <motion.div
            animate={{ scale: [1, 1.5, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
            style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'linear-gradient(135deg, #7c5ce0, #38bdf8)', flexShrink: 0 }}
          />
          <span style={{ fontSize: '0.68rem', fontFamily: "'DM Sans', sans-serif", fontWeight: 500, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.38)', textTransform: 'uppercase' }}>
            Designer
          </span>
          <motion.span
            animate={{ backgroundPosition: ['0% center', '200% center'] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: 'linear' }}
            style={{
              fontSize: '0.72rem', fontFamily: "'Outfit', sans-serif", fontWeight: 700,
              letterSpacing: '0.04em',
              background: 'linear-gradient(90deg, #a78bfa, #38bdf8, #f05080, #a78bfa)',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            @NEET
          </motion.span>
        </motion.div>
      </footer>
    </section>
  );
}
