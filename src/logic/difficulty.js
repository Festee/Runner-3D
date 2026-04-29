const BASE_SPEED = 0.005;
const SPEED_INCREASE_INTERVAL = 600;
const SPEED_INCREASE_AMOUNT = 0.001;
const MAX_SPEED = 0.020;

export function calculateDifficultyLevel(score) {
  return Math.floor(score / SPEED_INCREASE_INTERVAL);
}

export function calculateSpeedFromScore(score) {
  const level = calculateDifficultyLevel(score);
  const nextSpeed = BASE_SPEED + level * SPEED_INCREASE_AMOUNT;

  return Math.min(nextSpeed, MAX_SPEED);
}