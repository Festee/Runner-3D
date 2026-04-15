import * as THREE from 'https://unpkg.com/three@0.183.2/build/three.module.js';
import { PLAYER_DEFAULTS } from '../core/constants.js';

export function createPlayerMesh() {
  const geometry = new THREE.BoxGeometry(
    PLAYER_DEFAULTS.width,
    PLAYER_DEFAULTS.height,
    PLAYER_DEFAULTS.depth
  );

  const material = new THREE.MeshLambertMaterial({
    color: PLAYER_DEFAULTS.color,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(
    PLAYER_DEFAULTS.x,
    PLAYER_DEFAULTS.y,
    PLAYER_DEFAULTS.z
  );

  return mesh;
}

export function syncPlayerMesh(mesh, playerState) {
  mesh.position.x = playerState.x;
  mesh.position.y = playerState.y;
  mesh.position.z = playerState.z;
}