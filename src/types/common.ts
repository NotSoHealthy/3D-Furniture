export type Cell = {
  position: [x: number, y: number, z: number];
  filled: boolean;
};

export type GridPoint = { x: number; y: number };

export type WallTexture = {
  id: string;
  name: string;
  url: string;
};

export type FloorTexture = {
  id: string;
  name: string;
  url: string;
};
