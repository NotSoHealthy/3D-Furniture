import { CatalogObject } from "@/types/objects";

export const CATEGORIES = [
  {
    id: "beds",
    name: "Beds",
    icon: "cat_beds.svg",
  },
  {
    id: "chairs",
    name: "Chairs",
    icon: "cat_chairs.svg",
  },
  {
    id: "couches",
    name: "Couches",
    icon: "cat_couches.svg",
  },
  {
    id: "desks",
    name: "Desks",
    icon: "cat_desks.svg",
  },
  {
    id: "closets",
    name: "Closets",
    icon: "cat_closets.svg",
  },
];

export const FURNITURE_CATALOG: CatalogObject[] = [
  {
    id: "chair",
    name: "Chair",
    type: "glb",
    categoryId: "chairs",
    defaultScale: [1, 1, 1],
    defaultRotation: [0, 3.14159, 0],
    defaultOffset: [0, 0, 0],
    dimensions: [0.425, 1, 0.51],
  },
  {
    id: "bed",
    name: "Bed",
    type: "glb",
    categoryId: "beds",
    defaultScale: [1, 1, 1],
    defaultRotation: [0, 0, 0],
    defaultOffset: [0.5, 0, 0.7],
    dimensions: [1.8, 1.168, 2.18],
  },
];
