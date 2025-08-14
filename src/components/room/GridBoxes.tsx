import { Cell } from "@/types/common";
import { Object } from "@/types/Object";
import { Box } from "@react-three/drei";

type GridBoxesProps = {
  roomCells: Cell[];
  objects: Object[];
  moveObject: (object: Object, newCell: Cell) => void;
  hoveredCell: number | null;
  setHoveredCell: (index: number | null) => void;
  selectedObjectId: string | null;
  setSelectedObjectId: (id: string | null) => void;
  setRoomCells: React.Dispatch<React.SetStateAction<Cell[]>>;
};

export default function GridBoxes({
  roomCells,
  objects,
  moveObject,
  hoveredCell,
  setHoveredCell,
  selectedObjectId,
  setSelectedObjectId,
  setRoomCells,
}: GridBoxesProps) {
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
            if (selectedObjectId !== null && !cell.filled) {
              const selectedObj = objects.find(
                (obj) => obj.id === selectedObjectId
              );
              if (selectedObj) {
                moveObject(selectedObj, cell);
              }
            }
          }}
          onPointerOut={() => {
            setHoveredCell(null);
          }}
          onPointerDown={() => {
            if (selectedObjectId !== null) {
              setRoomCells((prev) =>
                prev.map((cell, i) =>
                  i === index ? { ...cell, filled: true } : cell
                )
              );
              setSelectedObjectId(null);
            }
            console.log("Cell clicked:", cell);
          }}
        >
          <meshStandardMaterial
            color="gray"
            transparent
            opacity={hoveredCell === index ? 0.3 : 1}
          />
        </Box>
      ))}
    </>
  );
}
