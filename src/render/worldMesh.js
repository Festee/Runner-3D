import * as THREE from 'https://unpkg.com/three@0.183.2/build/three.module.js';
import { WORLD_DEFAULTS } from '../core/worldConstants.js';

function createRoadMesh(scene, roadGeometry, roadMaterial, z) {
  const road = new THREE.Mesh(roadGeometry, roadMaterial);

  const roadCenterY =
    WORLD_DEFAULTS.roadY - WORLD_DEFAULTS.roadThickness / 2;

  road.position.set(0, roadCenterY, z);
  road.receiveShadow = true;

  scene.add(road);
  return road;
}

function createSideMesh(scene, sideGeometry, sideMaterial, x, z) {
  const sideMesh = new THREE.Mesh(sideGeometry, sideMaterial);

  const sideCenterY =
    WORLD_DEFAULTS.wallY + WORLD_DEFAULTS.wallHeight / 2;

  sideMesh.position.set(x, sideCenterY, z);
  sideMesh.castShadow = true;
  sideMesh.receiveShadow = true;

  scene.add(sideMesh);
  return sideMesh;
}

function createWorldSegment(scene, roadGeometry, roadMaterial, sideGeometry, sideMaterial, index) {
  const z = -index * WORLD_DEFAULTS.segmentLength;

  const road = createRoadMesh(scene, roadGeometry, roadMaterial, z);

  const leftSide = createSideMesh(
    scene,
    sideGeometry,
    sideMaterial,
    -WORLD_DEFAULTS.wallOffset,
    z
  );

  const rightSide = createSideMesh(
    scene,
    sideGeometry,
    sideMaterial,
    WORLD_DEFAULTS.wallOffset,
    z
  );

  return {
    index,
    z,
    road,
    leftSide,
    rightSide,
  };
}

export function createWorld(scene, textures) {
  const roadMaterial = new THREE.MeshLambertMaterial({
    map: textures.groundTexture,
    color: 0xffffff,
  });

  const sideMaterial = new THREE.MeshLambertMaterial({
    map: textures.wallTexture,
    color: 0xffffff,
    side: THREE.DoubleSide,
  });

  const roadGeometry = new THREE.BoxGeometry(
    WORLD_DEFAULTS.roadVisualWidth,
    WORLD_DEFAULTS.roadThickness,
    WORLD_DEFAULTS.segmentLength
  );

  const sideGeometry = new THREE.BoxGeometry(
    WORLD_DEFAULTS.wallThickness,
    WORLD_DEFAULTS.wallHeight,
    WORLD_DEFAULTS.segmentLength
  );

  const segments = [];

  for (let i = 0; i < WORLD_DEFAULTS.totalSegments; i++) {
    segments.push(
      createWorldSegment(
        scene,
        roadGeometry,
        roadMaterial,
        sideGeometry,
        sideMaterial,
        i
      )
    );
  }

  return {
    segments,
    segmentLength: WORLD_DEFAULTS.segmentLength,
    totalSegments: WORLD_DEFAULTS.totalSegments,
  };
}