import React, { Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";

function TrainModel() {
  const { scene } = useGLTF("/assets/scene.gltf"); // Load model

  // Override all materials once loaded
  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.material = new THREE.MeshStandardMaterial({
          color: "skyblue",   // default color
          metalness: 0.3,
          roughness: 0.7,
        });
      }
    });
  }, [scene]);

  return <primitive object={scene} scale={2} position={[0, -1, 0]} />;
}

export default function Train3D() {
  return (
    <Canvas style={{ height: "500px", background: "#e0e0e0" }}>
      {/* Lights */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <OrbitControls />

      {/* Suspense waits for model to load */}
      <Suspense fallback={null}>
        <TrainModel />
      </Suspense>
    </Canvas>
  );
}
