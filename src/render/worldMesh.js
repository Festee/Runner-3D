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

function createSidewalkMesh(scene, sidewalkGeometry, sidewalkMaterial, x, z) {
  const sidewalk = new THREE.Mesh(sidewalkGeometry, sidewalkMaterial);

  const sidewalkCenterY =
    WORLD_DEFAULTS.roadY - WORLD_DEFAULTS.sidewalkHeight / 2;

  sidewalk.position.set(x, sidewalkCenterY, z);
  sidewalk.receiveShadow = true;

  scene.add(sidewalk);
  return sidewalk;
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

function createBuildingMaterial(textures, segmentIndex, sideSign) {
  const textureIndex =
    (segmentIndex + (sideSign > 0 ? 1 : 0)) % textures.buildingTextures.length;

  return new THREE.MeshLambertMaterial({
    map: textures.buildingTextures[textureIndex],
    color: 0xffffff,
    side: THREE.DoubleSide,
  });
}

function createWorldSegment(
  scene,
  textures,
  roadGeometry,
  roadMaterial,
  sidewalkGeometry,
  sidewalkMaterial,
  sideGeometry,
  index
) {
  const z = -index * WORLD_DEFAULTS.segmentLength;

  const road = createRoadMesh(scene, roadGeometry, roadMaterial, z);

  const leftSidewalk = createSidewalkMesh(
    scene,
    sidewalkGeometry,
    sidewalkMaterial,
    -WORLD_DEFAULTS.sidewalkOffset,
    z
  );

  const rightSidewalk = createSidewalkMesh(
    scene,
    sidewalkGeometry,
    sidewalkMaterial,
    WORLD_DEFAULTS.sidewalkOffset,
    z
  );

  const leftSideMaterial = createBuildingMaterial(textures, index, -1);
  const rightSideMaterial = createBuildingMaterial(textures, index, 1);

  const leftSide = createSideMesh(
    scene,
    sideGeometry,
    leftSideMaterial,
    -WORLD_DEFAULTS.wallOffset,
    z
  );

  const rightSide = createSideMesh(
    scene,
    sideGeometry,
    rightSideMaterial,
    WORLD_DEFAULTS.wallOffset,
    z
  );

  return {
    index,
    z,
    road,
    leftSidewalk,
    rightSidewalk,
    leftSide,
    rightSide,
  };
}

export function createWorld(scene, textures) {
  const roadMaterial = new THREE.MeshLambertMaterial({
    map: textures.groundTexture,
    color: 0xffffff,
  });

  const sidewalkMaterial = new THREE.MeshLambertMaterial({
    color: 0x9a9a9a,
  });

  const roadGeometry = new THREE.BoxGeometry(
    WORLD_DEFAULTS.roadVisualWidth,
    WORLD_DEFAULTS.roadThickness,
    WORLD_DEFAULTS.segmentLength
  );

  const sidewalkGeometry = new THREE.BoxGeometry(
    WORLD_DEFAULTS.sidewalkWidth,
    WORLD_DEFAULTS.sidewalkHeight,
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
        textures,
        roadGeometry,
        roadMaterial,
        sidewalkGeometry,
        sidewalkMaterial,
        sideGeometry,
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