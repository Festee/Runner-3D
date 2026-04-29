import { respawnCollectible } from '../entities/collectibles.js';

const COLLECTIBLE_SCROLL_MULTIPLIER = 25;
const COLLECTIBLE_RESPAWN_THRESHOLD_Z = 8;
const COLLECTIBLE_X_THRESHOLD = 0.55;
const COLLECTIBLE_Y_THRESHOLD = 0.7;
const COLLECTIBLE_Z_MIN = 2.2;
const COLLECTIBLE_Z_MAX = 4.2;

export function updateCollectibles(state, collectibles) {
  const moveSpeed = state.speed * COLLECTIBLE_SCROLL_MULTIPLIER;
  const respawnedCollectibleIndices = [];

  collectibles.forEach((collectible, index) => {
    if (!collectible.isActive) {
      return;
    }

    collectible.z += moveSpeed;

    if (collectible.z > COLLECTIBLE_RESPAWN_THRESHOLD_Z) {
      collectibles[index] = respawnCollectible(collectible);
      respawnedCollectibleIndices.push(index);
    }
  });

  return respawnedCollectibleIndices;
}

function isCollectibleCollected(player, collectible) {
  if (!collectible.isActive) {
    return false;
  }

  const isAlignedInLane = Math.abs(collectible.x - player.x) <= COLLECTIBLE_X_THRESHOLD;
  const isAlignedInHeight = Math.abs(collectible.y - player.y) <= COLLECTIBLE_Y_THRESHOLD;
  const isAlignedInDepth =
    collectible.z >= COLLECTIBLE_Z_MIN && collectible.z <= COLLECTIBLE_Z_MAX;

  return isAlignedInLane && isAlignedInHeight && isAlignedInDepth;
}

export function collectCollectibles(player, collectibles) {
  let collectedCount = 0;

  collectibles.forEach((collectible, index) => {
    if (!isCollectibleCollected(player, collectible)) {
      return;
    }

    collectedCount += 1;
    collectibles[index] = respawnCollectible(collectible);
  });

  return collectedCount;
}
