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
//renderer.domElement.style.cursor = 'none';
//Main Camera

let camPos = new THREE.Vector3(0.0, 40.0, 100.0);
let camUp = new THREE.Vector3(0.0, 1.0, 0.0);
let camLook = new THREE.Vector3(0.0, 0.0, 0.0);

camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.copy(camPos);
camera.up.copy(camUp);
camera.lookAt(camLook);


//Plano do Raycaster
var planeGeometry = new THREE.PlaneGeometry(100, 100);
var planeMaterial = new THREE.MeshBasicMaterial({ visible: false });
var raycastPlane = new THREE.Mesh(planeGeometry, planeMaterial);
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
loadGLBFile('/T2/objeto/', 'gun_turrent', true, 2.0);

//Criando aviao
loadGLBFile('/T2/objeto/', 'low-poly_airplane', true, 13.0);
let posicaoAviao = new THREE.Vector3(0, 10, 0);

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
    }
    if (obj.name == 'gun_turrent') {
      obj.position.set(THREE.MathUtils.randFloat(-15, 15),2,THREE.MathUtils.randFloat(-15,15));
      obj.layers.set(2);
    }
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
  const planeSize = 30; // Tamanho do plano
  const cubeSize = 1; // Tamanho dos cubos
  const numCubes = planeSize / cubeSize; // Quantidade de cubos em cada dimensão

  for (let i = 0; i < numCubes; i++) {
    for (let j = 0; j < numCubes; j++) {
      const cubeGeometry = new THREE.BoxGeometry(cubeSize, 2, cubeSize);
      const cubeMaterial = new THREE.MeshLambertMaterial({ color: 'lightgreen' });
      const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
      cube.position.x = (i - numCubes / 2) * cubeSize;
      cube.position.z = (j - numCubes / 2) * cubeSize;
      cube.receiveShadow = true;
      scene.add(cube); // Adiciona o cubo à cena
    }
  }
}

