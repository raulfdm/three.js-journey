import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const scene = new THREE.Scene();

const canvasEl = document.querySelector("#scene");

const cursorCoordinates = {
  x: 0,
  y: 0,
};

// MESH
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: "#f0a" });
const mesh = new THREE.Mesh(geometry, material);

scene.add(mesh);

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
  get aspectRatio() {
    return sizes.width / sizes.height;
  },
};

// Camera (Point Of View)
const fov = 75; // field of view (deg)
const camera = new THREE.PerspectiveCamera(fov, sizes.aspectRatio);
const controls = new OrbitControls(camera, canvasEl);
controls.enableDamping = true;

camera.position.z = 3;
camera.lookAt(mesh.position);

// we also need to add to the scene
scene.add(camera);

const rendered = new THREE.WebGLRenderer({
  canvas: canvasEl,
});

// Enforcing max pixel ratio of 2 (retina)
rendered.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Resize it
rendered.setSize(sizes.width, sizes.height);

// Adding scene and camera
// rendered.render(scene, camera);

// LOOP

const clock = new THREE.Clock();

function tick() {
  controls.update();
  const elapsed = clock.getElapsedTime();

  rendered.render(scene, camera);

  window.requestAnimationFrame(tick);
}

tick();

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

window.addEventListener("dblclick", () => {
  if (document.fullscreenElement) {
    console.log("exit fullscreen");
    document.exitFullscreen();
  } else {
    canvasEl.requestFullscreen();
    console.log("fullscreen");
  }
});
