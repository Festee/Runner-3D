import { PLAYER_DEFAULTS } from './constants.js';

export function setupPlayerInput(state) {
  window.addEventListener('keydown', (e) => {
    if (!state.started || state.gameOver) return;

    if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
      state.player.lane = Math.max(-1, state.player.lane - 1);
    }

    if (e.code === 'ArrowRight' || e.code === 'KeyD') {
      state.player.lane = Math.min(1, state.player.lane + 1);
    }

    if ((e.code === 'Space' || e.code === 'ArrowUp') && !state.player.isJumping) {
      state.player.isJumping = true;
      state.player.jumpVelocity = PLAYER_DEFAULTS.jumpStrength;
    }
  });
}