/**
 * Mark player as hit - triggered when collision occurs
 * Player enters 'hit' state where movement is restricted
 * 
 * @param {Object} player - Player state object
 */
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
}

/**
 * Check if player is alive and able to move
 * 
 * @param {Object} player - Player state object
 * @returns {boolean} True if player can move, false otherwise
 */
export function canPlayerMove(player) {
  return player.status === 'alive';
}

/**
 * Check if player can jump
 * Player cannot jump if hit or already jumping/lowering
 * 
 * @param {Object} player - Player state object
 * @returns {boolean} True if player can jump
 */
export function canPlayerJump(player) {
  return canPlayerMove(player) && !player.isJumping && !player.isLowering;
}

/**
 * Check if player can change lanes
 * Player cannot change lanes if hit
 * 
 * @param {Object} player - Player state object
 * @returns {boolean} True if player can change lanes
 */
export function canPlayerChangeLane(player) {
  return canPlayerMove(player);
}

/**
 * Check if player can lower/duck
 * Player cannot lower if hit or already jumping/lowering
 * 
 * @param {Object} player - Player state object
 * @returns {boolean} True if player can lower
 */
export function canPlayerLower(player) {
  return canPlayerMove(player) && !player.isJumping && !player.isLowering;
}

/**
 * Restore player to alive state
 * Useful for game reset or respawn logic
 * 
 * @param {Object} player - Player state object
 */
export function restorePlayerAlive(player) {
  player.status = 'alive';
  player.isJumping = false;
  player.jumpVelocity = 0;
  player.isLowering = false;
  player.lowerVelocity = 0;
}

/**
 * Get player current status
 * 
 * @param {Object} player - Player state object
 * @returns {string} Player status: 'alive' or 'hit'
 */
export function getPlayerStatus(player) {
  return player.status;
}

/**
 * Check if player is in hit state
 * 
 * @param {Object} player - Player state object
 * @returns {boolean} True if player is hit
 */
export function isPlayerHit(player) {
  return player.status === 'hit';
}
