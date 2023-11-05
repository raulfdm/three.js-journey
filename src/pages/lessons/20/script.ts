import * as THREE from "three";
import GUI from "lil-gui";
import gradientImage from "./_assets/textures/gradients/3.jpg";

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
  createLight();
  const textures = createTextures();
  const geometries = createGeometries();
  const clock = new THREE.Clock();

  updateRenderer();

  /**
   * Methods
   */

  function updateRenderer() {
    const elapsedTime = clock.getElapsedTime();

    renderer.render(scene, camera);
    geometries.animate(elapsedTime);

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
    mesh1.position.y = parameters.materialDistance * 0;

    const mesh2 = new THREE.Mesh(
      new THREE.ConeGeometry(1, 2, 32),
      sharedMaterial
    );
    mesh2.position.y = parameters.materialDistance * 1;

    const mesh3 = new THREE.Mesh(
      new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
      sharedMaterial
    );
    mesh3.position.y = parameters.materialDistance * 2;

    scene.add(mesh1, mesh2, mesh3);

    return {
      animate: (elapsedTime: number) => {
        mesh1.rotation.y = elapsedTime * 0.1;
        mesh2.rotation.y = elapsedTime * 0.1;
        mesh3.rotation.y = elapsedTime * 0.1;

        mesh1.rotation.x = elapsedTime * 0.12;
        mesh2.rotation.x = elapsedTime * 0.12;
        mesh3.rotation.x = elapsedTime * 0.12;
      },
    };
  }

  function createUiParams() {
    type OnChangeColorCb = (color: string) => void;

    const observers: OnChangeColorCb[] = [];

    const params = {
      materialColor: "#ffeded",
      materialDistance: 4,
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
}