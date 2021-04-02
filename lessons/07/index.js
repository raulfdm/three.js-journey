import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const scene = new THREE.Scene();
const canvasEl = document.querySelector("#scene");

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
  get aspectRatio() {
    return sizes.width / sizes.height;
  },
};

/**
 * Objects
 */

const material = new THREE.MeshBasicMaterial();

const sphere = new THREE.Mesh(
  new THREE.SphereBufferGeometry(0.5, 16, 16),
  material
);

scene.add(sphere);

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75 /* FOV */, sizes.aspectRatio);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

/**
 * Controls
 */
const controls = new OrbitControls(camera, canvasEl);
controls.enableDamping = true;

window.addEventListener("resize", (event) => {
  // Update sizes
  sizes.width = event.target.innerWidth;
  sizes.height = event.target.innerHeight;

  // Update camera
  camera.aspect = sizes.aspectRatio;
  camera.updateProjectionMatrix();

  // update renderer size
  rendered.setSize(sizes.width, sizes.height);
  // Good for transition a window between screens
  rendered.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Renderer
 */
const rendered = new THREE.WebGLRenderer({
  canvas: canvasEl,
});
rendered.setPixelRatio(Math.min(window.devicePixelRatio, 2));
rendered.setSize(sizes.width, sizes.height);

/**
 * Animate / Loop
 */

const clock = new THREE.Clock();

function tick() {
  controls.update();
  const elapsed = clock.getElapsedTime();

  rendered.render(scene, camera);

  window.requestAnimationFrame(tick);
}

tick();
