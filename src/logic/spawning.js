import { respawnObstacle, resetObstacleForStart } from '../entities/obstacles.js';

const OBSTACLE_SCROLL_MULTIPLIER = 25;
const OBSTACLE_RESPAWN_THRESHOLD_Z = 8;

export function resetObstaclesForStart(obstacles) {
  return obstacles.map((obstacle, index) => {
    return resetObstacleForStart(obstacle, index);
  });
}

export function updateObstacles(state, obstacles) {
  const moveSpeed = state.speed * OBSTACLE_SCROLL_MULTIPLIER;
  const respawnedIndices = [];

  obstacles.forEach((obstacle, index) => {
    obstacle.z += moveSpeed;

    if (obstacle.z > OBSTACLE_RESPAWN_THRESHOLD_Z) {
      respawnObstacle(obstacle);
      respawnedIndices.push(index);
    }
  });

  return respawnedIndices;
}