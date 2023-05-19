import * as THREE from 'three';
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import { GLTFLoader } from '../build/jsm/loaders/GLTFLoader.js';
import {
  initRenderer,
  InfoBox,
  onWindowResize,
  getMaxSize
} from "../libs/util/util.js";

let scene, renderer, camera, orbit; // Initial variables

scene = new THREE.Scene();    // Create main scene
renderer = initRenderer();    // Init a basic renderer
  renderer.domElement.style.cursor = 'none';
//Main Camera

let camPos = new THREE.Vector3(0.0, 30.0, 70.0);
let camUp = new THREE.Vector3(0.0, 1.0, 0.0);
let camLook = new THREE.Vector3(0.0, 0.0, 0.0);

camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.copy(camPos);
camera.up.copy(camUp);
camera.lookAt(camLook);


//Plano do Raycaster
// Variáveis para armazenar a posição do mouse
const mouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
var planeGeometry = new THREE.PlaneGeometry(50, 48);
var planeMaterial = new THREE.MeshBasicMaterial({ visible: false });
var raycastPlane = new THREE.Mesh(planeGeometry, planeMaterial);
raycastPlane.translateY(24);
raycastPlane.translateX(-2.8);
scene.add(raycastPlane);

//Luz

const ambientColor = "rgb(50,50,50)";
let ambientLight = new THREE.AmbientLight(ambientColor);
scene.add(ambientLight);

let lightPosition = new THREE.Vector3(5, 15, 0);
let lightColor = "rgb(255,255,255)";
let dirLight = new THREE.DirectionalLight(lightColor);
setDirectionalLighting(lightPosition);

//definindo controles
orbit = new OrbitControls(camera, renderer.domElement); // Enable mouse rotation, pan, zoom etc.

// Listen window size changes
window.addEventListener('resize', function () { onWindowResize(camera, renderer) }, false);
window.addEventListener('mousemove', onMouseMove, false);
// Assets manager --------------------------------
let assetManager = {
  // Properties ---------------------------------
  aviao: null,
  allLoaded: false,

  // Functions ----------------------------------
  checkLoaded: function () {
    if (!this.allLoaded) {
      if (this.aviao) {
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

// create the ground plane
createCubePlane();
createCubePlaneLateral();
createCubePlaneLateralEsq();

// Use this to show information onscreen
let controls = new InfoBox();
controls.add("Basic Scene");
controls.addParagraph();
controls.add("Use mouse to interact:");
controls.add("* Left button to rotate");
controls.add("* Right button to translate (pan)");
controls.add("* Scroll to zoom in/out.");
controls.show();

//Criando Torreta
for (let i = 0; i < 3; i++) {
  loadGLBFile('/T2/objeto/', 'gun_turrent', true, 2.0);
}

//Criando aviao
var movimentoAviao = null;
var destino =  new THREE.Vector3( 0.0, 0.0, 1.0);
var aviaoSpeed = 1;
loadGLBFile('/T2/objeto/', 'low-poly_airplane', true, 13.0);
let posicaoAviao = new THREE.Vector3(0, 10, 0);

//Criando mira
// Criar as miras sem preenchimento interno
const tamanhoPequeno = 1.5;
const tamanhoGrande = tamanhoPequeno*2;
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
  new THREE.Vector3(-tamanhoPequeno/2, tamanhoPequeno/2, 0)
]);
const linhaInterna2 = new THREE.BufferGeometry().setFromPoints([
  new THREE.Vector3(tamanhoPequeno, tamanhoPequeno, 0),
  new THREE.Vector3(tamanhoPequeno/2, tamanhoPequeno/2, 0)
]);
const linhaInterna3 = new THREE.BufferGeometry().setFromPoints([
  new THREE.Vector3(tamanhoPequeno, -tamanhoPequeno, 0),
  new THREE.Vector3(tamanhoPequeno/2, -tamanhoPequeno/2, 0)
]);
const linhaInterna4 = new THREE.BufferGeometry().setFromPoints([
  new THREE.Vector3(-tamanhoPequeno, -tamanhoPequeno, 0),
  new THREE.Vector3(-tamanhoPequeno/2, -tamanhoPequeno/2, 0)
]);

const material = new THREE.LineBasicMaterial({ color: 0x00ff00 });
const linhavertice1 = new THREE.Line(linhaExterna1,material);
const linhavertice2 = new THREE.Line(linhaExterna2,material);
const linhavertice3 = new THREE.Line(linhaExterna3,material);
const linhavertice4 = new THREE.Line(linhaExterna4,material);
const linhaverticeinterno1 = new THREE.Line(linhaInterna1,material);
const linhaverticeinterno2 = new THREE.Line(linhaInterna2,material);
const linhaverticeinterno3 = new THREE.Line(linhaInterna3,material);
const linhaverticeinterno4 = new THREE.Line(linhaInterna4,material);
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
smallSquare.position.set(0,30,0);
largeSquare.position.set(0,30,0);
scene.add(smallSquare);
scene.add(largeSquare);

//Render
render();

function render() {
  assetManager.checkLoaded();
  requestAnimationFrame(render);
  renderer.render(scene, camera) // Render scene
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
    if (obj.name == 'low-poly_airplane') {
      obj.rotateY(3.13);
      obj.position.copy(posicaoAviao);
      obj.layers.set(1);
      movimentoAviao = obj;
    }
    if (obj.name == 'gun_turrent') {
      obj.position.set(THREE.MathUtils.randFloat(-15, 15),1,THREE.MathUtils.randFloat(-15,15));
      obj.layers.set(2);
    }
    
    obj.receiveShadow = true;
    obj.castShadow = true;
    scene.add(obj);
    assetManager[modelName] = obj;
  });
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
  dirLight.shadow.mapSize.width = 512;
  dirLight.shadow.mapSize.height = 512;
  dirLight.shadow.camera.near = 1;
  dirLight.shadow.camera.far = 30;
  dirLight.shadow.camera.left = -15;
  dirLight.shadow.camera.right = 15;
  dirLight.shadow.camera.top = 15;
  dirLight.shadow.camera.bottom = -15;
  dirLight.name = "Direction Light";

  scene.add(dirLight);
}

