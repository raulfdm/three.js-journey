import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import GUI from "lil-gui";

import doorAlphaImage from "./assets/door/alpha.jpg";
import doorAmbientOcclusionImage from "./assets/door/ambientOcclusion.jpg";
import doorColorImage from "./assets/door/color.jpg";
import doorHeightImage from "./assets/door/height.jpg";
import doorMetalnessImage from "./assets/door/metalness.jpg";
import doorNormalImage from "./assets/door/normal.jpg";
import doorRoughnessImage from "./assets/door/roughness.jpg";
import wallAmbientOcclusionImage from "./assets/bricks/ambientOcclusion.jpg";
import wallColorImage from "./assets/bricks/color.jpg";
import wallNormalImage from "./assets/bricks/normal.jpg";
import wallRoughnessImage from "./assets/bricks/roughness.jpg";

import grassAmbientOcclusionImage from "./assets/grass/ambientOcclusion.jpg";
import grassColorImage from "./assets/grass/color.jpg";
import grassNormalImage from "./assets/grass/normal.jpg";
import grassRoughnessImage from "./assets/grass/roughness.jpg";

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
  const lights = createLights();
  const geometries = createGeometries();
  const camera = createCamera();
  const controls = createControls();
  const renderer = createRenderer();
  const clock = new THREE.Clock();

  /**
   * Shadows
   */
  renderer.activateShadows();
  lights.activateShadows();
  geometries.activateShadows();

  updateRenderer();

  /**
   * Methods
   */

  function updateRenderer() {
    const elapsedTime = clock.getElapsedTime();

    lights.animate(elapsedTime);

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

    const doorLight = new THREE.PointLight("#ff7d46", 1, 7);
    const doorLightHelper = new THREE.PointLightHelper(doorLight);
    doorLightHelper.visible = false;
    scene.add(doorLightHelper);
    doorLight.position.set(0, 1.9, 2.7);

    gui.add(doorLight.position, "x").step(0.01).name("point light x");
    gui.add(doorLight.position, "y").step(0.01).name("point light y");
    gui.add(doorLight.position, "z").step(0.01).name("point light z");
    house.add(doorLight);

    const ghost1 = new THREE.PointLight("#ff00ff", 2, 3);
    scene.add(ghost1);

    const ghost2 = new THREE.PointLight("#00ffff", 2, 3);
    scene.add(ghost2);

    const ghost3 = new THREE.PointLight("#ffff00", 2, 3);
    scene.add(ghost3);

    return {
      animate(elapsedTime: number) {
        const ghost1Angle = elapsedTime * 0.5;
        ghost1.position.x = Math.cos(ghost1Angle) * 4;
        ghost1.position.z = Math.sin(ghost1Angle) * 4;
        ghost1.position.y = Math.sin(elapsedTime * 3);

        const ghost2Angle = -elapsedTime * 0.32;
        ghost2.position.x = Math.cos(ghost2Angle) * 5;
        ghost2.position.z = Math.sin(ghost2Angle) * 5;
        ghost2.position.y =
          Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);

        const ghost3Angle = -elapsedTime * 0.18;
        ghost3.position.x =
          Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32));
        ghost3.position.z =
          Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5));
        ghost3.position.y =
          Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);
      },
      activateShadows() {
        ghost1.castShadow = true;
        ghost2.castShadow = true;
        ghost3.castShadow = true;
        doorLight.castShadow = true;
        moonLight.castShadow = true;

        const DEFAULT_SHADOW_MAP_SIZE = 256;

        /**
         * Optimizations
         */
        moonLight.shadow.mapSize.width = DEFAULT_SHADOW_MAP_SIZE;
        moonLight.shadow.mapSize.height = DEFAULT_SHADOW_MAP_SIZE;
        moonLight.shadow.camera.far = 15;

        doorLight.shadow.mapSize.width = DEFAULT_SHADOW_MAP_SIZE;
        doorLight.shadow.mapSize.height = DEFAULT_SHADOW_MAP_SIZE;
        doorLight.shadow.camera.far = 7;

        ghost1.shadow.mapSize.width = DEFAULT_SHADOW_MAP_SIZE;
        ghost1.shadow.mapSize.height = DEFAULT_SHADOW_MAP_SIZE;
        ghost1.shadow.camera.far = 7;

        ghost2.shadow.mapSize.width = DEFAULT_SHADOW_MAP_SIZE;
        ghost2.shadow.mapSize.height = DEFAULT_SHADOW_MAP_SIZE;
        ghost2.shadow.camera.far = 7;

        ghost3.shadow.mapSize.width = DEFAULT_SHADOW_MAP_SIZE;
        ghost3.shadow.mapSize.height = DEFAULT_SHADOW_MAP_SIZE;
        ghost3.shadow.camera.far = 7;
      },
    };
  }

  function createTextures() {
    const textureLoader = new THREE.TextureLoader();

    const grassAmbientOcclusionTexture = textureLoader.load(
      grassAmbientOcclusionImage.src
    );
    grassAmbientOcclusionTexture.repeat.set(8, 8);
    grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping;
    grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping;

    const grassColorTexture = textureLoader.load(grassColorImage.src);
    grassColorTexture.repeat.set(8, 8);
    grassColorTexture.wrapS = THREE.RepeatWrapping;
    grassColorTexture.wrapT = THREE.RepeatWrapping;

    const grassNormalTexture = textureLoader.load(grassNormalImage.src);
    grassNormalTexture.repeat.set(8, 8);
    grassNormalTexture.wrapS = THREE.RepeatWrapping;
    grassNormalTexture.wrapT = THREE.RepeatWrapping;

    const grassRoughnessTexture = textureLoader.load(grassRoughnessImage.src);
    grassRoughnessTexture.repeat.set(8, 8);
    grassRoughnessTexture.wrapS = THREE.RepeatWrapping;
    grassRoughnessTexture.wrapT = THREE.RepeatWrapping;

    return {
      door: {
        doorAlphaTexture: textureLoader.load(doorAlphaImage.src),
        doorAmbientOcclusionTexture: textureLoader.load(
          doorAmbientOcclusionImage.src
        ),
        doorColorTexture: textureLoader.load(doorColorImage.src),
        doorHeightTexture: textureLoader.load(doorHeightImage.src),
        doorMetalnessTexture: textureLoader.load(doorMetalnessImage.src),
        doorNormalTexture: textureLoader.load(doorNormalImage.src),
        doorRoughnessTexture: textureLoader.load(doorRoughnessImage.src),
      },
      wall: {
        wallAmbientOcclusionTexture: textureLoader.load(
          wallAmbientOcclusionImage.src
        ),
        wallColorTexture: textureLoader.load(wallColorImage.src),
        wallNormalTexture: textureLoader.load(wallNormalImage.src),
        wallRoughnessTexture: textureLoader.load(wallRoughnessImage.src),
      },
      grass: {
        grassAmbientOcclusionTexture,
        grassColorTexture,
        grassNormalTexture,
        grassRoughnessTexture,
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

    return Object.assign(renderer, {
      activateShadows,
    });

    function activateShadows() {
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.shadowMap.enabled = true;
    }
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
      new THREE.MeshStandardMaterial({
        normalMap: textures.wall.wallNormalTexture,
        map: textures.wall.wallColorTexture,
        aoMap: textures.wall.wallAmbientOcclusionTexture,
        roughnessMap: textures.wall.wallRoughnessTexture,
      })
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

    const allBushes = renderBushes();
    const allGraves = renderGraves();

    // Floor
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 20),
      new THREE.MeshStandardMaterial({
        map: textures.grass.grassColorTexture,
        aoMap: textures.grass.grassAmbientOcclusionTexture,
        normalMap: textures.grass.grassNormalTexture,
        roughnessMap: textures.grass.grassRoughnessTexture,
      })
    );
    floor.rotation.x = -Math.PI * 0.5;
    floor.position.y = 0;
    scene.add(floor);

    function renderBushes() {
      const bushMaterial = new THREE.MeshStandardMaterial({
        map: textures.grass.grassColorTexture,
        aoMap: textures.grass.grassAmbientOcclusionTexture,
        normalMap: textures.grass.grassNormalTexture,
        roughnessMap: textures.grass.grassRoughnessTexture,
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

      const allBushes = bushes.map((bushMeasures) => {
        const bush = new THREE.Mesh(bushGeometry, bushMaterial);
        const [scale, position] = bushMeasures;

        const [scaleX, scaleY, scaleZ] = scale;
        const [positionX, positionY, positionZ] = position;
        bush.scale.set(scaleX, scaleY, scaleZ);
        bush.position.set(positionX, positionY, positionZ);
        house.add(bush);

        return bush;
      });

      return allBushes;
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

      const allGraves = Array.from({
        length: 50,
      }).map(() => {
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
        return grave;
      });

      return allGraves;
    }

    return {
      activateShadows() {
        floor.receiveShadow = true;
        walls.castShadow = true;

        allBushes.forEach((bush) => (bush.castShadow = true));
        allGraves.forEach((grave) => (grave.castShadow = true));
      },
    };
  }

  function createFog() {
    const fog = new THREE.Fog("#262837", 2, 15);
    scene.fog = fog;
  }
}
