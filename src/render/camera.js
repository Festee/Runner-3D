import * as THREE from 'https://unpkg.com/three@0.183.2/build/three.module.js';

export function createCamera() {
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  camera.position.set(0, 3, 8);
  camera.lookAt(0, 0.5, -15);

  return camera;
}

export function updateCamera(camera, playerState) {
  camera.position.x += (playerState.x - camera.position.x) * 0.1;
  camera.position.y = 3;
  camera.position.z = playerState.z + 8;
  camera.lookAt(playerState.x, 0.5, playerState.z - 15);
}

export function resizeCamera(camera) {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}