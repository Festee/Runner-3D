import * as THREE from 'https://unpkg.com/three@0.183.2/build/three.module.js';

export function loadWorldTextures() {
  const loader = new THREE.TextureLoader();

  const groundTexture = loader.load(
    './src/assets/Ground.png',
    (tex) => {
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(1, 20);
      tex.magFilter = THREE.LinearFilter;
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.colorSpace = THREE.SRGBColorSpace;
    },
    undefined,
    () => console.warn('Ground.png not found')
  );

  const wallTexture = loader.load(
    './src/assets/Wall.png',
    (tex) => {
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(1, 40);
      tex.offset.y = 0;
      tex.magFilter = THREE.LinearFilter;
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.colorSpace = THREE.SRGBColorSpace;
    },
    undefined,
    () => console.warn('Wall.png not found')
  );

  return {
    groundTexture,
    wallTexture,
  };
}