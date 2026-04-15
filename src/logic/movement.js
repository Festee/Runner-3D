import { PLAYER_DEFAULTS } from '../core/constants.js';
import { getPlayerTargetX } from '../entities/player.js';

export function updatePlayerMovement(player) {
  const targetX = getPlayerTargetX(player.lane);

  player.x += (targetX - player.x) * PLAYER_DEFAULTS.laneLerpFactor;

  if (player.isJumping) {
    player.y += player.jumpVelocity;
    player.jumpVelocity -= player.gravity;

    if (player.y <= PLAYER_DEFAULTS.groundY) {
      player.y = PLAYER_DEFAULTS.groundY;
      player.isJumping = false;
      player.jumpVelocity = 0;
    }
  }
}