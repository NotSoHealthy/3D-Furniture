import { useRoom } from "@/app/context/RoomProvider";
import { Plane, useTexture } from "@react-three/drei";
import { FLOOR_TEXTURES } from "@/data/FurnitureCatalog";

export function Floor() {
  const { roomWidth, roomHeight, floorTextureId } = useRoom();
  const floorTexture = FLOOR_TEXTURES.find(
    (texture) => texture.id === floorTextureId
  );
  const texture = useTexture(floorTexture?.url || "");
  return (
    <Plane
      args={[roomWidth, roomHeight]}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[roomWidth / 2 - 0.5, 0, roomHeight / 2 - 0.5]}
    >
      <meshStandardMaterial map={texture} />
    </Plane>
  );
}
