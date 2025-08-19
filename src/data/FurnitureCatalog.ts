import { CatalogObject } from "@/types/objects";

export const FURNITURE_CATALOG: CatalogObject[] = [
  {
    id: "chair",
    name: "Chair",
    modelUrl: "/models/chair/",
    type: "fbx",
    category: "seating",
    defaultScale: [0.01, 0.01, 0.01],
    defaultRotation: [0, 3.14159, 0],
    defaultOffset: [0, 0, 0],
    dimensions: [0.425, 1, 0.51],
  },
  {
    id: "bed",
    name: "Bed",
    modelUrl: "/models/bed/",
    type: "gltf",
    category: "sleeping",
    defaultScale: [1, 1, 1],
    defaultRotation: [0, 0, 0],
    defaultOffset: [0.5, 0, 0.7],
    dimensions: [1.8, 1.168, 2.18],
  },
];
