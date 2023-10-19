import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
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

  const scene = new THREE.Scene();

  setResizeEventListeners();

  const allTextures = createTextures();
  createLights();
  const geometries = createGeometries();
  const camera = createCamera();
  const controls = createControls();
  const renderer = createRenderer();
  updateRenderer();

  /**
   * Methods
   */

  function updateRenderer() {
    controls.update();
    renderer.render(scene, camera);

    window.requestAnimationFrame(updateRenderer);
  }

  function createCamera() {
    const camera = new THREE.PerspectiveCamera(75, sizes.aspectRatio, 0.1, 100);
    camera.position.x = 4;
    camera.position.y = 2;
    camera.position.z = 5;
    scene.add(camera);

    return camera;
  }

  function createControls() {
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;

    return controls;
  }

  function createLights() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight("#ffffff", 0.5);
    gui.add(ambientLight, "intensity").min(0).max(1).step(0.001);
    scene.add(ambientLight);

    // Directional light
    const moonLight = new THREE.DirectionalLight("#ffffff", 0.5);
    moonLight.position.set(4, 5, -2);
    gui.add(moonLight, "intensity").min(0).max(1).step(0.001);
    gui.add(moonLight.position, "x").min(-5).max(5).step(0.001);
    gui.add(moonLight.position, "y").min(-5).max(5).step(0.001);
    gui.add(moonLight.position, "z").min(-5).max(5).step(0.001);
    scene.add(moonLight);
  }

  function createTextures() {
    const textureLoader = new THREE.TextureLoader();
  }

  function createRenderer() {
    const renderer = new THREE.WebGLRenderer({
      canvas,
    });
    renderer.outputColorSpace = THREE.LinearSRGBColorSpace;

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    return renderer;
  }

  function setResizeEventListeners() {
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
  }

  function createGeometries() {
    // Temporary sphere
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(1, 32, 32),
      new THREE.MeshStandardMaterial({ roughness: 0.7 })
    );
    sphere.position.y = 1;
    scene.add(sphere);

    // Floor
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 20),
      new THREE.MeshStandardMaterial({ color: "#a9c388" })
    );
    floor.rotation.x = -Math.PI * 0.5;
    floor.position.y = 0;
    scene.add(floor);
  }
}
