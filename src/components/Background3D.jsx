import { useRef, useEffect, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';
import { diskState } from '../systems/diskPosition';

// ======================================================================
// 🎛️ TWEAKABLE CONFIG
// ======================================================================
const CONFIG = {
  diskRadius: 2.2,
  diskThickness: 0.04,
  labelRadius: 1.0,
  labelFaceRadius: 2.1,    // flat label face covers most of the top/bottom disk face
  grooveInner: 1.15,

  // Studio Dark aesthetic
  bodyColor: "#111116",
  bodyEmissive: "#04040a",
  labelColor: "#000000",
  grooveColorA: "#0f0f15",
  grooveColorB: "#16161d",

  idleSpinSpeed: 0.08,
  returnSpeed: 0.38,   // fast snap to scroll position

  // X, Y, Z, RotX, RotY
  pos_Hero: [2.4, 0.5, 1.1, 0.8, 0.4],
  pos_Tier1: [-2.5, 0.3, 1.8, 0.7, 0.3],
  pos_Tier2: [1.5, 0.4, 2.8, 0.6, 2.3],
  pos_Sample: [0.1, 0.0, 0.2, 0.5, 0.2],
  pos_Bottom: [0, 0.2, 4.5, 0.5, -0.2], // Moved aside to prevent obscuring form
};

const M_CONFIG = {
  pos_Hero: [1.0, 1.3, -1.0, 0.8, 0.2],    // Pulled back and slightly tighter to center
  pos_Tier1: [-1.0, -1.0, -1.0, 0.7, 0.3], // Retains corner dodging but physically smaller
  pos_Tier2: [1.0, 1.5, -1.0, 0.6, 1.3],
  pos_Sample: [0, 2.0, -1.0, 0.5, 0.2],
  pos_Bottom: [1.0, 1.0, -1.0, 0.5, -0.2],
};

const drag = {
  active: false,
  mx: 0,
  my: 0,
  diskScreenX: 0,
  diskScreenY: 0,
};

function lerpKF(a, b, t) {
  return a.map((v, i) => THREE.MathUtils.lerp(v, b[i], t));
}

function useLabelTexture(side = 'A') {
  return useMemo(() => {
    const size = 1024;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    if (side === 'B') {
      ctx.translate(size, 0);
      ctx.scale(-1, 1);
    }

    const cx = size / 2;
    const cy = size / 2;
    const outerR = size / 2 - 6;
    const innerR = Math.round(outerR * (1.0 / 2.1)); // ~241px

    // ── 1. Deep black vinyl base ──
    const bgGrad = ctx.createRadialGradient(cx, cy, innerR, cx, cy, outerR);
    bgGrad.addColorStop(0, '#14141a');
    bgGrad.addColorStop(0.5, '#0a0a0f');
    bgGrad.addColorStop(1, '#050508');
    ctx.fillStyle = bgGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
    ctx.fill();

    // ── 2. Premium groove rings — alternating widths for depth ──
    for (let r = innerR + 12; r < outerR - 5; r += 7) {
      const even = Math.floor((r - innerR) / 7) % 2 === 0;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = even ? 'rgba(255,255,255,0.055)' : 'rgba(255,255,255,0.02)';
      ctx.lineWidth = even ? 1.5 : 0.8;
      ctx.stroke();
    }

    // ── 3. Metallic sheen overlay ──
    const sheenX = cx + outerR * 0.25;
    const sheenY = cy - outerR * 0.3;
    const sheen = ctx.createRadialGradient(sheenX, sheenY, 10, sheenX, sheenY, outerR * 0.6);
    sheen.addColorStop(0, 'rgba(200,180,255,0.08)');
    sheen.addColorStop(0.3, 'rgba(120,160,255,0.05)');
    sheen.addColorStop(0.6, 'rgba(80,220,200,0.03)');
    sheen.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = sheen;
    ctx.beginPath();
    ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
    ctx.fill();

    // ── 4. Text in the outer black ring ──
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const ringMid = innerR + (outerR - innerR) * 0.48;
    const originY = cy - ringMid;

    ctx.font = 'italic bold 90px Georgia, serif';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(200,180,255,0.5)';
    ctx.shadowBlur = 10;
    ctx.fillText('Origin', cx, originY);
    ctx.shadowBlur = 0;

    ctx.strokeStyle = 'rgba(255,255,255,0.22)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx - 150, originY + 56);
    ctx.lineTo(cx + 150, originY + 56);
    ctx.stroke();

    ctx.font = 'bold 46px Arial, sans-serif';
    ctx.letterSpacing = '10px';
    ctx.fillStyle = 'rgba(255,255,255,0.82)';
    ctx.fillText('MusicHUB', cx, originY + 104);
    ctx.letterSpacing = '0px';

    // ── 5. Inner label circle ──
    const labelGrad = ctx.createRadialGradient(cx - 30, cy - 30, 10, cx, cy, innerR);
    if (side === 'A') {
      labelGrad.addColorStop(0, '#f8f8f8');
      labelGrad.addColorStop(0.55, '#e8e8e8');
      labelGrad.addColorStop(0.85, '#d5d5d5');
      labelGrad.addColorStop(1, '#bebebe');
    } else {
      labelGrad.addColorStop(0, '#242428');
      labelGrad.addColorStop(0.55, '#16161a');
      labelGrad.addColorStop(1, '#050508');
    }
    ctx.fillStyle = labelGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = side === 'A' ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
    ctx.stroke();

    ctx.lineWidth = 2.5;
    ctx.strokeStyle = side === 'A' ? 'rgba(0,0,0,0.22)' : 'rgba(255,255,255,0.1)';
    ctx.beginPath();
    ctx.arc(cx, cy, innerR - 16, 0, Math.PI * 2);
    ctx.stroke();

    // ── 6. Musical symbols on inner label ──
    const symColor = side === 'A' ? 'rgba(20,20,35,0.55)' : 'rgba(255,255,255,0.35)';

    // Treble clef left of center
    ctx.save();
    ctx.translate(cx - 62, cy + 8);
    ctx.fillStyle = symColor;
    ctx.font = 'bold 88px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('\u{1D11E}', 0, 0);
    ctx.restore();

    // Music note right of center
    ctx.save();
    ctx.translate(cx + 66, cy - 6);
    ctx.fillStyle = symColor;
    ctx.font = 'bold 70px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('\u266A', 0, 0);
    ctx.restore();

    // Small decorative dots around inner ring
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 6) {
      const dr = innerR * 0.72;
      ctx.beginPath();
      ctx.arc(cx + Math.cos(a) * dr, cy + Math.sin(a) * dr, 3, 0, Math.PI * 2);
      ctx.fillStyle = side === 'A' ? 'rgba(0,0,0,0.18)' : 'rgba(255,255,255,0.15)';
      ctx.fill();
    }

    // ── 7. Center spindle hole ──
    const holeGrad = ctx.createRadialGradient(cx - 8, cy - 8, 2, cx, cy, 44);
    holeGrad.addColorStop(0, '#1a1a22');
    holeGrad.addColorStop(1, '#030308');
    ctx.fillStyle = holeGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, 44, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, 44, 0, Math.PI * 2);
    ctx.stroke();

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, [side]);

  // VRAM Cleanup: Dispose of the massive texture when the hook unmounts! 
  // This prevents memory leaks outlined in the performance guide.
  useEffect(() => {
    return () => {
      if (texture) texture.dispose();
    };
  }, [texture]);

  return texture;
}

