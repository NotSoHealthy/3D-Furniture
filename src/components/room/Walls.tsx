import { useRoom } from "@/app/context/RoomProvider";
import { Plane, useTexture } from "@react-three/drei";
import { WALL_TEXTURES } from "@/data/FurnitureCatalog";

export function Walls() {
  const { roomWidth, roomHeight, wallTextureId } = useRoom();
  const wallTextureData = WALL_TEXTURES.find((t) => t.id === wallTextureId);
  const texture = useTexture(wallTextureData?.url || "");

  return (
    <group>
      {/* Left Wall */}
      <Plane
        args={[roomHeight, 2, 1]}
        position={[-0.5, 1, roomHeight / 2 - 0.5]}
        rotation={[0, Math.PI / 2, 0]}
      >
        <meshStandardMaterial map={texture} />
      </Plane>
      {/* Front Wall */}
      <Plane
        args={[2, roomWidth, 1]}
        position={[roomWidth / 2 - 0.5, 1, -0.5]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <meshStandardMaterial map={texture} />
      </Plane>
      {/* Right Wall */}
      <Plane
        args={[roomHeight, 2, 1]}
        position={[roomWidth - 0.5, 1, roomHeight / 2 - 0.5]}
        rotation={[0, -Math.PI / 2, 0]}
      >
        <meshStandardMaterial map={texture} />
      </Plane>
      {/* Back Wall */}
      <Plane
        args={[2, roomWidth, 1]}
        position={[roomWidth / 2 - 0.5, 1, roomHeight - 0.5]}
        rotation={[0, Math.PI, Math.PI / 2]}
      >
        <meshStandardMaterial map={texture} />
      </Plane>
    </group>
  );
}
