import { saveHighScore } from '../core/highScoreStorage.js';
import { saveTotalCoins } from '../core/coinStorage.js';
import { calculateSpeedFromScore } from './difficulty.js';

const SCORE_STEP = 1;
const COLLECTIBLE_SCORE_VALUE = 50;

export function calculateNextScoreState(
  currentScore,
  currentCoinsCollected,
  currentTotalCoins,
  currentHighScore,
  delta,
  collectedCoinsDelta = 0
) {
  const nextScore = currentScore + delta;
  const nextCoinsCollected = currentCoinsCollected + collectedCoinsDelta;
  const nextTotalCoins = currentTotalCoins + collectedCoinsDelta;
  const nextHighScore = Math.max(currentHighScore, nextScore);
  const nextSpeed = calculateSpeedFromScore(nextScore);

  return {
    score: nextScore,
    coinsCollected: nextCoinsCollected,
    totalCoins: nextTotalCoins,
    highScore: nextHighScore,
    speed: nextSpeed,
    highScoreChanged: nextHighScore !== currentHighScore,
    totalCoinsChanged: nextTotalCoins !== currentTotalCoins,
  };
}

function applyScoreState(state, nextScoreState) {
  state.score = nextScoreState.score;
  state.coinsCollected = nextScoreState.coinsCollected;
  state.totalCoins = nextScoreState.totalCoins;
  state.highScore = nextScoreState.highScore;
  state.speed = nextScoreState.speed;

  if (nextScoreState.highScoreChanged) {
    saveHighScore(nextScoreState.highScore);
  }

  if (nextScoreState.totalCoinsChanged) {
    saveTotalCoins(nextScoreState.totalCoins);
  }

  return {
    score: state.score,
    coinsCollected: state.coinsCollected,
    totalCoins: state.totalCoins,
    highScore: state.highScore,
    speed: state.speed,
  };
}

function applyScoreDelta(state, delta, collectedCoinsDelta = 0) {
  const nextScoreState = calculateNextScoreState(
    state.score,
    state.coinsCollected,
    state.totalCoins,
    state.highScore,
    delta,
    collectedCoinsDelta
  );

  return applyScoreState(state, nextScoreState);
}

export function updateScore(state) {
  return applyScoreDelta(state, SCORE_STEP);
}

export function addCollectedCoinsScore(state, collectedCount) {
  if (collectedCount <= 0) {
    return {
      score: state.score,
      coinsCollected: state.coinsCollected,
      totalCoins: state.totalCoins,
      highScore: state.highScore,
      speed: state.speed,
    };
  }

  return applyScoreDelta(
    state,
    COLLECTIBLE_SCORE_VALUE * collectedCount,
    collectedCount
  );
}

export function addCollectibleScore(state) {
  return addCollectedCoinsScore(state, 1);
}