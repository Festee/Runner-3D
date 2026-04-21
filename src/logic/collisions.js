import { markPlayerHit } from './playerStateTransitions.js';
import { startKnockback } from './knockback.js';
import { startCameraShake } from '../render/cameraEffects.js';

export function isObstacleCollidingWithPlayer(player, obstacle) {
  const zClose = obstacle.z > 2.0 && obstacle.z < 4.0;
  const sameLane = Math.abs(obstacle.x - player.x) < 0.9;

  if (!zClose || !sameLane) {
    return false;
  }

  if (obstacle.type === 'tall') {
    return player.y > 0.1;
  }

  return player.y < 1.0;
}

export function findFirstCollidingObstacle(player, obstacles) {
  for (const obstacle of obstacles) {
    if (isObstacleCollidingWithPlayer(player, obstacle)) {
      return obstacle;
    }
  }

  return null;
}

export function resolveObstacleCollision(state, obstacle, knockback, cameraShake) {
  markPlayerHit(state.player);
  state.gameOver = true;

  const knockbackDirection = obstacle.x > state.player.x ? 1 : -1;

  startKnockback(knockback, state.player, knockbackDirection, 1.0, 24);
  startCameraShake(cameraShake, 0.35, 12);
}

export function checkAndResolveObstacleCollision(state, obstacles, knockback, cameraShake) {
  const hitObstacle = findFirstCollidingObstacle(state.player, obstacles);

  if (!hitObstacle) {
    return null;
  }

  resolveObstacleCollision(state, hitObstacle, knockback, cameraShake);
  return hitObstacle;
}