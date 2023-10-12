import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RectAreaLightHelper } from "three/addons/helpers/RectAreaLightHelper.js";
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

  const scene = new THREE.Scene();

  /**
   * Lights
   */
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight(0xff9000, 0.5, 2, 0.5);
  pointLight.position.set(1, 0.3, 1.5);
  scene.add(pointLight);
  const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.5);
  scene.add(pointLightHelper);

  const hemisphereLight = new THREE.HemisphereLight(0x00ff, 0x00ff00, 0.8);
  scene.add(hemisphereLight);
  const hemisphereLightHelper = new THREE.HemisphereLightHelper(
    hemisphereLight,
    0.5
  );
  scene.add(hemisphereLightHelper);

  const directionalLight = new THREE.DirectionalLight(0x00ffff, 0.5);
  directionalLight.position.set(1, 0.2, 0);
  scene.add(directionalLight);
  const directionalLightHelper = new THREE.DirectionalLightHelper(
    directionalLight
  );
  scene.add(directionalLightHelper);

  const rectLight = new THREE.RectAreaLight(0x4e00ff, 2, 2, 2);
  rectLight.position.set(-1.5, 0, 2);
  rectLight.lookAt(new THREE.Vector3());
  scene.add(rectLight);
  const rectLightHelper = new RectAreaLightHelper(rectLight);
  scene.add(rectLightHelper);

  const spotLight = new THREE.SpotLight(0x78ff00, 0.5, 10, Math.PI * 0.1, 1);
  scene.add(spotLight);
  const spotLightHelper = new THREE.SpotLightHelper(spotLight);
  scene.add(spotLightHelper);

  // gui.add(spotLight, "penumbra").min(0).max(1).step(0.001);
  // gui
  //   .add(spotLight, "angle")
  //   .min(Math.PI * 0.1)
  //   .max(Math.PI)
  //   .step(0.001);
  // scene.add(spotLight);

  /**
   * Geometries
   */

  const material = new THREE.MeshStandardMaterial();

  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.6, 32, 16),
    material
  );
  sphere.position.x = -1.5;
  scene.add(sphere);

  const box = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material);
  scene.add(box);

  const donut = new THREE.Mesh(
    new THREE.TorusGeometry(0.4, 0.3, 16, 64),
    material
  );
  donut.position.x = 1.5;
  scene.add(donut);

  const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
  plane.rotation.x = -Math.PI * 0.5;
  plane.position.y = -1;
  scene.add(plane);

  const camera = new THREE.PerspectiveCamera(45, sizes.aspectRatio);
  camera.position.x = 1;
  camera.position.y = 1;
  camera.position.z = 2;

  scene.add(camera);

  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;

  const renderer = new THREE.WebGLRenderer({
    canvas,
  });

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  function tick() {
    controls.update();

    renderer.render(scene, camera);

    window.requestAnimationFrame(tick);
  }

  tick();
}
