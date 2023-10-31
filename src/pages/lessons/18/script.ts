import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import GUI from "lil-gui";
import particle1Image from "./_assets/particles/2.png";

if (typeof window !== "undefined") {
  render();
}

function render() {
  THREE.ColorManagement.enabled = false;
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

  const textures = createTextures();
  const lights = createLights();
  const geometries = createGeometries();
  const camera = createCamera();
  const controls = createControls();
  const renderer = createRenderer();
  const clock = new THREE.Clock();

  updateRenderer();

  /**
   * Methods
   */

  function updateRenderer() {
    const elapsedTime = clock.getElapsedTime();

    controls.update();
    renderer.render(scene, camera);

    window.requestAnimationFrame(updateRenderer);
  }

  function createCamera() {
    const camera = new THREE.PerspectiveCamera(75, sizes.aspectRatio, 0.1, 100);
    camera.position.z = 3;
    scene.add(camera);

    return camera;
  }

  function createControls() {
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;

    return controls;
  }

  function createLights() {}

  function createTextures() {
    const textureLoader = new THREE.TextureLoader();
    const particleTexture = textureLoader.load(particle1Image.src);

    return {
      particleTexture,
    };
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
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.2,
      sizeAttenuation: true,
      // color: "red",
    });

    // particlesMaterial.map = textures.particleTexture;
    particlesMaterial.alphaMap = textures.particleTexture;
    particlesMaterial.transparent = true;
    // particlesMaterial.alphaTest = 0.01;
    // particlesMaterial.depthTest = false;
    particlesMaterial.depthWrite = false;

    // const particlesGeometry = new THREE.SphereGeometry(1, 32, 32);

    const particlesAmount = 5000 * 3;
    const positions = new Float32Array(particlesAmount);
    const colors = new Float32Array(particlesAmount);

    for (let index = 0; index < particlesAmount; index++) {
      positions[index] = (Math.random() - 0.5) * 10;
      colors[index] = Math.random();
    }

    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );

    particlesGeometry.setAttribute(
      "color",
      new THREE.BufferAttribute(colors, 3)
    );

    const particle = new THREE.Points(particlesGeometry, particlesMaterial);
    particlesMaterial.vertexColors = true;

    scene.add(particle);

    const cube = new THREE.Mesh(
      new THREE.BoxGeometry(),
      new THREE.MeshBasicMaterial()
    );

    scene.add(cube);
  }
}
