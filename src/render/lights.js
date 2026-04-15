import * as THREE from 'https://unpkg.com/three@0.183.2/build/three.module.js';

export function createLights() {
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.3);
  directionalLight.position.set(5, 20, 10);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 2048;
  directionalLight.shadow.mapSize.height = 2048;
  directionalLight.shadow.camera.far = 200;
  directionalLight.shadow.camera.left = -20;
  directionalLight.shadow.camera.right = 20;
  directionalLight.shadow.camera.top = 20;
  directionalLight.shadow.camera.bottom = -20;

  return {
    ambientLight,
    directionalLight,
  };
}