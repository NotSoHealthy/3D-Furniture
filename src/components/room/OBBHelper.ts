import * as THREE from "three";
import { OBB } from "three/examples/jsm/Addons.js";

export class OBBHelper extends THREE.LineSegments {
  obb: OBB;

  constructor(obb: OBB, color = 0x00ff00) {
    const geometry = new THREE.EdgesGeometry(new THREE.BoxGeometry(1, 1, 1));
    const material = new THREE.LineBasicMaterial({ color });
    super(geometry, material);

    this.obb = obb;
    this.matrixAutoUpdate = false;
    this.update();
  }

  update() {
    const { center, halfSize, rotation } = this.obb;

    // Build a transform from rotation + scale + translation
    const rotMat = new THREE.Matrix4().setFromMatrix3(rotation);
    const scaleMat = new THREE.Matrix4().makeScale(
      halfSize.x * 2,
      halfSize.y * 2,
      halfSize.z * 2
    );
    const transMat = new THREE.Matrix4().makeTranslation(
      center.x,
      center.y,
      center.z
    );

    this.matrix
      .identity()
      .multiply(transMat)
      .multiply(rotMat)
      .multiply(scaleMat);
  }
}
