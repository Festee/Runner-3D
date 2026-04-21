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