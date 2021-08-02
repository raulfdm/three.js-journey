<script>
  import * as THREE from 'three';
  import { onMount } from 'svelte';
  import { getBaseSettings } from '../../config/baseSettings';

  export let canvas;

  onMount(async () => {
    const scene = new THREE.Scene();
    const settings = getBaseSettings();

    // MESH
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: '#f0a' });
    const mesh = new THREE.Mesh(geometry, material);

    // we need to add the Mesh into the scene
    scene.add(mesh);

    // Camera (Point Of View)
    const camera = new THREE.PerspectiveCamera(settings.fov, settings.sizes.aspectRatio);

    camera.position.z = 3;
    // camera.position.y = 1;
    camera.position.x = -1;

    // we also need to add to the scene
    scene.add(camera);

    const rendered = new THREE.WebGLRenderer({
      canvas: canvas
    });

    // Resize it
    rendered.setSize(settings.sizes.width, settings.sizes.height);

    // Adding scene and camera
    rendered.render(scene, camera);
  });
</script>

<canvas bind:this={canvas} />
