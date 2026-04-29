const HIGH_SCORE_STORAGE_KEY = 'runner3d_high_score';

export function loadHighScore() {
  const storedValue = localStorage.getItem(HIGH_SCORE_STORAGE_KEY);
  const parsedValue = Number(storedValue);

  if (Number.isFinite(parsedValue) && parsedValue >= 0) {
    return parsedValue;
  }

  return 0;
}

export function saveHighScore(highScore) {
  localStorage.setItem(HIGH_SCORE_STORAGE_KEY, String(highScore));
}