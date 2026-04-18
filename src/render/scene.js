import * as THREE from 'https://unpkg.com/three@0.183.2/build/three.module.js';

export function createScene() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x87ceeb);
  scene.fog = new THREE.Fog(0x87ceeb, 18, 85);

  return scene;
}