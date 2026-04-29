import { syncPlayerMesh } from './playerMesh.js';
import { replaceObstacleMesh, syncObstacleMesh } from './meshes.js';
import {
  replaceCollectibleMesh,
  syncCollectibleMesh,
} from './collectibleMeshes.js';
import { updateCamera } from './camera.js';
import { updateCameraShake } from './cameraEffects.js';

function syncWorldScene(world) {
  world.segments.forEach((segment, index) => {
    const meshes = world.segmentMeshes[index];

    const segmentMeshes = [
      meshes.road,
      meshes.leftSidewalk,
      meshes.rightSidewalk,
      meshes.leftSide,
      meshes.rightSide,
      meshes.leftLamp.post,
      meshes.leftLamp.bulb,
      meshes.leftLamp.light,
      meshes.rightLamp.post,
      meshes.rightLamp.bulb,
      meshes.rightLamp.light,
      meshes.leftEdgeStrip,
      meshes.rightEdgeStrip,
      meshes.leftCurb,
      meshes.rightCurb,
    ];

    segmentMeshes.forEach((mesh) => {
      mesh.position.z = segment.z;
    });

    meshes.laneMarkers.forEach((marker) => {
      marker.position.z = segment.z + marker.userData.localZOffset;
    });
  });
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
