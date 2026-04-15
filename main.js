import * as THREE from 'https://unpkg.com/three@0.183.2/build/three.module.js';

import { createInitialGameState } from './src/core/gameState.js';
import { setupPlayerInput } from './src/core/inputState.js';

import { updatePlayerMovement } from './src/logic/movement.js';
import { updateWorld } from './src/logic/world.js';

import { createPlayerMesh, syncPlayerMesh } from './src/render/playerMesh.js';
import { createCamera, updateCamera, resizeCamera } from './src/render/camera.js';
import { createScene } from './src/render/scene.js';
import { createLights } from './src/render/lights.js';
import { loadWorldTextures } from './src/render/textures.js';
import { createWorld } from './src/render/worldMesh.js';
import { createScoreHud, updateScoreHud } from './src/ui/hud.js';

// state
const state = createInitialGameState();
const lanePositions = [-1.8, 0, 1.8];

// scene
const scene = createScene();

// camera
const camera = createCamera();

// renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
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
const obstacleGeometry = new THREE.BoxGeometry(1, 1, 1);
const obstacleMaterial = new THREE.MeshLambertMaterial({ color: 0x5a3825 });
const obstacles = [];

function createObstacle(z) {
  const obstacle = new THREE.Mesh(obstacleGeometry, obstacleMaterial);
  const laneIndex = Math.floor(Math.random() * lanePositions.length);
  obstacle.position.set(lanePositions[laneIndex], 0, z);
  scene.add(obstacle);
  obstacles.push(obstacle);
}

for (let i = 0; i < 8; i++) {
  createObstacle(-30 - i * 25);
}

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
      <p>Jump: Space</p>
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
  state.player.x = 0;
  state.player.y = 0.2;
  state.player.z = 3;
  state.player.isJumping = false;
  state.player.jumpVelocity = 0;

  syncPlayerMesh(playerMesh, state.player);

  obstacles.forEach((obstacle, index) => {
    obstacle.position.z = -30 - index * 25;
    const laneIndex = Math.floor(Math.random() * lanePositions.length);
    obstacle.position.x = lanePositions[laneIndex];
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

function updateObstacles() {
  const moveSpeed = state.speed * 25;

  obstacles.forEach((obstacle) => {
    obstacle.position.z += moveSpeed;

    if (obstacle.position.z > 8) {
      obstacle.position.z = -170 - Math.random() * 90;
      const laneIndex = Math.floor(Math.random() * lanePositions.length);
      obstacle.position.x = lanePositions[laneIndex];
    }

    const zClose = obstacle.position.z > 2.0 && obstacle.position.z < 4.0;
    const sameLane = Math.abs(obstacle.position.x - state.player.x) < 0.8;
    const lowEnough = state.player.y < 1.05;

    if (zClose && sameLane && lowEnough) {
      showGameOver();
    }
  });
}

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
    updatePlayerMovement(state.player);
    syncPlayerMesh(playerMesh, state.player);

    updateWorld(state, world, textures);
    updateObstacles();
    updateScore();
  }

  updateCamera(camera, state.player);
  renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
  resizeCamera(camera);
  renderer.setSize(window.innerWidth, window.innerHeight);
});