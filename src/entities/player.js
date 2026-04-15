import { PLAYER_DEFAULTS, LANE_POSITIONS } from '../core/constants.js';

export function createInitialPlayerState() {
  return {
    lane: PLAYER_DEFAULTS.lane,
    x: PLAYER_DEFAULTS.x,
    y: PLAYER_DEFAULTS.y,
    z: PLAYER_DEFAULTS.z,
    isJumping: PLAYER_DEFAULTS.isJumping,
    jumpVelocity: PLAYER_DEFAULTS.jumpVelocity,
    gravity: PLAYER_DEFAULTS.gravity,
  };
}

export function getPlayerTargetX(lane) {
  return LANE_POSITIONS[lane + 1];
}