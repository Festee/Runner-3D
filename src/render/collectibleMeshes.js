import * as THREE from 'https://unpkg.com/three@0.183.2/build/three.module.js';

function createCollectibleMesh() {
  const group = new THREE.Group();

  const ringGeometry = new THREE.TorusGeometry(0.28, 0.09, 12, 24);
  const ringMaterial = new THREE.MeshLambertMaterial({ color: 0xffd24a });
  const ring = new THREE.Mesh(ringGeometry, ringMaterial);
  ring.rotation.x = Math.PI / 2;
  ring.castShadow = true;
  ring.receiveShadow = true;
  group.add(ring);

  const coreGeometry = new THREE.SphereGeometry(0.12, 16, 16);
  const coreMaterial = new THREE.MeshLambertMaterial({ color: 0xfff4b5 });
  const core = new THREE.Mesh(coreGeometry, coreMaterial);
  core.castShadow = true;
  core.receiveShadow = true;
  group.add(core);

  return group;
}

function applyCollectibleState(mesh, collectible) {
  mesh.position.set(collectible.x, collectible.y, collectible.z);
  mesh.visible = collectible.isActive;
}

export function createCollectibleMeshes(scene, collectibles) {
  return collectibles.map((collectible) => {
    const mesh = createCollectibleMesh();
    applyCollectibleState(mesh, collectible);
    scene.add(mesh);
    return mesh;
  });
}

export function syncCollectibleMesh(mesh, collectible) {
  if (!mesh) {
    return null;
  }

  applyCollectibleState(mesh, collectible);
  mesh.rotation.y += 0.08;
  return mesh;
}

export function replaceCollectibleMesh(scene, oldMesh, collectible) {
  if (oldMesh) {
    scene.remove(oldMesh);
  }

  const newMesh = createCollectibleMesh();
  applyCollectibleState(newMesh, collectible);
  scene.add(newMesh);
  return newMesh;
}
