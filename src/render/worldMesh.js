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

function createLaneMarkers(scene, z) {
  const laneMarkerMaterial = new THREE.MeshLambertMaterial({
    color: 0xf5f1c8,
    emissive: 0x000000,
    emissiveIntensity: 0.0,
  });

  const laneMarkerGeometry = new THREE.BoxGeometry(0.14, 0.025, 8.5);
  const laneMarkers = [];
  const markerCount = 8;
  const markerStep = WORLD_DEFAULTS.segmentLength / markerCount;

  for (let i = 0; i < markerCount; i++) {
    const localZOffset =
      -WORLD_DEFAULTS.segmentLength / 2 + markerStep * i + markerStep * 0.5;
    const marker = new THREE.Mesh(laneMarkerGeometry, laneMarkerMaterial);
    marker.position.set(0, WORLD_DEFAULTS.roadY + 0.01, z + localZOffset);
    marker.userData.localZOffset = localZOffset;
    marker.receiveShadow = true;
    scene.add(marker);
    laneMarkers.push(marker);
  }

  return laneMarkers;
}

function createRoadEdgeStrip(scene, x, z) {
  const stripGeometry = new THREE.BoxGeometry(0.09, 0.02, WORLD_DEFAULTS.segmentLength);
  const stripMaterial = new THREE.MeshLambertMaterial({
    color: 0xf3d58f,
    emissive: 0x000000,
    emissiveIntensity: 0.0,
  });
  const strip = new THREE.Mesh(stripGeometry, stripMaterial);
  strip.position.set(x, WORLD_DEFAULTS.roadY + 0.008, z);
  strip.receiveShadow = true;
  scene.add(strip);
  return strip;
}

function createCurbAccent(scene, x, z) {
  const curbGeometry = new THREE.BoxGeometry(0.25, 0.18, WORLD_DEFAULTS.segmentLength);
  const curbMaterial = new THREE.MeshLambertMaterial({ color: 0xc4c7d1 });
  const curb = new THREE.Mesh(curbGeometry, curbMaterial);
  curb.position.set(x, WORLD_DEFAULTS.roadY + 0.06, z);
  curb.receiveShadow = true;
  scene.add(curb);
  return curb;
}

function createStreetLamp(scene, x, z) {
  const postGeometry = new THREE.CylinderGeometry(0.06, 0.08, 2.9, 8);
  const postMaterial = new THREE.MeshLambertMaterial({ color: 0x2f3442 });
  const post = new THREE.Mesh(postGeometry, postMaterial);
  post.position.set(x, 1.2, z);
  post.castShadow = true;
  post.receiveShadow = true;
  scene.add(post);

  const bulbGeometry = new THREE.SphereGeometry(0.14, 12, 12);
  const bulbMaterial = new THREE.MeshLambertMaterial({
    color: 0xfff0c4,
    emissive: 0xffd37a,
    emissiveIntensity: 0.0,
  });
  const bulb = new THREE.Mesh(bulbGeometry, bulbMaterial);
  bulb.position.set(x, 2.65, z);
  scene.add(bulb);

  const light = new THREE.PointLight(0xffd37a, 0.0, 14, 2);
  light.position.set(x, 2.65, z);
  light.castShadow = false;
  scene.add(light);

  return {
    post,
    bulb,
    light,
  };
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

function createWorldSegmentState(index) {
  return {
    index,
    z: -index * WORLD_DEFAULTS.segmentLength,
  };
}

function createWorldSegmentMeshes(
  scene,
  textures,
  roadGeometry,
  roadMaterial,
  sidewalkGeometry,
  sidewalkMaterial,
  sideGeometry,
  segment
) {
  const z = segment.z;

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

  const leftSideMaterial = createBuildingMaterial(textures, segment.index, -1);
  const rightSideMaterial = createBuildingMaterial(textures, segment.index, 1);

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

  const leftLamp = createStreetLamp(scene, -WORLD_DEFAULTS.sidewalkOffset + 0.7, z);
  const rightLamp = createStreetLamp(scene, WORLD_DEFAULTS.sidewalkOffset - 0.7, z);
  const laneMarkers = createLaneMarkers(scene, z);
  const leftEdgeStrip = createRoadEdgeStrip(scene, -WORLD_DEFAULTS.roadVisualWidth / 2 + 0.06, z);
  const rightEdgeStrip = createRoadEdgeStrip(scene, WORLD_DEFAULTS.roadVisualWidth / 2 - 0.06, z);
  const leftCurb = createCurbAccent(scene, -WORLD_DEFAULTS.roadVisualWidth / 2 - 0.22, z);
  const rightCurb = createCurbAccent(scene, WORLD_DEFAULTS.roadVisualWidth / 2 + 0.22, z);

  return {
    road,
    leftSidewalk,
    rightSidewalk,
    leftSide,
    rightSide,
    leftLamp,
    rightLamp,
    laneMarkers,
    leftEdgeStrip,
    rightEdgeStrip,
    leftCurb,
    rightCurb,
  };
}

export function createWorld(scene, textures) {
  const roadMaterial = new THREE.MeshLambertMaterial({
    map: textures.groundTexture,
    color: 0xffffff,
  });

  const sidewalkMaterial = new THREE.MeshLambertMaterial({
    color: 0xa4a8b0,
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
  const segmentMeshes = [];

  for (let i = 0; i < WORLD_DEFAULTS.totalSegments; i++) {
    const segment = createWorldSegmentState(i);
    segments.push(segment);

    segmentMeshes.push(
      createWorldSegmentMeshes(
        scene,
        textures,
        roadGeometry,
        roadMaterial,
        sidewalkGeometry,
        sidewalkMaterial,
        sideGeometry,
        segment
      )
    );
  }

  return {
    segments,
    segmentMeshes,
    segmentLength: WORLD_DEFAULTS.segmentLength,
    totalSegments: WORLD_DEFAULTS.totalSegments,
  };
}
