import { saveHighScore } from '../core/gameState.js';
import { calculateSpeedFromScore } from './difficulty.js';

const SCORE_STEP = 1;
const COLLECTIBLE_SCORE_VALUE = 50;

function applyScoreDelta(state, delta) {
  state.score += delta;

  if (state.score > state.highScore) {
    state.highScore = state.score;
    saveHighScore(state.highScore);
  }

  state.speed = calculateSpeedFromScore(state.score);

  return {
    score: state.score,
    coinsCollected: state.coinsCollected,
    highScore: state.highScore,
    speed: state.speed,
  };
}

export function updateScore(state) {
  return applyScoreDelta(state, SCORE_STEP);
}

export function addCollectibleScore(state) {
  state.coinsCollected += 1;
  return applyScoreDelta(state, COLLECTIBLE_SCORE_VALUE);
}
