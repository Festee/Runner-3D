import { syncPlayerMesh } from './playerMesh.js';
import { replaceObstacleMesh, syncObstacleMesh } from './meshes.js';
import { updateCamera } from './camera.js';
import { updateCameraShake } from './cameraEffects.js';

export function syncGameplayScene(state, sceneState) {
  const {
    scene,
    playerMesh,
    obstacleMeshes,
    obstacles,
    respawnedIndices,
    camera,
    cameraShake,
    cameraBasePosition,
  } = sceneState;

  syncPlayerMesh(playerMesh, state.player);

  for (let i = 0; i < obstacles.length; i++) {
    if (respawnedIndices.includes(i)) {
      obstacleMeshes[i] = replaceObstacleMesh(scene, obstacleMeshes[i], obstacles[i]);
    } else {
      syncObstacleMesh(obstacleMeshes[i], obstacles[i]);
    }
  }

  updateCamera(camera, state.player);

  cameraBasePosition.x = camera.position.x;
  cameraBasePosition.y = camera.position.y;
  cameraBasePosition.z = camera.position.z;

  updateCameraShake(cameraShake, camera, cameraBasePosition);

  return {
    obstacleMeshes,
  };
}