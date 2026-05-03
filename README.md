## Functional Programming Concepts Used

The project applies functional programming ideas where possible:

- Game entities are represented as plain data objects.
- Game logic is separated from rendering.
- Many functions transform state or return new objects.
- Side effects are isolated in specific layers:
  - `render` for Three.js visual updates
  - `ui` for DOM updates
  - `audio` for sound effects
  - Storage helpers for `localStorage`
- Array helpers such as `map`, `find`, and `Array.from` are used where appropriate.
- Gameplay events such as coin pickup and player hit are returned from logic and handled in `main.js`.

Example:

```js
const gameplayResult = updateGameplay(state, systems);

if (gameplayResult.events.includes('coinPickup')) {
  playCoinPickupSound();
}
```

This keeps the gameplay update logic separate from the audio side effect.

## Example Input Sequences

These input sequences show the main gameplay features of the project.

### Start the game

1. Open the game in the browser.
2. Choose visual mode:
   - Day
   - Night
3. Press the Start button.

### Move between lanes

Use:

```text
A / Left Arrow  -> move left
D / Right Arrow -> move right
```

This demonstrates lane switching and player movement state updates.

### Jump

Use:

```text
Space / Up Arrow -> jump
```

This demonstrates vertical movement, jump state, gravity, and ground detection.

### Lower / Crouch

Use:

```text
Down Arrow -> lower/crouch
```

This demonstrates player lowering and recovery state transitions.

### Collect coins

Move the player into the same lane as a coin.

This demonstrates:

- Collectible collision checking
- Coin respawn
- Run coin count
- Total coin storage in `localStorage`
- Coin pickup sound event

### Hit an obstacle

Run into an obstacle.

This demonstrates:

- Obstacle collision detection
- Player hit state
- Knockback effect
- Camera shake event
- Game over screen

### Restart the game

After losing, press:

```text
Restart
```

This demonstrates:

- Run reset
- Score reset
- Current coins reset
- High score preservation
- Total coins preservation

## Important Gameplay Values

The game tracks:

| Value | Description |
|---|---|
| Score | Score for the current run |
| Coins | Coins collected in the current run |
| Total Coins | All coins collected across runs |
| High Score | Highest score saved across runs |

High Score and Total Coins are saved in browser `localStorage`.

## Notes

This project runs completely in the browser.

No backend server or database is required.

To reset saved high score and total coins, clear the browser `localStorage` for this site.
