import * as THREE from 'https://unpkg.com/three@0.183.2/build/three.module.js';

function applyLampState(world, isNightMode) {
  const lampIntensity = isNightMode ? 1.5 : 0.0;
  const emissiveIntensity = isNightMode ? 0.85 : 0.0;

  world.segmentMeshes.forEach((segmentMeshes) => {
    const lamps = [segmentMeshes.leftLamp, segmentMeshes.rightLamp];

    lamps.forEach((lamp) => {
      lamp.light.intensity = lampIntensity;
      lamp.bulb.material.emissiveIntensity = emissiveIntensity;
    });
  });
}

export function applyVisualMode(scene, world, lights, visualMode) {
  const isNightMode = visualMode === 'night';

  if (isNightMode) {
    scene.background = new THREE.Color(0x0b1021);
    scene.fog = new THREE.Fog(0x0b1021, 10, 65);
    lights.ambientLight.intensity = 0.2;
    lights.directionalLight.intensity = 0.35;
    lights.directionalLight.color.setHex(0xa9bbff);
    lights.nightFillLight.intensity = 0.7;
  } else {
    scene.background = new THREE.Color(0x87ceeb);
    scene.fog = new THREE.Fog(0x87ceeb, 18, 85);
    lights.ambientLight.intensity = 0.9;
    lights.directionalLight.intensity = 1.3;
    lights.directionalLight.color.setHex(0xffffff);
    lights.nightFillLight.intensity = 0.0;
  }

  applyLampState(world, isNightMode);
}
