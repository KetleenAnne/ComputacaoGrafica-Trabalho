import * as THREE from 'three';
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import { GLTFLoader } from '../build/jsm/loaders/GLTFLoader.js';
import { IcosahedronBufferGeometry, Vector3 } from '../build/three.module.js';
import {
    initRenderer,
    initCamera,
    initDefaultBasicLight,
    setDefaultMaterial,
    createLightSphere,
    onWindowResize,
    getMaxSize
} from "../libs/util/util.js";
import { Arvore } from './Arvore.js';

let scene, renderer, camera, orbit; // Initial variables
// -------- AVIAO --------//
let quaternionZ;

// -------- AVIAO --------//
let isPaused = false;
let playMusic = true;
let vira = 0;
let isCursorVisible = false;
var lerpConfig;
let isShooting = false;
let tiros = [];
let tirosHB = [];
let tirosHBHelper = [];
//explosao
let explosion = {
    textures: [],
    numTextures: 20,
    show: false,
    texPlane: null,
    texIndex: 0,
    frameDrop: 2,

    play: function () {
        this.show = true;
    },
    build: function () {
        // Create texture plane
        this.texPlane = new THREE.Mesh(
            new THREE.PlaneGeometry(2.0, 2.0, 20, 20),
            new THREE.MeshLambertMaterial({ color: "rgb(255,255,255)", side: THREE.DoubleSide, alphaTest: 0.5 }));
        scene.add(this.texPlane);

        // Load Textures
        var textureLoader = new THREE.TextureLoader();
        for (let i = 1; i <= this.numTextures; i++) {
            this.textures.push(textureLoader.load("../assets/textures/explosion/" + i + ".png"));
        }
    },
    animate: function () {
        if (this.show) {
            this.texPlane.visible = true;
            let index = this.texIndex / this.frameDrop;
            let skip = this.texIndex % this.frameDrop;
            if (!skip)
                this.texPlane.material.map = this.textures[index];
            this.texIndex++;

            // Hide plane after passing by all textures
            if (index > this.numTextures) {
                this.texPlane.visible = false;
                this.texIndex = 0;
                this.show = false;
            }
        }
    },
}
document.body.style.cursor = 'none';
scene = new THREE.Scene();    // Create main scene
renderer = initRenderer();    // Init a basic renderer
//camera
let camPos = new THREE.Vector3(0.0, 30.0, 60.0);
let camUp = new THREE.Vector3(0.0, 0.0, 0.0);

camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.copy(camPos);
camera.up.copy(camUp);
let cameraHolder = new THREE.Object3D();
cameraHolder.add(camera);
scene.add(cameraHolder);

orbit = new OrbitControls(camera, renderer.domElement); // Enable mouse rotation, pan, zoom etc.
const tamanhoPlano = 100;
//posiçao aviao
const posicaoAviao = new Vector3(0.0, 10.0, 0.0);

//criar plano do raycaster
var plano = CriarPlano(scene, tamanhoPlano);
plano.name = 'ground';
let objectsRaycaster = [];
objectsRaycaster.push(plano);
//var highlight = CriarHighLight(scene);
let mousePosition = new THREE.Vector2();
let raycaster = new THREE.Raycaster();
raycaster.layers.enable(0);
raycaster.layers.enable(1);
camera.layers.enable(0);
camera.layers.enable(1);
let intersects;
var inicio = (tamanhoPlano / 2) - 10;//valor em x
var fim = (tamanhoPlano / 2) - 10;//valor em z
// Assets manager --------------------------------
let assetManager = {
    // Properties ---------------------------------
    aviao: null,
    torreta: null,
    hbAviao: new THREE.Box3(),
    hbTorreta: null,
    allLoaded: false,

    // Functions ----------------------------------
    checkLoaded: function () {
        if (!this.allLoaded) {
            if (this.aviao && this.torreta) {
                this.allLoaded = true;
            }
        }
    },

    hideAll: function () {
        this.aviao.visible = this.torreta = false;
    }
}

// ---------------------TRILHA SONORA-----------------------//
var firstPlay = true;
const listener = new THREE.AudioListener();
camera.add(listener);

// Musica ambiente
const sound = new THREE.Audio( listener );  
let audioLoader = new THREE.AudioLoader(); //./objeto/', 'aviao'

audioLoader.load( './sounds/ambiente.mp3', function( buffer ) {
	sound.setBuffer( buffer );
	sound.setLoop( true );
	sound.setVolume( 0.5 );
});

// Tiro aviao
const tiroAviao = new THREE.PositionalAudio( listener );
audioLoader.load( './sounds/tiroaviao.mp3', function ( buffer ) {
  tiroAviao.setBuffer( buffer );
  tiroAviao.setLoop( false );
} );

