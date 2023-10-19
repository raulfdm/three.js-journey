import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import GUI from "lil-gui";

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
    const defaultLightIntensity = 1;
    // Ambient light
    const ambientLight = new THREE.AmbientLight(
      "#ffffff",
      defaultLightIntensity
    );
    gui.add(ambientLight, "intensity").min(0).max(1).step(0.001);
    scene.add(ambientLight);

    // Directional light
    const moonLight = new THREE.DirectionalLight(
      "#ffffff",
      defaultLightIntensity
    );
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
    const house = new THREE.Group();
    scene.add(house);

    const walls = new THREE.Mesh(
      new THREE.BoxGeometry(4, 2.5, 4),
      new THREE.MeshStandardMaterial()
    );
    /**
     * \* 0.5 means half of its height (the other half is already above the floor)
     */
    walls.position.y = walls.geometry.parameters.height * 0.5;
    house.add(walls);

    const ceiling = new THREE.Mesh(
      new THREE.ConeGeometry(3.3, 1.5, 4),
      new THREE.MeshStandardMaterial({
        color: "#b35f45",
      })
    );
    ceiling.position.y =
      walls.geometry.parameters.height +
      ceiling.geometry.parameters.height * 0.5;
    /**
     * Quarter rotation
     */
    ceiling.rotation.y = Math.PI * 0.25;
    house.add(ceiling);

    const door = new THREE.Mesh(
      new THREE.PlaneGeometry(1.5, 1.9, 2),
      new THREE.MeshStandardMaterial({
        color: "#A02B2B",
      })
    );
    /**
     * 0.01 to avoid z-fighting
     */
    door.position.z = walls.geometry.parameters.depth * 0.5 + 0.01;
    door.position.y = door.geometry.parameters.height * 0.5;
    house.add(door);

    const bushMaterial = new THREE.MeshStandardMaterial({
      color: "#3FBF7F",
    });
    const bushGeometry = new THREE.SphereGeometry(1, 16, 16);

    const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
    bush1.scale.set(0.5, 0.5, 0.5);
    bush1.position.set(0.8, 0.2, 2.2);
    house.add(bush1);

    const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
    bush2.scale.set(0.25, 0.25, 0.25);
    bush2.position.set(1.4, 0.1, 2.1);
    house.add(bush2);

    const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
    bush3.scale.set(0.4, 0.4, 0.4);
    bush3.position.set(-0.8, 0.1, 2.2);
    house.add(bush3);

    const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
    bush4.scale.set(0.15, 0.15, 0.15);
    bush4.position.set(-1, 0.05, 2.6);
    house.add(bush4);

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
