import { PLAYER_DEFAULTS } from '../core/constants.js';
import { getPlayerTargetX, isPlayerNearLaneTarget } from '../entities/player.js';
import { canPlayerMove } from './playerStateTransitions.js';

export function updatePlayerMovement(player) {
  // Only process movement if player is alive
  if (!canPlayerMove(player)) {
    return;
  }

  const targetX = getPlayerTargetX(player.targetLane);
  player.x += (targetX - player.x) * PLAYER_DEFAULTS.laneLerpFactor;

  // Keep lane as a logical integer, update it only when the player is close enough
  if (isPlayerNearLaneTarget(player)) {
    player.x = targetX;
    player.lane = player.targetLane;
  }

  if (player.isJumping) {
    player.y += player.jumpVelocity;
    player.jumpVelocity -= player.gravity;

    if (player.y <= PLAYER_DEFAULTS.groundY) {
      player.y = PLAYER_DEFAULTS.groundY;
      player.isJumping = false;
      player.jumpVelocity = 0;
    }
  } else if (player.isLowering) {
    player.y += player.lowerVelocity;

    if (player.y <= PLAYER_DEFAULTS.lowerY) {
      player.y = PLAYER_DEFAULTS.lowerY;
      player.isLowering = false;
      player.lowerVelocity = 0;
      player.lowerTimer = PLAYER_DEFAULTS.lowerHoldFrames;
      player.isRecoveringFromLower = true;
    }
  } else if (player.isRecoveringFromLower) {
    if (player.lowerTimer > 0) {
      player.lowerTimer -= 1;
    } else {
      player.y += PLAYER_DEFAULTS.lowerRecoverSpeed;

      if (player.y >= PLAYER_DEFAULTS.groundY) {
        player.y = PLAYER_DEFAULTS.groundY;
        player.isRecoveringFromLower = false;
        player.lowerTimer = 0;
      }
    }
  }
}