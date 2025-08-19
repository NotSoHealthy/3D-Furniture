import { Cell } from "@/types/common";
import { Box } from "@react-three/drei";

type GridBoxesProps = {
  roomCells: Cell[];
  hoveredCell: number | null;
  setHoveredCell: (index: number | null) => void;
  showGrid: boolean;
};

export default function GridBoxes({
  roomCells,
  hoveredCell,
  setHoveredCell,
  showGrid = true,
}: GridBoxesProps) {
  if (!showGrid) return null;
  return (
    <>
      {roomCells.map((cell, index) => (
        <Box
          key={index}
          args={[1, 0.01, 1]}
          position={cell.position}
          visible={hoveredCell === index}
          onPointerOver={() => {
            setHoveredCell(index);
          }}
          onPointerOut={() => {
            setHoveredCell(null);
          }}
        >
          <meshStandardMaterial
            visible={showGrid}
            color="gray"
            transparent
            opacity={hoveredCell === index ? 0.3 : 1}
          />
        </Box>
      ))}
    </>
  );
}
