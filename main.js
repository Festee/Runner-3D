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
const obstacles = [];

// Function to create realistic obstacle meshes
function createObstacleMesh(type) {
  const group = new THREE.Group();
  
  if (type === 'tall') {
    // Tall obstacle - wooden gate with gap at bottom to duck under
    const woodColor = 0x8B6F47;
    const metalColor = 0x555555;
    
    // Create upper fence panels - only the top part, leaving bottom clear
    const panelGeometry = new THREE.BoxGeometry(1.5, 1.2, 0.4);
    const woodMaterial = new THREE.MeshLambertMaterial({ color: woodColor });
    
    // Top-left panel
    const topLeftPanel = new THREE.Mesh(panelGeometry, woodMaterial);
    topLeftPanel.position.set(-0.4, 1.3, 0);
    topLeftPanel.castShadow = true;
    topLeftPanel.receiveShadow = true;
    group.add(topLeftPanel);
    
    // Top-right panel
    const topRightPanel = new THREE.Mesh(panelGeometry, woodMaterial);
    topRightPanel.position.set(0.4, 1.3, 0);
    topRightPanel.castShadow = true;
    topRightPanel.receiveShadow = true;
    group.add(topRightPanel);
    
    // Support posts on sides
    const postGeometry = new THREE.BoxGeometry(0.2, 2.0, 0.5);
    const postMaterial = new THREE.MeshLambertMaterial({ color: 0x654321 });
    
    const leftPost = new THREE.Mesh(postGeometry, postMaterial);
    leftPost.position.set(-0.8, 1.0, 0);
    leftPost.castShadow = true;
    leftPost.receiveShadow = true;
    group.add(leftPost);
    
    const rightPost = new THREE.Mesh(postGeometry, postMaterial);
    rightPost.position.set(0.8, 1.0, 0);
    rightPost.castShadow = true;
    rightPost.receiveShadow = true;
    group.add(rightPost);
    
    // Bottom beam crossbar
    const beamGeometry = new THREE.BoxGeometry(1.8, 0.18, 0.5);
    const beam = new THREE.Mesh(beamGeometry, postMaterial);
    beam.position.set(0, 0.5, 0);
    beam.castShadow = true;
    beam.receiveShadow = true;
    group.add(beam);
    
    // Metal corner brackets for detail
    const bracketGeometry = new THREE.BoxGeometry(0.15, 0.3, 0.3);
    const bracketMaterial = new THREE.MeshLambertMaterial({ color: metalColor });
    
    const bracket1 = new THREE.Mesh(bracketGeometry, bracketMaterial);
    bracket1.position.set(-0.75, 0.65, 0.15);
    bracket1.castShadow = true;
    bracket1.receiveShadow = true;
    group.add(bracket1);
    
    const bracket2 = new THREE.Mesh(bracketGeometry, bracketMaterial);
    bracket2.position.set(0.75, 0.65, 0.15);
    bracket2.castShadow = true;
    bracket2.receiveShadow = true;
    group.add(bracket2);
    
  } else {
    // Low obstacle - wooden barrels/boxes (low enough to jump over)
    const barrelColor = 0xB8860B;
    const metalColor = 0x666666;
    
    // Shorter barrel geometry
    const barrelGeometry = new THREE.CylinderGeometry(0.35, 0.35, 0.5, 8);
    const barrelMaterial = new THREE.MeshLambertMaterial({ color: barrelColor });
    
    // Left barrel
    const leftBarrel = new THREE.Mesh(barrelGeometry, barrelMaterial);
    leftBarrel.position.set(-0.5, 0.25, 0);
    leftBarrel.castShadow = true;
    leftBarrel.receiveShadow = true;
    group.add(leftBarrel);
    
    // Right barrel
    const rightBarrel = new THREE.Mesh(barrelGeometry, barrelMaterial);
    rightBarrel.position.set(0.5, 0.25, 0);
    rightBarrel.castShadow = true;
    rightBarrel.receiveShadow = true;
    group.add(rightBarrel);
    
    // Center barrel on top (lower than before)
    const topBarrel = new THREE.Mesh(barrelGeometry, barrelMaterial);
    topBarrel.position.set(0, 0.7, 0);
    topBarrel.castShadow = true;
    topBarrel.receiveShadow = true;
    group.add(topBarrel);
    
    // Metal bands on barrels
    const bandGeometry = new THREE.TorusGeometry(0.36, 0.08, 8, 16);
    const bandMaterial = new THREE.MeshLambertMaterial({ color: metalColor });
    
    const band1 = new THREE.Mesh(bandGeometry, bandMaterial);
    band1.position.set(-0.5, 0.12, 0);
    band1.castShadow = true;
    band1.receiveShadow = true;
    group.add(band1);
    
    const band2 = new THREE.Mesh(bandGeometry, bandMaterial);
    band2.position.set(0.5, 0.12, 0);
    band2.castShadow = true;
    band2.receiveShadow = true;
    group.add(band2);
    
    const band3 = new THREE.Mesh(bandGeometry, bandMaterial);
    band3.position.set(0, 0.65, 0);
    band3.castShadow = true;
    band3.receiveShadow = true;
    group.add(band3);
    
    // Top rim on center barrel
    const rimGeometry = new THREE.TorusGeometry(0.38, 0.05, 8, 16);
    const rim = new THREE.Mesh(rimGeometry, bandMaterial);
    rim.position.set(0, 0.95, 0);
    rim.castShadow = true;
    rim.receiveShadow = true;
    group.add(rim);
  }
  
  return group;
}

