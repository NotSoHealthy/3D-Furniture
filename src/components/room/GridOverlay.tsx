import { GridPoint } from "@/types/common";
import { Line, Point, PointMaterial, Points } from "@react-three/drei";

type GridOverlayProps = {
  roomWidth: number;
  roomHeight: number;
  showGrid: boolean;
  roomPoints: GridPoint[];
};

export function GridOverlay({
  roomWidth,
  roomHeight,
  showGrid,
  roomPoints,
}: GridOverlayProps) {
  const LINE_COLOR = "#3986d5";
  const POINT_COLOR = "#FF0000";

  return (
    <>
      <group position={[-0.5, 0.001, -0.5]} visible={showGrid}>
        {Array.from({ length: roomWidth + 1 }).map((_, x) => (
          <Line
            key={`v-${x}`}
            points={[
              [x, 0, 0],
              [x, 0, roomHeight],
            ]}
            color={LINE_COLOR}
            lineWidth={2}
            side={2}
          />
        ))}
        {Array.from({ length: roomHeight + 1 }).map((_, z) => (
          <Line
            key={`h-${z}`}
            points={[
              [0, 0, z],
              [roomWidth, 0, z],
            ]}
            color={LINE_COLOR}
            lineWidth={2}
            side={2}
          />
        ))}
      </group>

      <Points position={[-0.5, 0.004, -0.5]} visible={showGrid}>
        {roomPoints.map((point, index) => (
          <Point key={index} position={[point.x, 0, point.y]} />
        ))}
        <PointMaterial
          color={POINT_COLOR}
          transparent
          vertexColors
          size={5}
          sizeAttenuation={false}
          depthWrite={false}
          side={2}
        />
      </Points>
    </>
  );
}
