import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useSpring, a } from '@react-spring/three';
import { OrbitControls } from '@react-three/drei';

// Simple 3D paw shape using spheres and cylinders
function Paw({ action }) {
  const group = useRef();
  // Animate scale on action (add/delete)
  const { scale } = useSpring({
    scale: action ? 1.2 : 1,
    config: { tension: 300, friction: 10 },
    reset: true,
  });

  useFrame(() => {
    if (group.current) {
      group.current.rotation.z = Math.sin(Date.now() * 0.001) * 0.1;
    }
  });

  return (
    <a.group ref={group} scale={scale}>
      {/* Palm */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="#fbbf24" />
      </mesh>
      {/* Toes */}
      <mesh position={[-0.35, 0.5, 0]}>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshStandardMaterial color="#fde68a" />
      </mesh>
      <mesh position={[0, 0.6, 0]}>
        <sphereGeometry args={[0.22, 32, 32]} />
        <meshStandardMaterial color="#fde68a" />
      </mesh>
      <mesh position={[0.35, 0.5, 0]}>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshStandardMaterial color="#fde68a" />
      </mesh>
      <mesh position={[0.18, 0.2, 0.3]}>
        <sphereGeometry args={[0.13, 32, 32]} />
        <meshStandardMaterial color="#fde68a" />
      </mesh>
    </a.group>
  );
}

export default function CatPaw3D({ action }) {
  return (
    <div style={{ width: 120, height: 120, margin: '0 auto' }}>
      <Canvas camera={{ position: [0, 0, 2.5] }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[2, 2, 2]} intensity={0.7} />
        <Paw action={action} />
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
}
