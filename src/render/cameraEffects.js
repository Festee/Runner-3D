/**
 * Camera shake effect system
 * Applies temporary vibration to the camera for impact feedback
 */

export function createCameraShake() {
  return {
    isActive: false,
    intensity: 0,
    duration: 0,
    elapsed: 0,
    basePosition: { x: 0, y: 0, z: 0 },
  };
}

/**
 * Start a camera shake effect
 * 
 * @param {Object} shake - Camera shake state object
 * @param {number} intensity - Shake intensity (0-1 range, typically 0.3-0.6 for collision)
 * @param {number} duration - Duration in frames (typically 8-15 for impact)
 */
export function startCameraShake(shake, intensity = 0.3, duration = 12) {
  shake.isActive = true;
  shake.intensity = intensity;
  shake.duration = duration;
  shake.elapsed = 0;
}

/**
 * Update camera shake and apply offset to camera position
 * Should be called each frame before rendering
 * 
 * @param {Object} shake - Camera shake state object
 * @param {THREE.Camera} camera - Three.js camera to shake
 * @param {Object} basePosition - Camera's target position without shake
 */
export function updateCameraShake(shake, camera, basePosition) {
  if (!shake.isActive) {
    return;
  }

  shake.elapsed++;

  if (shake.elapsed >= shake.duration) {
    shake.isActive = false;
    shake.elapsed = 0;
    // Restore base position
    camera.position.x = basePosition.x;
    camera.position.y = basePosition.y;
    camera.position.z = basePosition.z;
    return;
  }

  // Calculate fade-out effect (shake gets weaker over time)
  const progress = shake.elapsed / shake.duration;
  const fadeOut = 1 - progress;
  const currentIntensity = shake.intensity * fadeOut;

  // Apply random offset
  camera.position.x = basePosition.x + (Math.random() - 0.5) * currentIntensity * 2;
  camera.position.y = basePosition.y + (Math.random() - 0.5) * currentIntensity * 2;
  camera.position.z = basePosition.z + (Math.random() - 0.5) * currentIntensity;
}
