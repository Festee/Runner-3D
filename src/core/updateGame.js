import { updatePlayerMovement } from '../logic/movement.js';
import { updateWorld } from '../logic/world.js';
import { updateObstacles } from '../logic/spawning.js';
import { checkAndResolveObstacleCollision } from '../logic/collisions.js';
import {
  updateCollectibles,
  collectCollectibles,
} from '../logic/collectibles.js';
import { playCoinPickupSound } from '../audio/coinSound.js';
import { addCollectibleScore, updateScore } from '../logic/scoring.js';
import { updateKnockback, isKnockbackActive } from '../logic/knockback.js';

export function updateGameplay(state, systems) {
  const {
    world,
    textures,
    obstacles,
    collectibles,
    knockback,
    cameraShake,
  } = systems;

  if (isKnockbackActive(knockback)) {
    updateKnockback(knockback, state.player);
  }

  updatePlayerMovement(state.player);
  updateWorld(state, world, textures);

  const respawnedIndices = updateObstacles(state, obstacles);
  const respawnedCollectibleIndices = updateCollectibles(state, collectibles);

  const hitObstacle = checkAndResolveObstacleCollision(
    state,
    obstacles,
    knockback,
    cameraShake
  );

  let scoreResult = null;
  const collectedCount = hitObstacle
    ? 0
    : collectCollectibles(state.player, collectibles);

  if (!hitObstacle) {
    scoreResult = updateScore(state);

    for (let i = 0; i < collectedCount; i++) {
      scoreResult = addCollectibleScore(state);
    }

    if (collectedCount > 0) {
      playCoinPickupSound();
    }
  }

  return {
    respawnedIndices,
    respawnedCollectibleIndices,
    hitObstacle,
    scoreResult,
  };
}
