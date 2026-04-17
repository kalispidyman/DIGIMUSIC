import { useState, useCallback, useEffect } from 'react';
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
import ContactForm from './components/ContactForm';
import Loader from './components/Loader';
import DiskPortal from './components/DiskPortal';
import './App.css';

gsap.registerPlugin(ScrollTrigger);

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

                 <ScrollHighlight>
                   <ContactForm />
                 </ScrollHighlight>
               </div>
            </motion.main>
          </div>
        </ReactLenis>
      )}

      {/* Fixed vinyl→WhatsApp portal — visible on last section */}
      <DiskPortal />
    </div>
  );
}

export default App;
