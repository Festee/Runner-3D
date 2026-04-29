import { LANE_POSITIONS } from '../core/constants.js';

const COLLECTIBLE_START_Z = -22;
const COLLECTIBLE_GAP = 18;
const COLLECTIBLE_MIN_HEIGHT = 0.35;
const COLLECTIBLE_MAX_HEIGHT = 0.65;

function getRandomLaneX() {
  const laneIndex = Math.floor(Math.random() * LANE_POSITIONS.length);
  return LANE_POSITIONS[laneIndex];
}

function getRandomHeight() {
  return (
    COLLECTIBLE_MIN_HEIGHT +
    Math.random() * (COLLECTIBLE_MAX_HEIGHT - COLLECTIBLE_MIN_HEIGHT)
  );
}

export function createCollectibleState(z, x = getRandomLaneX(), y = getRandomHeight()) {
  return {
    x,
    y,
    z,
    isActive: true,
  };
}

export function createInitialCollectibles(count = 6) {
  return Array.from({ length: count }, (_, index) =>
    createCollectibleState(COLLECTIBLE_START_Z - index * COLLECTIBLE_GAP)
  );
}

export function resetCollectiblesForStart(collectibles) {
  return collectibles.map((collectible, index) => ({
    ...collectible,
    x: getRandomLaneX(),
    y: getRandomHeight(),
    z: COLLECTIBLE_START_Z - index * COLLECTIBLE_GAP,
    isActive: true,
  }));
}

export function respawnCollectible(collectible) {
  return {
    ...collectible,
    x: getRandomLaneX(),
    y: getRandomHeight(),
    z: -150 - Math.random() * 100,
    isActive: true,
  };
}
