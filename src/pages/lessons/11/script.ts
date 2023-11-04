import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import GUI from "lil-gui";

import doorColor from "./_assets/textures/door/color.jpg";

if (typeof window !== "undefined") {
  render();
}

function render() {
  const canvas = document.querySelector("canvas") as HTMLCanvasElement;

  if (!canvas) {
    throw new Error("No canvas found");
  }

  /**
   * TEXTURES
   */
  const loadingManager = new THREE.LoadingManager();
  const textureLoader = new THREE.TextureLoader(loadingManager);
  // const texture = textureLoader.load(checkerboardImage.src);

  // const texture = textureLoader.load(doorColorTexture.src);
  const texture = textureLoader.load(doorColor.src);
  texture.generateMipmaps = false;
  texture.minFilter = THREE.NearestFilter;
  texture.magFilter = THREE.NearestFilter;

  // doorColorLoadedTexture.rotation = Math.PI * 0.25;
  // doorColorLoadedTexture.center.y = 0.5;
  // doorColorLoadedTexture.center.x = 0.5;

  // doorColorLoadedTexture.offset.x = 0.5;
  // doorColorLoadedTexture.offset.y = 0.5;

  // doorColorLoadedTexture.repeat.x = 3;
  // doorColorLoadedTexture.repeat.y = 2;
  // doorColorLoadedTexture.wrapS = THREE.RepeatWrapping;
  // doorColorLoadedTexture.wrapT = THREE.RepeatWrapping;

  // const doorNormaLoadedTexture = textureLoader.load(doorNormalTexture.src);

  loadingManager.onProgress = () => console.log("progress");
  loadingManager.onLoad = () => console.log("load");
  loadingManager.onError = () => console.log("error");

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

  const redCubeGeometry = new THREE.BoxGeometry(1, 1, 1);

  const redMaterial = new THREE.MeshBasicMaterial({
    map: texture,
  });
  const cube = new THREE.Mesh(redCubeGeometry, redMaterial);

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
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  function tick() {
    controls.update();

    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
  }

  tick();
}
