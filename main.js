import * as THREE from 'https://unpkg.com/three@0.183.2/build/three.module.js';

const state = {
  started: false,
  score: 0,
  gameOver: false,
};      

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

// Create the startup UI overlay
const overlay = document.createElement('div');
overlay.id = 'ui-overlay';
overlay.style.position = 'fixed';
overlay.style.top = '0';
overlay.style.left = '0';
overlay.style.width = '100vw';
overlay.style.height = '100vh';
overlay.style.display = 'flex';
overlay.style.justifyContent = 'center';
overlay.style.alignItems = 'center';
overlay.style.background = 'rgba(0,0,0,0.4)';
overlay.style.zIndex = '10';

overlay.innerHTML = `
  <div style="text-align:center; color:white; background:#000000b8; padding:30px; border-radius:12px;">
    <h1>Runner 3D</h1>
    <p>Press Start to begin</p>
    <button id="start-btn" style="font-size:18px; padding:12px 22px;">Start</button>
    <p style="margin-top:12px;">Score: <span id="score-val">0</span></p>
  </div>
`;

document.body.appendChild(overlay);

const startButton = document.getElementById('start-btn');
const scoreValue = document.getElementById('score-val');

function startGame() {
  state.started = true;
  overlay.style.display = 'none';
  state.score = 0;
  state.gameOver = false;
}

function showGameOver() {
  state.gameOver = true;
  overlay.style.display = 'flex';
  overlay.innerHTML = `
    <div style="text-align:center; color:white; background:#000000b8; padding:30px; border-radius:12px;">
      <h1>Game Over</h1>
      <p>Your score: ${state.score}</p>
      <button id="restart-btn" style="font-size:18px; padding:12px 22px;">Restart</button>
    </div>
  `;
  document.getElementById('restart-btn').addEventListener('click', () => {
    overlay.innerHTML = `
      <div style="text-align:center; color:white; background:#000000b8; padding:30px; border-radius:12px;">
        <h1>Runner 3D</h1>
        <p>Press Start to begin</p>
        <button id="start-btn" style="font-size:18px; padding:12px 22px;">Start</button>
        <p style="margin-top:12px;">Score: <span id="score-val">0</span></p>
      </div>
    `;
    document.getElementById('start-btn').addEventListener('click', startGame);
    scoreValue.textContent = '0';
  });
}

startButton.addEventListener('click', startGame);

function animate() {
  requestAnimationFrame(animate);

  if (!state.started || state.gameOver) {
    renderer.render(scene, camera);
    return;
  }

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  // scoreboard increment logic
  state.score += 1;
  scoreValue.textContent = state.score;

  // example game over trigger
  if (state.score > 2000) {
    showGameOver();
  }

  renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});