"use client";

import { RoomObject } from "@/types/objects";
import React, { createContext, useContext, useState } from "react";

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

  const selectObject = (id: string | null) => {
    if (id) {
      console.log("Selecting object with ID:", id);
    } else {
      console.log("Deselecting object");
    }
    setSelectedObjectId(id);
  };

  const addObject = (obj: RoomObject) => {
    setRoomObjects((prev) => [...prev, obj]);
    selectObject(obj.id);
  };

  function updateObject(id: string, updates: Partial<RoomObject>) {
    setRoomObjects((prev) =>
      prev.map((obj) => (obj.id === id ? { ...obj, ...updates } : obj))
    );
  }

  const removeObject = (id: string) => {
    console.log("Removing object with ID:", id);
    setRoomObjects((prev) => prev.filter((o) => o.id !== id));
    setSelectedObjectId((prev) => (prev === id ? null : prev));
  };

  const toggleTransformMode = () => {
    setTransformMode((prev) => (prev === "translate" ? "rotate" : "translate"));
  };

  return (
    <RoomContext.Provider
      value={{
        roomObjects,
        selectedObjectId,
        addObject,
        updateObject,
        removeObject,
        selectObject,
        transformMode,
        toggleTransformMode,
        setRoomObjects,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};

export const useRoom = () => {
  const ctx = useContext(RoomContext);
  if (!ctx) throw new Error("useRoom must be used within RoomProvider");
  return ctx;
};
