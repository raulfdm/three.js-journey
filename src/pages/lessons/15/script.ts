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
  createLights();
  createGeometries();
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
    camera.position.x = 1;
    camera.position.y = 1;
    camera.position.z = 2;

    scene.add(camera);

    return camera;
  }

  function createControls() {
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;

    return controls;
  }

  function createLights() {
    const DEFAULT_LIGHT_INTENSITY = 0.5;
    renderAmbientLight();
    renderDirectionalLight();
    renderSpotLight();

    function renderAmbientLight() {
      const ambientLight = new THREE.AmbientLight(
        0xffffff,
        DEFAULT_LIGHT_INTENSITY
      );
      gui.add(ambientLight, "intensity").min(0).max(1).step(0.001);
      scene.add(ambientLight);
    }

    function renderDirectionalLight() {
      const directionalLight = new THREE.DirectionalLight(
        0xffffff,
        DEFAULT_LIGHT_INTENSITY
      );

      directionalLight.position.set(2, 2, -1);
      directionalLight.castShadow = true;

      /**
       * Shadow map optimization
       */
      directionalLight.shadow.mapSize.width = 1024;
      directionalLight.shadow.mapSize.height = 1024;

      directionalLight.shadow.camera.top = 2;
      directionalLight.shadow.camera.right = 2;
      directionalLight.shadow.camera.bottom = -5;
      directionalLight.shadow.camera.left = -2;
      directionalLight.shadow.camera.near = 1;
      directionalLight.shadow.camera.far = 6;

      // directionalLight.shadow.radius = 10;

      gui.add(directionalLight, "intensity").min(0).max(1).step(0.001);
      gui.add(directionalLight.position, "x").min(-5).max(5).step(0.001);
      gui.add(directionalLight.position, "y").min(-5).max(5).step(0.001);
      gui.add(directionalLight.position, "z").min(-5).max(5).step(0.001);

      const directionalLightHelper = new THREE.DirectionalLightHelper(
        directionalLight
      );

      directionalLightHelper.visible = false;

      const directionalLightCameraHelper = new THREE.CameraHelper(
        directionalLight.shadow.camera
      );
      directionalLightCameraHelper.visible = false;

      scene.add(
        directionalLight,
        directionalLightHelper,
        directionalLightCameraHelper
      );
    }

    function renderSpotLight() {
      const spotLight = new THREE.SpotLight(0xffffff, 5, 10, Math.PI * 0.3);
      // enable shadow
      spotLight.castShadow = true;

      // optimizations
      spotLight.shadow.mapSize.width = 1024;
      spotLight.shadow.mapSize.height = 1024;

      spotLight.shadow.camera.near = 1;
      spotLight.shadow.camera.far = 6;
      spotLight.shadow.camera.fov = 30;

      spotLight.position.set(0, 2, 2);

      const spotLightHelper = new THREE.SpotLightHelper(spotLight);
      spotLightHelper.visible = false;

      const spotLightCameraHelper = new THREE.CameraHelper(
        spotLight.shadow.camera
      );
      // spotLightCameraHelper.visible = false;

      // add everything to the scene
      scene.add(
        spotLight,
        spotLight.target,
        spotLightHelper,
        spotLightCameraHelper
      );
    }
  }

  function createRenderer() {
    const renderer = new THREE.WebGLRenderer({
      canvas,
    });
    renderer.shadowMap.enabled = true;

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

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
    /**
     * Geometries
     */

    const material = new THREE.MeshStandardMaterial();
    material.roughness = 0.7;
    gui.add(material, "metalness").min(0).max(1).step(0.001);
    gui.add(material, "roughness").min(0).max(1).step(0.001);

    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.6, 32, 16),
      material
    );
    sphere.castShadow = true;
    scene.add(sphere);

    const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
    plane.receiveShadow = true;
    plane.rotation.x = -Math.PI * 0.5;
    plane.position.y = -1;
    scene.add(plane);
  }
}
