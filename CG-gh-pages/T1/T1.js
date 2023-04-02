import * as THREE from 'three';
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import {
    initRenderer,
    initCamera,
    initDefaultBasicLight,
    setDefaultMaterial,
    InfoBox,
    onWindowResize,
    createGroundPlaneWired
} from "../libs/util/util.js";

let scene, renderer, camera, material, light, orbit; // Initial variables
scene = new THREE.Scene();    // Create main scene
renderer = initRenderer();    // Init a basic renderer
camera = initCamera(new THREE.Vector3(0, 15, 30)); // Init camera in this position
material = setDefaultMaterial(); // create a basic material
light = initDefaultBasicLight(scene); // Create a basic light to illuminate the scene
orbit = new OrbitControls(camera, renderer.domElement); // Enable mouse rotation, pan, zoom etc.

// Listen window size changes
window.addEventListener('resize', function () { onWindowResize(camera, renderer) }, false);

// Show axes (parameter is size of each axis)
let axesHelper = new THREE.AxesHelper(12);
scene.add(axesHelper);

// create the ground plane
let plane = createGroundPlaneWired(20, 20);//plano criado com base em (libs/util/util.js tem esse codigo)
scene.add(plane);//adiciona o plano a cena ja como grid

// create a tree

var trunk = new THREE.CylinderGeometry(1, 1, 3);//medidas do tronco
var leaves = new THREE.ConeGeometry(3,5);//medida das camadas da arvore

// create the mesh
var trunkMesh = new THREE.Mesh(trunk, new THREE.MeshPhongMaterial({
    color: 0x8b4513
}));//mesh do tronco
var leavesMesh = new THREE.Mesh(leaves, new THREE.MeshPhongMaterial({
    color: 0x00ff00
}));//mesh da 1 camada
var leaves2Mesh = new THREE.Mesh(leaves, new THREE.MeshPhongMaterial({
    color: 0x00ff00
}));//mesh da 2 camada
var leaves3Mesh = new THREE.Mesh(leaves, new THREE.MeshPhongMaterial({
    color: 0x00ff00
}));//mesh da 3 camada

// position the trunk. Set y to half of height of trunk
trunkMesh.position.set(-2, 1.5, 0);//posição do tronco
leavesMesh.position.set(0, 7.5, 0);//posição em relação ao tronco da 1 camada
leaves2Mesh.position.set(0, 5.5, 0);//posição em relação ao tronco da 2 camada
leaves3Mesh.position.set(0, 3.5, 0);//posição em relação ao tronco da 3 camada

trunkMesh.castShadow = true;//sombra do tronco
trunkMesh.receiveShadow = true;
leavesMesh.castShadow = true;//sombra da 1 camada
leavesMesh.receiveShadow = true;
leaves2Mesh.castShadow = true;//sombra da 2 camada
leaves2Mesh.receiveShadow = true;
leaves3Mesh.castShadow = true;//sombra da 3 camada
leaves3Mesh.receiveShadow = true;

scene.add(trunkMesh);//adiciona o tronco a cena
trunkMesh.add(leavesMesh);//adiciona no tronco a 1 camada
trunkMesh.add(leaves2Mesh);//adiciona a segunda camada ao tronco
trunkMesh.add(leaves3Mesh);//adiciona a terceira camada ao tronco
// Use this to show information onscreen
let controls = new InfoBox();
controls.add("Basic Scene");
controls.addParagraph();
controls.add("Use mouse to interact:");
controls.add("* Left button to rotate");
controls.add("* Right button to translate (pan)");
controls.add("* Scroll to zoom in/out.");
controls.show();

render();
function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera) // Render scene
}
