import * as THREE from 'three';
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import { Group } from '../build/three.module.js';
import {
    initRenderer,
    initCamera,
    initDefaultBasicLight,
    setDefaultMaterial,
    InfoBox,
    onWindowResize,
    createGroundPlaneWired
} from "../libs/util/util.js";
import { Arvore } from './Arvore.js';

let scene, renderer, camera, materialTrunk, materialLeaves, light, orbit; // Initial variables
scene = new THREE.Scene();    // Create main scene
renderer = initRenderer();    // Init a basic renderer
camera = initCamera(new THREE.Vector3(0, 15, 30)); // Init camera in this position
materialTrunk = new THREE.MeshPhongMaterial({
    color: 0x8b4513, transparent: true}); // create a basic material
materialLeaves = new THREE.MeshPhongMaterial({
    color: 0x00ff00, transparent: true}); // create a basic material
light = initDefaultBasicLight(scene); // Create a basic light to illuminate the scene
orbit = new OrbitControls(camera, renderer.domElement); // Enable mouse rotation, pan, zoom etc.

// Listen window size changes
window.addEventListener('resize', function () { onWindowResize(camera, renderer) }, false);

// Show axes (parameter is size of each axis)
let axesHelper = new THREE.AxesHelper(12);
scene.add(axesHelper);

// create the ground plane
let plane = createGroundPlaneWired(400,50,100,50,3,);//plano criado com base em (libs/util/util.js tem esse codigo)
scene.add(plane);//adiciona o plano a cena ja como grid

//create a group
var group = new THREE.Group();
// create a tree
for (let i = 0; i < 50; i++) {
    var arvore = new Arvore(group,materialLeaves,materialTrunk);
    scene.add(group);
}
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
