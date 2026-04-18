import { PLAYER_DEFAULTS } from '../../core/constants.js';

/**
 * Get player collision bounds as center + half-extents
 * Useful for AABB (Axis-Aligned Bounding Box) collision detection
 * 
 * @param {Object} player - Player state object with x, y, z position
 * @returns {Object} Bounds object with center and half-extents
 */
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

/**
 * Get player collision bounds as min/max corners of AABB
 * Alternative format for some collision detection algorithms
 * 
 * @param {Object} player - Player state object with x, y, z position
 * @returns {Object} Bounds object with min and max corners
 */
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

/**
 * Get raw player dimensions
 * 
 * @returns {Object} Player dimensions {width, height, depth}
 */
export function getPlayerDimensions() {
  return {
    width: PLAYER_DEFAULTS.width,
    height: PLAYER_DEFAULTS.height,
    depth: PLAYER_DEFAULTS.depth,
  };
}
