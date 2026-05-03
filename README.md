# Runner 3D

Runner 3D is a browser-based 3D endless runner game built with JavaScript and Three.js.  
The player controls a character running forward through a 3D city-style environment, avoiding obstacles and collecting coins.

The project was developed with a focus on functional programming principles, such as separating game state from rendering, using small reusable functions, treating entities as data, and isolating side effects like rendering, UI, audio, and localStorage.

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
- Save high score using localStorage
- Save total collected coins across multiple runs
- Choose between day and night visual mode

The game uses Three.js for 3D rendering and JavaScript modules for organizing the project into smaller functional parts.

---

## External Libraries / Dependencies

This project depends on:

- [Three.js](https://threejs.org/)  
  Used for rendering the 3D scene, camera, lights, meshes, textures, and animations.

Three.js is imported directly from a CDN:

```js
import * as THREE from 'https://unpkg.com/three@0.183.2/build/three.module.js';

No package installation is required for Three.js.

For running the project locally, we recommend using npx serve.

How to Install and Run
1. Clone the repository
git clone https://github.com/Festee/Runner-3D.git
cd Runner-3D
2. Run the project locally
npx serve .
3. Open the game in the browser

After running the command, open the local URL shown in the terminal, usually:

http://localhost:3000
Main Module / Entry Point

This is not a Haskell project, so no module needs to be loaded into GHCi.

The main JavaScript module is:

main.js

The browser loads it through:

<script type="module" src="./main.js"></script>

The application starts from index.html, which loads main.js.

Project Structure
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
index.html

The browser entry point. It loads main.js as a JavaScript module.

main.js

The main orchestrator of the game. It connects game state, rendering, UI, audio, input, and the game loop.

src/core

Contains core game setup and lifecycle logic, including:

game state creation
run initialization
input setup
gameplay update coordination
high score and total coin storage helpers
src/logic

Contains gameplay rules and state update logic, including:

player movement
collision detection
obstacle spawning
collectible handling
scoring
difficulty progression
world movement
knockback logic
src/entities

Contains data/state definitions for game entities:

player
obstacles
collectibles
environment/world segments
src/render

Contains Three.js rendering code:

scene
camera
lights
player mesh
obstacle meshes
collectible meshes
world mesh
textures
day/night theme
scene synchronization
src/ui

Contains DOM-based interface elements:

start screen
game over screen
score HUD
src/audio

Contains sound effect logic using the Web Audio API.

src/assets

Contains image and texture assets used by the game.

Functional Programming Concepts Used

The project applies functional programming ideas where possible:

Game entities are represented as plain data objects.
Game logic is separated from rendering.
Many functions transform state or return new objects.
Side effects are isolated in specific layers:
render for Three.js visual updates
ui for DOM updates
audio for sound effects
storage helpers for localStorage
Array helpers such as map, find, and Array.from are used where appropriate.
Gameplay events such as coin pickup and player hit are returned from logic and handled in main.js.

Example:

const gameplayResult = updateGameplay(state, systems);

if (gameplayResult.events.includes('coinPickup')) {
  playCoinPickupSound();
}

This keeps the gameplay update logic separate from the audio side effect.

Example Input Sequences

These input sequences show the main gameplay features of the project.

Start the game
Open the game in the browser.
Choose visual mode:
Day
Night
Press the Start button.
Move between lanes

Use:

A / Left Arrow  -> move left
D / Right Arrow -> move right

This demonstrates lane switching and player movement state updates.

Jump

Use:

Space / Up Arrow -> jump

This demonstrates vertical movement, jump state, gravity, and ground detection.

Lower / Crouch

Use:

Down Arrow -> lower/crouch

This demonstrates player lowering and recovery state transitions.

Collect coins

Move the player into the same lane as a coin.

This demonstrates:

collectible collision checking
coin respawn
run coin count
total coin storage in localStorage
coin pickup sound event
Hit an obstacle

Run into an obstacle.

This demonstrates:

obstacle collision detection
player hit state
knockback effect
camera shake event
game over screen
Restart the game

After losing, press:

Restart

This demonstrates:

run reset
score reset
current coins reset
high score preservation
total coins preservation
Important Gameplay Values

The game tracks:

Score        -> score for the current run
Coins        -> coins collected in the current run
Total Coins  -> all coins collected across runs
High Score   -> highest score saved across runs

High Score and Total Coins are saved in browser localStorage.

Notes

This project runs completely in the browser.
No backend server or database is required.

To reset saved high score and total coins, clear the browser localStorage for this site.
