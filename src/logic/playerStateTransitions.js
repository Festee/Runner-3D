
export function markPlayerHit(player) {
  player.status = 'hit';
  
  // Stop any ongoing jumps or lowers
  if (player.isJumping) {
    player.isJumping = false;
    player.jumpVelocity = 0;
  }
  
  if (player.isLowering) {
    player.isLowering = false;
    player.lowerVelocity = 0;
  }

  player.isRecoveringFromLower = false;
  player.lowerTimer = 0;
}

export function canPlayerMove(player) {
  return player.status === 'alive';
}

export function canPlayerJump(player) {
  return canPlayerMove(player) && !player.isJumping && !player.isLowering && !player.isRecoveringFromLower;
}

export function canPlayerChangeLane(player) {
  return canPlayerMove(player);
}

export function canPlayerLower(player) {
  return canPlayerMove(player) && !player.isJumping && !player.isLowering && !player.isRecoveringFromLower;
}

export function restorePlayerAlive(player) {
  player.status = 'alive';
  player.isJumping = false;
  player.jumpVelocity = 0;
  player.isLowering = false;
  player.lowerVelocity = 0;
  player.isRecoveringFromLower = false;
  player.lowerTimer = 0;
}

export function getPlayerStatus(player) {
  return player.status;
}

export function isPlayerHit(player) {
  return player.status === 'hit';
}