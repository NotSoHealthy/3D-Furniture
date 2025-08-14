import { Plane, useTexture } from "@react-three/drei";

type FloorProps = {
  roomWidth: number;
  roomHeight: number;
  floorColor: string;
  floorTexture: string;
};

export function Floor({
  roomWidth,
  roomHeight,
  floorColor,
  floorTexture,
}: FloorProps) {
  const floorTex = useTexture(floorTexture || "");
  return (
    <Plane
      args={[roomWidth, roomHeight]}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[roomWidth / 2 - 0.5, 0, roomHeight / 2 - 0.5]}
    >
      <meshStandardMaterial map={floorTex} color={floorColor} />
    </Plane>
  );
}
