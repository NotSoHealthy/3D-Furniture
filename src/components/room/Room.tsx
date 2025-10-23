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
import { OBB } from "three/examples/jsm/Addons.js";
import { OBBHelper } from "./OBBHelper";

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
    roomWidth,
    roomHeight,
  } = useRoom();
  const [roomCells, setRoomCells] = useState<Cell[]>([]);
  const [roomPoints, setRoomPoints] = useState<GridPoint[]>([]);
  const [hoveredCell, setHoveredCell] = useState<number | null>(null);
  const { showGrid } = SidePanel();

  const objectRefs = useRef<{ [id: string]: THREE.Object3D | null }>({});

  function setObjectRef(id: string) {
    return (ref: THREE.Object3D | null) => {
      if (ref) objectRefs.current[id] = ref;
      else delete objectRefs.current[id];

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

  function ensureOBB(object: THREE.Object3D) {
    if (!object.userData.originalObb) {
      // Get bounding box in world space
      const worldBox = new THREE.Box3().setFromObject(object);

      // Extract size & center in world space
      const size = new THREE.Vector3();
      worldBox.getSize(size);
      const center = new THREE.Vector3();
      worldBox.getCenter(center);

      // Convert world center back to local space
      const localCenter = center
        .clone()
        .applyMatrix4(new THREE.Matrix4().copy(object.matrixWorld).invert());

      // Save local-space OBB
      object.userData.originalObb = new OBB(
        localCenter,
        size.multiplyScalar(0.5)
      );
      object.userData.obb = object.userData.originalObb.clone();
    }
  }

  function updateOBB(object: THREE.Object3D) {
    object.userData.obb.copy(object.userData.originalObb);
    object.userData.obb.applyMatrix4(object.matrixWorld);
  }

  function updateOBBHelper(
    object: THREE.Object3D,
    scene: THREE.Scene,
    isColliding: boolean
  ) {
    if (!object.userData.obb) return;

    if (!object.userData.helper) {
      const helper = new OBBHelper(object.userData.obb, 0xff0000); // red for collision
      object.userData.helper = helper;
      scene.add(helper);
    }

    object.userData.helper.obb = object.userData.obb;
    object.userData.helper.update();

    object.userData.helper.visible = isColliding;
  }

  function checkCollisions() {
    const collisions = new Set<string>();
    const entries = Object.entries(objectRefs.current);

    // First, compute OBBs
    for (const [, ref] of entries) {
      if (!ref) continue;
      ensureOBB(ref);
      updateOBB(ref);
    }

    // Then check collisions
    for (let i = 0; i < entries.length; i++) {
      const [idA, refA] = entries[i];
      if (!refA) continue;

      for (let j = i + 1; j < entries.length; j++) {
        const [idB, refB] = entries[j];
        if (!refB) continue;

        if (refA.userData.obb.intersectsOBB(refB.userData.obb)) {
          collisions.add(idA);
          collisions.add(idB);
        }
      }
    }

    // Update helpers only for collided objects
    for (const [id, ref] of entries) {
      if (!ref) continue;
      updateOBBHelper(ref, ref.parent as THREE.Scene, collisions.has(id));
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
        <Leva fill={true} hidden={true} collapsed={true} />
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
        shadows
        gl={{ antialias: true }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
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
        <ambientLight color={0xffffff} intensity={0.5} />
        {/* <directionalLight position={[10, 10, 10]} intensity={0.8} /> */}
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
        <Walls />
        <Floor />
        {/* Objects */}
        {roomObjects.map((object) => (
          <FurnitureItem
            key={object.id}
            ref={setObjectRef(object.id)}
            object={object}
          />
        ))}
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
      </Canvas>
    </>
  );
}
