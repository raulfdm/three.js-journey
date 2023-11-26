import * as THREE from "three";
import * as CANNON from "cannon-es";

type CreateSphereOptions = {
  radius: number;
  texture: THREE.CubeTexture;
  position: {
    x: number;
    y: number;
    z: number;
  };
};

const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
const sphereMaterial = new THREE.MeshStandardMaterial({
  metalness: 0.3,
  roughness: 0.4,
  // envMap: texture,
  envMapIntensity: 0.5,
});

export function createSphere({
  radius,
  texture,
  position,
}: CreateSphereOptions) {
  /**
   * Three.js World
   */
  sphereMaterial.envMap = texture;

  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  /**
   * Because the sphere has a default size of 1, we scale it to the radius
   * we want, making possible to create spheres with different sizes.
   *
   * This technique allow us to use the same geometry for all spheres but for
   * different sizes.
   */
  sphere.scale.set(radius, radius, radius);

  sphere.castShadow = true;
  sphere.position.copy(position as any);

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
  sphereBody.position.copy(position as any);

  sphereBody.applyLocalForce(
    new CANNON.Vec3(150, 0, 0), // when it gets rendered, force it to X axis
    new CANNON.Vec3(0, 0, 0) // at the center of the sphere
  );

  return {
    object: sphere,
    body: sphereBody,
    animate() {
      // windEffect();

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

export type Sphere = ReturnType<typeof createSphere>;
