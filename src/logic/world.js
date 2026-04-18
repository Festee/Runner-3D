import { WORLD_DEFAULTS } from '../core/worldConstants.js';

function syncSegmentZ(segment, z) {
  segment.z = z;
  segment.road.position.z = z;
  segment.leftSide.position.z = z;
  segment.rightSide.position.z = z;
}

function recycleSegment(segment, segmentLength, totalSegments) {
  const recycleLimit = segmentLength * (totalSegments - 1);

  if (segment.z > recycleLimit) {
    syncSegmentZ(segment, segment.z - segmentLength * totalSegments);
  }
}

export function updateWorld(state, world, textures) {
  const moveSpeed = state.speed * WORLD_DEFAULTS.scrollSpeedMultiplier;

  textures.groundTexture.offset.y -= state.speed;
  textures.wallTexture.offset.y -= state.speed * 0.35;

  for (const segment of world.segments) {
    syncSegmentZ(segment, segment.z + moveSpeed);
    recycleSegment(segment, world.segmentLength, world.totalSegments);
  }
}