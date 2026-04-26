import * as THREE from 'https://unpkg.com/three@0.183.2/build/three.module.js';
import { PLAYER_DEFAULTS } from '../core/constants.js';

function createMaterial(color) {
  return new THREE.MeshLambertMaterial({ color });
}

function createBox(width, height, depth, material) {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(width, height, depth),
    material
  );
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function createJoint() {
  const joint = new THREE.Group();
  joint.castShadow = true;
  joint.receiveShadow = true;
  return joint;
}

function createArm(shoulderX, materials) {
  const shoulder = createJoint();
  shoulder.position.set(shoulderX, 0.52, 0);

  const upperArm = createBox(0.14, 0.34, 0.14, materials.sleeve);
  upperArm.position.y = -0.17;
  shoulder.add(upperArm);

  const elbow = createJoint();
  elbow.position.y = -0.34;
  shoulder.add(elbow);

  const forearm = createBox(0.12, 0.3, 0.12, materials.skin);
  forearm.position.y = -0.15;
  elbow.add(forearm);

  return {
    shoulder,
    elbow,
  };
}

function createLeg(hipX, materials) {
  const hip = createJoint();
  hip.position.set(hipX, 0.02, 0);

  const upperLeg = createBox(0.16, 0.3, 0.18, materials.pants);
  upperLeg.position.y = -0.15;
  hip.add(upperLeg);

  const knee = createJoint();
  knee.position.y = -0.28;
  hip.add(knee);

  const lowerLeg = createBox(0.14, 0.26, 0.16, materials.pantsDark);
  lowerLeg.position.y = -0.13;
  knee.add(lowerLeg);

  const foot = createBox(0.17, 0.08, 0.28, materials.shoes);
  foot.position.set(0, -0.23, 0.07);
  knee.add(foot);

  return {
    hip,
    knee,
  };
}

function createHumanoidRig() {
  const rig = new THREE.Group();

  const materials = {
    skin: createMaterial(0xf0c2a0),
    shirt: createMaterial(0x2e5de0),
    sleeve: createMaterial(0x2749b0),
    pants: createMaterial(0x313745),
    pantsDark: createMaterial(0x262b36),
    shoes: createMaterial(0x111318),
    hair: createMaterial(0x2c2117),
  };

  const torso = createBox(0.5, 0.62, 0.24, materials.shirt);
  torso.position.y = 0.2;
  rig.add(torso);

  const neck = createBox(0.12, 0.08, 0.1, materials.skin);
  neck.position.y = 0.58;
  rig.add(neck);

  const head = createBox(0.3, 0.34, 0.28, materials.skin);
  head.position.y = 0.78;
  rig.add(head);

  const hair = createBox(0.32, 0.1, 0.3, materials.hair);
  hair.position.y = 0.92;
  rig.add(hair);

  const leftArm = createArm(-0.33, materials);
  const rightArm = createArm(0.33, materials);
  rig.add(leftArm.shoulder);
  rig.add(rightArm.shoulder);

  const leftLeg = createLeg(-0.14, materials);
  const rightLeg = createLeg(0.14, materials);
  rig.add(leftLeg.hip);
  rig.add(rightLeg.hip);

  return {
    rig,
    head,
    torso,
    leftArm,
    rightArm,
    leftLeg,
    rightLeg,
  };
}

function lerp(current, target, alpha = 0.22) {
  return current + (target - current) * alpha;
}

function applyRunPose(parts, runPhase, playerState) {
  const armSwing = Math.sin(runPhase) * 0.85;
  const legSwing = Math.sin(runPhase) * 0.95;
  const kneeLiftLeft = Math.max(0, -Math.sin(runPhase)) * 0.8;
  const kneeLiftRight = Math.max(0, Math.sin(runPhase)) * 0.8;

  parts.leftArm.shoulder.rotation.x = armSwing;
  parts.rightArm.shoulder.rotation.x = -armSwing;
  parts.leftArm.elbow.rotation.x = -Math.abs(armSwing) * 0.35;
  parts.rightArm.elbow.rotation.x = -Math.abs(armSwing) * 0.35;

  parts.leftLeg.hip.rotation.x = -legSwing;
  parts.rightLeg.hip.rotation.x = legSwing;
  parts.leftLeg.knee.rotation.x = kneeLiftLeft;
  parts.rightLeg.knee.rotation.x = kneeLiftRight;

  const bob = Math.abs(Math.sin(runPhase * 2)) * 0.035;
  parts.rig.position.y = bob;
  parts.head.rotation.x = Math.sin(runPhase * 2) * 0.035;
  parts.torso.rotation.x = Math.sin(runPhase * 2) * 0.05;

  const isChangingLane = Math.abs(playerState.targetLane - playerState.lane) > 0;
  parts.rig.rotation.z = isChangingLane
    ? (playerState.targetLane - playerState.lane) * -0.08
    : 0;
}

