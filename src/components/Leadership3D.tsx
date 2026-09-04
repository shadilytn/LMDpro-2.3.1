
import React from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';

const PrincipleSphere = ({ position, title }: { position: [number, number, number], title: string }) => {
  const mesh = React.useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    mesh.current.rotation.x = Math.sin(state.clock.getElapsedTime()) * 0.1;
    mesh.current.rotation.y = Math.cos(state.clock.getElapsedTime()) * 0.1;
  });

  return (
    <mesh position={position} ref={mesh}>
      <sphereGeometry args={[0.8, 32, 32]} />
      <meshStandardMaterial color="#40E0D0" emissive="#000080" emissiveIntensity={0.5} />
      <Text position={[0, 1.2, 0]} fontSize={0.3} color="white" anchorX="center" anchorY="middle">
        {title}
      </Text>
    </mesh>
  );
};

export const Leadership3D: React.FC = () => {
  return (
    <div className="h-[400px] w-full rounded-3xl overflow-hidden bg-[#000000] border border-[#27272a]">
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <PrincipleSphere position={[-2, 0, 0]} title="Vision" />
        <PrincipleSphere position={[0, 0, 0]} title="Adaptive" />
        <PrincipleSphere position={[2, 0, 0]} title="Excellence" />
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
};
