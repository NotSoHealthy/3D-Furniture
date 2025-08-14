import { Group, Object3DEventMap } from "three";

export type Object = {
  id: string;
  position: [x: number, y: number, z: number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  model: Group<Object3DEventMap>;
};
