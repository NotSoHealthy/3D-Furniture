"use client";
import { Slider } from "@/components/ui/slider";
import {
  OrbitControls,
  Line,
  Points,
  Point,
  PointMaterial,
  Box,
  Plane,
  useFBX,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useCallback, useEffect, useState } from "react";
import { Group, Object3DEventMap } from "three";

export default function Home() {
  type Cell = { x: number; y: number; filled: boolean };
  type Point = { x: number; y: number };
  type MyObject = {
    position: [number, number, number];
    rotation?: [number, number, number];
    scale?: [number, number, number];
    model: Group<Object3DEventMap>;
  };

  const initialObjects: MyObject[] = [
    {
      position: [0, 0, 0],
      rotation: [0, Math.PI, 0],
      scale: [0.01, 0.01, 0.01],
      model: useFBX("/models/chair/source/Chair.fbx"),
    },
    // Add more objects here
  ];

  const [objects, setObjects] = useState<MyObject[]>(initialObjects);
  const [selectedObjectIndex, setSelectedObjectIndex] = useState<number | null>(
    null
  );
  const [roomCells, setRoomCells] = useState<Cell[]>([]);
  const [roomPoints, setRoomPoints] = useState<Point[]>([]);
  const [hoveredCell, setHoveredCell] = useState<number | null>(null);
  const [roomDimensions, setRoomDimensions] = useState<[number, number]>([
    5, 4,
  ]);

  const populateCells = useCallback(() => {
    const cells: Cell[] = [];
    for (let x = 0; x < roomDimensions[0]; x++) {
      for (let y = 0; y < roomDimensions[1]; y++) {
        cells.push({ x, y, filled: false });
      }
    }
    setRoomCells(cells);
  }, [roomDimensions]);

  const populatePoints = useCallback(() => {
    const points: Point[] = [];
    for (let x = 0; x < roomDimensions[0]; x++) {
      for (let y = 0; y < roomDimensions[1]; y++) {
        points.push({ x, y });
        if (x == roomDimensions[0] - 1) {
          points.push({ x: x + 1, y });
        }
        if (y == roomDimensions[1] - 1) {
          points.push({ x, y: y + 1 });
        }
        if (x == roomDimensions[0] - 1 && y == roomDimensions[1] - 1) {
          points.push({ x: x + 1, y: y + 1 });
        }
      }
    }
    setRoomPoints(points);
  }, [roomDimensions]);

  useEffect(() => {
    populateCells();
    populatePoints();
  }, [roomDimensions, populateCells, populatePoints]);

  return (
    <>
      <div className="absolute top-4 left-4 z-10 w-[280px] bg-[#1D1D1D] text-white rounded-lg shadow-lg p-6 space-y-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-200">
          Room Dimensions
        </h3>

        {/* Room Width */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300 flex justify-between">
            Width (meters)
            <span className="text-blue-400">{roomDimensions[0]}m</span>
          </label>
          <Slider
            value={[roomDimensions[0]]}
            onValueChange={(value) =>
              setRoomDimensions([value[0], roomDimensions[1]])
            }
            min={1}
            max={20}
            step={1}
            className="w-full"
          />
        </div>

        {/* Room Height */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300 flex justify-between">
            Length (meters)
            <span className="text-blue-400">{roomDimensions[1]}m</span>
          </label>
          <Slider
            value={[roomDimensions[1]]}
            onValueChange={(value) =>
              setRoomDimensions([roomDimensions[0], value[0]])
            }
            min={1}
            max={20}
            step={1}
            className="w-full"
          />
        </div>

        {/* Info */}
        <div className="text-xs text-gray-400">
          Room size: {roomDimensions[0]}m x {roomDimensions[1]}m<br />
          Grid cells: {roomDimensions[0]} x {roomDimensions[1]}
          <br />
          Each cell: 1m x 1m
        </div>

        {/* Reset Button */}
        <button
          onClick={() => {
            setRoomDimensions([5, 4]);
          }}
          className="w-full bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded transition-colors duration-200"
        >
          Reset to 5m × 4m
        </button>
      </div>
      <Canvas
        style={{ height: "100vh", width: "100vw" }}
        camera={{
          position: [
            0,
            Math.max(roomDimensions[0], roomDimensions[1]) * 1.5, // height above
            Math.max(roomDimensions[0], roomDimensions[1]) * 1.5, // offset back for angle
          ],
          fov: 50,
        }}
        // onMouseDown={() => {
        //   if (selectedObject) {
        //     setSelectedObject(null);
        //   }
        // }}
      >
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2.5}
          target={[0, 0, 0]}
          minDistance={Math.max(roomDimensions[0], roomDimensions[1]) * 0.5}
          maxDistance={Math.max(roomDimensions[0], roomDimensions[1]) * 3}
        />
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 10]} intensity={0.8} />
        {/* Lines */}
        <group
          position={[-roomDimensions[0] / 2, 0.01, -roomDimensions[1] / 2]}
        >
          {Array.from({ length: roomDimensions[0] + 1 }).map((_, x) => (
            <Line
              key={`v-${x}`}
              points={[
                [x, 0, 0],
                [x, 0, roomDimensions[1]],
              ]}
              color="#6f6f6f"
              lineWidth={1}
            />
          ))}
          {Array.from({ length: roomDimensions[1] + 1 }).map((_, z) => (
            <Line
              key={`h-${z}`}
              points={[
                [0, 0, z],
                [roomDimensions[0], 0, z],
              ]}
              color="#6f6f6f"
              lineWidth={1}
            />
          ))}
        </group>
        {/* Points */}
        <Points
          position={[-roomDimensions[0] / 2, 0.01, -roomDimensions[1] / 2]}
        >
          {roomPoints.map((point, index) => (
            <Point
              key={index}
              position={[point.x, 0, point.y]}
              color={"#FF0000"}
            />
          ))}
          <PointMaterial
            transparent
            vertexColors
            size={8}
            sizeAttenuation={false}
            depthWrite={false}
          />
        </Points>
        {/* Boxes */}
        <group
          position={[
            0.5 - roomDimensions[0] / 2,
            0,
            0.5 - roomDimensions[1] / 2,
          ]}
        >
          {roomCells.map((cell, index) => (
            <Box
              key={index}
              args={[1, 0, 1]}
              position={[cell.x, 0, cell.y]}
              material-color={hoveredCell === index ? "orange" : "hotpink"}
              onPointerOver={() => {
                setHoveredCell(index);
                if (selectedObjectIndex !== null) {
                  setObjects((prev) =>
                    prev.map((obj, i) =>
                      i === selectedObjectIndex
                        ? { ...obj, position: [cell.x - 2, 0, cell.y - 1.5] }
                        : obj
                    )
                  );
                }
              }}
              onPointerOut={() => {
                setHoveredCell(null);
              }}
              onPointerDown={() => {
                if (selectedObjectIndex !== null) {
                  setSelectedObjectIndex(null);
                }
              }}
            />
          ))}
        </group>
        <group>
          {/* Left Wall */}
          <Plane
            args={[roomDimensions[1], 2, 1]}
            position={[-roomDimensions[0] / 2, 1, 0]}
            rotation={[0, Math.PI / 2, 0]}
            material-color="#1D1D1D"
          />
          {/* Front Wall */}
          <Plane
            args={[2, roomDimensions[0], 1]}
            position={[0, 1, -roomDimensions[1] / 2]}
            rotation={[0, 0, Math.PI / 2]}
            material-color="#1D1D1D"
          />
          {/* Right Wall */}
          <Plane
            args={[roomDimensions[1], 2, 1]}
            position={[roomDimensions[0] / 2, 1, 0]}
            rotation={[0, -Math.PI / 2, 0]}
            material-color="#1D1D1D"
          />
          {/* Back Wall */}
          <Plane
            args={[2, roomDimensions[0], 1]}
            position={[0, 1, roomDimensions[1] / 2]}
            rotation={[0, Math.PI, Math.PI / 2]}
            material-color="#1D1D1D"
          />
        </group>
        {objects.map((obj, i) => (
          <primitive
            key={i}
            object={obj.model}
            scale={obj.scale}
            position={obj.position}
            rotation={obj.rotation}
            onPointerDown={() => setSelectedObjectIndex(i)}
          />
        ))}
      </Canvas>
    </>
  );
}
