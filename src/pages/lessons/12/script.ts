import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import GUI from "lil-gui";

import doorAlpha from "@/assets/textures/door/alpha.jpg";
// import doorAmbient from "@/assets/textures/door/ambientOcclusion.jpg";

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

  const textureLoader = new THREE.TextureLoader();

  // const doorAmbientOcclusionTexture = textureLoader.load(
  //   doorAmbientOcclusion.src
  // );
  const doorBaseColorTexture = textureLoader.load(doorAlpha.src);
  // const doorHeightTexture = textureLoader.load(doorHeight.src);
  // const doorMetallicTexture = textureLoader.load(doorMetallic.src);
  // const doorNormalTexture = textureLoader.load(doorNormal.src);
  // const doorOpacityTexture = textureLoader.load(doorOpacity.src);
  // const doorRoughnessTexture = textureLoader.load(doorRoughness.src);

  const material = new THREE.MeshBasicMaterial({
    map: doorBaseColorTexture,
  });

  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    material
  );
  sphere.position.x = -1.5;

  const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 16, 32),
    material
  );
  torus.position.x = 1.5;

  const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material);

  scene.add(plane, torus, sphere);

  const camera = new THREE.PerspectiveCamera(45, sizes.aspectRatio);
  scene.add(camera);
  camera.position.z = -5;

  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;

  const renderer = new THREE.WebGLRenderer({
    canvas,
  });

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const clock = new THREE.Clock();
  function tick() {
    animateMaterials();
    controls.update();

    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
  }

  function animateMaterials() {
    const elapsedTime = clock.getElapsedTime();

    plane.rotation.y = elapsedTime * 0.1;
    sphere.rotation.y = elapsedTime * 0.1;
    torus.rotation.y = elapsedTime * 0.1;

    plane.rotation.x = elapsedTime * 0.15;
    sphere.rotation.x = elapsedTime * 0.15;
    torus.rotation.x = elapsedTime * 0.15;
  }

  tick();
}
