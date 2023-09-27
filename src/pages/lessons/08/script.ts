import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import GUI from "lil-gui";

if (typeof window !== "undefined") {
  render();
}

function render() {
  const gui = new GUI();

  const canvas = document.querySelector("canvas") as HTMLCanvasElement;

  if (!canvas) {
    throw new Error("No canvas found");
  }

  const cursor = {
    x: 0,
    y: 0,
  };

  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
    get aspectRatio() {
      return sizes.width / sizes.height;
    },
  };

  window.addEventListener("mousemove", (event) => {
    cursor.x = event.clientX / sizes.width - 0.5;
    cursor.y = event.clientY / sizes.height - 0.5;
  });

  const scene = new THREE.Scene();

  const redCubeGeometry = new THREE.BoxGeometry(1, 1, 1);
  const redMaterial = new THREE.MeshBasicMaterial({ color: "red" });

  const cube = new THREE.Mesh(redCubeGeometry, redMaterial);
  cube.material.wireframe = true;

  scene.add(cube);

  const camera = new THREE.PerspectiveCamera(45, sizes.aspectRatio);
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;

  camera.position.z = 3;
  camera.lookAt(cube.position);

  scene.add(camera);

  const renderer = new THREE.WebGLRenderer({
    canvas,
  });

  renderer.setSize(sizes.width, sizes.height);

  function tick() {
    controls.update();

    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
  }

  tick();
}
