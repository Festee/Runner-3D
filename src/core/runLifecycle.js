import { resetRunState } from './gameState.js';
import { resetObstaclesForStart } from '../logic/spawning.js';
import { replaceObstacleMesh, syncObstacleMesh } from '../render/meshes.js';
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

export function initializeRun(state, runtime) {
  const {
    scene,
    obstacleMeshes,
    scoreHud,
  } = runtime;

  resetRunState(state);
  resetEffects(state);
  resetObstacleVisuals(state, scene, obstacleMeshes);
  updateScoreHud(scoreHud, state.score, state.highScore);

  return state;
}