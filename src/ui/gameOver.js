export function createOverlay() {
  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.inset = '0';
  overlay.style.display = 'flex';
  overlay.style.justifyContent = 'center';
  overlay.style.alignItems = 'center';
  overlay.style.background = 'rgba(0,0,0,0.35)';
  overlay.style.zIndex = '10';

  document.body.appendChild(overlay);
  return overlay;
}

export function showStartScreen(overlay, highScore, onStart, selectedMode = 'day') {
  overlay.style.display = 'flex';
  overlay.innerHTML = `
    <div style="text-align:center; color:white; background:#000000c7; padding:30px; border-radius:16px; min-width:280px; font-family:Arial,sans-serif;">
      <h1 style="margin-top:0;">Runner 3D</h1>
      <p>Press Start to begin</p>
      <p>Move: A / D or Left / Right</p>
      <p>Jump: Space or Up</p>
      <p>Lower: Down</p>
      <label for="mode-select" style="display:block; margin:12px 0 8px; font-weight:700; letter-spacing:0.3px;">Visual Mode</label>
      <div style="position:relative; width:170px; margin:0 auto 2px;">
        <select
          id="mode-select"
          style="
            width:100%;
            font-size:18px;
            font-weight:700;
            line-height:1.1;
            color:#f5f7ff;
            padding:11px 44px 11px 14px;
            border-radius:14px;
            border:1px solid #6f79a5;
            background:linear-gradient(160deg, #2f3758 0%, #202742 100%);
            box-shadow:0 8px 20px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.12);
            outline:none;
            appearance:none;
            -webkit-appearance:none;
            -moz-appearance:none;
            cursor:pointer;
            transition:border-color 120ms ease, box-shadow 120ms ease, transform 120ms ease;
          "
          onfocus="this.style.borderColor='#a7b6ff';this.style.boxShadow='0 0 0 3px rgba(111,121,165,0.35), 0 8px 20px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.12)'"
          onblur="this.style.borderColor='#6f79a5';this.style.boxShadow='0 8px 20px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.12)'"
        >
          <option
            value="day"
            style="color:#121729; background:#f4f6ff;"
            ${selectedMode === 'day' ? ' selected' : ''}
          >
            Day
          </option>
          <option
            value="night"
            style="color:#121729; background:#f4f6ff;"
            ${selectedMode === 'night' ? ' selected' : ''}
          >
            Night
          </option>
        </select>
        <span
          style="
            position:absolute;
            right:14px;
            top:50%;
            width:10px;
            height:10px;
            border-right:2px solid #d6dcff;
            border-bottom:2px solid #d6dcff;
            transform:translateY(-62%) rotate(45deg);
            pointer-events:none;
          "
        ></span>
      </div>
      <p>High Score: ${highScore}</p>
      <button id="start-btn" style="font-size:18px; padding:12px 24px; cursor:pointer;">Start</button>
    </div>
  `;

  const startButton = document.getElementById('start-btn');
  const modeSelect = document.getElementById('mode-select');

  startButton.addEventListener('click', () => {
    onStart(modeSelect.value);
  });
}

export function showGameOverScreen(overlay, score, highScore, onRestart) {
  overlay.style.display = 'flex';
  overlay.innerHTML = `
    <div style="text-align:center; color:white; background:#000000c7; padding:30px; border-radius:16px; min-width:280px; font-family:Arial,sans-serif;">
      <h1 style="margin-top:0;">Game Over</h1>
      <p>Your score: ${score}</p>
      <p>High Score: ${highScore}</p>
      <button id="restart-btn" style="font-size:18px; padding:12px 24px; cursor:pointer;">Restart</button>
    </div>
  `;

  document.getElementById('restart-btn').addEventListener('click', onRestart);
}

export function hideOverlay(overlay) {
  overlay.style.display = 'none';
}