function createObstacle(z) {
  const type = Math.random() > 0.5 ? 'tall' : 'low';
  const obstacleGroup = createObstacleMesh(type);
  
  const laneIndex = Math.floor(Math.random() * lanePositions.length);
  obstacleGroup.position.set(lanePositions[laneIndex], 0, z);
  
  scene.add(obstacleGroup);
  
  obstacles.push({
    mesh: obstacleGroup,
    type: type,
    laneX: lanePositions[laneIndex]
  });
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

  syncPlayerMesh(playerMesh, state.player);

  obstacles.forEach((obstacle, index) => {
    const newType = Math.random() > 0.5 ? 'tall' : 'low';
    
    // Recreate mesh if type changes
    if (obstacle.type !== newType) {
      scene.remove(obstacle.mesh);
      const newMesh = createObstacleMesh(newType);
      scene.add(newMesh);
      obstacle.mesh = newMesh;
      obstacle.type = newType;
    }
    
    obstacle.mesh.position.z = -30 - index * 25;
    const laneIndex = Math.floor(Math.random() * lanePositions.length);
    obstacle.mesh.position.x = lanePositions[laneIndex];
    obstacle.laneX = lanePositions[laneIndex];
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
    obstacle.mesh.position.z += moveSpeed;

    if (obstacle.mesh.position.z > 8) {
      const newType = Math.random() > 0.5 ? 'tall' : 'low';
      
      // Always recreate mesh on respawn
      scene.remove(obstacle.mesh);
      const newMesh = createObstacleMesh(newType);
      scene.add(newMesh);
      obstacle.mesh = newMesh;
      
      obstacle.mesh.position.z = -170 - Math.random() * 90;
      const laneIndex = Math.floor(Math.random() * lanePositions.length);
      obstacle.mesh.position.x = lanePositions[laneIndex];
      obstacle.laneX = lanePositions[laneIndex];
      obstacle.type = newType;
    }

    const zClose = obstacle.mesh.position.z > 2.0 && obstacle.mesh.position.z < 4.0;
    const sameLane = Math.abs(obstacle.mesh.position.x - state.player.x) < 0.9;
    
    let collision = false;
    
    if (zClose && sameLane) {
      if (obstacle.type === 'tall') {
        // Tall gate - player must duck under by lowering (y <= 0.1 to pass)
        collision = state.player.y > 0.1;
      } else {
        // Barrels - player must jump over (y >= 1.0 to pass)
        collision = state.player.y < 1.0;
      }
      
      if (collision) {
        state.player.status = 'dead';
        showGameOver();
      }
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