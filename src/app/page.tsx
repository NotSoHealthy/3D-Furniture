"use client";
import SidePanel from "@/components/room/SidePanel";
import { OrbitControls, useFBX } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useCallback, useEffect, useState } from "react";
import { Leva } from "leva";
import { Cell, GridPoint } from "@/types/common";
import { Object } from "@/types/Object";
import { Walls } from "@/components/room/Walls";
import { Floor } from "@/components/room/Floor";
import GridBoxes from "@/components/room/GridBoxes";
import { GridOverlay } from "@/components/room/GridOverlay";

export default function Home() {
  const initialObjects: Object[] = [
    {
      id: crypto.randomUUID(),
      position: [0, 0, 0],
      rotation: [0, Math.PI, 0],
      scale: [0.01, 0.01, 0.01],
      model: useFBX("/models/chair/source/Chair.fbx"),
    },
  ];

  const [objects, setObjects] = useState<Object[]>(initialObjects);
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  const [roomCells, setRoomCells] = useState<Cell[]>([]);
  const [roomPoints, setRoomPoints] = useState<GridPoint[]>([]);
  const [hoveredCell, setHoveredCell] = useState<number | null>(null);
  const {
    roomWidth,
    roomHeight,
    showGrid,
    wallColor,
    floorColor,
    wallTexture,
    floorTexture,
  } = SidePanel();

  const populateCells = useCallback(() => {
    const cells: Cell[] = [];
    for (let x = 0; x < roomWidth; x++) {
      for (let y = 0; y < roomHeight; y++) {
        cells.push({ position: [x, 0, y], filled: false });
      }
    }
    setRoomCells(cells);
  }, [roomWidth, roomHeight]);

  const checkObject = useCallback(() => {
    objects.forEach((object) => {
      if (object.position[0] >= roomWidth || object.position[2] >= roomHeight) {
        console.warn(`Object at ${object.position} is out of bounds:`, object);
        setObjects((prev) => prev.filter((obj) => obj.id !== object.id));
        if (selectedObjectId === object.id) setSelectedObjectId(null);
      }
    });
  }, [objects, roomWidth, roomHeight, selectedObjectId]);

  const moveObject = (object: Object, newCell: Cell) => {
    if (object.position[0] >= roomWidth || object.position[2] >= roomHeight) {
      setObjects((prev) => prev.filter((o) => o.id !== object.id));
    } else {
      setRoomCells((prev) =>
        prev.map((cell) =>
          cell.position === object.position ? { ...cell, filled: false } : cell
        )
      );
      setObjects((prev) =>
        prev.map((obj) =>
          obj.id === selectedObjectId
            ? { ...obj, position: newCell.position }
            : obj
        )
      );
    }
  };

  useEffect(() => {
    checkObject();
  }, [objects, roomWidth, roomHeight, checkObject]);

  const populatePoints = useCallback(() => {
    const points: GridPoint[] = [];
    for (let x = 0; x < roomWidth; x++) {
      for (let y = 0; y < roomHeight; y++) {
        points.push({ x, y });
        if (x == roomWidth - 1) {
          points.push({ x: x + 1, y });
        }
        if (y == roomHeight - 1) {
          points.push({ x, y: y + 1 });
        }
        if (x == roomWidth - 1 && y == roomHeight - 1) {
          points.push({ x: x + 1, y: y + 1 });
        }
      }
    }
    setRoomPoints(points);
  }, [roomWidth, roomHeight]);

  useEffect(() => {
    populateCells();
    populatePoints();
  }, [roomWidth, roomHeight, populateCells, populatePoints]);

  return (
    <>
      <div className="absolute top-4 left-4 z-10">
        <Leva fill={true} />
      </div>
      <Canvas
        style={{ height: "100vh", width: "100vw" }}
        camera={{
          position: [
            0,
            roomWidth * roomHeight * 0.5, // height above
            roomHeight / 3, // move back for tilt (was roomHeight / 2 - 0.5)
          ],
          rotation: [-Math.PI / 2.3, 0, 0],
          fov: 50,
        }}
      >
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2.5}
          target={[0, 0, 0]}
          minDistance={Math.max(roomWidth, roomHeight) * 0.5}
          maxDistance={Math.max(roomWidth * roomHeight * 0.3, 10)}
        />
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 10]} intensity={0.8} />
        {/* Main Group */}
        <group position={[-roomWidth / 2 + 0.5, 0, -roomHeight / 2 + 0.5]}>
          {/* Boxes */}
          <GridBoxes
            roomCells={roomCells}
            objects={objects}
            moveObject={moveObject}
            hoveredCell={hoveredCell}
            setHoveredCell={setHoveredCell}
            selectedObjectId={selectedObjectId}
            setSelectedObjectId={setSelectedObjectId}
            setRoomCells={setRoomCells}
          />
          {/* Grid Overlay */}
          <GridOverlay
            roomWidth={roomWidth}
            roomHeight={roomHeight}
            showGrid={showGrid}
            roomPoints={roomPoints}
          />
          {/* Walls */}
          <Walls
            roomWidth={roomWidth}
            roomHeight={roomHeight}
            wallColor={wallColor}
            wallTexture={wallTexture}
          />
          {/* Floor */}
          <Floor
            roomWidth={roomWidth}
            roomHeight={roomHeight}
            floorColor={floorColor}
            floorTexture={floorTexture}
          />
          {/* Objects */}
          {objects.map((object) => (
            <primitive
              key={object.id}
              object={object.model}
              scale={object.scale}
              position={object.position}
              rotation={object.rotation}
              onPointerDown={() => setSelectedObjectId(object.id)}
              visible={
                object.position[0] < roomWidth &&
                object.position[2] < roomHeight
              }
            />
          ))}
        </group>
      </Canvas>
    </>
  );
}
