import { WORLD_DEFAULTS } from '../core/worldConstants.js';

export function createWorldSegmentState(index) {
  return {
    index,
    z: -index * WORLD_DEFAULTS.segmentLength,
  };
}

export function createWorldSegments(count = WORLD_DEFAULTS.totalSegments) {
  return Array.from({ length: count }, (_, index) =>
    createWorldSegmentState(index)
  );
}