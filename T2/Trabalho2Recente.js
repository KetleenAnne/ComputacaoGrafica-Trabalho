import * as THREE from 'three';
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import { GLTFLoader } from '../build/jsm/loaders/GLTFLoader.js';
import { Arvore } from "./Arvore.js";
import { Plano } from "./Plano.js";
import {
  initRenderer,
  InfoBox,
  onWindowResize,
  createLightSphere,
  getMaxSize
} from "../libs/util/util.js";
import { MeshLambertMaterial, MeshPhongMaterial } from '../build/three.module.js';

let scene, renderer, camera, orbit; // Initial variables
let isPaused = false;
let isCursorVisible = false;
document.body.style.cursor = 'none';
let hbAviao;
let hbTorreta;
let aviaoHelper;
let torretaHelper;
let torreta;
var lastMousePosition = new THREE.Vector2(); // Última posição do mouse
scene = new THREE.Scene();    // Create main scene
renderer = initRenderer();
document.body.appendChild(renderer.domElement);
//Main Camera

let camPos = new THREE.Vector3(0.0, 50.0, 70.0);
let camUp = new THREE.Vector3(0.0, 1.0, 0.0);

camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.copy(camPos);
camera.up.copy(camUp);
let cameraHolder = new THREE.Object3D();
cameraHolder.add(camera);
scene.add(cameraHolder);

var plano = new Plano(scene);

//Plano do Raycaster
// Variáveis para armazenar a posição do mouse
const mouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
var planeGeometry = new THREE.PlaneGeometry(100, 98);
var planeMaterial = new THREE.MeshBasicMaterial({ visible: false });
var raycastPlane = new THREE.Mesh(planeGeometry, planeMaterial);
raycastPlane.translateY(15);
raycastPlane.translateX(-2.8);
scene.add(raycastPlane);

//Luz

const ambientColor = "rgb(50,50,50)";
let ambientLight = new THREE.AmbientLight(ambientColor);
scene.add(ambientLight);
let lightPosition = new THREE.Vector3(100, 100, 0);
let lightColor = "rgb(255,255,255)";
let dirLight = new THREE.DirectionalLight(lightColor);
setDirectionalLighting(lightPosition);
// Sphere to represent the light
let lightSphere = createLightSphere(scene, 0.5, 10, 10, lightPosition);
// Create helper for the spotlight
const spotHelper = new THREE.SpotLightHelper(dirLight, 0xFF8C00);
//scene.add(spotHelper);

// Create helper for the dirLight shadow
const shadowHelper = new THREE.CameraHelper(dirLight.shadow.camera);
scene.add(shadowHelper);

//definindo controles
orbit = new OrbitControls(camera, renderer.domElement); // Enable mouse rotation, pan, zoom etc.

// Listen window size changes
window.addEventListener('resize', function () { onWindowResize(camera, renderer) }, false);
window.addEventListener('mousemove', onMouseMove, false);
window.addEventListener('contextmenu', onRightClick, false);
window.addEventListener('keydown', onKeyPress, false);
// Assets manager --------------------------------
let assetManager = {
  // Properties ---------------------------------
  aviao: null,
  turreta: null,
  hb: new THREE.Box3(),
  allLoaded: false,

  // Functions ----------------------------------
  checkLoaded: function () {
    if (!this.allLoaded) {
      if (this.aviao && this.turreta) {
        this.allLoaded = true;
        loadingMessage.hide();
      }
    }
  },

  hideAll: function () {
    this.aviao.visible = this.turreta = false;
  }
}
// Show axes (parameter is size of each axis)
let axesHelper = new THREE.AxesHelper(30);
scene.add(axesHelper);


// Use this to show information onscreen
let controls = new InfoBox();
controls.add("Basic Scene");
controls.addParagraph();
controls.add("Use mouse to interact:");
controls.add("* Left button to rotate");
controls.add("* Right button to translate (pan)");
controls.add("* Scroll to zoom in/out.");
controls.show();


