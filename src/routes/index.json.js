import glob from 'glob';
import { promisify } from 'util';
import path from 'path';

const globPromise = promisify(glob);

export async function get() {
  const paths = await globPromise(path.resolve('./src/routes/lesson', '*'));

  const sanitizedPaths = paths.map((p) => {
    const newPath = path.basename(p).replace('.svelte', '');

    return `/lesson/${newPath}`;
  });

  return {
    body: {
      lessons: sanitizedPaths
    }
  };
}
