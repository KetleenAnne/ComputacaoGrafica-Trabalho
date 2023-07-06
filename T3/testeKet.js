import * as THREE from  'three';
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import {initRenderer, 
        initCamera,
        initDefaultBasicLight,
        setDefaultMaterial,
        InfoBox,
        onWindowResize,
        createGroundPlaneXZ} from "../libs/util/util.js";

let scene, renderer, camera, material, light, orbit; // Initial variables
scene = new THREE.Scene();    // Create main scene
renderer = initRenderer();    // Init a basic renderer
camera = initCamera(new THREE.Vector3(0, 15, 30)); // Init camera in this position
material = setDefaultMaterial(); // create a basic material
light = initDefaultBasicLight(scene); // Create a basic light to illuminate the scene
orbit = new OrbitControls( camera, renderer.domElement ); // Enable mouse rotation, pan, zoom etc.

// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

// Show axes (parameter is size of each axis)
let axesHelper = new THREE.AxesHelper( 12 );
scene.add( axesHelper );

// create the ground plane
let plane = createGroundPlaneXZ(20, 20)
scene.add(plane);

// create a cube
let x = 10;
  let pipeGeometry = new THREE.CylinderGeometry(2.5, 2.5, x);
  let capGeometry = new THREE.ConeGeometry(2.5, 3, 16, 18);

  let textureLoader = new THREE.TextureLoader();
  let envMapTexture = textureLoader.load('./Textures/aco.jpeg');
  envMapTexture.mapping = THREE.EquirectangularReflectionMapping;

  let pipeMaterial = new THREE.MeshPhongMaterial({
    side: THREE.DoubleSide,
    envMap: envMapTexture
  });

  let pipe = new THREE.Mesh(pipeGeometry, pipeMaterial);
  let cap = new THREE.Mesh(capGeometry,pipeMaterial );
  cap.position.set(0, x-3.5, 0);
  pipe.add(cap); 
  pipe.castShadow = true;
  pipe.receiveShadow = true;
// add the cube to the scene
scene.add(pipe);

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
function render()
{
  requestAnimationFrame(render);
  renderer.render(scene, camera) // Render scene
}