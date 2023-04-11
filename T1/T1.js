import * as THREE from 'three';
import { FlyControls } from '../build/jsm/controls/FlyControls.js';
import {
  initRenderer,
  initDefaultBasicLight,
  setDefaultMaterial,
  InfoBox,
  onWindowResize,
} from "../libs/util/util.js";
import { Arvore } from './Arvore.js';
import { Plano } from './Plano.js';
import { degreesToRadians } from "../libs/util/util.js";

//---VARIAVEIS E SETAGEM---

let scene, renderer, material, materialTrunk, materialLeaves, light, orbit; // Initial variables
const numArvores = 100;
const clock = new THREE.Clock();

scene = new THREE.Scene();    // Create main scene
renderer = initRenderer();    // Init a basic renderer

// Listen window size changes
window.addEventListener('resize', function () { onWindowResize(camera, renderer) }, false);

// Show axes (parameter is size of each axis)
let axesHelper = new THREE.AxesHelper(12);
scene.add(axesHelper);


//---PLANO---

var plano = new Plano(scene);

//---CAMERA---

//camera
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(-200.0, 20.0, 0.0);
camera.up.set(0, 1, 0);
camera.lookAt(0, 0, 0);
light = initDefaultBasicLight(scene); // Create a basic light to illuminate the scene

//controles de voo
var flyCamera = new FlyControls(camera, renderer.domElement);
flyCamera.movementSpeed = 100;
flyCamera.domElement = renderer.domElement;
flyCamera.rollSpeed = 0.20;
flyCamera.autoForward = false;
flyCamera.dragToLook = false;

//create a fly camera
var flyCamera = new FlyControls(camera, renderer.domElement);
flyCamera.movementSpeed = 100;
flyCamera.domElement = renderer.domElement;
flyCamera.rollSpeed = 0.20;
flyCamera.autoForward = false;
flyCamera.dragToLook = false;


//--ARVORE--

//materiais das ávores
material = setDefaultMaterial();
materialTrunk = new THREE.MeshPhongMaterial({
  color: 0x8b4513, transparent: true
}); // create a basic material
materialLeaves = new THREE.MeshPhongMaterial({
  color: 0x00ff00, transparent: true
}); // create a basic material

// create a tree
for (let i = 0; i < numArvores; i++) {
  var arvore = new Arvore(materialLeaves, materialTrunk);
  scene.add(arvore);
  arvore.rotation.x = Math.PI / 2;
  plano.plano1.add(arvore);
}

for (let i = 0; i < numArvores; i++) {
  var arvore = new Arvore(materialLeaves, materialTrunk);
  scene.add(arvore);
  arvore.rotation.x = Math.PI / 2;
  plano.plano2.add(arvore);
}

showInformation();
render();

function showInformation() {
  var controls = new InfoBox();
  controls.add("Fly Controls");
  controls.addParagraph();
  controls.add("Keyboard:");
  controls.add("* WASD - Move");
  controls.add("* R | F - up | down");
  controls.add("* Q | E - roll");
  controls.addParagraph();
  controls.add("Mouse and Keyboard arrows:");
  controls.add("* up | down    - pitch");
  controls.add("* left | right - yaw");
  controls.addParagraph();
  controls.add("Mouse buttons:");
  controls.add("* Left  - Move forward");
  controls.add("* Right - Move backward");
  // controls.add(flyCamera.position.getComponent(0));

  controls.show();
}


function render() {

  const delta = clock.getDelta();
  //stats.update();
  flyCamera.update(delta);
  requestAnimationFrame(render);
  renderer.render(scene, camera) // Render scene
  let posicaoCameraX = flyCamera.object.position.getComponent(0);
  plano.desenhaPlano(posicaoCameraX);
}

export { scene };