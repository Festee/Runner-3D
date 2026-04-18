import * as THREE from 'https://unpkg.com/three@0.183.2/build/three.module.js';
import { WORLD_DEFAULTS } from '../core/worldConstants.js';

function createRoadSegment(scene, roadGeometry, roadMaterial, z) {
  const road = new THREE.Mesh(roadGeometry, roadMaterial);

  const roadCenterY =
    WORLD_DEFAULTS.roadY - WORLD_DEFAULTS.roadThickness / 2;

  road.position.set(0, roadCenterY, z);
  road.receiveShadow = true;

  scene.add(road);
  return road;
}

function createWallSegment(scene, wallGeometry, wallMaterial, x, z) {
  const wall = new THREE.Mesh(wallGeometry, wallMaterial);

  const wallCenterY =
    WORLD_DEFAULTS.wallY + WORLD_DEFAULTS.wallHeight / 2;

  wall.position.set(x, wallCenterY, z);
  wall.castShadow = true;
  wall.receiveShadow = true;

  scene.add(wall);
  return wall;
}

export function createWorld(scene, textures) {
  const roadMaterial = new THREE.MeshLambertMaterial({
    map: textures.groundTexture,
    color: 0xffffff,
  });

  const wallMaterial = new THREE.MeshLambertMaterial({
    map: textures.wallTexture,
    color: 0xffffff,
    side: THREE.DoubleSide,
  });

  const roadGeometry = new THREE.BoxGeometry(
    WORLD_DEFAULTS.roadVisualWidth,
    WORLD_DEFAULTS.roadThickness,
    WORLD_DEFAULTS.segmentLength
  );

  const wallGeometry = new THREE.BoxGeometry(
    WORLD_DEFAULTS.wallThickness,
    WORLD_DEFAULTS.wallHeight,
    WORLD_DEFAULTS.segmentLength
  );

  const roadSegments = [];
  const leftWallSegments = [];
  const rightWallSegments = [];

  for (let i = 0; i < WORLD_DEFAULTS.totalSegments; i++) {
    const z = -i * WORLD_DEFAULTS.segmentLength;

    roadSegments.push(
      createRoadSegment(scene, roadGeometry, roadMaterial, z)
    );

    leftWallSegments.push(
      createWallSegment(
        scene,
        wallGeometry,
        wallMaterial,
        -WORLD_DEFAULTS.wallOffset,
        z
      )
    );

    rightWallSegments.push(
      createWallSegment(
        scene,
        wallGeometry,
        wallMaterial,
        WORLD_DEFAULTS.wallOffset,
        z
      )
    );
  }

  return {
    roadSegments,
    leftWallSegments,
    rightWallSegments,
    segmentLength: WORLD_DEFAULTS.segmentLength,
    totalSegments: WORLD_DEFAULTS.totalSegments,
  };
}