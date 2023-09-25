/**
 * This hack is to fix this issue:
 * - https://github.com/withastro/astro/issues/8660
 * - https://github.com/georgealways/lil-gui/issues/115
 */
import pkg from "../node_modules/lil-gui/package.json";

const newPkg = {
  ...pkg,
  exports: {
    ".": {
      import: "./dist/lil-gui.esm.js",
      require: "./dist/lil-gui.umd.js",
    },
  },
};

Bun.write("node_modules/lil-gui/package.json", JSON.stringify(newPkg, null, 2));
