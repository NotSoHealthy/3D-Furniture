"use client";
import SidePanel from "@/components/room/SidePanel";
import { OrbitControls, TransformControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useCallback, useEffect, useRef, useState } from "react";
import { Leva } from "leva";
import { Cell, GridPoint } from "@/types/common";
import { Walls } from "@/components/room/Walls";
import { Floor } from "@/components/room/Floor";
import GridBoxes from "@/components/room/GridBoxes";
import { GridOverlay } from "@/components/room/GridOverlay";
import * as THREE from "three";
import { useRoom } from "@/app/context/RoomProvider";
import FurnitureItem from "./FurnitureItem";

const INITIAL_WIDTH = 5;
const INITIAL_HEIGHT = 4;
const initialRoomCenter = [
  INITIAL_WIDTH / 2 - 0.5,
  0,
  INITIAL_HEIGHT / 2 - 0.5,
];

export default function Room() {
  const {
    roomObjects,
    selectedObjectId,
    selectObject,
    updateObject,
    transformMode,
    toggleTransformMode,
    removeObject,
    setRoomObjects,
  } = useRoom();
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

  const objectRefs = useRef<{ [id: string]: THREE.Object3D | null }>({});

  function setObjectRef(id: string) {
    return (ref: THREE.Object3D | null) => {
      if (ref) objectRefs.current[id] = ref;
      else delete objectRefs.current[id];
      // optional: run full check when object mounts/unmounts
      requestAnimationFrame(() => checkCollisions());
    };
  }

  const selectedRef = selectedObjectId
    ? objectRefs.current[selectedObjectId]
    : null;

  const populateCells = useCallback(() => {
    const cells: Cell[] = [];
    for (let x = 0; x < roomWidth; x++) {
      for (let y = 0; y < roomHeight; y++) {
        cells.push({ position: [x, 0, y], filled: false });
      }
    }
    setRoomCells(cells);
  }, [roomWidth, roomHeight]);

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

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") selectObject(null);
      if (e.key.toLowerCase() === "r") toggleTransformMode();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Delete" || e.key === "Backspace") {
        if (selectedObjectId) removeObject(selectedObjectId);
        checkCollisions();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selectedObjectId]);

  const lastCollisions = useRef<Set<string>>(new Set());

  function checkCollisions() {
    const boxA = new THREE.Box3();
    const boxB = new THREE.Box3();
    const collisions = new Set<string>();
    const entries = Object.entries(objectRefs.current);

    for (let i = 0; i < entries.length; i++) {
      const [idA, refA] = entries[i];
      if (!refA) continue;

      boxA.setFromObject(refA);

      for (let j = i + 1; j < entries.length; j++) {
        const [idB, refB] = entries[j];
        if (!refB) continue;

        boxB.setFromObject(refB);

        if (boxA.intersectsBox(boxB)) {
          // updateObject(idA, { showBoundingBox: true });
          // updateObject(idB, { showBoundingBox: true });
          collisions.add(idA);
          collisions.add(idB);
        }
      }
    }
    if (
      collisions.size !== lastCollisions.current.size ||
      [...collisions].some((id) => !lastCollisions.current.has(id))
    ) {
      lastCollisions.current = new Set(collisions);
      setRoomObjects((prev) =>
        prev.map((obj) => ({
          ...obj,
          showBoundingBox: collisions.has(obj.id),
        }))
      );
    }
  }

  const collisionRaf = useRef<number | null>(null);

  function debouncedCheck() {
    if (collisionRaf.current) cancelAnimationFrame(collisionRaf.current);
    collisionRaf.current = requestAnimationFrame(() => {
      checkCollisions();
      collisionRaf.current = null;
    });
  }

  return (
    <>
      <div className="absolute top-4 left-4 z-10">
        <Leva fill={true} collapsed={true} />
      </div>
      <Canvas
        camera={{
          position: [
            roomWidth * 0.5, // center x
            roomWidth * roomHeight * 0.5, // height above
            roomHeight * 0.5 + 2, // move back for tilt (was roomHeight / 2 - 0.5)
          ],
          rotation: [-Math.PI / 2.3, 0, 0],
          fov: 50,
        }}
        onPointerMissed={() => {
          if (selectedObjectId) selectObject(null);
        }}
      >
        <OrbitControls
          target={[initialRoomCenter[0], 0, initialRoomCenter[2]]}
          makeDefault={true}
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2.05}
          minDistance={Math.max(roomWidth, roomHeight) * 0.5}
          maxDistance={Math.max(roomWidth * roomHeight * 0.3, 10)}
        />
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 10]} intensity={0.8} />
        {/* Boxes */}
        <GridBoxes
          roomCells={roomCells}
          hoveredCell={hoveredCell}
          setHoveredCell={setHoveredCell}
          showGrid={showGrid}
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
        {selectedRef && (
          <TransformControls
            mode={transformMode === "rotate" ? "rotate" : "translate"}
            showX={transformMode === "rotate" ? false : true}
            showY={transformMode === "rotate" ? true : false}
            showZ={transformMode === "rotate" ? false : true}
            object={selectedRef}
            onObjectChange={() => {
              debouncedCheck();
              updateObject(selectedObjectId!, {
                position: [
                  selectedRef.position.x,
                  selectedRef.position.y,
                  selectedRef.position.z,
                ],
                rotation: [
                  selectedRef.rotation.x,
                  selectedRef.rotation.y,
                  selectedRef.rotation.z,
                ],
              });
            }}
          />
        )}
        {/* Objects */}
        {roomObjects.map((object) => (
          <FurnitureItem
            key={object.id}
            ref={setObjectRef(object.id)}
            object={object}
          />
        ))}
      </Canvas>
    </>
  );
}
