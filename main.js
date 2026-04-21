import * as THREE from 'https://unpkg.com/three@0.183.2/build/three.module.js';

import { createInitialGameState } from './src/core/gameState.js';
import { setupPlayerInput } from './src/core/inputState.js';

import { updatePlayerMovement } from './src/logic/movement.js';
import { updateWorld } from './src/logic/world.js';
import { markPlayerHit } from './src/logic/playerStateTransitions.js';
import { createKnockbackState, startKnockback, updateKnockback, isKnockbackActive } from './src/logic/knockback.js';
import { updateObstacles, resetObstaclesForStart } from './src/logic/spawning.js';
import { findFirstCollidingObstacle } from './src/logic/collisions.js';

import { createPlayerMesh, syncPlayerMesh } from './src/render/playerMesh.js';
import { createCamera, updateCamera, resizeCamera } from './src/render/camera.js';
import { createCameraShake, startCameraShake, updateCameraShake } from './src/render/cameraEffects.js';
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
      <button id="start-btn" style="font-size:18px; padding:12px 24px; cursor:pointer;">Start</button>
    </div>
  `;

  document.getElementById('start-btn').addEventListener('click', startGame);
}

function startGame() {
  state.started = true;
  state.gameOver = false;
  state.score = 0;
  state.speed = 0.010;

  state.player.lane = 0;
  state.player.targetLane = 0;
  state.player.x = 0;
  state.player.y = 0.2;
  state.player.z = 3;
  state.player.isJumping = false;
  state.player.jumpVelocity = 0;
  state.player.isLowering = false;
  state.player.lowerVelocity = 0;
  state.player.status = 'alive';

  // Reset effects
  cameraShake.isActive = false;
  knockback.isActive = false;

  syncPlayerMesh(playerMesh, state.player);

  const resetResults = resetObstaclesForStart(obstacles);

  resetResults.forEach((result, index) => {
    if (result.typeChanged) {
      obstacleMeshes[index] = replaceObstacleMesh(scene, obstacleMeshes[index], obstacles[index]);
    } else {
      syncObstacleMesh(obstacleMeshes[index], obstacles[index]);
    }
  });

  updateScoreHud(scoreHud, 0);
  overlay.style.display = 'none';
}

function showGameOver() {
  state.gameOver = true;
  overlay.style.display = 'flex';
  overlay.innerHTML = `
    <div style="text-align:center; color:white; background:#000000c7; padding:30px; border-radius:16px; min-width:280px; font-family:Arial,sans-serif;">
      <h1 style="margin-top:0;">Game Over</h1>
      <p>Your score: ${state.score}</p>
      <button id="restart-btn" style="font-size:18px; padding:12px 24px; cursor:pointer;">Restart</button>
    </div>
  `;

  document.getElementById('restart-btn').addEventListener('click', renderStartScreen);
}

renderStartScreen();

// input
setupPlayerInput(state);

function updateScore() {
  state.score += 1;
  updateScoreHud(scoreHud, state.score);

  if (state.score % 900 === 0) {
    state.speed += 0.001;
  }
}

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

    const hitObstacle = findFirstCollidingObstacle(state.player, obstacles);

    if (hitObstacle) {
      markPlayerHit(state.player);
      state.gameOver = true;

      const knockbackDirection = hitObstacle.x > state.player.x ? 1 : -1;

      // Start knockback and camera shake effects
      startKnockback(knockback, state.player, knockbackDirection, 1.0, 24);
      startCameraShake(cameraShake, 0.35, 12);

      // Show game over screen immediately
      showGameOver();
    }

    updateScore();
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