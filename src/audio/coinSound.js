let audioContext = null;

function getAudioContext() {
  if (audioContext) {
    return audioContext;
  }

  const AudioContextClass = window.AudioContext || window.webkitAudioContext;

  if (!AudioContextClass) {
    return null;
  }

  audioContext = new AudioContextClass();
  return audioContext;
}

export async function ensureAudioReady() {
  const context = getAudioContext();

  if (!context) {
    return null;
  }

  if (context.state === 'suspended') {
    await context.resume();
  }

  return context;
}

export function playCoinPickupSound() {
  const context = getAudioContext();

  if (!context || context.state !== 'running') {
    return;
  }

  const now = context.currentTime;
  const oscillator = context.createOscillator();
  const gainNode = context.createGain();

  oscillator.type = 'triangle';
  oscillator.frequency.setValueAtTime(880, now);
  oscillator.frequency.exponentialRampToValueAtTime(1320, now + 0.08);

  gainNode.gain.setValueAtTime(0.0001, now);
  gainNode.gain.exponentialRampToValueAtTime(0.08, now + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);

  oscillator.connect(gainNode);
  gainNode.connect(context.destination);

  oscillator.start(now);
  oscillator.stop(now + 0.16);
}
