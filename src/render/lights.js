import * as THREE from 'https://unpkg.com/three@0.183.2/build/three.module.js';

export function createLights() {
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.78);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(6, 10, 8);

  return {
    ambientLight,
    directionalLight,
  };
}