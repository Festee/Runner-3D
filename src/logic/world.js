import { WORLD_DEFAULTS } from '../core/worldConstants.js';

function recycleSegment(segment, segmentLength, totalSegments) {
  const recycleLimit = segmentLength * (totalSegments - 1);

  if (segment.z > recycleLimit) {
    segment.z -= segmentLength * totalSegments;
  }
}

export function updateWorld(state, world, textures) {
  const moveSpeed = state.speed * WORLD_DEFAULTS.scrollSpeedMultiplier;

  textures.groundTexture.offset.y -= state.speed;

  for (const segment of world.segments) {
    segment.z += moveSpeed;
    recycleSegment(segment, world.segmentLength, world.totalSegments);
  }
}