// Tiro torreta
const tiroTorreta = new THREE.PositionalAudio( listener );
audioLoader.load( './sounds/tirotorreta.mp3', function ( buffer ) {
    tiroTorreta.setBuffer( buffer );
    tiroTorreta.setLoop( false );
} );

// Colisao
const colisao = new THREE.PositionalAudio( listener );

//Luz
const ambientColor = "rgb(50,50,50)";
let ambientLight = new THREE.AmbientLight(ambientColor);
scene.add(ambientLight);
let lightPosition = new THREE.Vector3(70, 90, 0);
let lightColor = "rgb(255,255,255)";
let dirLight = new THREE.DirectionalLight(lightColor);

//criando target
const materialtarget = new THREE.MeshBasicMaterial({ color: 'lightgreen', visible: false });
const targetGeometry = new THREE.BoxGeometry(1, 1, 1);
const targetLuz = new THREE.Mesh(targetGeometry, materialtarget);
scene.add(targetLuz);
dirLight.target = targetLuz;
setDirectionalLighting(lightPosition);
// Sphere to represent the light
//let lightSphere = createLightSphere(scene, 0.5, 10, 10, lightPosition);
// Create helper for the spotlight
const spotHelper = new THREE.SpotLightHelper(dirLight, 0xFF8C00);
//scene.add(spotHelper);

// Create helper for the dirLight shadow
const shadowHelper = new THREE.CameraHelper(dirLight.shadow.camera);
//scene.add(shadowHelper);

//Criando aviao
loadGLBFile('./objeto/', 'aviao', true, 13.0);


//cria Mira
const tamanhoPequeno = 1.5;
const smallSquareGeometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(-tamanhoPequeno, tamanhoPequeno, 0),
    new THREE.Vector3(tamanhoPequeno, tamanhoPequeno, 0),
    new THREE.Vector3(tamanhoPequeno, -tamanhoPequeno, 0),
    new THREE.Vector3(-tamanhoPequeno, -tamanhoPequeno, 0),
    new THREE.Vector3(-tamanhoPequeno, tamanhoPequeno, 0) // Fechar o loop
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

const linhaverticeinterno1 = new THREE.Line(linhaInterna1, material);
const linhaverticeinterno2 = new THREE.Line(linhaInterna2, material);
const linhaverticeinterno3 = new THREE.Line(linhaInterna3, material);
const linhaverticeinterno4 = new THREE.Line(linhaInterna4, material);
const smallSquare = new THREE.Line(smallSquareGeometry, material);

smallSquare.add(linhaverticeinterno1);
smallSquare.add(linhaverticeinterno2);
smallSquare.add(linhaverticeinterno3);
smallSquare.add(linhaverticeinterno4);
smallSquare.position.set(0, 30, 0);
smallSquare.name = 'smallSquare';
smallSquare.move = true;
scene.add(smallSquare);

var lerpConfig = {
    destination: new THREE.Vector3(0.0, 0.2, -0.1),
    alpha: 0.05,
    move: true
}

var lerpConfigTiro = {
    destination: new THREE.Vector3(0.0, 0.2, 0.0),
    alpha: 0.5,
    move: true
}

//Plano
var ground = new THREE.TextureLoader().load("./Textures/death-star-texture ground.jpg");

const materialcubo = new THREE.MeshLambertMaterial({
    color: 'white',
    side: THREE.DoubleSide,
    map: ground
});
const cuboGeometry = new THREE.BoxGeometry(20, 20, 20);
const cubo = new THREE.Mesh(cuboGeometry, materialcubo);
cubo.receiveShadow = true;

//movimento do mouse
function onMouseMove(event) {
    mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1;
    mousePosition.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mousePosition, camera);

    intersects = raycaster.intersectObjects(objectsRaycaster);

    if (intersects.length > 0) {
        let point = intersects[0].point;
        smallSquare.position.set(point.x,point.y,-50);
        lerpConfig.destination.set(point.x,point.y);
    }
};

const objects = [];
CriarTrincheiras(5);

// window.addEventListener('mousedown', function () {
//     const objectExist = objects.find(function (object) {
//         return (object.position.x === assetManager.aviao.position.x) &&
//             (object.position.z === assetManager.aviao.position.z)
//     });
//     if (!objectExist) {
//         intersects.forEach(function (intersect) {
//         });
//     }
// });



// Listen window size changes
window.addEventListener('resize', function () { onWindowResize(camera, renderer) }, false);
window.addEventListener('keydown', onKeyPress, false);
window.addEventListener('contextmenu', onRightClick, false);
window.addEventListener('mousemove', onMouseMove, false);
var TextureLoader = new THREE.TextureLoader();
var velocidade = 0.0;

