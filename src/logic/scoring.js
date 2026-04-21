import { saveHighScore } from '../core/gameState.js';

const SCORE_STEP = 1;

const BASE_SPEED = 0.007;
const SPEED_INCREASE_INTERVAL = 600;
const SPEED_INCREASE_AMOUNT = 0.001;
const MAX_SPEED = 0.020;

function calculateSpeedFromScore(score) {
  const level = Math.floor(score / SPEED_INCREASE_INTERVAL);
  const nextSpeed = BASE_SPEED + level * SPEED_INCREASE_AMOUNT;

  return Math.min(nextSpeed, MAX_SPEED);
}

export function updateScore(state) {
  state.score += SCORE_STEP;

  if (state.score > state.highScore) {
    state.highScore = state.score;
    saveHighScore(state.highScore);
  }

  state.speed = calculateSpeedFromScore(state.score);

  return {
    score: state.score,
    highScore: state.highScore,
    speed: state.speed,
  };
}