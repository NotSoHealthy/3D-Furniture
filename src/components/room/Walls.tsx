import { Plane, useTexture } from "@react-three/drei";

type WallsProps = {
  roomWidth: number;
  roomHeight: number;
  wallColor: string;
  wallTexture: string;
};

export function Walls({
  roomWidth,
  roomHeight,
  wallColor,
  wallTexture,
}: WallsProps) {
  const wallTex = useTexture(wallTexture || "");

  return (
    <group>
      {/* Left Wall */}
      <Plane
        args={[roomHeight, 2, 1]}
        position={[-0.5, 1, roomHeight / 2 - 0.5]}
        rotation={[0, Math.PI / 2, 0]}
      >
        <meshStandardMaterial map={wallTex} color={wallColor} />
      </Plane>
      {/* Front Wall */}
      <Plane
        args={[2, roomWidth, 1]}
        position={[roomWidth / 2 - 0.5, 1, -0.5]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <meshStandardMaterial map={wallTex} color={wallColor} />
      </Plane>
      {/* Right Wall */}
      <Plane
        args={[roomHeight, 2, 1]}
        position={[roomWidth - 0.5, 1, roomHeight / 2 - 0.5]}
        rotation={[0, -Math.PI / 2, 0]}
      >
        <meshStandardMaterial map={wallTex} color={wallColor} />
      </Plane>
      {/* Back Wall */}
      <Plane
        args={[2, roomWidth, 1]}
        position={[roomWidth / 2 - 0.5, 1, roomHeight - 0.5]}
        rotation={[0, Math.PI, Math.PI / 2]}
      >
        <meshStandardMaterial map={wallTex} color={wallColor} />
      </Plane>
    </group>
  );
}
