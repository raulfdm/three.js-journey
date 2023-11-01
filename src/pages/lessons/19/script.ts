import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import GUI from "lil-gui";
import particle1Image from "./_assets/particles/4.png";

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

  const parameters = createUiParams();

  const textures = createTextures();
  const geometries = createGeometries();
  parameters.onFinish(geometries.update);

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
    let particlesMaterial: THREE.PointsMaterial | null = null;
    let particlesGeometry: THREE.BufferGeometry | null = null;
    let particles: THREE.Points | null = null;

    function generateGalaxy() {
      particlesMaterial = new THREE.PointsMaterial({
        size: parameters.particlesSize,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending,
        // alphaMap: textures.particleTexture,
        transparent: true,
        depthWrite: true,
      });

      particlesGeometry = new THREE.BufferGeometry();

      const particlesCount = parameters.amountOfParticles * 3;

      const positions = new Float32Array(particlesCount);

      for (let index = 0; index < particlesCount; index++) {
        const indexBy3 = index * 3;

        const xIndex = indexBy3 + 0;
        const yIndex = indexBy3 + 1;
        const zIndex = indexBy3 + 2;

        positions[xIndex] = (Math.random() - 0.5) * 3;
        positions[yIndex] = (Math.random() - 0.5) * 3;
        positions[zIndex] = (Math.random() - 0.5) * 3;
      }

      particlesGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );

      particles = new THREE.Points(particlesGeometry, particlesMaterial);
      scene.add(particles);
    }

    generateGalaxy();

    return {
      update() {
        if (particles) {
          scene.remove(particles);
        }
        if (particlesGeometry) {
          particlesGeometry.dispose();
        }
        if (particlesMaterial) {
          particlesMaterial.dispose();
        }

        generateGalaxy();
      },
    };
  }

  function createUiParams() {
    const params = {
      amountOfParticles: 1000,
      particlesSize: 0.04,
    };

    const amountGui = gui
      .add(params, "amountOfParticles")
      .name("Amount of Parameters")
      .min(100)
      .max(100_000)
      .step(100);

    const sizeGui = gui
      .add(params, "particlesSize")
      .name("Particle Size")
      .min(0.001)
      .max(0.1)
      .step(0.001);

    function onFinish(cb: () => void) {
      amountGui.onFinishChange(cb);
      sizeGui.onFinishChange(cb);
    }

    const result = Object.assign(params, {
      onFinish,
    });

    return result;
  }
}
