import { replaceObstacleMesh, syncObstacleMesh } from './meshes.js';
import { replaceCollectibleMesh } from './collectibleMeshes.js';

export function resetObstacleVisuals(scene, obstacles, obstacleMeshes, resetObstacleResults) {
  resetObstacleResults.forEach((result, index) => {
    if (result.typeChanged) {
      obstacleMeshes[index] = replaceObstacleMesh(
        scene,
        obstacleMeshes[index],
        obstacles[index]
      );
    } else {
      syncObstacleMesh(obstacleMeshes[index], obstacles[index]);
    }
  });

  return obstacleMeshes;
}

export function resetCollectibleVisuals(scene, collectibles, collectibleMeshes) {
  collectibles.forEach((collectible, index) => {
    collectibleMeshes[index] = replaceCollectibleMesh(
      scene,
      collectibleMeshes[index],
      collectible
    );
  });

  return collectibleMeshes;
}