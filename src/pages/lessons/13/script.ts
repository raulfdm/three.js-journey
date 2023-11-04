import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { Font } from "three/addons/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import GUI from "lil-gui";
import helvetikerRegularFont from "three/examples/fonts/helvetiker_regular.typeface.json";
import matCapImage from "./_assets/textures/matcaps/10.png";

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
  const loadedFont = new Font(helvetikerRegularFont);
  const textureLoader = new THREE.TextureLoader();
  const matCapTexture = textureLoader.load(matCapImage.src);

  const text = new TextGeometry("Hello Three.JS", {
    font: loadedFont,
    size: 0.5,
    height: 0.2,
    curveSegments: 5,
    /**
     * Bevel
     */
    bevelEnabled: true, // must be on so it can bevel
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelSegments: 4,
  });

  text.center();

  // text.computeBoundingBox();

  // text.translate(
  //   -(text.boundingBox!.max.x - 0.02) * 0.5,
  //   -(text.boundingBox!.max.y - 0.02) * 0.5,
  //   -(text.boundingBox!.max.z - 0.03) * 0.5
  // );

  // text.computeBoundingBox();
  // console.log(text.boundingBox);

  const material = new THREE.MeshMatcapMaterial();
  material.matcap = matCapTexture;

  const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);
  const donutMaterial = new THREE.MeshMatcapMaterial();
  donutMaterial.matcap = matCapTexture;

  console.time("donuts");
  for (let numberOfDonuts = 0; numberOfDonuts < 100; numberOfDonuts++) {
    const donut = new THREE.Mesh(donutGeometry, donutMaterial);

    donut.position.x = (Math.random() - 0.5) * 6;
    donut.position.y = (Math.random() - 0.5) * 6;
    donut.position.z = (Math.random() - 0.5) * 6;

    donut.rotation.x = Math.random() * Math.PI;
    donut.rotation.y = Math.random() * Math.PI;

    const scale = Math.random();
    donut.scale.set(scale, scale, scale);

    scene.add(donut);
  }
  console.timeEnd("donuts");

  const box = new THREE.Mesh(text, material);

  scene.add(box);

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
