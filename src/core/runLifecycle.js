import { resetRunState } from './gameState.js';
import { resetObstaclesForStart } from '../logic/spawning.js';
import { resetCollectiblesForStart } from '../entities/collectibles.js';

export function resetEffects(state) {
  state.effects.cameraShake.isActive = false;
  state.effects.knockback.isActive = false;

  return state;
}

export function resetRunEntities(state) {
  const resetObstacleResults = resetObstaclesForStart(state.entities.obstacles);
  resetCollectiblesForStart(state.entities.collectibles);

  return {
    resetObstacleResults,
  };
}

export function initializeRun(state) {
  resetRunState(state);
  resetEffects(state);

  return resetRunEntities(state);
}