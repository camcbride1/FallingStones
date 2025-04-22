import * as THREE from 'three';
// Sets up scene, camera, renderer, reset button, and lights
// Grass Photo: https://www.vecteezy.com/free-vector/grass-background

// Main scene setup
export function sceneSetup(grassPath){
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050505);
    
    const camera = new THREE.PerspectiveCamera(
      75, window.innerWidth / window.innerHeight, 0.1, 1000
    );

    camera.position.set(0, 12, 1.5);
    camera.lookAt(0, 0, 1.5);
    
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    let sceneData = {
        scene: scene,
        camera: camera,
        renderer: renderer,
    }

    createLights(sceneData);
    loadImage(sceneData, grassPath);
    // Button Setup
    document.getElementById("resetButton").addEventListener("click", () => {
        window.location.reload(); 
      });
    
    return sceneData
}

// Sets up lighting
function createLights(sceneData){
    let scene = sceneData.scene;
    let camera = sceneData.camera;
    let renderer = sceneData.renderer;

    const sunLight = new THREE.DirectionalLight(0xffffff, 1);
    sunLight.position.set(5, 5, 5);
    sunLight.castShadow = true;
    scene.add(sunLight);
    
    const ambientLight = new THREE.AmbientLight(0xf0f0f0, .9);
    scene.add(ambientLight);
}

// Load and add a JPG image as a texture on a plane
function loadImage(sceneData, path) {
  const loader = new THREE.TextureLoader();
  loader.load(path, function (texture) {
      const geometry = new THREE.PlaneGeometry(25, 25); // Size of the plane
      const material = new THREE.MeshBasicMaterial({ map: texture });
      
      const plane = new THREE.Mesh(geometry, material);
      const plane2 = new THREE.Mesh(geometry, material);

      plane.position.set(-10, -1, 2);
      plane.rotation.x = -Math.PI / 2;

      plane2.position.set(10, -1, 2);
      plane2.rotation.x = -Math.PI / 2;

      sceneData.scene.add(plane);
      sceneData.scene.add(plane2);
  });
}