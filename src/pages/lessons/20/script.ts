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

  const parameters = createUiParams();
  const camera = createCamera();
  const renderer = createRenderer();
  // const textures = createTextures();
  const geometries = createGeometries();
  const clock = new THREE.Clock();

  updateRenderer();

  /**
   * Methods
   */

  function updateRenderer() {
    const elapsedTime = clock.getElapsedTime();

    renderer.render(scene, camera);

    window.requestAnimationFrame(updateRenderer);
  }

  function createCamera() {
    const camera = new THREE.PerspectiveCamera(35, sizes.aspectRatio, 0.1, 100);
    camera.position.z = 6;
    scene.add(camera);

    return camera;
  }

  function createTextures() {
    const textureLoader = new THREE.TextureLoader();
  }

  function createRenderer() {
    const renderer = new THREE.WebGLRenderer({
      canvas,
    });

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
    const cube = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({ color: "#ff0000" })
    );
    scene.add(cube);
  }

  function createUiParams() {
    const params = {
      materialColor: "#ffeded",
    };

    gui.addColor(params, "materialColor");

    return params;
  }
}
