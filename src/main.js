import * as THREE from "three";
import { sceneSetup } from "./setup.js";
import { sceneDungeonSetup } from "./dungeonSetup.js";
import { scenePlayerSetup, movePlayer } from "./playerController.js";
import { setupTurnSystem, gameCheck } from "./turnSystem.js";
// Main driving File

// Paths to sprites
const dungeonPath = "./Sprite_Sheets/ProjectUtumno_full.png";
const playerPath = "./Sprite_Sheets/character.png";
const grassPath = "./Sprite_Sheets/grass.png";

// Setup
let sceneData = sceneSetup(grassPath);
sceneDungeonSetup(sceneData, dungeonPath);
const player = scenePlayerSetup(sceneData, playerPath);
const cleanupTurns = setupTurnSystem(sceneData, player, movePlayer, dungeonPath);

// Animation | Game Loop
animate(sceneData);
function animate(sceneData) {
    const { scene, camera, renderer } = sceneData;
    requestAnimationFrame(() => animate(sceneData));
    gameCheck(sceneData);
    renderer.render(scene, camera);
}
