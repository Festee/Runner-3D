import { PLAYER_DEFAULTS } from '../../core/constants.js';


export function getPlayerBounds(player) {
  return {
    // Center position
    center: {
      x: player.x,
      y: player.y,
      z: player.z,
    },
    // Half-extents (half of width, height, depth)
    halfExtents: {
      x: PLAYER_DEFAULTS.width / 2,
      y: PLAYER_DEFAULTS.height / 2,
      z: PLAYER_DEFAULTS.depth / 2,
    },
  };
}


export function getPlayerBoundsMinMax(player) {
  const halfX = PLAYER_DEFAULTS.width / 2;
  const halfY = PLAYER_DEFAULTS.height / 2;
  const halfZ = PLAYER_DEFAULTS.depth / 2;

  return {
    min: {
      x: player.x - halfX,
      y: player.y - halfY,
      z: player.z - halfZ,
    },
    max: {
      x: player.x + halfX,
      y: player.y + halfY,
      z: player.z + halfZ,
    },
  };
}


export function getPlayerDimensions() {
  return {
    width: PLAYER_DEFAULTS.width,
    height: PLAYER_DEFAULTS.height,
    depth: PLAYER_DEFAULTS.depth,
  };
}