function applyJumpPose(parts) {
  parts.rig.position.y = 0.02;
  parts.rig.rotation.z = 0;

  parts.torso.rotation.x = -0.2;
  parts.head.rotation.x = 0.1;

  parts.leftArm.shoulder.rotation.x = -1.1;
  parts.rightArm.shoulder.rotation.x = -1.1;
  parts.leftArm.elbow.rotation.x = -0.35;
  parts.rightArm.elbow.rotation.x = -0.35;

  parts.leftLeg.hip.rotation.x = 0.45;
  parts.rightLeg.hip.rotation.x = 0.45;
  parts.leftLeg.knee.rotation.x = 0.7;
  parts.rightLeg.knee.rotation.x = 0.7;
}

function applyCrouchPose(parts, crouchAmount) {
  parts.rig.position.y = -0.2 * crouchAmount;
  parts.rig.rotation.z = 0;

  parts.torso.rotation.x = 0.4 * crouchAmount;
  parts.head.rotation.x = -0.15 * crouchAmount;

  parts.leftArm.shoulder.rotation.x = 0.6 * crouchAmount;
  parts.rightArm.shoulder.rotation.x = 0.6 * crouchAmount;
  parts.leftArm.elbow.rotation.x = -0.7 * crouchAmount;
  parts.rightArm.elbow.rotation.x = -0.7 * crouchAmount;

  parts.leftLeg.hip.rotation.x = -0.8 * crouchAmount;
  parts.rightLeg.hip.rotation.x = -0.8 * crouchAmount;
  parts.leftLeg.knee.rotation.x = 1.2 * crouchAmount;
  parts.rightLeg.knee.rotation.x = 1.2 * crouchAmount;
}

function animateHumanoid(mesh, playerState) {
  const { parts } = mesh.userData;
  const wasLowering = playerState.isLowering || playerState.isRecoveringFromLower;

  mesh.userData.runPhase += 0.22;

  // Reset any previous frame pose toward neutral, then apply mode-specific pose.
  parts.torso.rotation.x = lerp(parts.torso.rotation.x, 0);
  parts.head.rotation.x = lerp(parts.head.rotation.x, 0);
  parts.rig.position.y = lerp(parts.rig.position.y, 0);
  parts.rig.rotation.z = lerp(parts.rig.rotation.z, 0);

  parts.leftArm.shoulder.rotation.x = lerp(parts.leftArm.shoulder.rotation.x, 0);
  parts.rightArm.shoulder.rotation.x = lerp(parts.rightArm.shoulder.rotation.x, 0);
  parts.leftArm.elbow.rotation.x = lerp(parts.leftArm.elbow.rotation.x, 0);
  parts.rightArm.elbow.rotation.x = lerp(parts.rightArm.elbow.rotation.x, 0);

  parts.leftLeg.hip.rotation.x = lerp(parts.leftLeg.hip.rotation.x, 0);
  parts.rightLeg.hip.rotation.x = lerp(parts.rightLeg.hip.rotation.x, 0);
  parts.leftLeg.knee.rotation.x = lerp(parts.leftLeg.knee.rotation.x, 0);
  parts.rightLeg.knee.rotation.x = lerp(parts.rightLeg.knee.rotation.x, 0);

  if (playerState.isJumping) {
    applyJumpPose(parts);
    return;
  }

  if (wasLowering) {
    const crouchAmount = playerState.isLowering ? 1 : 0.65;
    applyCrouchPose(parts, crouchAmount);
    return;
  }

  applyRunPose(parts, mesh.userData.runPhase, playerState);
}

export function createPlayerMesh() {
  const mesh = new THREE.Group();
  const parts = createHumanoidRig();

  mesh.add(parts.rig);
  mesh.position.set(PLAYER_DEFAULTS.x, PLAYER_DEFAULTS.y, PLAYER_DEFAULTS.z);

  mesh.userData.parts = parts;
  mesh.userData.runPhase = 0;
  mesh.castShadow = true;
  mesh.receiveShadow = true;

  return mesh;
}

export function syncPlayerMesh(mesh, playerState) {
  mesh.position.x = playerState.x;
  mesh.position.y = playerState.y;
  mesh.position.z = playerState.z;

  animateHumanoid(mesh, playerState);
}
