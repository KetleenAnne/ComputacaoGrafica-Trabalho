import * as THREE from "three";
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import {
  initRenderer,
  initDefaultBasicLight,
  onWindowResize,
  InfoBox,
} from "../libs/util/util.js";
import { plane } from "./Plano.js"; 

let scene, renderer, light, orbit; // Initial variables
const clock = new THREE.Clock();
scene = new THREE.Scene(); // Create main scene
renderer = initRenderer(); // Init a basic renderer
var camera = new THREE.PerspectiveCamera(
  65,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.set(-200.0, 20.0, 0.0);
camera.up.set(0, 1, 0);
camera.lookAt(0, 0, 0);

light = initDefaultBasicLight(scene); // Create a basic light to illuminate the scene
orbit = new OrbitControls(camera, renderer.domElement); // Enable mouse rotation, pan, zoom etc.
let planeGroup = plane();
scene.add(planeGroup);
// Listen window size changes
window.addEventListener(
  "resize",
  function () {
    onWindowResize(camera, renderer);
  },
  false
);

// Show axes (parameter is size of each axis)
let axesHelper = new THREE.AxesHelper(12);
scene.add(axesHelper);

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
  const delta = clock.getDelta();
  requestAnimationFrame(render);
  renderer.render(scene, camera); 

}

export { scene };
