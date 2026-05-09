import { updatePlayerMovement } from '../logic/movement.js';
import { updateWorld } from '../logic/world.js';
import { updateObstacles } from '../logic/spawning.js';
import { checkAndResolveObstacleCollision } from '../logic/collisions.js';
import {
  updateCollectibles,
  collectCollectibles,
} from '../logic/collectibles.js';
import { addCollectedCoinsScore, updateScore } from '../logic/scoring.js';
import { updateKnockback, isKnockbackActive } from '../logic/knockback.js';

function calculateScoreAndEvents(state, hitObstacle, collectedCount) {
  if (hitObstacle) {
    return { scoreResult: null, events: ['playerHit'] };
  }

  let scoreResult = updateScore(state);
  const events = [];

  if (collectedCount > 0) {
    scoreResult = addCollectedCoinsScore(state, collectedCount);
    events.push('coinPickup');
  }

  return { scoreResult, events };
}

export function updateGameplay(state, systems) {
  const {
    world,
    textures,
    obstacles,
    collectibles,
    knockback,
  } = systems;

  const events = [];

  if (isKnockbackActive(knockback)) {
    updateKnockback(knockback, state.player);
  }

  updatePlayerMovement(state.player);
  updateWorld(state, world, textures);

  const respawnedIndices = updateObstacles(state, obstacles);
  const respawnedCollectibleIndices = updateCollectibles(state, collectibles);

  const hitObstacle = checkAndResolveObstacleCollision(
    state,
    obstacles,
    knockback
  );

  const collectedCount = hitObstacle
    ? 0
    : collectCollectibles(state.player, collectibles);
  const scoringOutcome = calculateScoreAndEvents(
    state,
    hitObstacle,
    collectedCount
  );
  events.push(...scoringOutcome.events);

  return {
    respawnedIndices,
    respawnedCollectibleIndices,
    hitObstacle,
    scoreResult: scoringOutcome.scoreResult,
    events,
  };
}
