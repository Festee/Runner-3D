import * as THREE from 'https://unpkg.com/three@0.183.2/build/three.module.js';

export function createObstacleMesh(type) {
  const group = new THREE.Group();

  if (type === 'tall') {
    const woodColor = 0x8B6F47;
    const metalColor = 0x555555;

    const panelGeometry = new THREE.BoxGeometry(1.5, 1.2, 0.4);
    const woodMaterial = new THREE.MeshLambertMaterial({ color: woodColor });

    const topLeftPanel = new THREE.Mesh(panelGeometry, woodMaterial);
    topLeftPanel.position.set(-0.4, 1.3, 0);
    topLeftPanel.castShadow = true;
    topLeftPanel.receiveShadow = true;
    group.add(topLeftPanel);

    const topRightPanel = new THREE.Mesh(panelGeometry, woodMaterial);
    topRightPanel.position.set(0.4, 1.3, 0);
    topRightPanel.castShadow = true;
    topRightPanel.receiveShadow = true;
    group.add(topRightPanel);

    const postGeometry = new THREE.BoxGeometry(0.2, 2.0, 0.5);
    const postMaterial = new THREE.MeshLambertMaterial({ color: 0x654321 });

    const leftPost = new THREE.Mesh(postGeometry, postMaterial);
    leftPost.position.set(-0.8, 1.0, 0);
    leftPost.castShadow = true;
    leftPost.receiveShadow = true;
    group.add(leftPost);

    const rightPost = new THREE.Mesh(postGeometry, postMaterial);
    rightPost.position.set(0.8, 1.0, 0);
    rightPost.castShadow = true;
    rightPost.receiveShadow = true;
    group.add(rightPost);

    const beamGeometry = new THREE.BoxGeometry(1.8, 0.18, 0.5);
    const beam = new THREE.Mesh(beamGeometry, postMaterial);
    beam.position.set(0, 0.5, 0);
    beam.castShadow = true;
    beam.receiveShadow = true;
    group.add(beam);

    const bracketGeometry = new THREE.BoxGeometry(0.15, 0.3, 0.3);
    const bracketMaterial = new THREE.MeshLambertMaterial({ color: metalColor });

    const bracket1 = new THREE.Mesh(bracketGeometry, bracketMaterial);
    bracket1.position.set(-0.75, 0.65, 0.15);
    bracket1.castShadow = true;
    bracket1.receiveShadow = true;
    group.add(bracket1);

    const bracket2 = new THREE.Mesh(bracketGeometry, bracketMaterial);
    bracket2.position.set(0.75, 0.65, 0.15);
    bracket2.castShadow = true;
    bracket2.receiveShadow = true;
    group.add(bracket2);
  } else {
    const barrelColor = 0xB8860B;
    const metalColor = 0x666666;

    const barrelGeometry = new THREE.CylinderGeometry(0.35, 0.35, 0.5, 8);
    const barrelMaterial = new THREE.MeshLambertMaterial({ color: barrelColor });

    const leftBarrel = new THREE.Mesh(barrelGeometry, barrelMaterial);
    leftBarrel.position.set(-0.5, 0.25, 0);
    leftBarrel.castShadow = true;
    leftBarrel.receiveShadow = true;
    group.add(leftBarrel);

    const rightBarrel = new THREE.Mesh(barrelGeometry, barrelMaterial);
    rightBarrel.position.set(0.5, 0.25, 0);
    rightBarrel.castShadow = true;
    rightBarrel.receiveShadow = true;
    group.add(rightBarrel);

    const topBarrel = new THREE.Mesh(barrelGeometry, barrelMaterial);
    topBarrel.position.set(0, 0.7, 0);
    topBarrel.castShadow = true;
    topBarrel.receiveShadow = true;
    group.add(topBarrel);

    const bandGeometry = new THREE.TorusGeometry(0.36, 0.08, 8, 16);
    const bandMaterial = new THREE.MeshLambertMaterial({ color: metalColor });

    const band1 = new THREE.Mesh(bandGeometry, bandMaterial);
    band1.position.set(-0.5, 0.12, 0);
    band1.castShadow = true;
    band1.receiveShadow = true;
    group.add(band1);

    const band2 = new THREE.Mesh(bandGeometry, bandMaterial);
    band2.position.set(0.5, 0.12, 0);
    band2.castShadow = true;
    band2.receiveShadow = true;
    group.add(band2);

    const band3 = new THREE.Mesh(bandGeometry, bandMaterial);
    band3.position.set(0, 0.65, 0);
    band3.castShadow = true;
    band3.receiveShadow = true;
    group.add(band3);

    const rimGeometry = new THREE.TorusGeometry(0.38, 0.05, 8, 16);
    const rim = new THREE.Mesh(rimGeometry, bandMaterial);
    rim.position.set(0, 0.95, 0);
    rim.castShadow = true;
    rim.receiveShadow = true;
    group.add(rim);
  }

  return group;
}

export function createObstacleMeshes(scene, obstacles) {
  return obstacles.map((obstacle) => {
    const mesh = createObstacleMesh(obstacle.type);
    mesh.position.set(obstacle.x, obstacle.y, obstacle.z);
    mesh.userData.type = obstacle.type;
    scene.add(mesh);
    return mesh;
  });
}

export function syncObstacleMesh(mesh, obstacle) {
  mesh.position.set(obstacle.x, obstacle.y, obstacle.z);
  mesh.userData.type = obstacle.type;
}

export function replaceObstacleMesh(scene, oldMesh, obstacle) {
  scene.remove(oldMesh);

  const newMesh = createObstacleMesh(obstacle.type);
  newMesh.position.set(obstacle.x, obstacle.y, obstacle.z);
  newMesh.userData.type = obstacle.type;

  scene.add(newMesh);
  return newMesh;
}