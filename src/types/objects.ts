export type Category = {
  id: string;
  name: string;
  icon: string;
};

export type CatalogObject = {
  id: string;
  name: string;
  type: "fbx" | "gltf" | "glb";
  categoryId: string;
  defaultScale?: [number, number, number];
  defaultRotation: [number, number, number];
  defaultOffset: [number, number, number];
};

export type RoomObject = {
  id: string;
  catalogId: string;
  position: [number, number, number];
  rotation: [number, number, number];
  showBoundingBox: boolean;
};
