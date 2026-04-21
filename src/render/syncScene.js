import { syncPlayerMesh } from './playerMesh.js';
import { replaceObstacleMesh, syncObstacleMesh } from './meshes.js';
import { updateCamera } from './camera.js';
import { updateCameraShake } from './cameraEffects.js';

function syncWorldScene(world) {
  for (let i = 0; i < world.segments.length; i++) {
    const segment = world.segments[i];
    const meshes = world.segmentMeshes[i];

    meshes.road.position.z = segment.z;
    meshes.leftSidewalk.position.z = segment.z;
    meshes.rightSidewalk.position.z = segment.z;
    meshes.leftSide.position.z = segment.z;
    meshes.rightSide.position.z = segment.z;
  }
}

export function syncGameplayScene(state, sceneState) {
  const {
    scene,
    world,
    playerMesh,
    obstacleMeshes,
    obstacles,
    respawnedIndices,
    camera,
    cameraShake,
    cameraBasePosition,
  } = sceneState;

  syncWorldScene(world);
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