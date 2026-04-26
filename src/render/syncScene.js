import { syncPlayerMesh } from './playerMesh.js';
import { replaceObstacleMesh, syncObstacleMesh } from './meshes.js';
import {
  replaceCollectibleMesh,
  syncCollectibleMesh,
} from './collectibleMeshes.js';
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
    meshes.leftLamp.post.position.z = segment.z;
    meshes.leftLamp.bulb.position.z = segment.z;
    meshes.leftLamp.light.position.z = segment.z;
    meshes.rightLamp.post.position.z = segment.z;
    meshes.rightLamp.bulb.position.z = segment.z;
    meshes.rightLamp.light.position.z = segment.z;
    meshes.leftEdgeStrip.position.z = segment.z;
    meshes.rightEdgeStrip.position.z = segment.z;
    meshes.leftCurb.position.z = segment.z;
    meshes.rightCurb.position.z = segment.z;

    meshes.laneMarkers.forEach((marker) => {
      marker.position.z = segment.z + marker.userData.localZOffset;
    });
  }
}

export function syncGameplayScene(state, sceneState) {
  const {
    scene,
    world,
    playerMesh,
    obstacleMeshes,
    obstacles,
    collectibleMeshes,
    collectibles,
    respawnedIndices,
    respawnedCollectibleIndices,
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

  for (let i = 0; i < collectibles.length; i++) {
    if (respawnedCollectibleIndices.includes(i)) {
      collectibleMeshes[i] = replaceCollectibleMesh(
        scene,
        collectibleMeshes[i],
        collectibles[i]
      );
    } else {
      syncCollectibleMesh(collectibleMeshes[i], collectibles[i]);
    }
  }

  updateCamera(camera, state.player);

  cameraBasePosition.x = camera.position.x;
  cameraBasePosition.y = camera.position.y;
  cameraBasePosition.z = camera.position.z;

  updateCameraShake(cameraShake, camera, cameraBasePosition);

  return {
    obstacleMeshes,
    collectibleMeshes,
  };
}
