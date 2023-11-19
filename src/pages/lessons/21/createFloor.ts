import * as THREE from "three";

type CreateFloorOptions = {
  texture: THREE.CubeTexture;
};

export function createFloor({ texture }: CreateFloorOptions) {
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
      color: "#777777",
      metalness: 0.3,
      roughness: 0.4,
      envMap: texture,
      envMapIntensity: 0.5,
    })
  );
  floor.receiveShadow = true;
  floor.rotation.x = -Math.PI * 0.5;

  return floor;
}
