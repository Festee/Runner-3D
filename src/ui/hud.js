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
  scoreHud.textContent = 'Score: 0';

  document.body.appendChild(scoreHud);
  return scoreHud;
}

export function updateScoreHud(scoreHud, score) {
  scoreHud.textContent = `Score: ${score}`;
}