import { PLAYER_DEFAULTS } from '../core/constants.js';
import { getPlayerTargetX } from '../entities/player.js';
import { canPlayerMove } from './playerStateTransitions.js';

export function updatePlayerMovement(player) {
  // Only process movement if player is alive
  if (!canPlayerMove(player)) {
    return;
  }

  // Smooth lane interpolation towards target lane
  if (player.lane !== player.targetLane) {
    player.lane += (player.targetLane - player.lane) * PLAYER_DEFAULTS.laneLerpFactor;
  }

  const targetX = getPlayerTargetX(player.targetLane);

  player.x += (targetX - player.x) * PLAYER_DEFAULTS.laneLerpFactor;

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
    player.lowerVelocity -= player.gravity;

    if (player.y <= PLAYER_DEFAULTS.lowerY) {
      player.y = PLAYER_DEFAULTS.lowerY;
      player.isLowering = false;
      player.lowerVelocity = 0;
    }
  }
}