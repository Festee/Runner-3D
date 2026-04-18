import { PLAYER_DEFAULTS, LANE_POSITIONS } from '../core/constants.js';

export function createInitialPlayerState() {
  return {
    lane: PLAYER_DEFAULTS.lane,
    targetLane: PLAYER_DEFAULTS.lane,
    x: PLAYER_DEFAULTS.x,
    y: PLAYER_DEFAULTS.y,
    z: PLAYER_DEFAULTS.z,
    isJumping: PLAYER_DEFAULTS.isJumping,
    jumpVelocity: PLAYER_DEFAULTS.jumpVelocity,
    isLowering: PLAYER_DEFAULTS.isLowering,
    lowerVelocity: PLAYER_DEFAULTS.lowerVelocity,
    gravity: PLAYER_DEFAULTS.gravity,
    status: 'alive',
  };
}

export function getPlayerTargetX(lane) {
  return LANE_POSITIONS[lane + 1];
}