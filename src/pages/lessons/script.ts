import * as THREE from "three";

const scene = new THREE.Scene();

const redCubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const redMaterial = new THREE.MeshBasicMaterial({ color: "red" });

const cube = new THREE.Mesh(redCubeGeometry, redMaterial);

// We need to add to the scene
scene.add(cube);

const sizes = {
  width: 800,
  height: 600,
  get aspectRatio() {
    return sizes.width / sizes.height;
  },
};

const camera = new THREE.PerspectiveCamera(75, sizes.aspectRatio);
camera.position.z = 3;

// We need to add a camera
scene.add(camera);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("canvas") as HTMLCanvasElement,
});

renderer.setSize(sizes.width, sizes.height);

// Render things in the canvas
renderer.render(scene, camera);
