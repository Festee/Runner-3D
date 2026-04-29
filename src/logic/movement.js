import { PLAYER_DEFAULTS } from '../core/constants.js';
import { getPlayerTargetX, isPlayerNearLaneTarget } from '../entities/player.js';
import { canPlayerMove } from './playerStateTransitions.js';

function updateLaneMovement(player) {
  const targetX = getPlayerTargetX(player.targetLane);

  player.x += (targetX - player.x) * PLAYER_DEFAULTS.laneLerpFactor;

  if (isPlayerNearLaneTarget(player)) {
    player.x = targetX;
    player.lane = player.targetLane;
  }
}

function updateJumpMovement(player) {
  if (!player.isJumping) {
    return false;
  }

  player.y += player.jumpVelocity;
  player.jumpVelocity -= player.gravity;

  if (player.y <= PLAYER_DEFAULTS.groundY) {
    player.y = PLAYER_DEFAULTS.groundY;
    player.isJumping = false;
    player.jumpVelocity = 0;
  }

  return true;
}

function updateLowerMovement(player) {
  if (!player.isLowering) {
    return false;
  }

  player.y += player.lowerVelocity;

  if (player.y <= PLAYER_DEFAULTS.lowerY) {
    player.y = PLAYER_DEFAULTS.lowerY;
    player.isLowering = false;
    player.lowerVelocity = 0;
    player.lowerTimer = PLAYER_DEFAULTS.lowerHoldFrames;
    player.isRecoveringFromLower = true;
  }

  return true;
}

function updateLowerRecoveryMovement(player) {
  if (!player.isRecoveringFromLower) {
    return false;
  }

  if (player.lowerTimer > 0) {
    player.lowerTimer -= 1;
    return true;
  }

  player.y += PLAYER_DEFAULTS.lowerRecoverSpeed;

  if (player.y >= PLAYER_DEFAULTS.groundY) {
    player.y = PLAYER_DEFAULTS.groundY;
    player.isRecoveringFromLower = false;
    player.lowerTimer = 0;
  }

  return true;
}

function updateVerticalMovement(player) {
  if (updateJumpMovement(player)) {
    return;
  }

  if (updateLowerMovement(player)) {
    return;
  }

  updateLowerRecoveryMovement(player);
}

export function updatePlayerMovement(player) {
  if (!canPlayerMove(player)) {
    return;
  }

  updateLaneMovement(player);
  updateVerticalMovement(player);
}