function VinylRecord() {
  const group = useRef();
  const spinGroup = useRef();
  const scrollRef = useRef(0);
  const screenPos = useRef(new THREE.Vector3());
  const glowRef = useRef();
  const labelTextureA = useLabelTexture('A');
  const labelTextureB = useLabelTexture('B');
  const colorObj = useMemo(() => new THREE.Color(), []);

  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // WebGL Performance: Memoize the 60 groove materials into 2 shared instances. 
  // This reduces WebGL state changes and overhead significantly.
  const grooveMatA = useMemo(() => new THREE.MeshStandardMaterial({ color: CONFIG.grooveColorA, roughness: 0.2, metalness: 0.9, side: THREE.FrontSide }), []);
  const grooveMatB = useMemo(() => new THREE.MeshStandardMaterial({ color: CONFIG.grooveColorB, roughness: 0.2, metalness: 0.9, side: THREE.FrontSide }), []);

  useFrame((state) => {
    if (!group.current) return;

    // Layout Thrashing Fix: Max scroll is cached via global resize listener.
    // Reading `document.body.scrollHeight` in `useFrame` directly caused intense 60FPS lag!
    const activeMaxScroll = window._cachedMaxScroll || Math.max(1, document.body.scrollHeight - window.innerHeight);
    const activeIsMobile = window._cachedIsMobile !== undefined ? window._cachedIsMobile : window.innerWidth < 768;

    scrollRef.current = window.scrollY;
    const scroll = scrollRef.current;

    if (spinGroup.current) {
      // Y-axis rotation = spinning on the disk's own face (like a vinyl record playing)
      // Smoothly lerp between playing speed and near-stop when paused
      const targetSpeed = diskState.isPlaying ? CONFIG.idleSpinSpeed : 0.001;
      spinGroup.current._spinSpeed = THREE.MathUtils.lerp(
        spinGroup.current._spinSpeed ?? 0.001,
        targetSpeed,
        0.04
      );
      spinGroup.current.rotation.y -= spinGroup.current._spinSpeed;
    }

    // Color cycling logic - Studio periodic lighting
    const time = state.clock.elapsedTime;
    const hue = (time * 0.05) % 1;
    colorObj.setHSL(hue, 0.4, 0.5); // Rich studio mood color

    if (glowRef.current) {
      glowRef.current.material.color.lerp(colorObj, 0.1);
      // Subtle pulse — was too bright causing white spot artifact
      const pulse = 0.08 + Math.sin(time * 2) * 0.04;
      glowRef.current.material.opacity = pulse;
    }

    const progress = Math.max(0, Math.min(1, scroll / activeMaxScroll));
    const r = progress * 4;

    const cfg = activeIsMobile ? M_CONFIG : CONFIG;
    let kf;

    if (r <= 1) {
      kf = lerpKF(cfg.pos_Hero, cfg.pos_Tier1, r);
    } else if (r <= 2) {
      kf = lerpKF(cfg.pos_Tier1, cfg.pos_Tier2, r - 1);
    } else if (r <= 3) {
      kf = lerpKF(cfg.pos_Tier2, cfg.pos_Sample, r - 2);
    } else {
      kf = lerpKF(cfg.pos_Sample, cfg.pos_Bottom, r - 3);
    }

    const bob = Math.sin(time * 0.8) * 0.12; // Natural slow bob

    if (drag.active) {
      const worldX = drag.mx * 6;
      const worldY = drag.my * 4;
      group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, worldX, 0.1);
      group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, worldY, 0.1);
      group.current.position.z = THREE.MathUtils.lerp(group.current.position.z, 0, 0.08); // Pull close
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, 0.2, 0.1);
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, drag.mx * 0.5, 0.1);
    } else {
      // 🚀 MOBILE PHYSICS: 
      // A slight lerp (0.25) acts as a low-pass filter over the asynchronous compositor thread jumps, 
      // drastically reducing the visible rubber-band stutter without causing too much trailing lag.
      const spd = activeIsMobile ? 0.25 : CONFIG.returnSpeed;
      group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, kf[0], spd);
      group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, kf[1] + bob, spd);
      group.current.position.z = THREE.MathUtils.lerp(group.current.position.z, kf[2], spd);
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, kf[3], spd);
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, kf[4], spd);
    }

    screenPos.current.setFromMatrixPosition(group.current.matrixWorld);
    screenPos.current.project(state.camera);
    drag.diskScreenX = (screenPos.current.x + 1) / 2 * window.innerWidth;
    drag.diskScreenY = (-screenPos.current.y + 1) / 2 * window.innerHeight;

    // Broadcast position to DOM influence system
    diskState.x = drag.diskScreenX;
    diskState.y = drag.diskScreenY;
    diskState.visible = screenPos.current.z > 0 && screenPos.current.z < 1;
  });

  const halfT = CONFIG.diskThickness / 2;
  const grooveStep = (CONFIG.diskRadius - 0.08 - CONFIG.grooveInner) / 30;

  return (
    <group ref={group}>
      <group ref={spinGroup}>
        {/* Main Disk Body */}
        <mesh>
          <cylinderGeometry args={[CONFIG.diskRadius, CONFIG.diskRadius, CONFIG.diskThickness, 128]} />
          <meshPhysicalMaterial
            color={CONFIG.bodyColor}
            emissive={CONFIG.bodyEmissive}
            emissiveIntensity={0.2}
            roughness={0.15}
            metalness={0.85}
            clearcoat={0.9}
            clearcoatRoughness={0.02}
            envMapIntensity={3.0}
            side={THREE.DoubleSide}
          />
        </mesh>

        <mesh ref={glowRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, halfT + 0.005, 0]}>
          <ringGeometry args={[CONFIG.diskRadius - 0.03, CONFIG.diskRadius + 0.06, 128]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.4}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -halfT - 0.005, 0]}>
          <ringGeometry args={[CONFIG.diskRadius - 0.03, CONFIG.diskRadius + 0.04, 128]} />
          <meshBasicMaterial
            color="#5e5e6a"
            transparent
            opacity={0.2}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Top Grooves */}
        {!isMobile && Array.from({ length: 30 }, (_, i) => {
          const rad = CONFIG.grooveInner + i * grooveStep;
          return (
            <mesh key={`t${i}`} position={[0, halfT + 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]} material={i % 2 === 0 ? grooveMatA : grooveMatB}>
              <ringGeometry args={[rad, rad + grooveStep * 0.5, 128]} />
            </mesh>
          );
        })}

        {/* Bottom Grooves */}
        {!isMobile && Array.from({ length: 30 }, (_, i) => {
          const rad = CONFIG.grooveInner + i * grooveStep;
          return (
            <mesh key={`b${i}`} position={[0, -halfT - 0.001, 0]} rotation={[Math.PI / 2, 0, 0]} material={i % 2 === 0 ? grooveMatA : grooveMatB}>
              <ringGeometry args={[rad, rad + grooveStep * 0.5, 128]} />
            </mesh>
          );
        })}

        {/* Inner Label Base */}
        <mesh>
          <cylinderGeometry args={[CONFIG.labelRadius, CONFIG.labelRadius, CONFIG.diskThickness + 0.005, 64]} />
          <meshPhysicalMaterial
            color="#ffffff"
            map={labelTextureA}
            roughness={0.4}
            metalness={0.3}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Front Label (A-Side) — expanded to cover groove area */}
        <mesh position={[0, halfT + 0.004, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[CONFIG.labelFaceRadius, 128]} />
          <meshPhongMaterial map={labelTextureA} side={THREE.FrontSide} />
        </mesh>

        {/* Back Label (B-Side) */}
        <mesh position={[0, -halfT - 0.004, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <circleGeometry args={[CONFIG.labelFaceRadius, 128]} />
          <meshPhongMaterial map={labelTextureB} side={THREE.FrontSide} />
        </mesh>

        {/* Spindle hole */}
        <mesh>
          <cylinderGeometry args={[0.08, 0.08, CONFIG.diskThickness + 0.04, 32]} />
          <meshStandardMaterial color="#b0b0b0" metalness={1.0} roughness={0.05} side={THREE.DoubleSide} />
        </mesh>
        <mesh>
          <cylinderGeometry args={[0.03, 0.03, CONFIG.diskThickness + 0.06, 32]} />
          <meshBasicMaterial color="#000" side={THREE.DoubleSide} />
        </mesh>
      </group>
    </group>
  );
}

export default function Background3D() {
  useEffect(() => {
    const HIT_RADIUS = 200; // Increased hit area for easier dragging

    const onDown = (e) => {
      const dx = e.clientX - drag.diskScreenX;
      const dy = e.clientY - drag.diskScreenY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < HIT_RADIUS) {
        drag.active = true;
        document.body.style.cursor = 'grabbing';
      }
    };

    const onMove = (e) => {
      drag.mx = (e.clientX / window.innerWidth) * 2 - 1;
      drag.my = -((e.clientY / window.innerHeight) * 2 - 1);
    };

    const onUp = () => {
      drag.active = false;
      document.body.style.cursor = '';
    };

    window.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);

    // Severe Layout Thrashing Fix: Cache the DOM height globally
    const updateCache = () => {
      window._cachedMaxScroll = Math.max(1, document.body.scrollHeight - window.innerHeight);
      window._cachedIsMobile = window.innerWidth < 768;
    };
    window.addEventListener('resize', updateCache);
    updateCache(); // run immediately

    return () => {
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('resize', updateCache);
    };
  }, []);

  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 50 }}
      gl={{ antialias: false, powerPreference: "high-performance" }}
      dpr={typeof window !== 'undefined' ? [1, window.innerWidth < 768 ? 1.0 : 1.5] : [1, 1]} /* Lock mobile DPR to 1 to permanently stop GPU throttling */
    >
      <ambientLight intensity={2.5} />

      {/* Front & Top Lighting */}
      <directionalLight position={[0, 10, 5]} intensity={2.5} color="#ffffff" />
      <directionalLight position={[0, 20, 0]} intensity={5.0} color="#ffffff" />
      <spotLight position={[-6, 5, 8]} intensity={4.0} color="#7b52de" angle={0.4} penumbra={1} />

      {/* Back & Rim Lighting to prevent solid black when rotated */}
      <directionalLight position={[0, -10, -5]} intensity={3.5} color="#ffffff" />
      <pointLight position={[5, -5, -5]} intensity={3.0} color="#459ab1" distance={25} />
      <pointLight position={[-5, 0, -8]} intensity={2.0} color="#c8bcf0" distance={20} />

      <VinylRecord />

      <Environment preset="night" />
    </Canvas>
  );
}
