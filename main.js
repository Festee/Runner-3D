import * as THREE from 'https://unpkg.com/three@0.183.2/build/three.module.js';

import {
  createInitialGameState,
  resetRunState,
  attachRuntimeState,
  setGamePhase,
} from './src/core/gameState.js';
import { setupPlayerInput } from './src/core/inputState.js';
import { updateGameplay } from './src/core/updateGame.js';

import { createKnockbackState } from './src/logic/knockback.js';

import { createPlayerMesh } from './src/render/playerMesh.js';
import { createCamera, resizeCamera } from './src/render/camera.js';
import { createCameraShake } from './src/render/cameraEffects.js';
import { createScene } from './src/render/scene.js';
import { createLights } from './src/render/lights.js';
import { loadWorldTextures } from './src/render/textures.js';
import { createWorld } from './src/render/worldMesh.js';
import { createObstacleMeshes, replaceObstacleMesh, syncObstacleMesh } from './src/render/meshes.js';
import { syncGameplayScene } from './src/render/syncScene.js';

import { createScoreHud, updateScoreHud } from './src/ui/hud.js';
import {
  createOverlay,
  showStartScreen,
  showGameOverScreen,
  hideOverlay,
} from './src/ui/gameOver.js';

import { createInitialObstacles } from './src/entities/obstacles.js';
import { resetObstaclesForStart } from './src/logic/spawning.js';

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
const { ambientLight, directionalLight } = createLights();
scene.add(ambientLight);
scene.add(directionalLight);

// world
const textures = loadWorldTextures();
const world = createWorld(scene, textures);

// player
const playerMesh = createPlayerMesh();
scene.add(playerMesh);

// obstacles
const obstacles = createInitialObstacles();
const obstacleMeshes = createObstacleMeshes(scene, obstacles);

// attach gameplay runtime refs into state
attachRuntimeState(state, {
  world,
  obstacles,
  cameraShake,
  knockback,
});

// UI
const overlay = createOverlay();
const scoreHud = createScoreHud();

function renderStartScreen() {
  setGamePhase(state, 'start');
  showStartScreen(overlay, state.highScore, startGame);
}

function resetEffects() {
  state.effects.cameraShake.isActive = false;
  state.effects.knockback.isActive = false;
}

function resetObstacleMeshes() {
  const resetResults = resetObstaclesForStart(state.entities.obstacles);

  resetResults.forEach((result, index) => {
    if (result.typeChanged) {
      obstacleMeshes[index] = replaceObstacleMesh(
        scene,
        obstacleMeshes[index],
        state.entities.obstacles[index]
      );
    } else {
      syncObstacleMesh(obstacleMeshes[index], state.entities.obstacles[index]);
    }
  });
}

function initializeRun() {
  resetRunState(state);
  resetEffects();
  resetObstacleMeshes();
  updateScoreHud(scoreHud, state.score, state.highScore);
}

function startGame() {
  initializeRun();
  hideOverlay(overlay);
}

function showGameOver() {
  setGamePhase(state, 'gameOver');
  showGameOverScreen(overlay, state.score, state.highScore, renderStartScreen);
}

renderStartScreen();

// input
setupPlayerInput(state);

function animate() {
  requestAnimationFrame(animate);

  if (state.phase === 'running') {
    const gameplayResult = updateGameplay(state, {
      world: state.entities.world,
      textures,
      obstacles: state.entities.obstacles,
      knockback: state.effects.knockback,
      cameraShake: state.effects.cameraShake,
    });

    syncGameplayScene(state, {
      scene,
      world: state.entities.world,
      playerMesh,
      obstacleMeshes,
      obstacles: state.entities.obstacles,
      respawnedIndices: gameplayResult.respawnedIndices,
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
      respawnedIndices: [],
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