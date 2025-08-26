'use client';

import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface CameraControllerProps {
  mode: 'chat' | 'story';
  sceneIndex: number;
}

export default function CameraController({ mode, sceneIndex }: CameraControllerProps) {
  const { camera } = useThree();
  const targetPosition = useRef(new THREE.Vector3());
  const targetLookAt = useRef(new THREE.Vector3());
  const currentLookAt = useRef(new THREE.Vector3());

  useEffect(() => {
    const scenes = [
      { position: [0, 5, 15], lookAt: [0, 0, 0] }, // Chat view (default)
      { position: [-15, 8, 10], lookAt: [-15, 0, -10] }, // Market scene
      { position: [15, 8, 10], lookAt: [15, 0, -10] }, // Locker scene
      { position: [0, 10, -20], lookAt: [0, 0, -30] }, // Delivery scene
      { position: [0, 8, 20], lookAt: [0, 0, 10] }, // App scene
    ];

    const target = mode === 'chat' ? scenes[0] : scenes[sceneIndex];
    targetPosition.current.set(...target.position);
    targetLookAt.current.set(...target.lookAt);
  }, [mode, sceneIndex]);

  useFrame(() => {
    // Smooth camera position interpolation
    camera.position.lerp(targetPosition.current, 0.05);
    
    // Smooth look-at interpolation
    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction);
    currentLookAt.current.copy(camera.position).add(direction.multiplyScalar(10));
    currentLookAt.current.lerp(targetLookAt.current, 0.05);
    camera.lookAt(currentLookAt.current);
    
    // Update camera FOV based on mode
    const targetFOV = mode === 'chat' ? 60 : 50;
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = THREE.MathUtils.lerp(camera.fov, targetFOV, 0.05);
      camera.updateProjectionMatrix();
    }
  });

  return null;
}