//--ARVORE--
const numArvores = 15;
//materiais das ávores
var materialTrunk = new THREE.MeshPhongMaterial({ color: 'brown'});
materialTrunk.transparent = true;
//material folha
var materialLeaves = new THREE.MeshPhongMaterial({ color: 'green'});
materialLeaves.transparent = true;

// create a tree
for (let i = 0; i < numArvores; i++) {
  var arvore = new Arvore(materialLeaves, materialTrunk);
  scene.add(arvore);
  arvore.rotation.y = Math.PI / 2;
  plano.plano1.add(arvore);
}

for (let i = 0; i < numArvores; i++) {
  var arvore = new Arvore(materialLeaves, materialTrunk);
  scene.add(arvore);
  arvore.rotation.y = Math.PI / 2;
  plano.plano2.add(arvore);
}

for (let i = 0; i < numArvores; i++) {
  var arvore = new Arvore(materialLeaves, materialTrunk);
  scene.add(arvore);
  arvore.rotation.y = Math.PI / 2;
  plano.plano3.add(arvore);
}

//Criando Torreta
for (let i = 0; i < 3; i++) {
  loadGLBFile('/T2/objeto/', 'gun_turrent', true, 7.0);
}

//Criando aviao
var movimentoAviao = null;
var aviaoSpeed = 0.1;
loadGLBFile('/T2/objeto/', 'low-poly_airplane', true, 13.0);
let posicaoAviao = new THREE.Vector3(0, 10, 0);

//Criando mira
// Criar as miras sem preenchimento interno
const tamanhoPequeno = 1.5;
const tamanhoGrande = tamanhoPequeno * 2;
const smallSquareGeometry = new THREE.BufferGeometry().setFromPoints([
  new THREE.Vector3(-tamanhoPequeno, tamanhoPequeno, 0),
  new THREE.Vector3(tamanhoPequeno, tamanhoPequeno, 0),
  new THREE.Vector3(tamanhoPequeno, -tamanhoPequeno, 0),
  new THREE.Vector3(-tamanhoPequeno, -tamanhoPequeno, 0),
  new THREE.Vector3(-tamanhoPequeno, tamanhoPequeno, 0) // Fechar o loop
]);
const largeSquareGeometry = new THREE.BufferGeometry().setFromPoints([
  new THREE.Vector3(-tamanhoGrande, tamanhoGrande, 0),
  new THREE.Vector3(tamanhoGrande, tamanhoGrande, 0),
  new THREE.Vector3(tamanhoGrande, -tamanhoGrande, 0),
  new THREE.Vector3(-tamanhoGrande, -tamanhoGrande, 0),
  new THREE.Vector3(-tamanhoGrande, tamanhoGrande, 0) // Fechar o loop
]);
const linhaExterna1 = new THREE.BufferGeometry().setFromPoints([
  new THREE.Vector3(-tamanhoGrande, tamanhoGrande, 0),
  new THREE.Vector3(-tamanhoPequeno, tamanhoPequeno, 0)
]);
const linhaExterna2 = new THREE.BufferGeometry().setFromPoints([
  new THREE.Vector3(tamanhoGrande, tamanhoGrande, 0),
  new THREE.Vector3(tamanhoPequeno, tamanhoPequeno, 0)
]);
const linhaExterna3 = new THREE.BufferGeometry().setFromPoints([
  new THREE.Vector3(tamanhoGrande, -tamanhoGrande, 0),
  new THREE.Vector3(tamanhoPequeno, -tamanhoPequeno, 0)
]);
const linhaExterna4 = new THREE.BufferGeometry().setFromPoints([
  new THREE.Vector3(-tamanhoGrande, -tamanhoGrande, 0),
  new THREE.Vector3(-tamanhoPequeno, -tamanhoPequeno, 0)
]);
const linhaInterna1 = new THREE.BufferGeometry().setFromPoints([
  new THREE.Vector3(-tamanhoPequeno, tamanhoPequeno, 0),
  new THREE.Vector3(-tamanhoPequeno / 2, tamanhoPequeno / 2, 0)
]);
const linhaInterna2 = new THREE.BufferGeometry().setFromPoints([
  new THREE.Vector3(tamanhoPequeno, tamanhoPequeno, 0),
  new THREE.Vector3(tamanhoPequeno / 2, tamanhoPequeno / 2, 0)
]);
const linhaInterna3 = new THREE.BufferGeometry().setFromPoints([
  new THREE.Vector3(tamanhoPequeno, -tamanhoPequeno, 0),
  new THREE.Vector3(tamanhoPequeno / 2, -tamanhoPequeno / 2, 0)
]);
const linhaInterna4 = new THREE.BufferGeometry().setFromPoints([
  new THREE.Vector3(-tamanhoPequeno, -tamanhoPequeno, 0),
  new THREE.Vector3(-tamanhoPequeno / 2, -tamanhoPequeno / 2, 0)
]);

