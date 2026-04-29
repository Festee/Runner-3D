export function markPlayerHit(player) {
  return {
    ...player,
    status: 'hit',
    isJumping: false,
    jumpVelocity: 0,
    isLowering: false,
    lowerVelocity: 0,
    isRecoveringFromLower: false,
    lowerTimer: 0,
  };
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
  return {
    ...player,
    status: 'alive',
    isJumping: false,
    jumpVelocity: 0,
    isLowering: false,
    lowerVelocity: 0,
    isRecoveringFromLower: false,
    lowerTimer: 0,
  };
}

export function getPlayerStatus(player) {
  return player.status;
}

export function isPlayerHit(player) {
  return player.status === 'hit';
}