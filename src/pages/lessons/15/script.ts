import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RectAreaLightHelper } from "three/addons/helpers/RectAreaLightHelper.js";
import GUI from "lil-gui";

if (typeof window !== "undefined") {
  render();
}

function render() {
  const canvas = document.querySelector("canvas") as HTMLCanvasElement;

  if (!canvas) {
    throw new Error("No canvas found");
  }

  const gui = new GUI();

  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
    get aspectRatio() {
      return sizes.width / sizes.height;
    },
  };

  window.addEventListener("resize", () => {
    // Update the sizes
    sizes.height = window.innerHeight;
    sizes.width = window.innerWidth;

    // Update the camera
    camera.aspect = sizes.aspectRatio;
    camera.updateProjectionMatrix();

    // Update the renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

  window.addEventListener("dblclick", () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      canvas.requestFullscreen();
    }
  });

  const scene = new THREE.Scene();

  /**
   * Lights
   */
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  gui.add(ambientLight, "intensity").min(0).max(1).step(0.001);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight.castShadow = true;
  directionalLight.position.set(2, 2, -1);
  gui.add(directionalLight, "intensity").min(0).max(1).step(0.001);
  gui.add(directionalLight.position, "x").min(-5).max(5).step(0.001);
  gui.add(directionalLight.position, "y").min(-5).max(5).step(0.001);
  gui.add(directionalLight.position, "z").min(-5).max(5).step(0.001);
  scene.add(directionalLight);

  const directionalLightHelper = new THREE.DirectionalLightHelper(
    directionalLight
  );
  scene.add(directionalLightHelper);

  /**
   * Geometries
   */

  const material = new THREE.MeshStandardMaterial();
  material.roughness = 0.7;
  gui.add(material, "metalness").min(0).max(1).step(0.001);
  gui.add(material, "roughness").min(0).max(1).step(0.001);

  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.6, 32, 16),
    material
  );
  sphere.castShadow = true;
  scene.add(sphere);

  const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
  plane.receiveShadow = true;
  plane.rotation.x = -Math.PI * 0.5;
  plane.position.y = -1;
  scene.add(plane);

  const camera = new THREE.PerspectiveCamera(75, sizes.aspectRatio, 0.1, 100);
  camera.position.x = 1;
  camera.position.y = 1;
  camera.position.z = 2;

  scene.add(camera);

  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;

  const renderer = new THREE.WebGLRenderer({
    canvas,
  });
  renderer.shadowMap.enabled = true;

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  function tick() {
    controls.update();

    renderer.render(scene, camera);

    window.requestAnimationFrame(tick);
  }

  tick();
}
