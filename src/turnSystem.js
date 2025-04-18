import * as THREE from "three";
import { setMessage } from "./uiController.js";

let currentTurn = "player";

const rockPositions = new Set();

export function setupTurnSystem(sceneData, player, movePlayer) {
  const { scene, camera, renderer } = sceneData;
  let awaitingInput = true;

  function handleKey(event) {
    if (currentTurn === "player" && awaitingInput) {
      if (
        ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)
      ) {
        let move = movePlayer(player, event.key, rockPositions);

        if (move) {
          awaitingInput = false;
          setTimeout(() => {
            dropRock(sceneData, event);
            awaitingInput = true;
          }, 250);

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

function dropRock(sceneData, event) {
  const { scene } = sceneData;
  const positions = findRockPositions(sceneData, event);
  const geometry = new THREE.CircleGeometry(0.5, 32);
  const material = new THREE.MeshBasicMaterial({
    color: 0x4f4f4f,
    side: THREE.DoubleSide,
  });

  for (const pos of positions) {
    const rock = new THREE.Mesh(geometry, material);
    rock.name = "rock";
    rock.rotation.x = -Math.PI / 2;
    rock.position.set(pos.x, pos.y, pos.z);

    if ((Math.abs(pos.x) < 8) & (Math.abs(pos.z) < 8)) {
      scene.add(rock);
      const key = `${pos.x},${pos.z}`;
      rockPositions.add(key);
    }
  }

  console.log("AI Turn");
  currentTurn = "player";
}

function findRockPositions(sceneData, event) {
  const { scene, camera, renderer } = sceneData;
  let positions = [];

  if (Math.floor(Math.random() * 10) <= 4) {
    positions.push(userbasedPosition(sceneData, event));
  }
  positions.push(randomPosition(sceneData));
  positions.push(randomPosition(sceneData));
  positions.push(randomPosition(sceneData));
  positions.push(randomPosition(sceneData));
  positions.push(randomPosition(sceneData));
  positions.push(randomPosition(sceneData));
  positions.push(randomPosition(sceneData));
  positions.push(randomPosition(sceneData));
  positions.push(randomPosition(sceneData));
  
  return positions;
}

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

  return { x, y: 0.05, z }; // Slightly above ground
}

function randomPosition(sceneData) {
  const chance = Math.floor(Math.random() * 10);
  if (chance < 2) return { x: 0, y: -5, z: 0 };
  const gridRange = 7; // Limits to -7 to +7
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

export function gameCheck(sceneData) {
  const player = sceneData.scene.getObjectByName("player");
  if (Math.abs(player.position.x) > 7 || Math.abs(player.position.z) > 7) {
    setMessage("You Win!!!");
  }
}
