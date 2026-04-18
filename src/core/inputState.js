import { PLAYER_DEFAULTS } from './constants.js';

export function setupPlayerInput(state) {
  window.addEventListener('keydown', (e) => {
    if (!state.started || state.gameOver) return;

    // Lane switching only when alive
    if (state.player.status === 'alive') {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        state.player.targetLane = Math.max(-1, state.player.targetLane - 1);
      }

      if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        state.player.targetLane = Math.min(1, state.player.targetLane + 1);
      }
    }

    if ((e.code === 'Space' || e.code === 'ArrowUp') && !state.player.isJumping && !state.player.isLowering) {
      state.player.isJumping = true;
      state.player.jumpVelocity = PLAYER_DEFAULTS.jumpStrength;
    }

    if (e.code === 'ArrowDown' && !state.player.isLowering && !state.player.isJumping) {
      state.player.isLowering = true;
      state.player.lowerVelocity = -PLAYER_DEFAULTS.lowerStrength;
    }
  });
}