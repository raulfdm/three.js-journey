<main>
  <nav>
    <a href="/">Home</a>
  </nav>
  <slot />
</main>

<style>
  :global(*) {
    margin: 0;
    padding: 0;
  }

  :global(canvas) {
    width: 0;
    height: 0;
    margin: 0 auto;
  }

  main {
    height: 100vh;
    width: 100vw;
  }

  nav {
    padding: 1rem 0.8rem;
  }
</style>
