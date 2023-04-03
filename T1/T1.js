import * as THREE from 'three';
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import { FlyControls } from '../build/jsm/controls/FlyControls.js';
import {
    initRenderer,
    SecondaryBox,
    initDefaultBasicLight,
    setDefaultMaterial,
    InfoBox,
    onWindowResize,
    createGroundPlaneWired} from "../libs/util/util.js";


let material, light; // Initial variables
var scene = new THREE.Scene();    // Create main scene
const clock = new THREE.Clock();
initDefaultBasicLight(scene, true); // Use default light
var renderer = initRenderer();    // Init a basic renderer
    renderer.setClearColor("cornflowerblue");
//adicionando camera
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(10, 15, 10);
  camera.up.set( 0, 1, 0 );

material = setDefaultMaterial(); // create a basic material
light = initDefaultBasicLight(scene); // Create a basic light to illuminate the scene


//controles de voo
var flyCamera = new FlyControls( camera, renderer.domElement );
  flyCamera.movementSpeed = 10;
  flyCamera.domElement = renderer.domElement;
  flyCamera.rollSpeed = 0.20;
  flyCamera.autoForward = false;
  flyCamera.dragToLook = false;

// Listen window size changes
window.addEventListener('resize', function () { onWindowResize(camera, renderer) }, false);

// Show axes (parameter is size of each axis)
let axesHelper = new THREE.AxesHelper(12);
scene.add(axesHelper);

// create the ground plane
var plane = createGroundPlaneWired(400, 50, 200, 25, 2, "dimgray", "gainsboro");//plano criado com base em (libs/util/util.js tem esse codigo)
scene.add(plane);//adiciona o plano a cena ja como grid

// create a tree

var trunk = new THREE.CylinderGeometry(0.6, 0.6, 3);//medidas do tronco
var leaves = new THREE.ConeGeometry(1.5,1.5);//medida das camadas da arvore
var leaves2 = new THREE.ConeGeometry(2,2);//medida das camadas da arvore
var leaves3 = new THREE.ConeGeometry(2.5,2.5);//medida das camadas da arvore

// create the mesh
var trunkMesh = new THREE.Mesh(trunk, new THREE.MeshPhongMaterial({
    color: 0x8b4513
}));//mesh do tronco
var leavesMesh = new THREE.Mesh(leaves, new THREE.MeshPhongMaterial({
    color: 0x00ff00
}));//mesh da 1 camada
var leaves2Mesh = new THREE.Mesh(leaves2, new THREE.MeshPhongMaterial({
    color: 0x00ff00
}));//mesh da 2 camada
var leaves3Mesh = new THREE.Mesh(leaves3, new THREE.MeshPhongMaterial({
    color: 0x00ff00
}));//mesh da 3 camada

// position the trunk. Set y to half of height of trunk
trunkMesh.position.set(-2, 1.5, 0);//posição do tronco
leavesMesh.position.set(0, 4, 0);//posição em relação ao tronco da 1 camada
leaves2Mesh.position.set(0, 3, 0);//posição em relação ao tronco da 2 camada
leaves3Mesh.position.set(0, 2, 0);//posição em relação ao tronco da 3 camada

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

var infoBox = new SecondaryBox("");

showInformation();
render();

function showInformation()
{  
// Use this to show information onscreen
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

    controls.show();
}
function render() {
  const delta = clock.getDelta();
  //stats.update();
  flyCamera.update(delta);
  requestAnimationFrame(render);
  renderer.render(scene, camera) // Render scene
}
