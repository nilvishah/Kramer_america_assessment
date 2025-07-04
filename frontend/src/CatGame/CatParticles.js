import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';

// Generate random positions for N particles in a burst
function getBurstPositions(count) {
  const positions = [];
  for (let i = 0; i < count; i++) {
    // Spherical burst
    const theta = Math.random() * 2 * Math.PI;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 1.2 + Math.random() * 0.7;
    positions.push(
      Math.sin(phi) * Math.cos(theta) * r,
      Math.sin(phi) * Math.sin(theta) * r,
      Math.cos(phi) * r
    );
  }
  return new Float32Array(positions);
}

function ParticleBurst({ trigger, color = '#fbbf24', duration = 0.8, count = 32 }) {
  const [visible, setVisible] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [positions] = useState(() => getBurstPositions(count));
  const ref = useRef();

  useEffect(() => {
    if (trigger) {
      setVisible(true);
      setStartTime(performance.now());
    }
  }, [trigger]);

  useFrame(() => {
    if (!visible) return;
    const elapsed = (performance.now() - startTime) / 1000;
    if (ref.current) {
      ref.current.material.opacity = 1 - elapsed / duration;
      ref.current.position.y = elapsed * 0.5; // slight upward drift
    }
    if (elapsed > duration) {
      setVisible(false);
      if (ref.current) {
        ref.current.material.opacity = 0;
        ref.current.position.y = 0;
      }
    }
  });

  if (!visible) return null;
  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        color={color}
        size={0.18}
        sizeAttenuation
        transparent
        opacity={1}
        depthWrite={false}
      />
    </Points>
  );
}

export default function CatParticles({ action, width = 600, height = '100%' }) {
  // action: should change on add/delete
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width, height, pointerEvents: 'none', zIndex: 2 }}>
      <Canvas camera={{ position: [0, 0, 8] }} style={{ width: '100%', height: '100%' }}>
        <ambientLight intensity={0.5} />
        <ParticleBurst trigger={action} color="#fbbf24" count={64} />
        <ParticleBurst trigger={action} color="#6366f1" count={40} />
        <ParticleBurst trigger={action} color="#fff" count={28} />
      </Canvas>
    </div>
  );
}
