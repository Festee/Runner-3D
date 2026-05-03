# Runner 3D

Runner 3D is a browser-based 3D endless runner game built with JavaScript and Three.js.

The player controls a character running forward through a 3D city-style environment, avoiding obstacles and collecting coins.

The project was developed with a focus on functional programming principles, such as separating game state from rendering, using small reusable functions, treating entities as data, and isolating side effects like rendering, UI, audio, and `localStorage`.

---

## Team Members

- Festim Dibrani
- Puhizë Aliu

---

## Project Overview

In Runner 3D, the player can:

- Move left and right between lanes
- Jump over obstacles
- Lower/crouch under obstacles
- Collect coins
- Increase score over time
- Save high score using `localStorage`
- Save total collected coins across multiple runs
- Choose between day and night visual mode

The game uses JavaScript modules to organize the project into smaller parts. The main goal was to keep the game logic separated from rendering, UI, audio, and storage side effects.

---

## External Libraries / Dependencies

This project depends on the following external library:

### Three.js

Three.js is used for:

- Creating the 3D scene
- Rendering the player, road, obstacles, coins, and environment
- Managing the camera and lights
- Loading and applying textures
- Animating the 3D game world

Three.js is imported directly from a CDN:

```js
import * as THREE from 'https://unpkg.com/three@0.183.2/build/three.module.js';
```

No package installation is required for Three.js.

For running the project locally, we recommend using:

```bash
npx serve .
```

---

## How to Install and Run the Project

### 1. Clone the repository

```bash
git clone https://github.com/Festee/Runner-3D.git
cd Runner-3D
```

### 2. Start the local server

```bash
npx serve .
```

### 3. Open the project in the browser

After running the command, the terminal will show a local URL, usually:

```text
http://localhost:3000
```

Open that URL in your browser.

### 4. Start the game

When the game page opens:

1. Choose the visual mode:
   - Day
   - Night
2. Press the **Start** button.
3. Use the keyboard controls to play.

---

## Main Module / Entry Point

This is not a Haskell project, so no module needs to be loaded into GHCi.

Instead, the project is executed in the browser.

The browser starts the application from:

```text
index.html
```

The main JavaScript module is:

```text
main.js
```

It is loaded inside `index.html` using:

```html
<script type="module" src="./main.js"></script>
```

The command used to run the project locally is:

```bash
npx serve .
```

---

## Project Structure

```text
Runner-3D/
│
├── index.html
├── main.js
│
└── src/
    ├── core/
    ├── logic/
    ├── entities/
    ├── render/
    ├── ui/
    ├── audio/
    └── assets/
```

---

## Folder Explanation

### `index.html`

The browser entry point of the project. It loads the main JavaScript module and contains the basic HTML structure of the game.

### `main.js`

The main orchestrator of the game. It connects the game state, rendering, UI, audio, input handling, and the game loop.

### `src/core`

Contains core game setup and lifecycle logic, including:

- Game state creation
- Run initialization
- Input setup
- Gameplay update coordination
- High score and total coin storage helpers

### `src/logic`

Contains gameplay rules and state update logic, including:

- Player movement
- Collision detection
- Obstacle spawning
- Collectible handling
- Scoring
- Difficulty progression
- World movement
- Knockback logic

### `src/entities`

Contains data/state definitions for game entities, such as:

- Player
- Obstacles
- Collectibles
- Environment/world segments

### `src/render`

Contains Three.js rendering code, including:

- Scene
- Camera
- Lights
- Player mesh
- Obstacle meshes
- Collectible meshes
- World mesh
- Textures
- Day/night theme
- Scene synchronization

### `src/ui`

Contains DOM-based interface elements, such as:

- Start screen
- Game over screen
- Score HUD

### `src/audio`

Contains sound effect logic using the Web Audio API.

### `src/assets`

Contains image and texture assets used by the game.

---

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

---

## Example Input Sequences

These input sequences show the important gameplay features of the project.

---

### Start the game

1. Open the project in the browser using:

```text
http://localhost:3000
```

2. Choose either **Day** or **Night** mode.
3. Press the **Start** button.

This demonstrates:

- Start screen
- Theme selection
- Game initialization

---

### Move between lanes

Use:

```text
A / Left Arrow  -> move left
D / Right Arrow -> move right
```

This demonstrates:

- Lane switching
- Player movement
- State update based on keyboard input

---

### Jump over obstacles

Use:

```text
Space / Up Arrow -> jump
```

This demonstrates:

- Vertical movement
- Jump state
- Gravity
- Ground detection

---

### Lower / Crouch under obstacles

Use:

```text
Down Arrow -> lower/crouch
```

This demonstrates:

- Player lowering
- Crouch movement
- Recovery state transition

---

### Collect coins

Move the player into the same lane as a coin.

This demonstrates:

- Collectible collision checking
- Coin collection
- Run coin count
- Total coin storage in `localStorage`
- Coin pickup sound event

---

### Hit an obstacle

Run into an obstacle.

This demonstrates:

- Obstacle collision detection
- Player hit state
- Knockback effect
- Camera shake event
- Game over screen

---

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

---

## Important Gameplay Values

The game tracks the following values:

| Value | Description |
|---|---|
| Score | Score for the current run |
| Coins | Coins collected in the current run |
| Total Coins | All coins collected across multiple runs |
| High Score | Highest score saved across runs |

`High Score` and `Total Coins` are saved in browser `localStorage`.

---

## Notes

This project runs completely in the browser.

No backend server or database is required.

To reset saved high score and total coins, clear the browser `localStorage` for this site.
