/** @type {import('@sveltejs/kit').Config} */

import vercel from '@sveltejs/adapter-vercel';

export default {
  kit: {
    // hydrate the <div id="svelte"> element in src/app.html
    target: '#svelte',
    adapter: vercel()
  }
};
