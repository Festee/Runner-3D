import { LANE_POSITIONS } from '../core/constants.js';

export function getLanePositions() {
  return [...LANE_POSITIONS];
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
  return Array.from({ length: count }, (_, index) =>
    createObstacleState(startZ - index * gap)
  );
}

export function resetObstacleForStart(obstacle, index) {
  const nextObstacle = {
    ...obstacle,
    type: getRandomObstacleType(),
    x: getRandomLaneX(),
    y: 0,
    z: -30 - index * 25,
  };

  return {
    obstacle: nextObstacle,
    typeChanged: obstacle.type !== nextObstacle.type,
  };
}

export function respawnObstacle(obstacle) {
  return {
    ...obstacle,
    type: getRandomObstacleType(),
    x: getRandomLaneX(),
    y: 0,
    z: -170 - Math.random() * 90,
  };
}