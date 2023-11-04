import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import GUI from "lil-gui";

import doorAlpha from "./_assets/textures/door/alpha.jpg";
import doorOcclusion from "./_assets/textures/door/ambientOcclusion.jpg";
import doorColor from "./_assets/textures/door/color.jpg";
import doorHeight from "./_assets/textures/door/height.jpg";
import doorMetalness from "./_assets/textures/door/metalness.jpg";
import doorNormal from "./_assets/textures/door/normal.jpg";
import doorRoughness from "./_assets/textures/door/roughness.jpg";

import environmentPx from "./_assets/textures/environmentMaps/4/px.png";
import environmentNx from "./_assets/textures/environmentMaps/4/nx.png";
import environmentPy from "./_assets/textures/environmentMaps/4/py.png";
import environmentNy from "./_assets/textures/environmentMaps/4/ny.png";
import environmentPz from "./_assets/textures/environmentMaps/4/pz.png";
import environmentNz from "./_assets/textures/environmentMaps/4/nz.png";

import gradientImage from "./_assets/textures/gradients/5.jpg";
import matcapImage from "./_assets/textures/matcaps/10.png";

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

  const textureLoader = new THREE.TextureLoader();
  const cubeTextureLoader = new THREE.CubeTextureLoader();

  const doorColorTexture = textureLoader.load(doorColor.src);
  const doorAlphaTexture = textureLoader.load(doorAlpha.src);
  const doorHeightTexture = textureLoader.load(doorHeight.src);
  const doorMetalnessTexture = textureLoader.load(doorMetalness.src);
  const doorNormalTexture = textureLoader.load(doorNormal.src);
  const doorOcclusionTexture = textureLoader.load(doorOcclusion.src);
  const doorRoughnessTexture = textureLoader.load(doorRoughness.src);

  const gradientTexture = textureLoader.load(gradientImage.src);
  gradientTexture.minFilter = THREE.NearestFilter;
  gradientTexture.magFilter = THREE.NearestFilter;
  gradientTexture.generateMipmaps = false;

  const matcapTexture = textureLoader.load(matcapImage.src);

  /**
   * Environment Maps
   */

  const environmentTexture = cubeTextureLoader.load([
    environmentPx.src,
    environmentNx.src,
    environmentPy.src,
    environmentNy.src,
    environmentPz.src,
    environmentNz.src,
  ]);

  /**
   * Lights
   */
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);

  const light = new THREE.PointLight(0xffffff, 50);
  light.position.x = 2;
  light.position.y = 3;
  light.position.z = 4;
  scene.add(light);

  // const material = new THREE.MeshNormalMaterial();
  // material.flatShading = true;

  // const material = new THREE.MeshBasicMaterial();
  // material.side = THREE.DoubleSide;
  // material.map = doorColorTexture;
  // material.alphaMap = doorAlphaTexture;
  // material.transparent = true;
  // material.opacity = 0.4;
  // material.map = doorColorTexture;
  // material.color.set("green");
  // material.wireframe = true;

  // const material = new THREE.MeshMatcapMaterial();
  // material.matcap = matcapTexture;

  // const material = new THREE.MeshDepthMaterial();

  // const material = new THREE.MeshLambertMaterial();

  // const material = new THREE.MeshPhongMaterial();
  // material.specular = new THREE.Color("red");
  // material.shininess = 1000;

  // const material = new THREE.MeshToonMaterial();
  // material.gradientMap = gradientTexture;

  // const material = new THREE.MeshStandardMaterial();
  // material.displacementMap = doorHeightTexture;
  // material.metalnessMap = doorMetalnessTexture;
  // material.map = doorColorTexture;
  // material.aoMap = doorOcclusionTexture;
  // material.aoMapIntensity = 2;
  // material.displacementScale = 0.05;
  // material.roughnessMap = doorRoughnessTexture;
  // material.metalnessMap = doorMetalnessTexture;
  // material.normalMap = doorNormalTexture;
  // material.alphaMap = doorAlphaTexture;
  // material.transparent = true;

  const material = new THREE.MeshStandardMaterial();
  material.envMap = environmentTexture;
  material.metalness = 0.7;
  material.roughness = 0.2;

  gui.add(material, "roughness").min(0).max(1).step(0.0001);
  gui.add(material, "metalness").min(0).max(1).step(0.0001);
  gui.add(material, "displacementScale").min(0).max(1).step(0.0001);
  gui.add(material.normalScale, "x").min(0).max(10).step(0.0001);
  gui.add(material.normalScale, "y").min(0).max(10).step(0.0001);

  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 64, 64),
    material
  );
  sphere.position.x = -1.5;

  const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 64, 128),
    material
  );
  torus.position.x = 1.5;

  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1, 100, 100),
    material
  );

  scene.add(plane, torus, sphere);

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

  const clock = new THREE.Clock();
  function tick() {
    animateMaterials();

    controls.update();

    renderer.render(scene, camera);

    window.requestAnimationFrame(tick);
  }

  function animateMaterials() {
    const elapsedTime = clock.getElapsedTime();

    // plane.rotation.y = elapsedTime * 0.1;
    // sphere.rotation.y = elapsedTime * 0.1;
    // torus.rotation.y = elapsedTime * 0.1;

    // plane.rotation.x = elapsedTime * 0.15;
    // sphere.rotation.x = elapsedTime * 0.15;
    // torus.rotation.x = elapsedTime * 0.15;
  }

  tick();
}
