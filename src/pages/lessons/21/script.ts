import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import GUI from "lil-gui";
import * as CANNON from "cannon-es";
import mapPx from "./_assets/textures/environmentMaps/0/px.png";
import mapNx from "./_assets/textures/environmentMaps/0/nx.png";
import mapPy from "./_assets/textures/environmentMaps/0/py.png";
import mapNy from "./_assets/textures/environmentMaps/0/ny.png";
import mapPz from "./_assets/textures/environmentMaps/0/pz.png";
import mapNz from "./_assets/textures/environmentMaps/0/nz.png";
<<<<<<< Updated upstream
import { createSphere, type Sphere } from "./createSphere";
import { createFloor } from "./createFloor";
import { createBox, type Box } from "./createBox";
=======
import * as CANNON from "cannon-es";
>>>>>>> Stashed changes

const isBrowser = import.meta.env.SSR === false;

if (isBrowser) {
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

<<<<<<< Updated upstream
  const world = createWorld();
=======
  const world = new CANNON.World();
  world.gravity.set(0, -9.82, 0);

>>>>>>> Stashed changes
  const textures = createTextures();
  const lights = createLights();
  const geometries = createGeometries();
  const camera = createCamera();
  const controls = createControls();
  const renderer = createRenderer();
  const clock = new THREE.Clock();

<<<<<<< Updated upstream
  gui.add(geometries, "createNewSphere");
  gui.add(geometries, "createNewBox");
=======
  let previousElapsedTime = 0;

  updateRenderer();
>>>>>>> Stashed changes

  /**
   * Methods
   */
<<<<<<< Updated upstream

  let oldElapsedTime = 0;

  updateRenderer();
  function updateRenderer() {
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - oldElapsedTime;
    oldElapsedTime = elapsedTime;

    world.update(deltaTime);
=======
  function updateRenderer() {
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - previousElapsedTime;
    previousElapsedTime = elapsedTime;

    world.step(1 / 60, deltaTime, 3);

    geometries.sphere.mesh.position.copy(
      geometries.sphere.body.position as any
    );
>>>>>>> Stashed changes

    controls.update();
    renderer.render(scene, camera);

    window.requestAnimationFrame(updateRenderer);
  }

  function createCamera() {
    const camera = new THREE.PerspectiveCamera(75, sizes.aspectRatio, 0.1, 100);
    camera.position.set(-6, 6, 6);
    scene.add(camera);

    return camera;
  }

  function createControls() {
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;

    return controls;
  }

  function createLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.1);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.set(1024, 1024);
    directionalLight.shadow.camera.far = 15;
    directionalLight.shadow.camera.left = -7;
    directionalLight.shadow.camera.top = 7;
    directionalLight.shadow.camera.right = 7;
    directionalLight.shadow.camera.bottom = -7;
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
  }

  function createTextures() {
    const textureLoader = new THREE.TextureLoader();
    const cubeTextureLoader = new THREE.CubeTextureLoader();

    const environmentMapTexture = cubeTextureLoader.load([
      mapPx.src,
      mapNx.src,
      mapPy.src,
      mapNy.src,
      mapPz.src,
      mapNz.src,
    ]);

    return {
      environmentMapTexture,
    };
  }

  function createRenderer() {
    const renderer = new THREE.WebGLRenderer({
      canvas,
    });

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

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

    // window.addEventListener("dblclick", () => {
    //   if (document.fullscreenElement) {
    //     document.exitFullscreen();
    //   } else {
    //     canvas.requestFullscreen();
    //   }
    // });
  }

  function createGeometries() {
<<<<<<< Updated upstream
    const geometries: (Box | Sphere)[] = [
      createSphere({
        radius: 0.5,
        texture: textures.environmentMapTexture,
        position: {
          x: 0,
          z: 0,
          y: 3,
        },
      }),
    ];

    updateGeometries();

    const floor = createFloor({ texture: textures.environmentMapTexture });
    scene.add(floor);

    return {
      animateAll() {
        geometries.forEach((sphere) => sphere.animate());
      },
      createNewSphere() {
        const sphere = createSphere({
          radius: Math.random() * 0.5,
          texture: textures.environmentMapTexture,
          position: {
            x: (Math.random() - 0.5) * 3,
            y: 3,
            z: (Math.random() - 0.5) * 3,
          },
        });

        geometries.push(sphere);
        updateGeometries();
      },
      createNewBox() {
        const box = createBox({
          position: {
            x: (Math.random() - 0.5) * 3,
            y: 3,
            z: (Math.random() - 0.5) * 3,
          },
          width: Math.random(),
          height: Math.random(),
          depth: Math.random(),
          texture: textures.environmentMapTexture,
        });

        geometries.push(box);
        updateGeometries();
      },
=======
    const defaultMaterial = new CANNON.Material("defaultMaterial");

    const defaultContactMaterial = new CANNON.ContactMaterial(
      defaultMaterial,
      defaultMaterial,
      {
        friction: 0.1,
        restitution: 0.7,
      }
    );
    world.defaultContactMaterial = defaultContactMaterial;

    function createSphere() {
      const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(0.5, 32, 32),
        new THREE.MeshStandardMaterial({
          metalness: 0.3,
          roughness: 0.4,
          envMap: textures.environmentMapTexture,
          envMapIntensity: 0.5,
        })
      );
      sphere.castShadow = true;
      sphere.position.y = 0.5;
      scene.add(sphere);

      const sphereShape = new CANNON.Sphere(0.5);
      const sphereBody = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(0, 3, 0),
        shape: sphereShape,
      });

      sphereBody.applyLocalForce(
        new CANNON.Vec3(150, 0, 0),
        new CANNON.Vec3(0, 0, 0)
      );

      world.addBody(sphereBody);

      return {
        mesh: sphere,
        body: sphereBody,
      };
    }

    function createFloor() {
      const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(10, 10),
        new THREE.MeshStandardMaterial({
          color: "#777777",
          metalness: 0.3,
          roughness: 0.4,
          envMap: textures.environmentMapTexture,
          envMapIntensity: 0.5,
        })
      );
      floor.receiveShadow = true;
      floor.rotation.x = -Math.PI * 0.5;
      scene.add(floor);

      const floorShape = new CANNON.Plane();
      const floorBody = new CANNON.Body({
        mass: 0,
        shape: floorShape,
      });

      floorBody.quaternion.setFromAxisAngle(
        new CANNON.Vec3(-1, 0, 0),
        Math.PI * 0.5
      );

      world.addBody(floorBody);
    }

    return {
      sphere: createSphere(),
      floor: createFloor(),
>>>>>>> Stashed changes
    };

    function updateGeometries() {
      geometries.forEach((sphere) => {
        scene.add(sphere.object);
        world.addBody(sphere.body);
      });
    }
  }

  function createWorld() {
    const world = new CANNON.World();
    createMaterial();
    const plane = createPlane();

    /**
     * Add gravity
     */
    world.gravity.set(0, -9.82, 0);

    return Object.assign(world, {
      update(deltaTime: number) {
        geometries.animateAll();
        world.step(1 / 60, deltaTime, 3);
      },
    });

    function createPlane() {
      const floorShape = new CANNON.Plane();

      const floorBody = new CANNON.Body({
        mass: 0, // it's static and cannot move
        shape: floorShape,
        quaternion: new CANNON.Quaternion().setFromAxisAngle(
          new CANNON.Vec3(-1, 0, 0),
          Math.PI * 0.5
        ),
        // material: materials.concreteMaterial,
      });

      world.addBody(floorBody);
    }

    function createMaterial() {
      const defaultMaterial = new CANNON.Material();
      const defaultContactMaterial = new CANNON.ContactMaterial(
        defaultMaterial,
        defaultMaterial,
        {
          friction: 0.1,
          restitution: 0.7, // bounce
        }
      );

      world.defaultContactMaterial = defaultContactMaterial;
    }
  }
}
