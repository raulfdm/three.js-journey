import * as THREE from "three";
import GUI from "lil-gui";

if (typeof window !== "undefined") {
  render();
}

function render() {
  const gui = new GUI();

  const scene = new THREE.Scene();

  // const axesHelpers = new THREE.AxesHelper(2);
  // scene.add(axesHelpers);

  // const redCubeGeometry = new THREE.BoxGeometry(1, 1, 1);
  // const redMaterial = new THREE.MeshBasicMaterial({ color: "red" });
  // gui.addColor(redMaterial, "color").name("Cube Color");

  // const cube = new THREE.Mesh(redCubeGeometry, redMaterial);

  const group = new THREE.Group();
  scene.add(group);

  const redCube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: "red" })
  );
  group.add(redCube);

  const blueCube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: "blue" })
  );
  group.add(blueCube);

  const greenCube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: "green" })
  );
  group.add(greenCube);

  greenCube.position.x = 1.5;
  blueCube.position.x = -1.5;

  const position = gui.addFolder("Position");
  position.add(group.position, "x").min(-3).max(3).step(0.1).name("Group X");
  position.add(group.position, "y").min(-3).max(3).step(0.1).name("Group Y");
  position.add(group.position, "z").min(-3).max(3).step(0.1).name("Group Z");

  const scale = gui.addFolder("Scale");
  scale.add(group.scale, "x").min(0).max(3).step(0.1).name("Group X");
  scale.add(group.scale, "y").min(0).max(3).step(0.1).name("Group Y");
  scale.add(group.scale, "z").min(0).max(3).step(0.1).name("Group Z");

  const rotation = gui.addFolder("Rotation");
  rotation.add(group.rotation, "x").min(-6).max(6).step(0.1).name("Group X");
  rotation.add(group.rotation, "y").min(-6).max(6).step(0.1).name("Group Y");
  rotation.add(group.rotation, "z").min(-6).max(6).step(0.1).name("Group Z");

  // cube.material.wireframe = true; // to better visualize the cube
  // scene.add(cube); // We need to add to the scene

  // const rotationFolder = gui.addFolder("Rotation");
  // rotationFolder.add(cube.rotation, "x").min(-6).max(6).step(0.1);
  // rotationFolder.add(cube.rotation, "y").min(-6).max(6).step(0.1);
  // rotationFolder.add(cube.rotation, "z").min(-6).max(6).step(0.1);

  const sizes = {
    width: 800,
    height: 600,
    get aspectRatio() {
      return sizes.width / sizes.height;
    },
  };

  const camera = new THREE.PerspectiveCamera(75, sizes.aspectRatio);
  camera.position.z = 3;
  // camera.position.set(1.2, 1, 4);
  // camera.lookAt(cube.position);

  scene.add(camera); // We need to add a camera

  const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("canvas") as HTMLCanvasElement,
  });

  renderer.setSize(sizes.width, sizes.height);

  function animate() {
    // Request the next frame
    requestAnimationFrame(animate);

    // Render the scene
    renderer.render(scene, camera);
  }

  animate();
}