const material = new THREE.LineBasicMaterial({ color: 0x00ff00 });
const linhavertice1 = new THREE.Line(linhaExterna1, material);
const linhavertice2 = new THREE.Line(linhaExterna2, material);
const linhavertice3 = new THREE.Line(linhaExterna3, material);
const linhavertice4 = new THREE.Line(linhaExterna4, material);
const linhaverticeinterno1 = new THREE.Line(linhaInterna1, material);
const linhaverticeinterno2 = new THREE.Line(linhaInterna2, material);
const linhaverticeinterno3 = new THREE.Line(linhaInterna3, material);
const linhaverticeinterno4 = new THREE.Line(linhaInterna4, material);
const smallSquare = new THREE.Line(smallSquareGeometry, material);
const largeSquare = new THREE.Line(largeSquareGeometry, material);
largeSquare.add(linhavertice1);
largeSquare.add(linhavertice2);
largeSquare.add(linhavertice3);
largeSquare.add(linhavertice4);
smallSquare.add(linhaverticeinterno1);
smallSquare.add(linhaverticeinterno2);
smallSquare.add(linhaverticeinterno3);
smallSquare.add(linhaverticeinterno4);
smallSquare.position.set(0, 30, 0);
largeSquare.position.set(0, 30, 0);
scene.add(smallSquare);
scene.add(largeSquare);

//Render
render();

function render() {
  assetManager.checkLoaded();
  requestAnimationFrame(render);
  
  if (!isPaused) {
    renderer.render(scene, camera);

    cameraHolder.position.z -= aviaoSpeed ;
    largeSquare.position.z -= aviaoSpeed ;
    smallSquare.position.z -= aviaoSpeed ;
    raycastPlane.position.z -= aviaoSpeed;
    // desenha o plano
    let posicaoCameraZ = cameraHolder.position.z;
    plano.desenhaPlano(posicaoCameraZ);

    // Atualizar a posição das miras com base na posição do mouse
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObject(raycastPlane);

    if (intersects.length > 0) {
      const intersection = intersects[0];
      let diferenca = smallSquare.position;
      smallSquare.position.copy(intersection.point);
      const largeSquareSpeed = 1;
      const direction = intersection.point.clone().sub(largeSquare.position).normalize();
      largeSquare.position.add(direction.multiplyScalar(largeSquareSpeed));
      const aviaoFoco = 1;
      const directionAviao = intersection.point.clone().sub(posicaoAviao).normalize();
      if (movimentoAviao != null) {
        movimentoAviao.position.add(directionAviao.multiplyScalar(aviaoFoco));
      }
    }
  }
}



//ao clicar no mouse
function onRightClick(event) {
  event.preventDefault();
  //criando tiro
  if (!isPaused) {
    const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
    const sphereMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  }
  else {
    toggleSimulation();
  }
}

