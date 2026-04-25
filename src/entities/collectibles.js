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
  const collectibles = [];

  for (let i = 0; i < count; i++) {
    collectibles.push(createCollectibleState(COLLECTIBLE_START_Z - i * COLLECTIBLE_GAP));
  }

  return collectibles;
}

export function resetCollectiblesForStart(collectibles) {
  collectibles.forEach((collectible, index) => {
    collectible.x = getRandomLaneX();
    collectible.y = getRandomHeight();
    collectible.z = COLLECTIBLE_START_Z - index * COLLECTIBLE_GAP;
    collectible.isActive = true;
  });

  return collectibles;
}

export function respawnCollectible(collectible) {
  collectible.x = getRandomLaneX();
  collectible.y = getRandomHeight();
  collectible.z = -150 - Math.random() * 100;
  collectible.isActive = true;

  return collectible;
}
