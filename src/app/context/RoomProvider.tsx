"use client";

import { RoomObject } from "@/types/objects";
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type RoomContextType = {
  roomObjects: RoomObject[];
  selectedObjectId: string | null;
  addObject: (obj: RoomObject) => void;
  updateObject: (id: string, updates: Partial<RoomObject>) => void;
  removeObject: (id: string) => void;
  selectObject: (id: string | null) => void;
  transformMode: string;
  toggleTransformMode: () => void;
  setRoomObjects: React.Dispatch<React.SetStateAction<RoomObject[]>>;
  wallTextureId: string;
  setWallTextureId: (id: string) => void;
  floorTextureId: string;
  setFloorTextureId: (id: string) => void;
  roomWidth: number;
  setRoomWidth: (width: number) => void;
  roomHeight: number;
  setRoomHeight: (height: number) => void;
};

const RoomContext = createContext<RoomContextType | undefined>(undefined);

export const RoomProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [roomObjects, setRoomObjects] = useState<RoomObject[]>([]);
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  const [transformMode, setTransformMode] = useState<"translate" | "rotate">(
    "translate"
  );
  const [wallTextureId, setWallTextureId] = useState<string>("1");
  const [floorTextureId, setFloorTextureId] = useState<string>("2145");
  const [roomWidth, setRoomWidth] = useState<number>(5);
  const [roomHeight, setRoomHeight] = useState<number>(4);

  const selectObject = useCallback((id: string | null) => {
    if (id) {
      console.log("Selecting object with ID:", id);
    } else {
      console.log("Deselecting object");
    }
    setSelectedObjectId(id);
  }, []);

  const addObject = useCallback(
    (obj: RoomObject) => {
      setRoomObjects((prev) => [...prev, obj]);
      setTimeout(() => {
        selectObject(obj.id);
      }, 100);
    },
    [selectObject]
  );

  const updateObject = useCallback(
    (id: string, updates: Partial<RoomObject>) => {
      setRoomObjects((prev) =>
        prev.map((obj) => (obj.id === id ? { ...obj, ...updates } : obj))
      );
    },
    []
  );

  const removeObject = useCallback((id: string) => {
    console.log("Removing object with ID:", id);
    setRoomObjects((prev) => prev.filter((o) => o.id !== id));
    setSelectedObjectId((prev) => (prev === id ? null : prev));
  }, []);

  const toggleTransformMode = useCallback(() => {
    setTransformMode((prev) => (prev === "translate" ? "rotate" : "translate"));
  }, []);

  const value = useMemo(
    () => ({
      roomObjects,
      selectedObjectId,
      addObject,
      updateObject,
      removeObject,
      selectObject,
      transformMode,
      toggleTransformMode,
      setRoomObjects,
      wallTextureId,
      setWallTextureId,
      floorTextureId,
      setFloorTextureId,
      roomWidth,
      setRoomWidth,
      roomHeight,
      setRoomHeight,
    }),
    [
      roomObjects,
      selectedObjectId,
      addObject,
      updateObject,
      removeObject,
      selectObject,
      transformMode,
      toggleTransformMode,
      wallTextureId,
      floorTextureId,
      roomWidth,
      roomHeight,
    ]
  );

  return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>;
};

export const useRoom = () => {
  const ctx = useContext(RoomContext);
  if (!ctx) throw new Error("useRoom must be used within RoomProvider");
  return ctx;
};
