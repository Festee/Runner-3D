import * as THREE from 'https://unpkg.com/three@0.183.2/build/three.module.js';

function configureGroundTexture(texture) {
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 20);
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.colorSpace = THREE.SRGBColorSpace;
}

function configureBuildingTexture(texture) {
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.repeat.set(1, 1);
  texture.offset.set(0, 0);
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.colorSpace = THREE.SRGBColorSpace;
}

export function loadWorldTextures() {
  const loader = new THREE.TextureLoader();

  const groundTexture = loader.load(
    './src/assets/road.avif',
    (tex) => {
      configureGroundTexture(tex);
    },
    undefined,
    () => console.warn('road.avif not found')
  );

  const buildingTextures = [
    loader.load(
      './src/assets/Building1.avif',
      (tex) => {
        configureBuildingTexture(tex);
      },
      undefined,
      () => console.warn('Building1.avif not found')
    ),
    loader.load(
      './src/assets/Building2.avif',
      (tex) => {
        configureBuildingTexture(tex);
      },
      undefined,
      () => console.warn('Building2.avif not found')
    ),
    loader.load(
      './src/assets/Building3.avif',
      (tex) => {
        configureBuildingTexture(tex);
      },
      undefined,
      () => console.warn('Building3.avif not found')
    ),
  ];

  return {
    groundTexture,
    buildingTextures,
  };
}