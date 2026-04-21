import * as THREE from 'https://unpkg.com/three@0.183.2/build/three.module.js';

import { createInitialGameState, resetRunState } from './src/core/gameState.js';
import { setupPlayerInput } from './src/core/inputState.js';

import { updatePlayerMovement } from './src/logic/movement.js';
import { updateWorld } from './src/logic/world.js';
import { createKnockbackState, updateKnockback, isKnockbackActive } from './src/logic/knockback.js';
import { updateObstacles, resetObstaclesForStart } from './src/logic/spawning.js';
import { checkAndResolveObstacleCollision } from './src/logic/collisions.js';
import { updateScore } from './src/logic/scoring.js';

import { createPlayerMesh, syncPlayerMesh } from './src/render/playerMesh.js';
import { createCamera, updateCamera, resizeCamera } from './src/render/camera.js';
import { createCameraShake, updateCameraShake } from './src/render/cameraEffects.js';
import { createScene } from './src/render/scene.js';
import { createLights } from './src/render/lights.js';
import { loadWorldTextures } from './src/render/textures.js';
import { createWorld } from './src/render/worldMesh.js';
import { createObstacleMeshes, replaceObstacleMesh, syncObstacleMesh } from './src/render/meshes.js';
import { createScoreHud, updateScoreHud } from './src/ui/hud.js';

import { createInitialObstacles } from './src/entities/obstacles.js';

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

// UI
const overlay = document.createElement('div');
overlay.style.position = 'fixed';
overlay.style.inset = '0';
overlay.style.display = 'flex';
overlay.style.justifyContent = 'center';
overlay.style.alignItems = 'center';
overlay.style.background = 'rgba(0,0,0,0.35)';
overlay.style.zIndex = '10';

const scoreHud = createScoreHud();

document.body.appendChild(overlay);

function renderStartScreen() {
  overlay.style.display = 'flex';
  overlay.innerHTML = `
    <div style="text-align:center; color:white; background:#000000c7; padding:30px; border-radius:16px; min-width:280px; font-family:Arial,sans-serif;">
      <h1 style="margin-top:0;">Runner 3D</h1>
      <p>Press Start to begin</p>
      <p>Move: A / D or ← / →</p>
      <p>Jump: Space or ↑</p>
      <p>Lower: ↓</p>
      <p>High Score: ${state.highScore}</p>
      <button id="start-btn" style="font-size:18px; padding:12px 24px; cursor:pointer;">Start</button>
    </div>
  `;

  document.getElementById('start-btn').addEventListener('click', startGame);
}

function resetEffects() {
  cameraShake.isActive = false;
  knockback.isActive = false;
}

function resetObstacleMeshes() {
  const resetResults = resetObstaclesForStart(obstacles);

  resetResults.forEach((result, index) => {
    if (result.typeChanged) {
      obstacleMeshes[index] = replaceObstacleMesh(scene, obstacleMeshes[index], obstacles[index]);
    } else {
      syncObstacleMesh(obstacleMeshes[index], obstacles[index]);
    }
  });
}

function initializeRun() {
  resetRunState(state);
  resetEffects();
  resetObstacleMeshes();
  syncPlayerMesh(playerMesh, state.player);
  updateScoreHud(scoreHud, state.score);
}

function startGame() {
  initializeRun();
  overlay.style.display = 'none';
}

function showGameOver() {
  state.gameOver = true;
  overlay.style.display = 'flex';
  overlay.innerHTML = `
    <div style="text-align:center; color:white; background:#000000c7; padding:30px; border-radius:16px; min-width:280px; font-family:Arial,sans-serif;">
      <h1 style="margin-top:0;">Game Over</h1>
      <p>Your score: ${state.score}</p>
      <p>High Score: ${state.highScore}</p>
      <button id="restart-btn" style="font-size:18px; padding:12px 24px; cursor:pointer;">Restart</button>
    </div>
  `;

  document.getElementById('restart-btn').addEventListener('click', renderStartScreen);
}

renderStartScreen();

// input
setupPlayerInput(state);

function animate() {
  requestAnimationFrame(animate);

  if (state.started && !state.gameOver) {
    // Apply knockback effect if active
    if (isKnockbackActive(knockback)) {
      updateKnockback(knockback, state.player);
    }

    updatePlayerMovement(state.player);
    syncPlayerMesh(playerMesh, state.player);

    updateWorld(state, world, textures);

    const respawnedIndices = updateObstacles(state, obstacles);

    for (let i = 0; i < obstacles.length; i++) {
      if (respawnedIndices.includes(i)) {
        obstacleMeshes[i] = replaceObstacleMesh(scene, obstacleMeshes[i], obstacles[i]);
      } else {
        syncObstacleMesh(obstacleMeshes[i], obstacles[i]);
      }
    }

    const hitObstacle = checkAndResolveObstacleCollision(
      state,
      obstacles,
      knockback,
      cameraShake
    );

    if (hitObstacle) {
      showGameOver();
    } else {
      const scoreResult = updateScore(state);
      updateScoreHud(scoreHud, scoreResult.score);
    }
  }

  // Update camera position normally
  updateCamera(camera, state.player);
  
  // Store base position for camera shake
  cameraBasePosition.x = camera.position.x;
  cameraBasePosition.y = camera.position.y;
  cameraBasePosition.z = camera.position.z;
  
  // Apply camera shake if active
  updateCameraShake(cameraShake, camera, cameraBasePosition);

  renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
  resizeCamera(camera);
  renderer.setSize(window.innerWidth, window.innerHeight);
});