import { resetRunState } from './gameState.js';
import { pipe } from './fp.js';
import { resetObstaclesForStart } from '../logic/spawning.js';
import { resetCollectiblesForStart } from '../entities/collectibles.js';

const deactivateEffect = (effect) => ({
  ...effect,
  isActive: false,
});

export function resetEffects(state) {
  state.effects = {
    ...state.effects,
    cameraShake: deactivateEffect(state.effects.cameraShake),
    knockback: deactivateEffect(state.effects.knockback),
  };

  return state;
}

export function resetRunEntities(state) {
  const {
    obstacles,
    resetObstacleResults,
  } = resetObstaclesForStart(state.entities.obstacles);

  state.entities = {
    ...state.entities,
    obstacles,
    collectibles: resetCollectiblesForStart(state.entities.collectibles),
  };

  return {
    resetObstacleResults,
  };
}

export function initializeRun(state) {
  return pipe(
    state,
    (currentState) => {
      resetRunState(currentState);
      return currentState;
    },
    resetEffects,
    (currentState) => ({
      state: currentState,
      resetResult: resetRunEntities(currentState),
    }),
    ({ resetResult }) => resetResult
  );
}
