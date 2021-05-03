<script>
  import * as THREE from 'three';
  import { onMount } from 'svelte';

  // import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
  import { OrbitControls } from 'three/examples/js/controls/OrbitControls';

  export let canvas;

  onMount(async () => {
    const scene = new THREE.Scene();

    const cursorCoordinates = {
      x: 0,
      y: 0
    };

    // MESH
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: '#f0a' });
    const mesh = new THREE.Mesh(geometry, material);

    // scene.add(new THREE.AxesHelper());
    // mesh.position.z = 1;
    // mesh.position.x = -1;

    // mesh.scale.z = 1;
    // mesh.scale.x = 0.5;
    // we need to add the Mesh into the scene
    // mesh.rotation.reorder("YXZ");
    // mesh.rotation.x = Math.PI * 0.2;
    // mesh.rotation.y = Math.PI * 0.5;

    scene.add(mesh);

    // Sizes
    const sizes = {
      width: 800,
      height: 600,
      get aspectRatio() {
        return sizes.width / sizes.height;
      }
    };

    // Camera (Point Of View)
    const fov = 75; // field of view (deg)
    const camera = new THREE.PerspectiveCamera(fov, sizes.aspectRatio);
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;

    // const camera = new THREE.OrthographicCamera(
    //   -1 * sizes.aspectRatio,
    //   1 * sizes.aspectRatio,
    //   1,
    //   -1,
    //   0.1,
    //   100
    // );

    camera.position.z = 3;
    camera.lookAt(mesh.position);

    // we also need to add to the scene
    scene.add(camera);

    const rendered = new THREE.WebGLRenderer({
      canvas: canvas
    });

    // Resize it
    rendered.setSize(sizes.width, sizes.height);

    // Adding scene and camera
    // rendered.render(scene, camera);

    // LOOP

    const clock = new THREE.Clock();

    function tick() {
      // UPDATE DAMPING IN EACH FRAME
      controls.update();
      const elapsed = clock.getElapsedTime();

      // mesh.position.y = Math.sin(elapsed);
      // mesh.position.x = Math.cos(elapsed);
      // mesh.rotation.x = elapsed;
      // mesh.rotation.y = elapsed;

      // camera.position.y = cursorCoordinates.y * 10;
      // camera.position.x = cursorCoordinates.x * 10;
      // Math.PI => half rotation.
      // Math.PI * 2 => full rotation
      // * 3 is only to increment the distance
      // camera.position.x = Math.sin(cursorCoordinates.x * Math.PI * 2) * 3;
      // camera.position.z = Math.cos(cursorCoordinates.x * Math.PI * 2) * 3;
      // camera.position.y = cursorCoordinates.y * 5;
      // camera.lookAt(mesh.position);

      // const orbit;

      rendered.render(scene, camera);

      window.requestAnimationFrame(tick);
    }

    tick();

    /* Events */

    // document.addEventListener("mousemove", (event) => {
    //   const { clientX, clientY } = event;

    //   /**
    //    * Getting values between 1 and 0
    //    * If we want to have negative and positive values, we could subtract 0.5
    //    * from the values. By doing that, we'll go from -0.5 to 0.5.
    //    *
    //    * We might want to do that to easily move the camera left/down in the axes x/y
    //    */

    //   cursorCoordinates.y = clientY / sizes.height - 0.5;
    //   /**
    //    * we need to multiply by -1 to make it move for the right direction.
    //    * This is some axis difference between browser and three.js
    //    */
    //   cursorCoordinates.x = (clientX / sizes.width - 0.5) * -1;
    // });
  });
</script>

<canvas bind:this={canvas} />
