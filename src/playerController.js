import * as THREE from 'three';
import { setMessage } from './uiController.js';

const SPRITE_SHEET_CONFIG = {
  width: 64,
  height: 51,
  cols: 4,        // Number of columns in the sprite sheet
  rows: 3,        // Number of rows
  padding: 1,     // Padding between frames
  initialFrame: { x: 0, y: 0 },
};

// Creates the Player
function createPlayerMesh(texturePath, config = SPRITE_SHEET_CONFIG) {
  const { cols, rows, initialFrame: { x: frameX, y: frameY } } = config;

  const texture = new THREE.TextureLoader().load(texturePath);
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;

  // Show only one frame
  texture.repeat.set(1 / cols, 1 / rows);
  texture.offset.set(
    frameX / cols,
    1 - (frameY + 1) / rows
  );

  const aspectRatio = (1 / rows) / (1 / cols);
  const geometry = new THREE.PlaneGeometry(1, aspectRatio);

  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    alphaTest: 0.1,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.set(0, 0.01, 0);
  mesh.name = 'player';

  return mesh;
}

// Add Player to Scene
export function scenePlayerSetup(sceneData, spritePath) {
  const scene = sceneData.scene;
  const player = createPlayerMesh(spritePath);
  scene.add(player);
  return player;
}

// Move Player One Tile Based on Input
export function movePlayer(player, direction, rockPositions, tileSize = 1) {
  const pos = player.position;
  let [targetX, targetZ] = [pos.x, pos.z];
  let frameCol = 0; 
  let frameRow = Math.floor(Math.random() * SPRITE_SHEET_CONFIG.rows); 

  switch (direction) {
    case 'ArrowUp':
      targetZ -= tileSize;
      frameCol = 2;
      break;
    case 'ArrowDown':
      targetZ += tileSize;
      frameCol = 0;
      break;
    case 'ArrowLeft':
      targetX -= tileSize;
      frameCol = 3;
      break;
    case 'ArrowRight':
      targetX += tileSize;
      frameCol = 1;
      break;
    default: return;
  }

  const key = `${targetX},${targetZ}`;

  if (rockPositions.has(key)) {
    console.log("Blocked by rock at", key);
    setMessage("Blocked!");
    return;
  }

  if (Math.abs(targetX) > 8 || Math.abs(targetZ) > 8) {
    console.log("You are at the edge!");
    return;
  }

  player.position.set(targetX, pos.y, targetZ);

  setFrame(player.material.map, frameCol, frameRow, SPRITE_SHEET_CONFIG.cols, SPRITE_SHEET_CONFIG.rows);

  setMessage("Looking Good!");
  return true;
}

// Sets sprite
function setFrame(texture, col, row, cols, rows) {
  texture.offset.set(
    col / cols,
    1 - (row + 1) / rows
  );
}
