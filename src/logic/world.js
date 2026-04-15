function recycleSegments(segments, segmentLength, totalSegments) {
  for (const segment of segments) {
    if (segment.position.z > 20) {
      segment.position.z -= segmentLength * totalSegments;
    }
  }
}

export function updateWorld(state, world, textures) {
  const moveSpeed = state.speed * 25;

  textures.groundTexture.offset.y -= state.speed;
  textures.wallTexture.offset.y -= state.speed * 0.35;

  for (const road of world.roadSegments) {
    road.position.z += moveSpeed;
  }

  for (const wall of world.leftWallSegments) {
    wall.position.z += moveSpeed;
  }

  for (const wall of world.rightWallSegments) {
    wall.position.z += moveSpeed;
  }

  recycleSegments(
    world.roadSegments,
    world.segmentLength,
    world.totalSegments
  );

  recycleSegments(
    world.leftWallSegments,
    world.segmentLength,
    world.totalSegments
  );

  recycleSegments(
    world.rightWallSegments,
    world.segmentLength,
    world.totalSegments
  );
}