//RENDER
render();
function render() {
    requestAnimationFrame(render);
    if (!isPaused) {
        // if(playMusic){
        //     //tocar o arrquivo ambiente.mp3
        //     audioAmbiente.play();
        // }
        // else{
        //     audioAmbiente.pause();
        // }
        explosion.animate();
        assetManager.checkLoaded();
        updateAsset();
        UpdateProjetil();
        renderer.render(scene, camera) // Render scene
    }
}

//funçoes
function CriarPlano(scene, tamanhoPlano) {
    const planeMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(tamanhoPlano - 12, tamanhoPlano+4),
        new THREE.MeshLambertMaterial({
            side: THREE.DoubleSide,
            visible: false
        })
    );
    //planeMesh.rotateX(-Math.PI / 2);
    planeMesh.position.set(0, 60, -100);
    scene.add(planeMesh);

    return planeMesh;
}

//Set luz direcional
function setDirectionalLighting(position) {
    dirLight.position.copy(position);

    // Shadow settings
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.camera.near = 1;
    dirLight.shadow.camera.far = 190;
    dirLight.shadow.camera.left = -100;
    dirLight.shadow.camera.right = 100;
    dirLight.shadow.camera.top = 100;
    dirLight.shadow.camera.bottom = -100;
    dirLight.name = "Direction Light";

    scene.add(dirLight);
}

//LoadGLB
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
        obj.updateMatrixWorld(true);
        if (obj.name == 'aviao') {
            //obj.rotateY(3.13);
            obj.rotateY(THREE.MathUtils.degToRad(180));
            obj.position.copy(posicaoAviao);
            obj.layers.set(1);
            assetManager.hbAviao = new THREE.Box3().setFromObject(obj);
            var aviaoHelper = createBBHelper(assetManager.hbAviao, 'white')
        }
        if (obj.name == 'torreta') {
            obj.rotateY(1.57);
            obj.userData.collidable = true;
            obj.position.set(THREE.MathUtils.randFloat(-45, 45), 1.5, THREE.MathUtils.randFloat(-500, 45))
            assetManager.hbTorreta = new THREE.Box3().setFromObject(obj);
            var torretaHelper = createBBHelper(assetManager.hbTorreta, 'white')
        }

        obj.receiveShadow = true;
        obj.castShadow = true;
        assetManager[modelName] = obj;
        scene.add(obj);
    });
}

//Normalização e posição
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

function toggleSimulation() {
    isPaused = !isPaused;
    isCursorVisible = !isCursorVisible;
    document.body.style.cursor = isCursorVisible ? 'auto' : 'none';
}

function trilhaSonora(){
    playMusic = !playMusic;
}

function onKeyPress(event) {
    if (event.code === 'Escape') {
        toggleSimulation();
    }
    if(event.code === "KeyS"){
        trilhaSonora();
    }
    if (event.code === 'Digit1') {
        velocidade = 0.1;
    }
    if (event.code === 'Digit2') {
        velocidade = 0.5;
    }
    if (event.code === 'Digit3') {
        velocidade = 1;
    }
}


function onRightClick(event) {
    let tiro = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 4), new THREE.MeshPhongMaterial({ color: 'blue' }));
    tiro.castShadow = true;
    tiro.receiveShadow = true;

    let pos = new THREE.Vector3();
    assetManager.aviao.getWorldPosition(pos);
    tiro.position.copy(pos);

    tiro.lookAt(smallSquare.position);
    scene.add(tiro);
    tiros.push(tiro);
    let tiroHB = new THREE.Box3().setFromObject(tiro);
    tirosHB.push(tiroHB);

    tiro.userData = {};
    tiro.userData.initialPosition = new THREE.Vector3().copy(tiro.position);
}

function createBBHelper(bb, color) {
    // Create a bounding box helper
    let helper = new THREE.Box3Helper(bb, color);
    scene.add(helper);
}


function updateAsset()
{
   if(assetManager.allLoaded)
   {
    // ---------------------MOVIMENTO AVIAO-----------------------//
        //config da camera subir e descer
        
        let distancia = (mousePosition.x - assetManager.aviao.position.x );
        rotateAviao(distancia);
        
        if(assetManager.aviao.position.y > 50){
            cameraHolder.position.lerp(lerpConfig.destination, lerpConfig.alpha/2);
        }
        if(assetManager.aviao.position.y < 50){
            cameraHolder.position.lerp(lerpConfig.destination, lerpConfig.alpha*2);
        }
        assetManager.aviao.position.lerp(lerpConfig.destination, 0.035);

        assetManager.hbAviao.setFromObject(assetManager.aviao);
        plano.position.z -= velocidade;
        cameraHolder.position.z -= velocidade;
        targetLuz.position.z -= velocidade;
        dirLight.position.z -= velocidade;
        smallSquare.position.z -= velocidade;
      }
}
function UpdateProjetil() {
    if (tiros != null) {
        tiros.forEach((b, i) => {
            b.translateZ(2);
            tirosHB[i].copy(b.geometry.boundingBox).applyMatrix4(b.matrixWorld);
            tirosHB[i].setFromObject(b);
            let distancia = b.position.distanceTo(b.userData.initialPosition);
            if (b.position.y < 0 || distancia > 500 || b.position.x < -45 || b.position.x > 45 || b.position.y > 100) {
                scene.remove(b);
                tiros.splice(i, 1);
                tirosHB.splice(i, 1);

                i--;
            }
            checkCollisions(tirosHB[i]);
        })
    }
}
function checkCollisions(bala) {
    let collision = assetManager.hbTorreta.intersectsBox(bala);
    if (collision) {
        assetManager.torreta.traverse(function (node) {
            if (node.material) {
                explosion.build(); // Build explosion object
                explosion.play = true; // Execute on start
                node.material.opacity = 0;
            }
        });
    }
}

