import { LANE_POSITIONS } from '../core/constants.js';

export function getLanePositions() {
  return LANE_POSITIONS;
}

export function getRandomObstacleType() {
  return Math.random() > 0.5 ? 'tall' : 'low';
}

export function getRandomLaneX() {
  const laneIndex = Math.floor(Math.random() * LANE_POSITIONS.length);
  return LANE_POSITIONS[laneIndex];
}

export function createObstacleState(z, type = getRandomObstacleType(), x = getRandomLaneX()) {
  return {
    type,
    x,
    y: 0,
    z,
  };
}

export function createInitialObstacles(count = 8, startZ = -30, gap = 25) {
  const obstacles = [];

  for (let i = 0; i < count; i++) {
    obstacles.push(createObstacleState(startZ - i * gap));
  }

  return obstacles;
}

export function resetObstacleForStart(obstacle, index) {
  const previousType = obstacle.type;

  obstacle.type = getRandomObstacleType();
  obstacle.x = getRandomLaneX();
  obstacle.y = 0;
  obstacle.z = -30 - index * 25;

  return {
    typeChanged: previousType !== obstacle.type,
  };
}

export function respawnObstacle(obstacle) {
  obstacle.type = getRandomObstacleType();
  obstacle.x = getRandomLaneX();
  obstacle.y = 0;
  obstacle.z = -170 - Math.random() * 90;
}