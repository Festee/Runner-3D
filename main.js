import * as THREE from 'https://unpkg.com/three@0.183.2/build/three.module.js';

const state = {
  started: false,
  score: 0,
  gameOver: false,
  speed: 0.010,
  lane: 0, // -1, 0, 1
  isJumping: false,
  jumpVelocity: 0,
  gravity: 0.010,
};

const lanePositions = [-1.8, 0, 1.8];
const segmentLength = 160;
const totalSegments = 4;
const roadWidth = 6;
const wallHeight = 8;
const wallOffset = 4.5;

// SCENE
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);
scene.fog = new THREE.Fog(0x87ceeb, 18, 85);

// CAMERA
const camera = new THREE.PerspectiveCamera(
  70,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 5, 12);
camera.lookAt(0, 1, -20);

// RENDERER
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.style.margin = '0';
document.body.style.overflow = 'hidden';
document.body.appendChild(renderer.domElement);

// LIGHTS
const ambientLight = new THREE.AmbientLight(0xffffff, 0.78);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(6, 10, 8);
scene.add(directionalLight);

// TEXTURES
const loader = new THREE.TextureLoader();

const groundTexture = loader.load(
  './src/assets/Ground.png',
  (tex) => {
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(1, 12);
    tex.colorSpace = THREE.SRGBColorSpace;
  },
  undefined,
  () => console.warn('Ground.png not found')
);

const wallTexture = loader.load(
  './src/assets/Wall.png',
  (tex) => {
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(1, 20);
    tex.offset.y = 0;
    tex.colorSpace = THREE.SRGBColorSpace;
  },
  undefined,
  () => console.warn('Wall.png not found')
);

// MATERIALS
const roadMaterial = new THREE.MeshLambertMaterial({
  map: groundTexture,
  color: 0xffffff,
});

const wallMaterial = new THREE.MeshLambertMaterial({
  map: wallTexture,
  color: 0xffffff,
  side: THREE.DoubleSide,
});

// GEOMETRIES
const roadGeometry = new THREE.PlaneGeometry(roadWidth, segmentLength);
const wallGeometry = new THREE.BoxGeometry(0.4, wallHeight, segmentLength);

// SEGMENTS
const roadSegments = [];
const leftWallSegments = [];
const rightWallSegments = [];

function createRoadSegment(z) {
  const road = new THREE.Mesh(roadGeometry, roadMaterial);
  road.rotation.x = -Math.PI / 2;
  road.position.set(0, -0.5, z);
  scene.add(road);
  return road;
}

function createWallSegment(x, z) {
  const wall = new THREE.Mesh(wallGeometry, wallMaterial);
  wall.position.set(x, wallHeight / 2 - 0.5, z);
  scene.add(wall);
  return wall;
}

// create 3 road segments and 3 wall segments per side
for (let i = 0; i < totalSegments; i++) {
  const z = -i * segmentLength; // start from z=0, then -160, -320...

  roadSegments.push(createRoadSegment(z));
  leftWallSegments.push(createWallSegment(-wallOffset, z));
  rightWallSegments.push(createWallSegment(wallOffset, z));
}

// PLAYER
const playerGeometry = new THREE.BoxGeometry(0.9, 1.4, 0.9);
const playerMaterial = new THREE.MeshLambertMaterial({ color: 0xb02a1d });
const player = new THREE.Mesh(playerGeometry, playerMaterial);
player.position.set(0, 0.2, 3);
scene.add(player);

// OBSTACLES
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

const scoreHud = document.createElement('div');
scoreHud.style.position = 'fixed';
scoreHud.style.top = '20px';
scoreHud.style.left = '20px';
scoreHud.style.padding = '10px 14px';
scoreHud.style.background = 'rgba(0,0,0,0.45)';
scoreHud.style.color = 'white';
scoreHud.style.fontFamily = 'Arial, sans-serif';
scoreHud.style.fontSize = '18px';
scoreHud.style.borderRadius = '10px';
scoreHud.style.zIndex = '5';
scoreHud.textContent = 'Score: 0';

document.body.appendChild(overlay);
document.body.appendChild(scoreHud);

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
  state.lane = 0;
  state.isJumping = false;
  state.jumpVelocity = 0;

  player.position.set(0, 0.2, 3);

  obstacles.forEach((obstacle, index) => {
    obstacle.position.z = -30 - index * 25;
    const laneIndex = Math.floor(Math.random() * lanePositions.length);
    obstacle.position.x = lanePositions[laneIndex];
  });

  scoreHud.textContent = 'Score: 0';
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

// INPUT
window.addEventListener('keydown', (e) => {
  if (!state.started || state.gameOver) return;

  if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
    state.lane = Math.max(-1, state.lane - 1);
  }

  if (e.code === 'ArrowRight' || e.code === 'KeyD') {
    state.lane = Math.min(1, state.lane + 1);
  }

  if ((e.code === 'Space' || e.code === 'ArrowUp') && !state.isJumping) {
    state.isJumping = true;
    state.jumpVelocity = 0.16;
  }
});

// HELPERS
function updatePlayer() {
  const laneToX = {
    '-1': -1.8,
    '0': 0,
    '1': 1.8
  };

  player.position.x += (laneToX[state.lane] - player.position.x) * 0.18;

  if (state.isJumping) {
    player.position.y += state.jumpVelocity;
    state.jumpVelocity -= state.gravity;

    if (player.position.y <= 0.2) {
      player.position.y = 0.2;
      state.isJumping = false;
      state.jumpVelocity = 0;
    }
  }
}

function recycleSegments(segments) {
  for (const segment of segments) {
    if (segment.position.z > 20) {
      segment.position.z -= segmentLength * totalSegments;
    }
  }
}

function updateWorld() {
  const moveSpeed = state.speed * 25;

  groundTexture.offset.y -= state.speed;
  wallTexture.offset.y -= state.speed * 0.35;

  for (const road of roadSegments) {
    road.position.z += moveSpeed;
  }

  for (const wall of leftWallSegments) {
    wall.position.z += moveSpeed;
  }

  for (const wall of rightWallSegments) {
    wall.position.z += moveSpeed;
  }

  recycleSegments(roadSegments);
  recycleSegments(leftWallSegments);
  recycleSegments(rightWallSegments);
}

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
    const sameLane = Math.abs(obstacle.position.x - player.position.x) < 0.8;
    const lowEnough = player.position.y < 1.05;

    if (zClose && sameLane && lowEnough) {
      showGameOver();
    }
  });
}

function updateScore() {
  state.score += 1;
  scoreHud.textContent = `Score: ${state.score}`;

  if (state.score % 900 === 0) {
    state.speed += 0.001;
  }
}

function animate() {
  requestAnimationFrame(animate);

  if (state.started && !state.gameOver) {
    updatePlayer();
    updateWorld();
    updateObstacles();
    updateScore();
  }

  camera.position.x += (player.position.x - camera.position.x) * 0.06;
  camera.position.z = 8;
  camera.lookAt(player.position.x, 1, -5);

  renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});