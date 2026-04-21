import { createInitialPlayerState } from '../entities/player.js';

const INITIAL_SPEED = 0.010;

export function createInitialGameState() {
  return {
    started: false,
    score: 0,
    gameOver: false,
    speed: INITIAL_SPEED,
    player: createInitialPlayerState(),
  };
}

export function resetRunState(state) {
  const freshState = createInitialGameState();

  state.started = true;
  state.score = freshState.score;
  state.gameOver = freshState.gameOver;
  state.speed = freshState.speed;
  state.player = freshState.player;

  return state;
}

export function resetGameState() {
  return createInitialGameState();
}