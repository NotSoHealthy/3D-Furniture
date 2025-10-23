import { forwardRef, useMemo } from "react";
import { Box, useFBX, useGLTF } from "@react-three/drei";
import { RoomObject } from "@/types/objects";
import { FURNITURE_CATALOG } from "@/data/FurnitureCatalog";
import * as THREE from "three";
import { ThreeEvent } from "@react-three/fiber";
import { useRoom } from "@/app/context/RoomProvider";

type FurnitureItemProps = {
  object: RoomObject;
};

const FurnitureItem = forwardRef<THREE.Object3D, FurnitureItemProps>(
  ({ object }, ref) => {
    const catalogObject = FURNITURE_CATALOG.find(
      (item) => item.id === object.catalogId
    );

    const { selectObject } = useRoom();

    const fbxModel = useFBX(
      catalogObject?.type === "fbx"
        ? "/models/" + catalogObject.id + "/model.fbx"
        : "/models/empty.fbx"
    );
    const gltfModel = useGLTF(
      catalogObject?.type === "gltf"
        ? "/models/" + catalogObject.id + "/model.gltf"
        : "/models/empty.glb"
    );

    const glbModel = useGLTF(
      catalogObject?.type === "glb"
        ? "/models/" +
            catalogObject.categoryId +
            "/" +
            catalogObject.id +
            ".glb"
        : "/models/empty.gltf"
    );

    let model: THREE.Object3D | null = null;
    if (catalogObject?.type === "fbx") model = fbxModel;
    else if (catalogObject?.type === "gltf") model = gltfModel.scene;
    else if (catalogObject?.type === "glb") model = glbModel.scene;

    const modelInstance = useMemo(() => {
      if (!model) return null;
      return model.clone();
    }, [model]);

    const dims = useMemo(() => {
      if (!modelInstance || !catalogObject)
        return [1, 1, 1] as [number, number, number];

      modelInstance.updateMatrixWorld(true);
      const box = new THREE.Box3().setFromObject(modelInstance);

      // Apply defaultScale
      const defaultScale = catalogObject.defaultScale || [1, 1, 1];
      const scale = new THREE.Vector3(
        defaultScale[0] || 1,
        defaultScale[1] || 1,
        defaultScale[2] || 1
      );
      const min = box.min.clone().multiply(scale);
      const max = box.max.clone().multiply(scale);
      const size = new THREE.Vector3().subVectors(max, min);

      return [size.x, size.y, size.z] as [number, number, number];
    }, [modelInstance, catalogObject]);

    if (!model || !modelInstance || !catalogObject) return null;

    return (
      <>
        <primitive
          ref={ref}
          object={modelInstance}
          position={object.position}
          rotation={object.rotation}
          scale={catalogObject.defaultScale || [1, 1, 1]}
        />
        <Box
          visible={false}
          args={dims}
          onClick={(e: ThreeEvent<PointerEvent>) => {
            e.stopPropagation();
            selectObject(object.id);
          }}
          position={[object.position[0], dims[1] / 2, object.position[2]]}
          rotation={object.rotation}
        >
          <meshStandardMaterial
            opacity={0.5}
            color={"red"}
            transparent={true}
          />
        </Box>
      </>
    );
  }
);

FurnitureItem.displayName = "FurnitureItem";
export default FurnitureItem;
