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

//INICIO

//angulos
var angle90 = THREE.MathUtils.degToRad(90); //cria o angulo 90º
var speed = 0.08;
var animationOn = true; // control if animation is on or of


// create the ground plane
let plane = createGroundPlaneWired(20, 20);//plano criado com base em (libs/util/util.js tem esse codigo)
scene.add(plane);//adiciona o plano a cena ja como grid

// criando o avião
var base = new THREE.CylinderGeometry(1.5, 1, 12); //cria base
base.rotateZ(- angle90); //rotacinando o cilindro em 90°

var janela = new THREE.CapsuleGeometry(1, 1, 20, 25); //cria janela
janela.rotateZ(- angle90); //rotacinando a janela em 90°

var detalhe = new THREE.RingGeometry(0.5, 1.55, 32); //detalhe em amarelo da frente do aviao
detalhe.rotateY(angle90);

var circulo = new THREE.CircleGeometry(1, 32); //circulo preto da frente do avião
circulo.rotateY(angle90); //rotacinando  em 90°

var cilindro = new THREE.CylinderGeometry(0.2, 0.2, 2); //cilindro que gira da frente do avião
cilindro.rotateZ(angle90);

var helice = new THREE.PlaneGeometry(5, 0.5);//helice do avião
helice.rotateY(- angle90);

var asaLateralMaior = new THREE.BoxGeometry(2, 14, 0.25); //asa maior que fica na lateral
asaLateralMaior.rotateX(- angle90);

var asaLateralMenor = new THREE.BoxGeometry(1.5, 6, 0.25); // asa menor que fica mais atras do aviao
asaLateralMenor.rotateX(- angle90);

var asinha = new THREE.BoxGeometry(1, 2.5, 0.25); //asa que fica por cima

//Mesh's
var baseMesh = new THREE.Mesh(base, new THREE.MeshPhongMaterial({ color: 0x797D7F }));
baseMesh.position.set(0, 5, 0);

var janelaMesh = new THREE.Mesh(janela, new THREE.MeshPhongMaterial({ color: 0x1E90FF }));
janelaMesh.position.set(3, 1, 0);

var detalheMesh = new THREE.Mesh(detalhe, new THREE.MeshPhongMaterial({ color: 0xFFFF00, side: THREE.DoubleSide }));
detalheMesh.position.set(5.99, 0, 0);

var circuloMesh = new THREE.Mesh(circulo, new THREE.MeshPhongMaterial({ color: 0x000000 }));
circuloMesh.position.set(6.01, 0, 0);

var cilindroMesh = new THREE.Mesh(cilindro, new THREE.MeshPhongMaterial({ color: 0x000000 }));
cilindroMesh.position.set(6.01, 0, 0);

var heliceMesh = new THREE.Mesh(helice, new THREE.MeshPhongMaterial({ color: 0xFFFF00, side: THREE.DoubleSide }));
heliceMesh.position.set(0.98, 0, 0);

var asaLateralMaiorMesh = new THREE.Mesh(asaLateralMaior, new THREE.MeshPhongMaterial({ color: 0x797D7F, side: THREE.DoubleSide }));
asaLateralMaiorMesh.position.set(2, 0, 0);

var asaLateralMenorMesh = new THREE.Mesh(asaLateralMenor, new THREE.MeshPhongMaterial({ color: 0x797D7F, side: THREE.DoubleSide }));
asaLateralMenorMesh.position.set(-5, 0, 0);

var asinhaMesh = new THREE.Mesh(asinha, new THREE.MeshPhongMaterial({ color: 0x797D7F, side: THREE.DoubleSide }));
asinhaMesh.position.set(-5.5, 1, 0);

scene.add(baseMesh);
baseMesh.add(janelaMesh);
baseMesh.add(detalheMesh);
baseMesh.add(circuloMesh);
baseMesh.add(cilindroMesh);
baseMesh.add(asaLateralMaiorMesh);
baseMesh.add(asaLateralMenorMesh);
baseMesh.add(asinhaMesh);
cilindroMesh.add(heliceMesh);

function rotateCylinder() {
  if (animationOn) {
    cilindroMesh.rotation.x += speed; //girando o cilindro pois a helice esta nele e irá girar junto
  }
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
  rotateCylinder();
  requestAnimationFrame(render);
  renderer.render(scene, camera) // Render scene
}
