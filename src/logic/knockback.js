/**
 * Player knockback effect system
 * Applies temporary displacement to player when hit
 */

export function createKnockbackState() {
  return {
    isActive: false,
    direction: 0, // -1 for left, 1 for right
    amount: 0,
    maxAmount: 0,
    duration: 0,
    elapsed: 0,
    originalLane: 0,
  };
}

/**
 * Start a knockback effect
 * 
 * @param {Object} knockback - Knockback state object
 * @param {Object} player - Player state object
 * @param {number} direction - Direction of knockback (-1 for left, 1 for right)
 * @param {number} maxAmount - Maximum knockback distance (typically 0.8-1.2)
 * @param {number} duration - Duration in frames (typically 20-30)
 */
export function startKnockback(
  knockback,
  player,
  direction,
  maxAmount = 1.0,
  duration = 24
) {
  knockback.isActive = true;
  knockback.direction = direction;
  knockback.amount = 0;
  knockback.maxAmount = maxAmount;
  knockback.duration = duration;
  knockback.elapsed = 0;
  knockback.originalLane = player.lane;

  // Immediately disable player movement
  player.isJumping = false;
  player.jumpVelocity = 0;
  player.isLowering = false;
  player.lowerVelocity = 0;
}

/**
 * Update knockback effect and move player
 * Should be called each frame during updates
 * 
 * @param {Object} knockback - Knockback state object
 * @param {Object} player - Player state object
 * @returns {boolean} True if knockback is still active
 */
export function updateKnockback(knockback, player) {
  if (!knockback.isActive) {
    return false;
  }

  knockback.elapsed++;

  if (knockback.elapsed >= knockback.duration) {
    knockback.isActive = false;
    knockback.elapsed = 0;
    // Snap back to lane
    player.lane = knockback.originalLane;
    player.targetLane = knockback.originalLane;
    return false;
  }

  // Easing function: move out quickly, come back slower
  const progress = knockback.elapsed / knockback.duration;
  let easeAmount;

  if (progress < 0.4) {
    // First 40% - quick movement outward (ease out)
    const p = progress / 0.4;
    easeAmount = Math.sin(p * Math.PI / 2);
  } else {
    // Remaining 60% - slow return (ease in)
    const p = (progress - 0.4) / 0.6;
    easeAmount = 1 - p * p * p * p;
  }

  knockback.amount = knockback.maxAmount * easeAmount;

  // Apply knockback to player lane (lateral displacement)
  player.lane = knockback.originalLane + knockback.direction * knockback.amount;
  player.targetLane = player.lane;

  return true;
}

/**
 * Check if knockback is currently active
 * 
 * @param {Object} knockback - Knockback state object
 * @returns {boolean} True if knockback effect is playing
 */
export function isKnockbackActive(knockback) {
  return knockback.isActive;
}
