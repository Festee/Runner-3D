export const WORLD_DEFAULTS = {
  // segment system
  segmentLength: 160,
  totalSegments: 10,

  // road
  roadWidth: 8,           // playable width
  roadVisualWidth: 7.6,   // visual width used for rendering
  roadThickness: 0.12,
  roadY: -0.25,

  // side zones (for next tasks)
  sidewalkWidth: 4.0,
  sidewalkHeight: 3.0,
  sidewalkOffset: 5.9,

  // temporary side boundaries / walls
  wallHeight: 8,
  wallThickness: 0.5,
  wallOffset: 6.2,
  wallY: -0.33,

  // buildings (for next tasks)
  buildingOffset: 8.5,
  buildingDepth: 3.5,
  buildingMinHeight: 6,
  buildingMaxHeight: 14,
  buildingsPerSide: 4,

  // world movement
  scrollSpeedMultiplier: 25,
};