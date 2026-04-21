const SCORE_STEP = 1;
const SPEED_INCREASE_INTERVAL = 900;
const SPEED_INCREASE_AMOUNT = 0.001;

export function updateScore(state) {
  state.score += SCORE_STEP;

  if (state.score > state.highScore) {
    state.highScore = state.score;
  }

  if (state.score % SPEED_INCREASE_INTERVAL === 0) {
    state.speed += SPEED_INCREASE_AMOUNT;
  }

  return {
    score: state.score,
    highScore: state.highScore,
    speed: state.speed,
  };
}