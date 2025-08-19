import { forwardRef, useEffect, useMemo, useRef } from "react";
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

    const { selectObject, selectedObjectId } = useRoom();

    const fbxModel = useFBX(
      catalogObject?.type === "fbx"
        ? catalogObject.modelUrl + "model.fbx"
        : "/models/empty.fbx"
    );
    const gltfModel = useGLTF(
      catalogObject?.type === "gltf"
        ? catalogObject.modelUrl + "model.gltf"
        : "/models/empty.gltf"
    );

    let model: THREE.Object3D | null = null;
    if (catalogObject?.type === "fbx") model = fbxModel;
    else if (catalogObject?.type === "gltf") model = gltfModel.scene;

    const modelInstance = useMemo(() => {
      if (!model) return null;
      return model.clone();
    }, [model]);

    const helperRef = useRef<THREE.BoxHelper>(null);

    useEffect(() => {
      if (ref && "current" in ref && ref.current && helperRef.current) {
        helperRef.current.setFromObject(ref.current);
      }
    }, [modelInstance, ref]);

    if (!model || !modelInstance || !catalogObject) return null;

    const boundingBox = new THREE.BoxHelper(modelInstance, 0x00ff00);
    return (
      <>
        <primitive
          ref={ref}
          object={modelInstance}
          position={object.position}
          rotation={object.rotation}
          scale={catalogObject.defaultScale}
          onClick={(e: ThreeEvent<PointerEvent>) => {
            e.stopPropagation();
            selectObject(selectedObjectId == object.id ? null : object.id);
          }}
        />
        <primitive
          object={boundingBox}
          ref={helperRef}
          visible={object.showBoundingBox}
        />
        <Box
          visible={object.showBoundingBox}
          args={catalogObject.dimensions}
          position={[
            object.position[0],
            catalogObject.dimensions[1] / 2,
            object.position[2],
          ]}
          rotation={object.rotation}
          raycast={() => null}
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
