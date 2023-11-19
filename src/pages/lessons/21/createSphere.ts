import * as THREE from "three";
import * as CANNON from "cannon-es";

type CreateSphereOptions = {
  radius: number;
  texture: THREE.CubeTexture;
};

export function createSphere({ radius, texture }: CreateSphereOptions) {
  /**
   * Three.js World
   */
  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(radius, 32, 32),
    new THREE.MeshStandardMaterial({
      metalness: 0.3,
      roughness: 0.4,
      envMap: texture,
      envMapIntensity: 0.5,
    })
  );
  sphere.castShadow = true;
  sphere.position.y = 0.5;

  /**
   * Physics World
   */
  const sphereShape = new CANNON.Sphere(0.5);
  const sphereBody = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(0, 3, 0),
    shape: sphereShape,
    // material: materials.plasticMaterial,
  });

  sphereBody.applyLocalForce(
    new CANNON.Vec3(150, 0, 0), // when it gets rendered, force it to X axis
    new CANNON.Vec3(0, 0, 0) // at the center of the sphere
  );

  return {
    object: sphere,
    body: sphereBody,
    animate() {
      windEffect();

      sphere.position.set(
        sphereBody.position.x,
        sphereBody.position.y,
        sphereBody.position.z
      );

      function windEffect() {
        sphereBody.applyForce(new CANNON.Vec3(-0.5, 0, 0), sphereBody.position);
      }
    },
  };
}
