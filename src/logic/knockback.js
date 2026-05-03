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

  player.isJumping = false;
  player.jumpVelocity = 0;
  player.isLowering = false;
  player.lowerVelocity = 0;
}


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

  const progress = knockback.elapsed / knockback.duration;
  let easeAmount;

  if (progress < 0.4) {
    const p = progress / 0.4;
    easeAmount = Math.sin(p * Math.PI / 2);
  } else {
    const p = (progress - 0.4) / 0.6;
    easeAmount = 1 - p * p * p * p;
  }

  knockback.amount = knockback.maxAmount * easeAmount;

  player.lane = knockback.originalLane + knockback.direction * knockback.amount;
  player.targetLane = player.lane;

  return true;
}


export function isKnockbackActive(knockback) {
  return knockback.isActive;
}