function createCubePlane() {
  const planeSize = 50; // Tamanho do plano
  const cubeSize = 5; // Tamanho dos cubos
  const numCubes = planeSize / cubeSize; // Quantidade de cubos em cada dimensão

  for (let i = 0; i < numCubes; i++) {
    for (let j = 0; j < numCubes; j++) {
      const cubeGeometry = new THREE.BoxGeometry(cubeSize, 1, cubeSize);
      const cubeMaterial = new THREE.MeshLambertMaterial({ color: 'lightgreen'});
      const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
      cube.position.x = (i - numCubes / 2) * cubeSize;
      cube.position.z = (j - numCubes / 2) * cubeSize;
      cube.receiveShadow = true;
      scene.add(cube); // Adiciona o cubo à cena
    }
  }
}
function createCubePlaneLateral() {
  const planeSize = 50; // Tamanho do plano
  const cubeSize = 5; // Tamanho dos cubos
  const numCubes = planeSize / cubeSize; // Quantidade de cubos em cada dimensão

  for (let i = 0; i < numCubes; i++) {
    for (let j = 0; j < numCubes; j++) {
      const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize,15,15,15);
      const cubeMaterial = new THREE.MeshBasicMaterial({color: 0x00ff00});
      const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
      cube.position.x = (25);
      cube.position.y = (i - numCubes / 2) * cubeSize;
      cube.position.z = (j - numCubes / 2) * cubeSize;
      cube.receiveShadow = true;
      if(cube.position.y >= 0)
        scene.add(cube); // Adiciona o cubo à cena
    }
  }
}
function createCubePlaneLateralEsq() {
  const planeSize = 50; // Tamanho do plano
  const cubeSize = 5; // Tamanho dos cubos
  const numCubes = planeSize / cubeSize; // Quantidade de cubos em cada dimensão

  for (let i = 0; i < numCubes; i++) {
    for (let j = 0; j < numCubes; j++) {
      const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
      const cubeMaterial = new THREE.MeshLambertMaterial({ color: 'lightgreen'});
      const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
      cube.position.x = (-30);
      cube.position.y = (i - numCubes / 2) * cubeSize;
      cube.position.z = (j - numCubes / 2) * cubeSize;
      cube.receiveShadow = true;
      if(cube.position.y >= 0)
        scene.add(cube); // Adiciona o cubo à cena
    }
  }
}
// Função para obter a posição do mouse
function onMouseMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Atualizar a posição das miras com base na posição do mouse
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObject(raycastPlane);

  if (intersects.length > 0) {
      const intersection = intersects[0];
      smallSquare.position.copy(intersection.point);
      const largeSquareSpeed = 1;
      const direction = intersection.point.clone().sub(largeSquare.position).normalize();

      largeSquare.position.add(direction.multiplyScalar(largeSquareSpeed));
  }
}


