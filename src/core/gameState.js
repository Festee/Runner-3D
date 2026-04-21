import { createInitialPlayerState } from '../entities/player.js';

const INITIAL_SPEED = 0.010;

export function createInitialGameState() {
  return {
    phase: 'start',
    started: false,
    score: 0,
    highScore: 0,
    gameOver: false,
    speed: INITIAL_SPEED,
    player: createInitialPlayerState(),

    entities: {
      world: null,
      obstacles: [],
    },

    effects: {
      cameraShake: null,
      knockback: null,
    },

    ui: {
      overlayVisible: true,
    },
  };
}

export function attachRuntimeState(
  state,
  {
    world = null,
    obstacles = [],
    cameraShake = null,
    knockback = null,
  } = {}
) {
  state.entities.world = world;
  state.entities.obstacles = obstacles;
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
  state.speed = INITIAL_SPEED;
  state.player = createInitialPlayerState();

  return state;
}

export function resetGameState() {
  return createInitialGameState();
}