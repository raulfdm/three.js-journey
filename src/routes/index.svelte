<script context="module">
  /**
   * @type {import('@sveltejs/kit').Load}
   */
  export async function load({ page, fetch, session, context }) {
    // console.log(more);
    const more = await fetch('/index.json');

    const { lessons } = await more.json();

    return {
      props: {
        lessons
      }
    };
  }
</script>

<script>
  export let lessons;

  console.log(lessons);
</script>

<div>
  <h1>ThreeJS Journey</h1>

  <p>Site: <a href="https://threejs-journey.xyz/">https://threejs-journey.xyz/</a></p>

  <ul>
    {#each lessons as lesson}
      <li>
        <a href={lesson}>{lesson}</a>
      </li>
    {/each}
  </ul>
</div>

<style>
  div {
    margin: 0 auto;
    max-width: 60rem;
  }
  ul {
    margin-top: 1rem;
  }
</style>
