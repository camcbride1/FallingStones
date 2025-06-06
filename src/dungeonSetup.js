import * as THREE from 'three';

// Sprites from: https://opengameart.org/content/dungeon-crawl-32x32-tiles-supplemental

// Main setup function
// Sets up ground tiles
export function sceneDungeonSetup(sceneData, tilesetPath, options = {}) {
    let scene = sceneData.scene;
    let camera = sceneData.camera;
    let renderer = sceneData.renderer;

    const {
        rows = 15,         // Rows
        cols = 15,         // Columns
        tileSize = 1,      // Tile size
        tilesHoriz = 64,   // Sprite Sheet info
        tilesVert = 95,    // Sprite Sheet info
    } = options;

    const loader = new THREE.TextureLoader();
    loader.load(tilesetPath, (tileset) => {
        tileset.wrapS = THREE.RepeatWrapping;
        tileset.wrapT = THREE.RepeatWrapping;
        tileset.repeat.set(1 / tilesHoriz, 1 / tilesVert);

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {

                const tileTexture = tileset.clone();
                tileTexture.needsUpdate = true;

                const tileIndexX = Math.floor(Math.random() * 19) + 24;
                const tileIndexY = 3;

                tileTexture.offset.x = tileIndexX / tilesHoriz;
                tileTexture.offset.y = 1 - (tileIndexY + 1) / tilesVert;

                const material = new THREE.MeshStandardMaterial({ map: tileTexture });
                const geometry = new THREE.PlaneGeometry(tileSize, tileSize);
                const tileMesh = new THREE.Mesh(geometry, material);

                tileMesh.position.x = (col * tileSize) - ((rows-1)/2);
                tileMesh.position.z = (row * tileSize) - ((rows-1)/2);
                tileMesh.rotation.x = -Math.PI / 2;
                tileMesh.renderOrder = -1;

                scene.add(tileMesh);
            }
        }
    });
}