import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as Dat from "dat.gui";

/* Textures images */
import textureAlpha from "./assets/textures/door/alpha.jpg";
import textureAmbientOcclusion from "./assets/textures/door/ambientOcclusion.jpg";
import textureColor from "./assets/textures/door/color.jpg";
import textureHeight from "./assets/textures/door/height.jpg";
import textureMetalness from "./assets/textures/door/metalness.jpg";
import textureNormal from "./assets/textures/door/normal.jpg";
import textureRoughness from "./assets/textures/door/roughness.jpg";
import textureMatCaps1 from "./assets/textures/matcaps/1.png";
import textureMatCaps2 from "./assets/textures/matcaps/2.png";
import textureMatCaps3 from "./assets/textures/matcaps/3.png";
import textureMatCaps4 from "./assets/textures/matcaps/4.png";
import textureMatCaps5 from "./assets/textures/matcaps/5.png";
import textureMatCaps6 from "./assets/textures/matcaps/6.png";
import textureMatCaps7 from "./assets/textures/matcaps/7.png";
import textureMatCaps8 from "./assets/textures/matcaps/8.png";
import textureGradient from "./assets/textures/gradients/3.jpg";

const scene = new THREE.Scene();
const canvasEl = document.querySelector("#scene");
const gui = new Dat.GUI();

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xfffffffff, 0.5);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;
scene.add(pointLight);

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
  get aspectRatio() {
    return sizes.width / sizes.height;
  },
};

/**
 * Textures
 */

const textureLoader = new THREE.TextureLoader();

// const doorColorTexture = manager.load();

const doorTextureAlpha = textureLoader.load(textureAlpha);
const doorTextureColor = textureLoader.load(textureColor);
const doorTextureAmbientOcclusion = textureLoader.load(textureAmbientOcclusion);
const doorTextureHeight = textureLoader.load(textureHeight);
const doorTextureMetalness = textureLoader.load(textureMetalness);
const doorTextureNormal = textureLoader.load(textureNormal);
const doorTextureRoughness = textureLoader.load(textureRoughness);
const mapCaps1Texture = textureLoader.load(textureMatCaps1);
const mapCaps2Texture = textureLoader.load(textureMatCaps2);
const mapCaps3Texture = textureLoader.load(textureMatCaps3);
const mapCaps4Texture = textureLoader.load(textureMatCaps4);
const mapCaps5Texture = textureLoader.load(textureMatCaps5);
const mapCaps6Texture = textureLoader.load(textureMatCaps6);
const mapCaps7Texture = textureLoader.load(textureMatCaps7);
const mapCaps8Texture = textureLoader.load(textureMatCaps8);
const gradientTexture = textureLoader.load(textureGradient);
// prevents gradient being applied incorrectly
gradientTexture.generateMipmaps = false;
gradientTexture.magFilter = THREE.NearestFilter;
gradientTexture.minFilter = THREE.NearestFilter;

/**
 * Objects
 */

// const material = new THREE.MeshBasicMaterial({
//   map: doorTextureColor,
// });
// // material.wireframe = true;
// material.transparent = true;
// material.alphaMap = doorTextureAlpha;

// const material = new THREE.MeshNormalMaterial();
// material.flatShading = true;

// const material = new THREE.MeshMatcapMaterial();
// // Can simulate light without light
// material.matcap = mapCaps8Texture;

// // Only paint in white when it's close. Good for fogs
// const material = new THREE.MeshDepthMaterial();

// Material which reacts with LIGHT
// It's great but it add some "blur lines"
// const material = new THREE.MeshLambertMaterial();

// // Similar to lambert but does not have "blur lines"
// // Less performant
// const material = new THREE.MeshPhongMaterial();
// material.shininess = 1000;

// // Cartoonish
// const material = new THREE.MeshToonMaterial();
// material.gradientMap = gradientTexture;

// The most used and important
// Physics base (real life)
const material = new THREE.MeshStandardMaterial();
material.metalness = 0.5;
material.roughness = 0.3;
material.map = doorTextureColor;

// Adding to the debug panel
gui.add(material, "metalness").min(0).max(1).step(0.01);
gui.add(material, "roughness").min(0).max(1).step(0.01);

const sphere = new THREE.Mesh(
  new THREE.SphereBufferGeometry(0.5, 16, 16),
  material
);
sphere.position.x = -1.5;

const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material);
plane.position.x = 1.5;

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 16, 32),
  material
);

scene.add(plane).add(sphere).add(torus);

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75 /* FOV */, sizes.aspectRatio);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

/**
 * Controls
 */
const controls = new OrbitControls(camera, canvasEl);
controls.enableDamping = true;

window.addEventListener("resize", (event) => {
  // Update sizes
  sizes.width = event.target.innerWidth;
  sizes.height = event.target.innerHeight;

  // Update camera
  camera.aspect = sizes.aspectRatio;
  camera.updateProjectionMatrix();

  // update renderer size
  rendered.setSize(sizes.width, sizes.height);
  // Good for transition a window between screens
  rendered.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Renderer
 */
const rendered = new THREE.WebGLRenderer({
  canvas: canvasEl,
});
rendered.setPixelRatio(Math.min(window.devicePixelRatio, 2));
rendered.setSize(sizes.width, sizes.height);

/**
 * Animate / Loop
 */

const clock = new THREE.Clock();

function tick() {
  controls.update();
  const elapsed = clock.getElapsedTime();

  /**
   * Update Objects
   */

  torus.rotation.y = elapsed;
  plane.rotation.y = elapsed;
  sphere.rotation.y = elapsed;

  torus.rotation.x = elapsed;
  plane.rotation.x = elapsed;
  sphere.rotation.x = elapsed;

  rendered.render(scene, camera);

  window.requestAnimationFrame(tick);
}

tick();
