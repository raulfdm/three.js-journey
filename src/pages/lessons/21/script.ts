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

const isBrowser = import.meta.env.SSR === false;

if (isBrowser) {
  const canvas = document.querySelector("canvas") as HTMLCanvasElement;

  if (!canvas) {
    throw new Error("No canvas found");
  }

  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
    get aspectRatio() {
      return sizes.width / sizes.height;
    },
  };

  const scene = new THREE.Scene();

  setResizeEventListeners();

  const world = createWorld();
  const textures = createTextures();
  const lights = createLights();
  const geometries = createGeometries();
  const camera = createCamera();
  const controls = createControls();
  const renderer = createRenderer();
  const clock = new THREE.Clock();

  /**
   * Methods
   */

  let oldElapsedTime = 0;

  updateRenderer();
  function updateRenderer() {
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - oldElapsedTime;
    oldElapsedTime = elapsedTime;

    world.update(deltaTime);

    controls.update();
    renderer.render(scene, camera);

    window.requestAnimationFrame(updateRenderer);
  }

  function createCamera() {
    const camera = new THREE.PerspectiveCamera(75, sizes.aspectRatio, 0.1, 100);
    camera.position.set(-3, 3, 3);
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

    window.addEventListener("dblclick", () => {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        canvas.requestFullscreen();
      }
    });
  }

  function createGeometries() {
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
      return sphere;
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
    }

    return {
      sphere: createSphere(),
      floor: createFloor(),
    };
  }

  function createWorld() {
    const world = new CANNON.World();
    createMaterial();
    const sphere = createSphere();
    const plane = createPlane();

    /**
     * Add gravity
     */
    world.gravity.set(0, -9.82, 0);

    return Object.assign(world, {
      update(deltaTime: number) {
        world.step(1 / 60, deltaTime, 3);

        geometries.sphere.position.set(
          sphere.position.x,
          sphere.position.y,
          sphere.position.z
        );
      },
    });

    function createSphere() {
      const sphereShape = new CANNON.Sphere(0.5);

      const sphereBody = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(0, 3, 0),
        shape: sphereShape,
        // material: materials.plasticMaterial,
      });

      world.addBody(sphereBody);

      return sphereBody;
    }

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

    // function createMaterials() {
    //   const concreteMaterial = new CANNON.Material();
    //   const plasticMaterial = new CANNON.Material();

    //   // describe how both materials should behave when it interacts with each other
    //   const concretePlasticContactMaterial = new CANNON.ContactMaterial(
    //     concreteMaterial,
    //     plasticMaterial,
    //     {
    //       friction: 0.1,
    //       restitution: 0.7, // bounce
    //     }
    //   );

    //   // add the contact material to the world
    //   world.addContactMaterial(concretePlasticContactMaterial);

    //   return {
    //     concreteMaterial,
    //     plasticMaterial,
    //   };
    // }

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
