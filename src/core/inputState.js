import { PLAYER_DEFAULTS } from './constants.js';
import {
  canPlayerChangeLane,
  canPlayerJump,
  canPlayerLower,
} from '../logic/playerStateTransitions.js';

export function setupPlayerInput(state) {
  window.addEventListener('keydown', (e) => {
    if (!state.started || state.gameOver) return;

    // Lane switching - check if player can change lanes
    if (canPlayerChangeLane(state.player)) {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        state.player.targetLane = Math.max(-1, state.player.targetLane - 1);
      }

      if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        state.player.targetLane = Math.min(1, state.player.targetLane + 1);
      }
    }

    // Jump - check if player can jump
    if ((e.code === 'Space' || e.code === 'ArrowUp') && canPlayerJump(state.player)) {
      state.player.isJumping = true;
      state.player.jumpVelocity = PLAYER_DEFAULTS.jumpStrength;
    }

    // Lower - check if player can lower
    if (e.code === 'ArrowDown' && canPlayerLower(state.player)) {
      state.player.isLowering = true;
      state.player.lowerVelocity = -PLAYER_DEFAULTS.lowerStrength;
    }
  });
}