function changeObjectColor(color) {
    if (assetManager.aviao) {
        assetManager.aviao.traverse(function (child) {
            if (child.material)
                child.material.color.set(assetManager.aviao.material.color - (0, 83.3, 83.3));
        });
    }
}

// ---------------------MOVIMENTO AVIAO-----------------------//
function rotateAviao(distancia){

    if(vira % 300 === 0 && assetManager.aviao.posicaoAviao === smallSquare.position){
        assetManager.aviao.rotateZ(distancia/100);
        vira = false;
    }
    else{
        assetManager.aviao.rotateZ(distancia/-100);
        vira += 1;    
        assetManager.aviao.lookAt(smallSquare.position); 
    }
     assetManager.aviao.position.z -= velocidade;

}

function rad(distancia) {
    const maxAngulo = Math.PI * 65 / 180; // Converter 65 graus para radianos;
    const limiteDistancia = 45.0; // Limite máximo de distância

    // Limitar a distância dentro do intervalo de -45 a 45
    distancia = Math.max(-limiteDistancia, Math.min(distancia, limiteDistancia));

    // Calcular o ângulo com base na distância
    const angulo = (distancia / limiteDistancia) * maxAngulo;

    return angulo;
}

// ---------------------MOVIMENTO AVIAO-----------------------//
function CriarTrincheiras(numTrincheiras) {
    var cuboClone;
    var cuboCloneLateral;
    for (let k = 0; k < numTrincheiras; k++) {
        if (k == 0) {
            //centro
            for (let j = 0; j < 5; j++) {
                for (let i = 0; i < 5; i++) {
                    cuboClone = cubo.clone();
                    cuboClone.position.set(-inicio + (i * 20), -10, fim - (j * 20));
                    scene.add(cuboClone);
                    objects.push(cuboClone);
                }
                if (j % 2 == 0) {
                    loadGLBFile('./objeto/', 'torreta', true, 5);
                }
            }
            //lateral esquerda
            for (let l = 0; l < 5; l++) {
                for (let m = 0; m < 3; m++) {
                    cuboCloneLateral = cubo.clone();
                    cuboCloneLateral.position.set(-60, -10 + (m * 20), fim - (l * 20));
                    scene.add(cuboCloneLateral);
                    objects.push(cuboCloneLateral);
                }
            }
            //lateral direita
            for (let n = 0; n < 5; n++) {
                for (let o = 0; o < 3; o++) {
                    cuboCloneLateral = cubo.clone();
                    cuboCloneLateral.position.set(60, -10 + (o * 20), fim - (n * 20));
                    scene.add(cuboCloneLateral);
                    objects.push(cuboCloneLateral);
                }
            }
        }
        else {
            //centro
            for (let j = 0; j < 5; j++) {
                for (let i = 0; i < 5; i++) {
                    cuboClone = cubo.clone();
                    cuboClone.position.set(-inicio + (i * 20), -10, (-k * fim) - (j * 20));
                    scene.add(cuboClone);
                    objects.push(cuboClone);

                }
            }

            //plano lateral esquerda
            for (let l = 0; l < 5; l++) {
                for (let m = 0; m < 3; m++) {
                    cuboCloneLateral = cubo.clone();
                    cuboCloneLateral.position.set(-60, -10 + (m * 20), (-k * fim) - (l * 20));
                    scene.add(cuboCloneLateral);
                    objects.push(cuboCloneLateral);
                }
            }
            //lateral direita
            for (let n = 0; n < 5; n++) {
                for (let o = 0; o < 3; o++) {
                    cuboCloneLateral = cubo.clone();
                    cuboCloneLateral.position.set(60, -10 + (o * 20), (-k * fim) - (n * 20));
                    scene.add(cuboCloneLateral);
                    objects.push(cuboCloneLateral);
                }
            }
        }
    }
}
