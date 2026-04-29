export function createScoreHud() {
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
  scoreHud.style.lineHeight = '1.5';
  scoreHud.innerHTML = `
    <div>Score: 0</div>
    <div>Coins: 0</div>
    <div>Total Coins: 0</div>
    <div>High Score: 0</div>
  `;

  document.body.appendChild(scoreHud);
  return scoreHud;
}

export function updateScoreHud(scoreHud, score, coinsCollected, totalCoins, highScore) {
  scoreHud.innerHTML = `
    <div>Score: ${score}</div>
    <div>Coins: ${coinsCollected}</div>
    <div>Total Coins: ${totalCoins}</div>
    <div>High Score: ${highScore}</div>
  `;
}
