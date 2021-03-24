import * as THREE from "three";
import gsap from "gsap";

console.log(gsap);

const scene = new THREE.Scene();

// MESH
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: "#f0a" });
const mesh = new THREE.Mesh(geometry, material);

// scene.add(new THREE.AxesHelper());
// mesh.position.z = 1;
// mesh.position.x = -1;

// mesh.scale.z = 1;
// mesh.scale.x = 0.5;
// we need to add the Mesh into the scene
// mesh.rotation.reorder("YXZ");
// mesh.rotation.x = Math.PI * 0.2;
// mesh.rotation.y = Math.PI * 0.5;

scene.add(mesh);

// Sizes
const sizes = {
  width: 800,
  height: 600,
  get aspectRatio() {
    return sizes.width / sizes.width;
  },
};

// Camera (Point Of View)
const fov = 75; // field of view (deg)
const camera = new THREE.PerspectiveCamera(fov, sizes.aspectRatio);

camera.position.z = 3;

// camera.lookAt(mesh.position);

// we also need to add to the scene
scene.add(camera);

const rendered = new THREE.WebGLRenderer({
  canvas: document.querySelector("#scene"),
});

// Resize it
rendered.setSize(sizes.width, sizes.height);

// Adding scene and camera
// rendered.render(scene, camera);

// Animations

gsap.to(mesh.position, { x: 2, duration: 1, delay: 1 });
gsap.to(mesh.position, { x: 0, duration: 1, delay: 2 });
gsap.to(mesh.position, { x: -2, duration: 1, delay: 3 });
// LOOP

const clock = new THREE.Clock();

function tick() {
  const elapsed = clock.getElapsedTime();

  // mesh.position.y = Math.sin(elapsed);
  // mesh.position.x = Math.cos(elapsed);

  rendered.render(scene, camera);

  window.requestAnimationFrame(tick);
}

tick();