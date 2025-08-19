export type CatalogObject = {
  id: string;
  name: string;
  modelUrl: string;
  type: "fbx" | "gltf";
  category: string;
  defaultScale: [number, number, number];
  defaultRotation: [number, number, number];
  defaultOffset: [number, number, number];
  dimensions: [number, number, number];
};

export type RoomObject = {
  id: string;
  catalogId: string;
  position: [number, number, number];
  rotation: [number, number, number];
  showBoundingBox: boolean;
};
