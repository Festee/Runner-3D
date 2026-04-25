import * as THREE from 'https://unpkg.com/three@0.183.2/build/three.module.js';

function applyLampState(world, isNightMode) {
  const lampIntensity = isNightMode ? 1.5 : 0.0;
  const emissiveIntensity = isNightMode ? 0.85 : 0.0;
  const markerEmissiveIntensity = isNightMode ? 0.2 : 0.0;
  const edgeEmissiveIntensity = isNightMode ? 0.3 : 0.0;

  world.segmentMeshes.forEach((segmentMeshes) => {
    const lamps = [segmentMeshes.leftLamp, segmentMeshes.rightLamp];

    lamps.forEach((lamp) => {
      lamp.light.intensity = lampIntensity;
      lamp.bulb.material.emissiveIntensity = emissiveIntensity;
    });

    segmentMeshes.laneMarkers.forEach((marker) => {
      marker.material.emissiveIntensity = markerEmissiveIntensity;
    });
    segmentMeshes.leftEdgeStrip.material.emissiveIntensity = edgeEmissiveIntensity;
    segmentMeshes.rightEdgeStrip.material.emissiveIntensity = edgeEmissiveIntensity;
  });
}

export function applyVisualMode(scene, world, lights, visualMode) {
  const isNightMode = visualMode === 'night';

  if (isNightMode) {
    scene.background = new THREE.Color(0x0b1021);
    scene.fog = new THREE.Fog(0x0b1021, 10, 65);
    lights.ambientLight.intensity = 0.24;
    lights.directionalLight.intensity = 0.4;
    lights.directionalLight.color.setHex(0xa9bbff);
    lights.nightFillLight.intensity = 0.75;
  } else {
    scene.background = new THREE.Color(0x87ceeb);
    scene.fog = new THREE.Fog(0x87ceeb, 18, 85);
    lights.ambientLight.intensity = 0.95;
    lights.directionalLight.intensity = 1.35;
    lights.directionalLight.color.setHex(0xffffff);
    lights.nightFillLight.intensity = 0.0;
  }

  applyLampState(world, isNightMode);
}
