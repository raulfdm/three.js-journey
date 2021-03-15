import * as THREE from "three";

const scene = new THREE.Scene();

// MESH
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: "#f0a" });
const mesh = new THREE.Mesh(geometry, material);

// we need to add the Mesh into the scene
scene.add(mesh);

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
  get aspectRatio() {
    return sizes.width / sizes.width;
  },
};

// Camera (Point Of View)
const fov = 75; // field of view (deg)
const camera = new THREE.PerspectiveCamera(fov, sizes.aspectRatio);

camera.position.z = 3;
// camera.position.y = 1;
camera.position.x = -1;

// we also need to add to the scene
scene.add(camera);

const rendered = new THREE.WebGLRenderer({
  canvas: document.querySelector("#scene"),
});

// Resize it
rendered.setSize(sizes.width, sizes.height);

// Adding scene and camera
rendered.render(scene, camera);
