export const WORLD_DEFAULTS = {
  // segment system
  segmentLength: 160,
  totalSegments: 10,

  // road
  roadWidth: 8,           // playable width
  roadVisualWidth: 8.6,   // visual width used for rendering
  roadThickness: 0.12,
  roadY: -0.25,

  // side zones (for next tasks)
  sidewalkWidth: 1.5,
  sidewalkHeight: 0.08,
  sidewalkOffset: 5.05,

  // temporary side boundaries / walls
  wallHeight: 8,
  wallThickness: 0.5,
  wallOffset: 4.25,
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