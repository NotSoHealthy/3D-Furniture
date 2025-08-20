"use client";

import { Canvas } from "@react-three/fiber";
import { FURNITURE_CATALOG } from "@/data/FurnitureCatalog";
import { OrbitControls, useGLTF } from "@react-three/drei";

export default function Page() {
  const catalogObject = FURNITURE_CATALOG.find((item) => item.id === "bed");
  const model = useGLTF("/models/" + catalogObject?.id + "/model.glb");

  if (!catalogObject || !model) return null;

  return (
    <Canvas
      camera={{
        position: [0, 1, -1],
        fov: 50,
      }}
      gl={{ alpha: true }}
      onCreated={({ gl }) => {
        gl.setClearColor("#2F3A43", 0.0); // Red with 50% transparency for testing
      }}
    >
      <OrbitControls
        target={[0, 0, 0]}
        makeDefault={true}
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 2.05}
      />
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 10]} intensity={0.8} />
      <primitive
        object={model.scene}
        position={[0, 0, 0]}
        rotation={catalogObject.defaultRotation}
      />
    </Canvas>
  );
}
