<script>
  import * as THREE from 'three';
  import { onMount } from 'svelte';
  import { getBaseSettings } from '../config/baseSettings';

  export let canvas;

  onMount(async () => {
    const scene = new THREE.Scene();

    // MESH
    // const geometry = new THREE.BoxGeometry(1, 1, 1);
    // const material = new THREE.MeshBasicMaterial({ color: "#f0a" });
    // const mesh = new THREE.Mesh(geometry, material);

    scene.add(new THREE.AxesHelper());
    // mesh.position.z = 1;
    // mesh.position.x = -1;

    // mesh.scale.z = 1;
    // mesh.scale.x = 0.5;
    // we need to add the Mesh into the scene
    // mesh.rotation.reorder("YXZ");
    // mesh.rotation.x = Math.PI * 0.2;
    // mesh.rotation.y = Math.PI * 0.5;

    // scene.add(mesh);

    // Sizes
    const sizes = {
      width: 800,
      height: 600,
      get aspectRatio() {
        return sizes.width / sizes.width;
      }
    };

    const group = new THREE.Group();
    group.position.y = 1;
    group.rotation.y = 1;
    scene.add(group);

    const cube1 = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({ color: '#f0a' })
    );

    const cube2 = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({ color: '#00a' })
    );

    cube2.position.x = -1.2;

    const cube3 = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({ color: '#0fa' })
    );

    cube3.position.x = 1.2;

    group.add(cube1);
    group.add(cube2);
    group.add(cube3);

    // Camera (Point Of View)
    const fov = 75; // field of view (deg)
    const camera = new THREE.PerspectiveCamera(fov, sizes.aspectRatio);

    camera.position.z = 3;

    // camera.lookAt(mesh.position);

    // we also need to add to the scene
    scene.add(camera);

    const rendered = new THREE.WebGLRenderer({
      canvas: canvas
    });

    // Resize it
    rendered.setSize(sizes.width, sizes.height);

    // Adding scene and camera
    rendered.render(scene, camera);
  });
</script>

<canvas bind:this={canvas} />
