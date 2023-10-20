import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import GUI from "lil-gui";

import doorAlphaImage from "./assets/door/alpha.jpg";
import doorAmbientOcclusionImage from "./assets/door/ambientOcclusion.jpg";
import doorColorImage from "./assets/door/color.jpg";
import doorHeightImage from "./assets/door/height.jpg";
import doorMetalnessImage from "./assets/door/metalness.jpg";
import doorNormalImage from "./assets/door/normal.jpg";
import doorRoughness from "./assets/door/roughness.jpg";

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
  const house = new THREE.Group();

  setResizeEventListeners();

  createFog();
  const textures = createTextures();
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
    const moonLightColor = "#b9d5ff";
    const defaultLightIntensity = 0.4;
    // Ambient light
    const ambientLight = new THREE.AmbientLight(
      moonLightColor,
      defaultLightIntensity
    );
    gui.add(ambientLight, "intensity").min(0).max(1).step(0.001);
    scene.add(ambientLight);

    // Directional light
    const moonLight = new THREE.DirectionalLight(
      moonLightColor,
      defaultLightIntensity
    );
    moonLight.position.set(4, 5, -2);
    gui.add(moonLight, "intensity").min(0).max(1).step(0.001);
    gui.add(moonLight.position, "x").min(-5).max(5).step(0.001);
    gui.add(moonLight.position, "y").min(-5).max(5).step(0.001);
    gui.add(moonLight.position, "z").min(-5).max(5).step(0.001);
    scene.add(moonLight);

    const pointLight = new THREE.PointLight("#ff7d46", 1, 7);
    const pointLightHelper = new THREE.PointLightHelper(pointLight);
    pointLightHelper.visible = false;
    scene.add(pointLightHelper);
    pointLight.position.set(0, 1.9, 2.7);

    gui.add(pointLight.position, "x").step(0.01).name("point light x");
    gui.add(pointLight.position, "y").step(0.01).name("point light y");
    gui.add(pointLight.position, "z").step(0.01).name("point light z");
    house.add(pointLight);
  }

  function createTextures() {
    const textureLoader = new THREE.TextureLoader();

    const doorAlphaTexture = textureLoader.load(doorAlphaImage.src);
    const doorAmbientOcclusionTexture = textureLoader.load(
      doorAmbientOcclusionImage.src
    );
    const doorColorTexture = textureLoader.load(doorColorImage.src);
    const doorHeightTexture = textureLoader.load(doorHeightImage.src);
    const doorMetalnessTexture = textureLoader.load(doorMetalnessImage.src);
    const doorNormalTexture = textureLoader.load(doorNormalImage.src);
    const doorRoughnessTexture = textureLoader.load(doorRoughness.src);

    return {
      door: {
        doorAlphaTexture,
        doorAmbientOcclusionTexture,
        doorColorTexture,
        doorHeightTexture,
        doorMetalnessTexture,
        doorNormalTexture,
        doorRoughnessTexture,
      },
    };
  }

  function createRenderer() {
    const renderer = new THREE.WebGLRenderer({
      canvas,
    });
    renderer.outputColorSpace = THREE.LinearSRGBColorSpace;

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    /**
     * To stop seeing the black parts out of our scene
     */
    renderer.setClearColor(scene.fog!.color);

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
    scene.add(house);

    const walls = new THREE.Mesh(
      new THREE.BoxGeometry(4, 2.1, 4),
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
      new THREE.PlaneGeometry(1.9, 1.9, 100, 100),
      new THREE.MeshStandardMaterial({
        map: textures.door.doorColorTexture,
        transparent: true,
        alphaMap: textures.door.doorAlphaTexture,
        normalMap: textures.door.doorNormalTexture,
        metalnessMap: textures.door.doorMetalnessTexture,
        roughnessMap: textures.door.doorRoughnessTexture,
        aoMap: textures.door.doorAmbientOcclusionTexture,
        displacementMap: textures.door.doorHeightTexture,
        displacementScale: 0.1,
      })
    );
    /**
     * 0.01 to avoid z-fighting
     */
    door.position.z = walls.geometry.parameters.depth * 0.5 + 0.01;
    door.position.y = door.geometry.parameters.height * 0.45;
    house.add(door);

    renderBushes();
    renderGraves();

    // Floor
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 20),
      new THREE.MeshStandardMaterial({ color: "#a9c388" })
    );
    floor.rotation.x = -Math.PI * 0.5;
    floor.position.y = 0;
    scene.add(floor);

    function renderBushes() {
      const bushMaterial = new THREE.MeshStandardMaterial({
        color: "#3FBF7F",
      });

      const bushes: [
        [scaleX: number, scaleY: number, scaleZ: number],
        [positionX: number, positionY: number, positionZ: number],
      ][] = [
        [
          [0.5, 0.5, 0.5],
          [0.8, 0.2, 2.2],
        ],
        [
          [0.25, 0.25, 0.25],
          [1.4, 0.1, 2.1],
        ],
        [
          [0.4, 0.4, 0.4],
          [-0.8, 0.1, 2.2],
        ],
        [
          [0.15, 0.15, 0.15],
          [-1, 0.05, 2.6],
        ],
      ];

      const bushGeometry = new THREE.SphereGeometry(1, 16, 16);

      for (const bushMeasures of bushes) {
        const bush = new THREE.Mesh(bushGeometry, bushMaterial);
        const [scale, position] = bushMeasures;

        const [scaleX, scaleY, scaleZ] = scale;
        const [positionX, positionY, positionZ] = position;
        bush.scale.set(scaleX, scaleY, scaleZ);
        bush.position.set(positionX, positionY, positionZ);
        house.add(bush);
      }
    }

    function renderGraves() {
      const graveWidth = 0.4;
      const graveHeight = 0.8;
      const graveDepth = 0.2;

      const graves = new THREE.Group();
      scene.add(graves);

      const graveMaterial = new THREE.MeshStandardMaterial();
      const graveGeometry = new THREE.BoxGeometry(
        graveWidth,
        graveHeight,
        graveDepth
      );

      for (let index = 0; index < 50; index++) {
        const grave = new THREE.Mesh(graveGeometry, graveMaterial);

        /**
         * We want a random angle in a circle
         * 1- PI is half-rotation, we want a full rotation (360)
         * 2- random value
         */
        const angle = Math.PI * 2 * Math.random();
        /**
         * around the house radious
         */
        const radius = 3 + Math.random() * 6.5;

        /**
         * "* 6" is a magic number move the graves out the house area
         */
        const x = Math.sin(angle) * radius;
        /**
         * We move the object all the way up from the ground.
         *
         * "-0.1" is because we rotate the grave in the z axis, it needs to give
         * the feeling it's "buried" in the ground
         */
        const y = graveHeight / 2 - 0.1;
        const z = Math.cos(angle) * radius;

        grave.position.set(x, y, z);

        grave.rotation.z = (Math.random() - 0.5) * 0.3;
        grave.rotation.y = (Math.random() - 0.5) * 0.3;

        graves.add(grave);
      }
    }
  }

  function createFog() {
    const fog = new THREE.Fog("#262837", 2, 15);
    scene.fog = fog;
  }
}
