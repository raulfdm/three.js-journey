import * as THREE from "three";
import * as CANNON from "cannon-es";

type CreateSphereOptions = {
  // size: number;
  width: number;
  height: number;
  depth: number;
  texture: THREE.CubeTexture;
  position: {
    x: number;
    y: number;
    z: number;
  };
};

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({
  metalness: 0.3,
  roughness: 0.4,
});

export function createBox({
  texture,
  position,
  depth,
  height,
  width,
}: CreateSphereOptions) {
  /**
   * Three.js World
   */
  material.envMap = texture;

  const box = new THREE.Mesh(geometry, material);
  box.scale.set(width, height, depth);

  box.castShadow = true;
  box.position.copy(position as any);

  /**
   * Physics World
   */
  const boxShape = new CANNON.Box(
    new CANNON.Vec3(width * 0.5, height * 0.5, depth * 0.5)
  );
  const boxBody = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(0, 0.3, 0),
    shape: boxShape,
  });

  boxBody.position.copy(position as any);

  boxBody.applyLocalForce(
    new CANNON.Vec3(150, 0, 0), // when it gets rendered, force it to X axis
    new CANNON.Vec3(0, 0, 0) // at the center of the sphere
  );

  return {
    object: box,
    body: boxBody,
    animate() {
      box.position.copy(boxBody.position as any);
      box.quaternion.copy(boxBody.quaternion as any);
    },
  };
}

export type Box = ReturnType<typeof createBox>;
