export function createCameraShake() {
  return {
    isActive: false,
    intensity: 0,
    duration: 0,
    elapsed: 0,
    basePosition: { x: 0, y: 0, z: 0 },
  };
}

export function startCameraShake(shake, intensity = 0.3, duration = 12) {
  shake.isActive = true;
  shake.intensity = intensity;
  shake.duration = duration;
  shake.elapsed = 0;
}

export function updateCameraShake(shake, camera, basePosition) {
  if (!shake.isActive) {
    return;
  }

  shake.elapsed++;

  if (shake.elapsed >= shake.duration) {
    shake.isActive = false;
    shake.elapsed = 0;

    camera.position.x = basePosition.x;
    camera.position.y = basePosition.y;
    camera.position.z = basePosition.z;
    return;
  }

  const progress = shake.elapsed / shake.duration;
  const fadeOut = 1 - progress;
  const currentIntensity = shake.intensity * fadeOut;

  camera.position.x = basePosition.x + (Math.random() - 0.5) * currentIntensity * 2;
  camera.position.y = basePosition.y + (Math.random() - 0.5) * currentIntensity * 2;
  camera.position.z = basePosition.z + (Math.random() - 0.5) * currentIntensity;
}
