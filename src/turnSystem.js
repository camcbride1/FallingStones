import * as THREE from "three";
import { setMessage } from "./uiController.js";
// Facilitates the turn system

let currentTurn = "player";

// Stores Rock Positions
const rockPositions = new Set();

// Main driver for turn system
export function setupTurnSystem(sceneData, player, movePlayer, dungeonPath) {
  const { scene, camera, renderer } = sceneData;
  let awaitingInput = true;

  // Handles input
  function handleKey(event) {
    if (currentTurn === "player" && awaitingInput) {
      if (
        ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)
      ) {
        let move = movePlayer(player, event.key, rockPositions);

        if (move) {
          awaitingInput = false;
          // Sets up rock drop
          setTimeout(() => {
            dropRock(sceneData, event, dungeonPath);
            awaitingInput = true;
          }, 100);

          currentTurn = "ai";
        }
      }
    }
  }

  window.addEventListener("keydown", handleKey);

  return () => {
    window.removeEventListener("keydown", handleKey);
  };
}

// Adds rocks based on positions recieved
function dropRock(sceneData, event, dungeonPath) {
  const tilesHoriz = 64; // Number of columns in the sprite sheet
  const tilesVert = 95;  // Number of rows
  const loader = new THREE.TextureLoader();
  const rockTexture = loader.load(dungeonPath);
  rockTexture.wrapS = THREE.RepeatWrapping;
  rockTexture.wrapT = THREE.RepeatWrapping;
  rockTexture.repeat.set(1 / tilesHoriz, 1 / tilesVert);
  const { scene } = sceneData;
  const positions = findRockPositions(sceneData, event);


  for (const pos of positions) {
    const tileTexture = rockTexture.clone();
    tileTexture.needsUpdate = true;

    const tileIndexX = Math.floor(Math.random() * 24) + 28;
    const tileIndexY = 12;

    tileTexture.offset.x = tileIndexX / tilesHoriz;
    tileTexture.offset.y = 1 - (tileIndexY + 1) / tilesVert;

    const rockMaterial = new THREE.MeshBasicMaterial({
      map: tileTexture,
      transparent: true,
      alphaTest: 0.1,
      side: THREE.DoubleSide,
    });

    const rockGeometry = new THREE.PlaneGeometry(1, 1);
    const rock = new THREE.Mesh(rockGeometry, rockMaterial);
    rock.name = "rock";
    rock.rotation.x = -Math.PI / 2;
    rock.position.set(pos.x, pos.y, pos.z);

    const key = `${pos.x},${pos.z}`;
    if ((Math.abs(pos.x) < 8) && (Math.abs(pos.z) < 8) && !(pos.x === 0 && pos.z === 0)) {
      scene.add(rock);
      rockPositions.add(key);
    }
  }

  console.log("AI Turn");
  currentTurn = "player";
}

// Finds all rock positions and pushes them to the set
function findRockPositions(sceneData, event) {
  const { scene, camera, renderer } = sceneData;
  let positions = [];

  // Each rock has a chance not to spawn.
  // One is made to pop in front of the player the other are random
  if (Math.floor(Math.random() * 10) <= 4) {
    positions.push(userbasedPosition(sceneData, event));
  }
  for (let iter = 0; iter <= 7; iter++) {
    positions.push(randomPosition(sceneData));
  }
  return positions;
}

// Returns the position for the rock in front of player
function userbasedPosition(sceneData, event) {
  const player = sceneData.scene.getObjectByName("player");
  const playerPos = player.position;
  const tileSize = 1;

  let x = playerPos.x;
  let z = playerPos.z;

  switch (event.key) {
    case "ArrowUp":
      z -= tileSize;
      break;
    case "ArrowDown":
      z += tileSize;
      break;
    case "ArrowLeft":
      x -= tileSize;
      break;
    case "ArrowRight":
      x += tileSize;
      break;
  }

  return { x, y: 0.05, z };
}

// Returns a random position on board
function randomPosition(sceneData) {
  const chance = Math.floor(Math.random() * 10);
  if (chance < 2) return { x: 0, y: -5, z: 0 };
  const gridRange = 7;
  const maxTries = 5;

  const player = sceneData.scene.getObjectByName("player");
  const playerKey = `${player.position.x},${player.position.z}`;

  for (let i = 0; i < maxTries; i++) {
    const x = Math.floor(Math.random() * (gridRange * 2 + 1)) - gridRange;
    const z = Math.floor(Math.random() * (gridRange * 2 + 1)) - gridRange;

    const posKey = `${x},${z}`;
    if (!rockPositions.has(posKey) && posKey !== playerKey) {
      return { x, y: 0.05, z };
    }
  }

  return { x: 0, y: -5, z: 0 };
}

// Checks if the game is finished
export function gameCheck(sceneData) {
  const player = sceneData.scene.getObjectByName("player");
  if (Math.abs(player.position.x) > 7 || Math.abs(player.position.z) > 7) {
    setMessage("You Win!!!");
  }
}
