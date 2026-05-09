import { saveHighScore } from '../core/highScoreStorage.js';
import { saveTotalCoins } from '../core/coinStorage.js';
import { pipe } from '../core/fp.js';
import { calculateSpeedFromScore } from './difficulty.js';

const SCORE_STEP = 1;
const COLLECTIBLE_SCORE_VALUE = 50;
const SCORE_KEYS = ['score', 'coinsCollected', 'totalCoins', 'highScore', 'speed'];

function projectScoreSnapshot(stateLike) {
  return SCORE_KEYS.reduce((snapshot, key) => {
    snapshot[key] = stateLike[key];
    return snapshot;
  }, {});
}

function withScoreDelta(delta, collectedCoinsDelta = 0) {
  return (currentState) => {
    const nextScore = currentState.score + delta;
    const nextCoinsCollected = currentState.coinsCollected + collectedCoinsDelta;
    const nextTotalCoins = currentState.totalCoins + collectedCoinsDelta;
    const nextHighScore = Math.max(currentState.highScore, nextScore);

    return {
      score: nextScore,
      coinsCollected: nextCoinsCollected,
      totalCoins: nextTotalCoins,
      highScore: nextHighScore,
      speed: calculateSpeedFromScore(nextScore),
      highScoreChanged: nextHighScore !== currentState.highScore,
      totalCoinsChanged: nextTotalCoins !== currentState.totalCoins,
    };
  };
}

function persistScoreChanges(nextScoreState) {
  if (nextScoreState.highScoreChanged) {
    saveHighScore(nextScoreState.highScore);
  }

  if (nextScoreState.totalCoinsChanged) {
    saveTotalCoins(nextScoreState.totalCoins);
  }

  return nextScoreState;
}

function applyNextScoreState(state, nextScoreState) {
  Object.assign(state, projectScoreSnapshot(nextScoreState));
  return projectScoreSnapshot(state);
}

function applyScoreTransform(state, scoreTransform) {
  return pipe(
    projectScoreSnapshot(state),
    scoreTransform,
    persistScoreChanges,
    (nextScoreState) => applyNextScoreState(state, nextScoreState)
  );
}

export function calculateNextScoreState(
  currentScore,
  currentCoinsCollected,
  currentTotalCoins,
  currentHighScore,
  delta,
  collectedCoinsDelta = 0
) {
  return withScoreDelta(delta, collectedCoinsDelta)({
    score: currentScore,
    coinsCollected: currentCoinsCollected,
    totalCoins: currentTotalCoins,
    highScore: currentHighScore,
    speed: calculateSpeedFromScore(currentScore),
  });
}

export function updateScore(state) {
  return applyScoreTransform(state, withScoreDelta(SCORE_STEP));
}

export function addCollectedCoinsScore(state, collectedCount) {
  if (collectedCount <= 0) {
    return projectScoreSnapshot(state);
  }

  return applyScoreTransform(
    state,
    withScoreDelta(COLLECTIBLE_SCORE_VALUE * collectedCount, collectedCount)
  );
}

export function addCollectibleScore(state) {
  return addCollectedCoinsScore(state, 1);
}
