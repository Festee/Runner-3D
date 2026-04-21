import { updatePlayerMovement } from '../logic/movement.js';
import { updateWorld } from '../logic/world.js';
import { updateObstacles } from '../logic/spawning.js';
import { checkAndResolveObstacleCollision } from '../logic/collisions.js';
import { updateScore } from '../logic/scoring.js';
import { updateKnockback, isKnockbackActive } from '../logic/knockback.js';

export function updateGameplay(state, systems) {
  const {
    world,
    textures,
    obstacles,
    knockback,
    cameraShake,
  } = systems;

  if (isKnockbackActive(knockback)) {
    updateKnockback(knockback, state.player);
  }

  updatePlayerMovement(state.player);
  updateWorld(state, world, textures);

  const respawnedIndices = updateObstacles(state, obstacles);

  const hitObstacle = checkAndResolveObstacleCollision(
    state,
    obstacles,
    knockback,
    cameraShake
  );

  let scoreResult = null;

  if (!hitObstacle) {
    scoreResult = updateScore(state);
  }

  return {
    respawnedIndices,
    hitObstacle,
    scoreResult,
  };
}