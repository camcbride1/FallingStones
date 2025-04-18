import * as THREE from 'three';
import { setMessage } from "./uiController.js";

// Player sprites from https://opengameart.org/content/lpc-beetle

export function scenePlayerSetup(sceneData, playerPath) {
    const scene = sceneData.scene;

    // These values depend on your actual sprite sheet
    const textureWidth = 244;
    const textureHeight = 196;
    const frameCols = 5;
    const frameRows = 4;
    const padding = 1; // Assume 1px padding between frames

    const frameIndexX = 1;
    const frameIndexY = 1;

    const frameWidth = Math.floor(textureWidth / frameCols);
    const frameHeight = Math.floor(textureHeight / frameRows);

    const u0 = (frameIndexX * frameWidth + padding) / textureWidth;
    const v0 = 1 - ((frameIndexY + 1) * frameHeight - padding) / textureHeight;
    const u1 = ((frameIndexX + 1) * frameWidth - padding) / textureWidth;
    const v1 = 1 - (frameIndexY * frameHeight + padding) / textureHeight;

    const texture = new THREE.TextureLoader().load(playerPath);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;

    const geometry = new THREE.PlaneGeometry(1, frameHeight / frameWidth);

    // Manually set the UVs
    const uvs = geometry.attributes.uv.array;
    uvs[0] = u0; uvs[1] = v1;  // bottom left
    uvs[2] = u1; uvs[3] = v1;  // bottom right
    uvs[4] = u0; uvs[5] = v0;  // top left
    uvs[6] = u1; uvs[7] = v0;  // top right
    geometry.attributes.uv.needsUpdate = true;

    const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        alphaTest: 0.1,
    });

    const player = new THREE.Mesh(geometry, material);
    player.position.set(0, 0.01, 0);
    player.rotation.x = -Math.PI / 2;
    player.name = "player";

    scene.add(player);
    return player;
}

// Utility function to move player by one tile
export function movePlayer(player, direction, rockPositions, tileSize = 1) {
    // Calculate intended move
    let targetX = player.position.x;
    let targetZ = player.position.z;
  
    switch (direction) {
      case 'ArrowUp':
        targetZ -= tileSize;
        break;
      case 'ArrowDown':
        targetZ += tileSize;
        break;
      case 'ArrowLeft':
        targetX -= tileSize;
        break;
      case 'ArrowRight':
        targetX += tileSize;
        break;
    }
  
    // Convert position to a string key
    const targetKey = `${targetX},${targetZ}`;
  
    // Block movement if there's a rock
    if (rockPositions.has(targetKey)) {
      console.log("Blocked by rock at", targetKey);
      setMessage("Blocked!");
      return; // Don't move
    }
    if (Math.abs(targetX) > 8 || Math.abs(targetZ) > 8){
        console.log("You are at the edge!")
        return
    }
  
    // Move player
    player.position.x = targetX;
    player.position.z = targetZ;
    setMessage("Looking Good!");
    return true;
  }