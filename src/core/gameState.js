import { createInitialPlayerState } from '../entities/player.js';

export function createInitialGameState() {
  return {
    started: false,
    score: 0,
    gameOver: false,
    speed: 0.010,
    player: createInitialPlayerState(),
  };
}

export function resetGameState() {
  return createInitialGameState();
}