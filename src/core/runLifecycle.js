import { resetRunState } from './gameState.js';
import { resetObstaclesForStart } from '../logic/spawning.js';
import { replaceObstacleMesh, syncObstacleMesh } from '../render/meshes.js';
import { resetCollectiblesForStart } from '../entities/collectibles.js';
import {
  replaceCollectibleMesh,
} from '../render/collectibleMeshes.js';
import { updateScoreHud } from '../ui/hud.js';

export function resetEffects(state) {
  state.effects.cameraShake.isActive = false;
  state.effects.knockback.isActive = false;
}

export function resetObstacleVisuals(state, scene, obstacleMeshes) {
  const resetResults = resetObstaclesForStart(state.entities.obstacles);

  resetResults.forEach((result, index) => {
    if (result.typeChanged) {
      obstacleMeshes[index] = replaceObstacleMesh(
        scene,
        obstacleMeshes[index],
        state.entities.obstacles[index]
      );
    } else {
      syncObstacleMesh(obstacleMeshes[index], state.entities.obstacles[index]);
    }
  });

  return obstacleMeshes;
}

export function resetCollectibleVisuals(state, scene, collectibleMeshes) {
  resetCollectiblesForStart(state.entities.collectibles);

  state.entities.collectibles.forEach((collectible, index) => {
    collectibleMeshes[index] = replaceCollectibleMesh(
      scene,
      collectibleMeshes[index],
      collectible
    );
  });

  return collectibleMeshes;
}

export function initializeRun(state, runtime) {
  const {
    scene,
    obstacleMeshes,
    collectibleMeshes,
    scoreHud,
  } = runtime;

  resetRunState(state);
  resetEffects(state);
  resetObstacleVisuals(state, scene, obstacleMeshes);
  resetCollectibleVisuals(state, scene, collectibleMeshes);
  updateScoreHud(
    scoreHud,
    state.score,
    state.coinsCollected,
    state.highScore
  );

  return state;
}
