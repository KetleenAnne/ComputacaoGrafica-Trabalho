import * as THREE from  'three';
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import { TeapotGeometry } from '../build/jsm/geometries/TeapotGeometry.js';
import {initRenderer, 
        initCamera,
        initDefaultBasicLight,
        InfoBox,
        createLightSphere,
        onWindowResize,
        createGroundPlaneXZ} from "../libs/util/util.js";

let scene, renderer, camera, material, light, orbit; // Initial variables
scene = new THREE.Scene();    // Create main scene
renderer = initRenderer();    // Init a basic renderer
camera = initCamera(new THREE.Vector3(0, 15, 30)); // Init camera in this position
//light = initDefaultBasicLight(scene); // Create a basic light to illuminate the scene
orbit = new OrbitControls( camera, renderer.domElement ); // Enable mouse rotation, pan, zoom etc.

let lightPosition = new THREE.Vector3(7.9, 3, 10.0);

let lightSphere = createLightSphere(scene, 0.3, 10, 10, lightPosition);
let ambientColor = "rgb(70,70,70)";
let lightColor = "rgb(255,255,255)";

let dirLight = new THREE.DirectionalLight(lightColor);
setDirectionalLighting(lightPosition);

let ambientLight = new THREE.AmbientLight(ambientColor);
scene.add( ambientLight );


// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

// Show axes (parameter is size of each axis)
let axesHelper = new THREE.AxesHelper( 12 );
scene.add( axesHelper );

// create the ground plane
let plane = createGroundPlaneXZ(20, 20)
scene.add(plane);

// create a cube
let cilindroGeometry = new THREE.CylinderGeometry(0.2,1.8,5,20);
material = new THREE.MeshLambertMaterial({
  color: "rgb(190,240,255)",
  flatShading: true
});
let cilindro = new THREE.Mesh(cilindroGeometry, material);
// position the cilindro  
  cilindro.position.set(5.0, 2.5, 5.0);
  cilindro.castShadow = true;
// add the cilindro to the scene
scene.add(cilindro);

let chaleira = new TeapotGeometry(1);
material = new THREE.MeshPhongMaterial({
  color: "rgb(255,20,20)",
  shininess: "200",
  specular: "rgb(255,255,255)"
});
let obj = new THREE.Mesh(chaleira,material);
  obj.position.set(0.0,1.0,0.0);
  obj.castShadow = true;
  obj.receiveShadow = true;
scene.add(obj);

let esfera = new THREE.SphereGeometry(1);
material = new THREE.MeshLambertMaterial({
  color: "lightgreen"
});
let bola = new THREE.Mesh(esfera,material);
  bola.position.set(-3.0,1,-4.0);
  bola.castShadow = true;
  bola.receiveShadow = true;
scene.add(bola);

function setDirectionalLighting(position)
{
  dirLight.position.copy(position);

  // Shadow settings
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.width = 1024;
  dirLight.shadow.mapSize.height = 1024;
  dirLight.shadow.camera.near = 1;
  dirLight.shadow.camera.far = 30;
  dirLight.shadow.camera.left = -5;
  dirLight.shadow.camera.right = 5;
  dirLight.shadow.camera.top = 5;
  dirLight.shadow.camera.bottom = -5;
  dirLight.name = "Direction Light";
  dirLight.intensity = 0.70;
  scene.add(dirLight);
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
function render()
{
  renderer.shadowMap.type = THREE.VSMShadowMap;
  requestAnimationFrame(render);
  renderer.render(scene, camera) // Render scene
}