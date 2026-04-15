import * as THREE from 'https://unpkg.com/three@0.183.2/build/three.module.js';
import { WORLD_DEFAULTS } from '../core/worldConstants.js';

function createRoadSegment(scene, roadGeometry, roadMaterial, z) {
  const road = new THREE.Mesh(roadGeometry, roadMaterial);
  road.rotation.x = -Math.PI / 2;
  road.position.set(0, -0.5, z);
  scene.add(road);
  return road;
}

function createWallSegment(scene, wallGeometry, wallMaterial, x, z) {
  const wall = new THREE.Mesh(wallGeometry, wallMaterial);
  wall.position.set(x, WORLD_DEFAULTS.wallHeight / 2 - 0.5, z);
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

  const roadGeometry = new THREE.PlaneGeometry(
    WORLD_DEFAULTS.roadWidth,
    WORLD_DEFAULTS.segmentLength
  );

  const wallGeometry = new THREE.BoxGeometry(
    0.4,
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