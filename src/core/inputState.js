import { PLAYER_DEFAULTS } from './constants.js';
import {
  canPlayerChangeLane,
  canPlayerJump,
  canPlayerLower,
} from '../logic/playerStateTransitions.js';

function movePlayerLeft(player) {
  if (!canPlayerChangeLane(player)) {
    return player;
  }

  return {
    ...player,
    targetLane: Math.max(-1, player.targetLane - 1),
  };
}

function movePlayerRight(player) {
  if (!canPlayerChangeLane(player)) {
    return player;
  }

  return {
    ...player,
    targetLane: Math.min(1, player.targetLane + 1),
  };
}

function startPlayerJump(player) {
  if (!canPlayerJump(player)) {
    return player;
  }

  return {
    ...player,
    isJumping: true,
    jumpVelocity: PLAYER_DEFAULTS.jumpStrength,
  };
}

function startPlayerLower(player) {
  if (!canPlayerLower(player)) {
    return player;
  }

  return {
    ...player,
    isLowering: true,
    isRecoveringFromLower: false,
    lowerVelocity: -PLAYER_DEFAULTS.lowerStrength,
    lowerTimer: PLAYER_DEFAULTS.lowerHoldFrames,
  };
}

function applyPlayerInput(player, code) {
  if (code === 'ArrowLeft' || code === 'KeyA') {
    return movePlayerLeft(player);
  }

  if (code === 'ArrowRight' || code === 'KeyD') {
    return movePlayerRight(player);
  }

  if (code === 'Space' || code === 'ArrowUp') {
    return startPlayerJump(player);
  }

  if (code === 'ArrowDown') {
    return startPlayerLower(player);
  }

  return player;
}

export function setupPlayerInput(state) {
  window.addEventListener('keydown', (e) => {
    if (!state.started || state.gameOver) {
      return;
    }

    state.player = applyPlayerInput(state.player, e.code);
  });
}