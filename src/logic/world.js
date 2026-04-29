import { WORLD_DEFAULTS } from '../core/worldConstants.js';

function getRecycledSegmentZ(z, segmentLength, totalSegments) {
  const recycleLimit = segmentLength * (totalSegments - 1);

  if (z > recycleLimit) {
    return z - segmentLength * totalSegments;
  }

  return z;
}

export function updateWorld(state, world, textures) {
  const moveSpeed = state.speed * WORLD_DEFAULTS.scrollSpeedMultiplier;

  textures.groundTexture.offset.y -= state.speed;

  for (const segment of world.segments) {
    const nextZ = segment.z + moveSpeed;

    segment.z = getRecycledSegmentZ(
      nextZ,
      world.segmentLength,
      world.totalSegments
    );
  }
}