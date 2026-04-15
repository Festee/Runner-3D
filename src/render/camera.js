import * as THREE from 'https://unpkg.com/three@0.183.2/build/three.module.js';

export function createCamera() {
  const camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  camera.position.set(0, 5, 12);
  camera.lookAt(0, 1, -20);

  return camera;
}

export function updateCamera(camera, playerState) {
  camera.position.x += (playerState.x - camera.position.x) * 0.06;
  camera.position.z = 8;
  camera.lookAt(playerState.x, 1, -5);
}

export function resizeCamera(camera) {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}