function loadGLBFile(modelPath, modelName, visibility, desiredScale) {
  var loader = new GLTFLoader();
  loader.load(modelPath + modelName + '.glb', function (gltf) {
    obj = gltf.scene;
    obj.name = modelName;
    obj.visible = visibility;
    obj.traverse(function (child) {
      if (child) {
        child.castShadow = true;
      }
    });
    obj.traverse(function (node) {
      if (node.material) node.material.side = THREE.DoubleSide;
    });

    var obj = normalizeAndRescale(obj, desiredScale);
    var obj = fixPosition(obj);
    obj.updateMatrixWorld( true );
    if (obj.name == 'low-poly_airplane') {
      obj.rotateY(3.13);
      obj.position.copy(posicaoAviao);
      obj.layers.set(1);
      hbAviao = new THREE.Box3().setFromObject(obj);
      aviaoHelper = createBBHelper(hbAviao, 'white')
      movimentoAviao = obj;
    }
    if (obj.name == 'gun_turrent') {
      //plano.plano1.add(obj.position.set(THREE.MathUtils.randFloat(-250, 250), 3, THREE.MathUtils.randFloat(-150, 150)));
      //plano.plano2.add(obj.position.set(THREE.MathUtils.randFloat(-250, 250), 3, THREE.MathUtils.randFloat(-150, 150)));
      //plano.plano3.add(obj.position.set(THREE.MathUtils.randFloat(-250, 250), 3, THREE.MathUtils.randFloat(-150, 150)));
      obj.rotateY(1.57);
      obj.layers.set(2);
      obj.userData.collidable = true;
      hbTorreta = new THREE.Box3().setFromObject(obj);
      torretaHelper = createBBHelper(hbTorreta, 'white')
      torreta = obj;
    }

    obj.receiveShadow = true;
    obj.castShadow = true;
    assetManager[modelName] = obj;
    scene.add(obj);
  });
}
function toggleSimulation() {
  isPaused = !isPaused;
  isCursorVisible = !isCursorVisible;
  document.body.style.cursor = isCursorVisible ? 'auto' : 'none';
}

function onKeyPress(event) {
  if (event.code === 'Escape') {
    toggleSimulation();
  }
  if (event.code === 'Digit1') {
    aviaoSpeed = 0.1;
  }
  if (event.code === 'Digit2') {
    aviaoSpeed = 0.5;
  }
  if (event.code === 'Digit3') {
    aviaoSpeed = 1;
  }
}


function normalizeAndRescale(obj, newScale) {
  var scale = getMaxSize(obj);
  obj.scale.set(newScale * (1.0 / scale),
    newScale * (1.0 / scale),
    newScale * (1.0 / scale));
  return obj;
}

function fixPosition(obj) {
  // Fix position of the object over the ground plane
  var box = new THREE.Box3().setFromObject(obj);
  if (box.min.y > 0)
    obj.translateY(-box.min.y);
  else
    obj.translateY(-1 * box.min.y);
  return obj;
}

function setDirectionalLighting(position) {
  dirLight.position.copy(position);

  // Shadow settings
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.width = 2048;
  dirLight.shadow.mapSize.height = 2048;
  dirLight.shadow.camera.near = 1;
  dirLight.shadow.camera.far = 300;
  dirLight.shadow.camera.left = -300;
  dirLight.shadow.camera.right = 300;
  dirLight.shadow.camera.top = 250;
  dirLight.shadow.camera.bottom = -250;
  dirLight.name = "Direction Light";

  scene.add(dirLight);
}

// Função para obter a posição do mouse
function onMouseMove(event) {
  // Atualizar a última posição do mouse
  lastMousePosition.x = event.clientX;
  lastMousePosition.y = event.clientY;

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}
function createBBHelper(bb, color)
{
   // Create a bounding box helper
   let helper = new THREE.Box3Helper( bb, color );
   scene.add( helper );
   return helper;
}