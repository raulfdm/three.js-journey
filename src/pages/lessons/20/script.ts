import * as THREE from "three";
import GUI from "lil-gui";
import gsap from "gsap";
import gradientImage from "./_assets/textures/gradients/3.jpg";

const canvas = document.querySelector("canvas") as HTMLCanvasElement;

if (!canvas) {
  throw new Error("No canvas found");
}

const gui = new GUI();

const scene = new THREE.Scene();

setResizeEventListeners();
setScrollEventListener();
setCursorEventListener();

const parameters = createParameters();
const camera = createCamera();
const renderer = createRenderer();
createLight();
const textures = createTextures();
const geometries = createGeometries();
const clock = new THREE.Clock();

let previousTime = 0;
let frame = 0;

updateRenderer();

/**
 * Methods
 */

function updateRenderer() {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;

  previousTime = elapsedTime;

  renderer.render(scene, camera);
  geometries.animate(elapsedTime);
  camera.animate(deltaTime);

  window.requestAnimationFrame(updateRenderer);
}

function createCamera() {
  const cameraGroup = new THREE.Group();
  scene.add(cameraGroup);

  const camera = new THREE.PerspectiveCamera(
    35,
    parameters.sizes.aspectRatio,
    0.1,
    100
  );
  camera.position.z = 6;
  cameraGroup.add(camera);

  return Object.assign(camera, {
    animate(deltaFrameTime: number) {
      /**
       * only the scrollY / the screen height would move
       */
      const amountToScroll =
        (parameters.scrollY / parameters.sizes.height) *
        parameters.materialDistance;

      camera.position.y = -amountToScroll;

      const parallaxX = parameters.cursor.x;
      const parallaxY = -parameters.cursor.y;

      cameraGroup.position.x +=
        (parallaxX - cameraGroup.position.x) * deltaFrameTime * 2;

      cameraGroup.position.y +=
        (parallaxY - cameraGroup.position.y) * deltaFrameTime * 2;
    },
  });
}

function createTextures() {
  const textureLoader = new THREE.TextureLoader();

  const gradientTexture = textureLoader.load(gradientImage.src);
  gradientTexture.magFilter = THREE.NearestFilter;

  return {
    gradientTexture,
  };
}

function createRenderer() {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
  });

  renderer.setSize(parameters.sizes.width, parameters.sizes.height);
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
}

function createGeometries() {
  const baseX = 2;

  const sharedMaterial = new THREE.MeshToonMaterial({
    gradientMap: textures.gradientTexture,
    color: parameters.materialColor,
  });

  parameters.setOnColorChange((nextColor: string) => {
    sharedMaterial.color.set(nextColor);
  });

  const mesh1 = new THREE.Mesh(
    new THREE.TorusGeometry(1, 0.4, 16, 60),
    sharedMaterial
  );
  mesh1.position.y = -parameters.materialDistance * 0;
  mesh1.position.x = -baseX;

  const mesh2 = new THREE.Mesh(
    new THREE.ConeGeometry(1, 2, 32),
    sharedMaterial
  );
  mesh2.position.y = -parameters.materialDistance * 1;
  mesh2.position.x = baseX;

  const mesh3 = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
    sharedMaterial
  );
  mesh3.position.y = -parameters.materialDistance * 2;
  mesh3.position.x = -baseX;

  const meshes = [mesh1, mesh2, mesh3];

  scene.add(...meshes, createParticles());

  return {
    animate(elapsedTime: number) {
      // mesh1.rotation.y = elapsedTime * 0.1;
      // mesh2.rotation.y = elapsedTime * 0.1;
      // mesh3.rotation.y = elapsedTime * 0.1;

      // mesh1.rotation.x = elapsedTime * 0.12;
      // mesh2.rotation.x = elapsedTime * 0.12;
      // mesh3.rotation.x = elapsedTime * 0.12;

      console.log("DIFFERENT?");
      if (parameters.currentSection !== parameters.previousSection) {
        gsap.to(meshes[parameters.currentSection], {
          duration: 1.5,
          ease: "power2.inOut",
        });
      }
    },
  };

  function createParticles() {
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.02,
      sizeAttenuation: true,
      color: parameters.materialColor,
    });

    particlesMaterial.depthWrite = false;

    const particlesAmount = 200 * 3;
    const particlesPosition = new Float32Array(particlesAmount);

    for (let index = 0; index < particlesAmount; index++) {
      const xIndex = index * 3 + 0;
      const yIndex = index * 3 + 1;
      const zIndex = index * 3 + 2;

      const maxHeightPosition = parameters.materialDistance * meshes.length;

      particlesPosition[xIndex] = (Math.random() - 0.5) * 10;
      particlesPosition[yIndex] =
        parameters.materialDistance * 0.5 - Math.random() * maxHeightPosition;
      particlesPosition[zIndex] = (Math.random() - 0.5) * 10;
    }

    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(particlesPosition, 3)
    );

    /**
     * Subscribe to the color change to force
     */
    parameters.setOnColorChange((nextColor: string) => {
      particlesMaterial.color.set(nextColor);
    });

    return new THREE.Points(particlesGeometry, particlesMaterial);
  }
}

function createParameters() {
  type OnChangeColorCb = (color: string) => void;

  const observers: OnChangeColorCb[] = [];

  const params = {
    materialColor: "#ffeded",
    materialDistance: 4,
    scrollY: window.scrollY,
    previousSection: 0,
    currentSection: 0,
    sizes: {
      width: window.innerWidth,
      height: window.innerHeight,
      get aspectRatio() {
        return params.sizes.width / params.sizes.height;
      },
    },
    cursor: {
      x: 0,
      y: 0,
    },
  };

  const colorHandlers = gui.addColor(params, "materialColor");

  colorHandlers.onChange((color: string) => {
    params.materialColor = color;
  });

  return Object.assign(params, {
    setOnColorChange: (cb: OnChangeColorCb) => {
      observers.push(cb);

      colorHandlers.onChange((color: string) => {
        observers.forEach((observer) => observer(color));
      });

      return () => {
        const index = observers.indexOf(cb);
        observers.splice(index, 1);
      };
    },
  });
}

function createLight() {
  const directionalLight = new THREE.DirectionalLight("#ffffff", 3);
  directionalLight.position.set(1, 1, 0);

  scene.add(directionalLight);
}

function setScrollEventListener() {
  window.addEventListener("scroll", () => {
    parameters.scrollY = window.scrollY;
    parameters.previousSection = parameters.currentSection;
    parameters.currentSection = Math.round(
      parameters.scrollY / parameters.sizes.height
    );
  });
}

function setCursorEventListener() {
  window.addEventListener("mousemove", (event) => {
    /**
     * -0.5 make to sure to from -0.5 to 0.5 (1 unit)
     */
    parameters.cursor.x = event.clientX / parameters.sizes.width - 0.5;
    parameters.cursor.y = event.clientY / parameters.sizes.height - 0.5;
  });
}
