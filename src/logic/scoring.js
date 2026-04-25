import { saveHighScore } from '../core/gameState.js';

const SCORE_STEP = 1;
const COLLECTIBLE_SCORE_VALUE = 50;

const BASE_SPEED = 0.005;
const SPEED_INCREASE_INTERVAL = 600;
const SPEED_INCREASE_AMOUNT = 0.001;
const MAX_SPEED = 0.020;

function calculateSpeedFromScore(score) {
  const level = Math.floor(score / SPEED_INCREASE_INTERVAL);
  const nextSpeed = BASE_SPEED + level * SPEED_INCREASE_AMOUNT;

  return Math.min(nextSpeed, MAX_SPEED);
}

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
