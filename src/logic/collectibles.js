import { respawnCollectible } from '../entities/collectibles.js';

const COLLECTIBLE_SCROLL_MULTIPLIER = 25;
const COLLECTIBLE_RESPAWN_THRESHOLD_Z = 8;
const COLLECTIBLE_X_THRESHOLD = 0.55;
const COLLECTIBLE_Y_THRESHOLD = 0.7;
const COLLECTIBLE_Z_MIN = 2.2;
const COLLECTIBLE_Z_MAX = 4.2;

export function updateCollectibles(state, collectibles) {
  const moveSpeed = state.speed * COLLECTIBLE_SCROLL_MULTIPLIER;
  const nextState = collectibles.reduce(
    (acc, collectible, index) => {
      const movedCollectible = advanceCollectible(collectible, moveSpeed);
      const shouldRespawn =
        movedCollectible.isActive &&
        movedCollectible.z > COLLECTIBLE_RESPAWN_THRESHOLD_Z;
      const nextCollectible = shouldRespawn
        ? respawnCollectible(movedCollectible)
        : movedCollectible;

      acc.nextCollectibles.push(nextCollectible);

      if (shouldRespawn) {
        acc.respawnedCollectibleIndices.push(index);
      }

      return acc;
    },
    { nextCollectibles: [], respawnedCollectibleIndices: [] }
  );

  nextState.nextCollectibles.forEach((collectible, index) => {
    collectibles[index] = collectible;
  });

  return nextState.respawnedCollectibleIndices;
}

function advanceCollectible(collectible, moveSpeed) {
  if (!collectible.isActive) {
    return collectible;
  }

  return {
    ...collectible,
    z: collectible.z + moveSpeed,
  };
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
  const nextState = collectibles.reduce(
    (acc, collectible) => {
      if (!isCollectibleCollected(player, collectible)) {
        acc.nextCollectibles.push(collectible);
        return acc;
      }

      acc.collectedCount += 1;
      acc.nextCollectibles.push(respawnCollectible(collectible));
      return acc;
    },
    { collectedCount: 0, nextCollectibles: [] }
  );

  nextState.nextCollectibles.forEach((collectible, index) => {
    collectibles[index] = collectible;
  });

  return nextState.collectedCount;
}
