export function getBaseSettings() {
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
    get aspectRatio() {
      return sizes.width / sizes.width;
    }
  };

  return {
    sizes,
    fov: 75 // FIELD OF VIEW
  };
}
