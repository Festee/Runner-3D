import { createInitialPlayerState } from '../entities/player.js';

const INITIAL_SPEED = 0.010;
const HIGH_SCORE_STORAGE_KEY = 'runner3d_high_score';

function loadHighScore() {
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

export function createInitialGameState() {
  return {
    phase: 'start',
    started: false,
    score: 0,
    coinsCollected: 0,
    highScore: loadHighScore(),
    gameOver: false,
    speed: INITIAL_SPEED,
    player: createInitialPlayerState(),

    entities: {
      world: null,
      obstacles: [],
      collectibles: [],
    },

    effects: {
      cameraShake: null,
      knockback: null,
    },

    ui: {
      overlayVisible: true,
      visualMode: 'day',
    },
  };
}

export function attachRuntimeState(
  state,
  {
    world = null,
    obstacles = [],
    collectibles = [],
    cameraShake = null,
    knockback = null,
  } = {}
) {
  state.entities.world = world;
  state.entities.obstacles = obstacles;
  state.entities.collectibles = collectibles;
  state.effects.cameraShake = cameraShake;
  state.effects.knockback = knockback;

  return state;
}

export function setGamePhase(state, phase) {
  state.phase = phase;
  state.started = phase === 'running';
  state.gameOver = phase === 'gameOver';
  state.ui.overlayVisible = phase !== 'running';

  return state;
}

export function resetRunState(state) {
  setGamePhase(state, 'running');
  state.score = 0;
  state.coinsCollected = 0;
  state.speed = INITIAL_SPEED;
  state.player = createInitialPlayerState();

  return state;
}

export function resetGameState() {
  return createInitialGameState();
}
