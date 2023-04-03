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

// create a plane
let base = new THREE.CylinderGeometry(1.5, 1, 10);
base.rotateZ(-Math.PI * 0.5); //rotacinando em 90°

let window = new THREE.CapsuleGeometry( 1, 1, 4, 8 );


// create the mesh
var trunkMesh = new THREE.Mesh(base, new THREE.MeshPhongMaterial({
    color: 0x797D7F
}));

// position the trunk. Set y to half of height of trunk
trunkMesh.position.set(0, 5, 0);//posição do tronco



scene.add(trunkMesh);


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
