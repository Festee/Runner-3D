import { markPlayerHit } from './playerStateTransitions.js';
import { startKnockback } from './knockback.js';

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
  return obstacles.find((obstacle) =>
    isObstacleCollidingWithPlayer(player, obstacle)
  ) ?? null;
}

export function resolveObstacleCollision(state, obstacle, knockback) {
  markPlayerHit(state.player);
  state.gameOver = true;

  const knockbackDirection = obstacle.x > state.player.x ? 1 : -1;

  startKnockback(knockback, state.player, knockbackDirection, 1.0, 24);
}

export function checkAndResolveObstacleCollision(state, obstacles, knockback) {
  const hitObstacle = findFirstCollidingObstacle(state.player, obstacles);

  if (!hitObstacle) {
    return null;
  }

  resolveObstacleCollision(state, hitObstacle, knockback);
  return hitObstacle;
}