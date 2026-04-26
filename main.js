import * as THREE from 'https://unpkg.com/three@0.183.2/build/three.module.js';

import {
  createInitialGameState,
  attachRuntimeState,
  setGamePhase,
} from './src/core/gameState.js';
import { initializeRun } from './src/core/runLifecycle.js';
import { setupPlayerInput } from './src/core/inputState.js';
import { updateGameplay } from './src/core/updateGame.js';

import { createKnockbackState } from './src/logic/knockback.js';
import { ensureAudioReady } from './src/audio/coinSound.js';

import { createPlayerMesh } from './src/render/playerMesh.js';
import { createCamera, resizeCamera } from './src/render/camera.js';
import { createCameraShake } from './src/render/cameraEffects.js';
import { createScene } from './src/render/scene.js';
import { createLights } from './src/render/lights.js';
import { applyVisualMode } from './src/render/theme.js';
import { loadWorldTextures } from './src/render/textures.js';
import { createWorld } from './src/render/worldMesh.js';
import { createObstacleMeshes } from './src/render/meshes.js';
import { syncGameplayScene } from './src/render/syncScene.js';

import { createScoreHud, updateScoreHud } from './src/ui/hud.js';
import {
  createOverlay,
  showStartScreen,
  showGameOverScreen,
  hideOverlay,
} from './src/ui/gameOver.js';

import { createInitialObstacles } from './src/entities/obstacles.js';
import { createInitialCollectibles } from './src/entities/collectibles.js';
import { createCollectibleMeshes } from './src/render/collectibleMeshes.js';

// state
const state = createInitialGameState();

// effects
const cameraShake = createCameraShake();
const knockback = createKnockbackState();
let cameraBasePosition = { x: 0, y: 3, z: 8 };

// scene
const scene = createScene();

// camera
const camera = createCamera();

// renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
document.body.style.margin = '0';
document.body.style.overflow = 'hidden';
document.body.appendChild(renderer.domElement);

// lights
const { ambientLight, directionalLight, nightFillLight } = createLights();
scene.add(ambientLight);
scene.add(directionalLight);
scene.add(nightFillLight);

// world
const textures = loadWorldTextures();
const world = createWorld(scene, textures);

// player
const playerMesh = createPlayerMesh();
scene.add(playerMesh);

// obstacles
const obstacles = createInitialObstacles();
const collectibles = createInitialCollectibles();
const obstacleMeshes = createObstacleMeshes(scene, obstacles);
const collectibleMeshes = createCollectibleMeshes(scene, collectibles);

// attach gameplay runtime refs into state
attachRuntimeState(state, {
  world,
  obstacles,
  collectibles,
  cameraShake,
  knockback,
});

// UI
const overlay = createOverlay();
const scoreHud = createScoreHud();

function renderStartScreen() {
  setGamePhase(state, 'start');
  showStartScreen(overlay, state.highScore, startGame, state.ui.visualMode);
}

function startGame(visualMode = 'day') {
  state.ui.visualMode = visualMode;
  applyVisualMode(
    scene,
    state.entities.world,
    { ambientLight, directionalLight, nightFillLight },
    state.ui.visualMode
  );
  ensureAudioReady();
  initializeRun(state, {
    scene,
    obstacleMeshes,
    collectibleMeshes,
    scoreHud,
  });
  hideOverlay(overlay);
}

function showGameOver() {
  setGamePhase(state, 'gameOver');
  showGameOverScreen(overlay, state.score, state.highScore, renderStartScreen);
}

renderStartScreen();
applyVisualMode(
  scene,
  state.entities.world,
  { ambientLight, directionalLight, nightFillLight },
  state.ui.visualMode
);

// input
setupPlayerInput(state);

function animate() {
  requestAnimationFrame(animate);

  if (state.phase === 'running') {
    const gameplayResult = updateGameplay(state, {
      world: state.entities.world,
      textures,
      obstacles: state.entities.obstacles,
      collectibles: state.entities.collectibles,
      knockback: state.effects.knockback,
      cameraShake: state.effects.cameraShake,
    });

    syncGameplayScene(state, {
      scene,
      world: state.entities.world,
      playerMesh,
      obstacleMeshes,
      obstacles: state.entities.obstacles,
      collectibleMeshes,
      collectibles: state.entities.collectibles,
      respawnedIndices: gameplayResult.respawnedIndices,
      respawnedCollectibleIndices: gameplayResult.respawnedCollectibleIndices,
      camera,
      cameraShake: state.effects.cameraShake,
      cameraBasePosition,
    });

    if (gameplayResult.hitObstacle) {
      showGameOver();
    }

    if (gameplayResult.scoreResult) {
      updateScoreHud(
        scoreHud,
        gameplayResult.scoreResult.score,
        gameplayResult.scoreResult.coinsCollected,
        gameplayResult.scoreResult.highScore
      );
    }
  } else {
    syncGameplayScene(state, {
      scene,
      world: state.entities.world,
      playerMesh,
      obstacleMeshes,
      obstacles: state.entities.obstacles,
      collectibleMeshes,
      collectibles: state.entities.collectibles,
      respawnedIndices: [],
      respawnedCollectibleIndices: [],
      camera,
      cameraShake: state.effects.cameraShake,
      cameraBasePosition,
    });
  }

  renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
  resizeCamera(camera);
  renderer.setSize(window.innerWidth, window.innerHeight);
});
