import * as THREE from 'three';
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import { GLTFLoader } from '../build/jsm/loaders/GLTFLoader.js';
import { DoubleSide, Vector3 } from '../build/three.module.js';
import {
    initRenderer,
    onWindowResize,
    getMaxSize
} from "../libs/util/util.js";

let scene, renderer, camera, orbit; // Initial variables
let vira; //rotationZ
let angle;
let isPaused = false;
let isActive = true;
let isCursorVisible = false;
let isMuted = false;
var lerpConfig;
var limitador = 0;
var intervalo = 3000;
let tirosTorreta = [];
let tirosTorretaHB = [];
const somadorEmZ = -500;
let numTirosLevados = 0;
let contadordeplanos = [];
var vezesChamada = 0;
const colors = [
    new THREE.Color(1, 1, 1),          // Branco
    new THREE.Color(1, 0.8, 0.8),      // Tom avermelhado mais claro
    new THREE.Color(1, 0.6, 0.6),      // Tom avermelhado médio
    new THREE.Color(1, 0.4, 0.4),      // Tom avermelhado mais escuro
    new THREE.Color(1, 0, 0)           // Vermelho completo
];
let tiros = [];
let tirosHB = [];
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
let audioLoader, audioPath;
let torretas = [];
let hbtorretas = [];
scene = new THREE.Scene();    // Create main scene
renderer = initRenderer();    // Init a basic renderer
//camera
let camPos = new THREE.Vector3(0.0, 30.0, 70.0);
let camUp = new THREE.Vector3(0.0, 0.0, 0.0);

camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.copy(camPos);
camera.up.copy(camUp);
let cameraHolder = new THREE.Object3D();
cameraHolder.add(camera);
scene.add(cameraHolder);

//orbit = new OrbitControls(camera, renderer.domElement); // Enable mouse rotation, pan, zoom etc.
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
var fim = 0;//valor em z
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
//orbit = new OrbitControls(camera, renderer.domElement); // Enable mouse rotation, pan, zoom etc.

//Luz
const ambientColor = "rgb(50,50,50)";
let ambientLight = new THREE.AmbientLight(ambientColor);
scene.add(ambientLight);
let lightPosition = new THREE.Vector3(70, 90, -250);
let lightColor = "rgb(255,255,255)";
let dirLight = new THREE.DirectionalLight(lightColor);


const loadingManager = new THREE.LoadingManager(() => {
    let loadingScreen = document.getElementById('loading-screen');
    loadingScreen.transition = 0;
    loadingScreen.style.setProperty('--speed1', '0');
    loadingScreen.style.setProperty('--speed2', '0');
    loadingScreen.style.setProperty('--speed3', '0');

    let button = document.getElementById("myBtn")
    button.style.backgroundColor = 'Red';
    button.innerHTML = 'Start';
    button.addEventListener("click", onButtonPressed);
});

loadAudio(loadingManager, './sounds/game-start.mp3');



//criando target
const materialtarget = new THREE.MeshBasicMaterial({ color: 'lightgreen', visible: false });
const targetGeometry = new THREE.BoxGeometry(1, 1, 1);
const targetLuz = new THREE.Mesh(targetGeometry, materialtarget);
targetLuz.position.set(0, 10.5, -250);
scene.add(targetLuz);
dirLight.target = targetLuz;
setDirectionalLighting(lightPosition);
// Sphere to represent the light
//let lightSphere = createLightSphere(scene, 0.5, 10, 10, lightPosition);
// Create helper for the spotlight
//const spotHelper = new THREE.SpotLightHelper(dirLight, 0xFF8C00);
//scene.add(spotHelper);

// Create helper for the dirLight shadow
//const shadowHelper = new THREE.CameraHelper(dirLight.shadow.camera);
//scene.add(shadowHelper);

//Criando aviao
loadGLBFile('./objeto/', 'aviao', true, 13.0, loadingManager);

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
    destination: new THREE.Vector3(0.0, 0.2, 0.0),
    alpha: 0.2,
    move: true
}
//Material de cubos
let cubeMaterials = [
    setMaterial(null, './Textures/death star.jpg', 2, 2), //x+
    setMaterial(null, './Textures/death star.jpg', 1, 1), //x-
    setMaterial(null, './Textures/death star.jpg', 1, 1), //y+
    setMaterial(null, './Textures/death star.jpg', 1, 1), //y-
    setMaterial(null, './Textures/paredetrench.jpg', 1, 1), //z+
    setMaterial(null, './Textures/paredetrench.jpg', 1, 1), //z-
];
//Skybox
const skyboxTexture = new THREE.TextureLoader().load("./Textures/skybox.jpeg");
skyboxTexture.mapping = THREE.EquirectangularReflectionMapping;
skyboxTexture.encoding = THREE.sRGBEncoding;
const skyboxSize = new THREE.Vector3();
const skyboxGeometry = new THREE.BoxGeometry(window.innerWidth, window.innerHeight, window.innerWidth);
skyboxGeometry.computeBoundingBox();
skyboxGeometry.boundingBox.getSize(skyboxSize);
const skyboxMaterial = new THREE.MeshBasicMaterial(
    {
        map: skyboxTexture,
        side: DoubleSide
    });
const skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
skybox.scale.x = -1;
scene.background = skyboxTexture;
//scene.add(skybox);


//Plano
var ground = new THREE.TextureLoader().load("./Textures/death star.jpg");

let materialcubo;

//movimento do mouse
function onMouseMove(event) {
    mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1;
    mousePosition.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mousePosition, camera);

    intersects = raycaster.intersectObjects(objectsRaycaster);

    if (intersects.length > 0) {
        let point = intersects[0].point;
        smallSquare.position.set(point.x, point.y, point.z);
        lerpConfig.destination.set(point.x, point.y, point.z + 100);
    }
};
//criando trincheira
const objects = [];
CriarTrincheiras(5);

// //----------------------------------------------------------------------------
//-- AUDIO STUFF -------------------------------------------------------------

//-------------------------------------------------------
// Create a listener and add it to que camera
var listener = new THREE.AudioListener();
camera.add(listener);

// create a global audio source
const som = new THREE.Audio(listener);

// Create ambient sound
var audio = new THREE.AudioLoader();
audio.load('./sounds/ambiente.mp3', function (buffer) {
    som.setBuffer(buffer);
    som.setLoop(true);
    som.setVolume(0.1);
    //sound.play(); // Will play when start button is pressed
});

//-- Create colisao sound ---------------------------------------------------       
const colisaoAviaoSound = new THREE.Audio(listener);
audioLoader.load('./sounds/colisaotorreta.mp3', function (buffer) {
    colisaoAviaoSound.setBuffer(buffer);
    colisaoAviaoSound.setLoop(false);
    colisaoAviaoSound.setVolume(0.1);
    //sound1.play(); // Will play when start button is pressed
}); // Will be added to the target object

//-- Create colisao sound ---------------------------------------------------       
const colisaoSound = new THREE.Audio(listener);
audioLoader.load('./sounds/colisaotorreta.mp3', function (buffer) {
    colisaoSound.setBuffer(buffer);
    colisaoSound.setLoop(false);
    colisaoSound.setVolume(0.1);
    //sound1.play(); // Will play when start button is pressed
}); // Will be added to the target object

//-- Create tiro sound ---------------------------------------------------       
const tiroSound = new THREE.Audio(listener);
audioLoader.load('./sounds/tiroaviao.mp3', function (buffer) {
    tiroSound.setBuffer(buffer);
    tiroSound.setLoop(false);
    tiroSound.setVolume(0.1);
    //sound1.play(); // Will play when start button is pressed
}); // Will be added to the target object

//-- Create tiroTorreta sound ---------------------------------------------------       
const tiroTorretaSound = new THREE.Audio(listener);
audioLoader.load('./sounds/tirotorreta.mp3', function (buffer) {
    tiroTorretaSound.setBuffer(buffer);
    tiroTorretaSound.setLoop(false);
    tiroTorretaSound.setVolume(0.1);
    //sound1.play(); // Will play when start button is pressed
}); // Will be added to the target object
//-- END OF AUDIO STUFF -------------------------------------------------------


// Listen window size changes
window.addEventListener('resize', function () { onWindowResize(camera, renderer) }, false);
window.addEventListener('keydown', onKeyPress, false);
window.addEventListener('mousemove', onMouseMove, false);
window.addEventListener('click', onClick, false);
var velocidade = 0.0;


//RENDER
render();
function render() {
    requestAnimationFrame(render);
    if (!isPaused) {
        explosion.animate();
        assetManager.checkLoaded();
        updateAsset();
        UpdateProjetil();
        if(getDelta()%3000 == 0){
            tiroTorretas();
        }
        UpdateProjetilTorreta();
        renderer.render(scene, camera) // Render scene
    }
    else {
        som.pause();
    }
}


//funçoes
function CriarPlano(scene, tamanhoPlano) {
    const planeMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(tamanhoPlano - 12, tamanhoPlano + 8),
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
    dirLight.shadow.camera.left = -300;
    dirLight.shadow.camera.right = 300;
    dirLight.shadow.camera.top = 100;
    dirLight.shadow.camera.bottom = -100;
    dirLight.name = "Direction Light";

    scene.add(dirLight);
}

//LoadGLB
function loadGLBFile(modelPath, modelName, visibility, desiredScale, manager) {
    var loader = new GLTFLoader(manager);
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
           // obj.rotateY(3.13);
            obj.position.copy(posicaoAviao);
            obj.layers.set(1);
            assetManager.hbAviao.setFromObject(obj);
            var aviaoHelper = createBBHelper(assetManager.hbAviao, 'white')
        }
        if (obj.name == 'torreta') {
            obj.rotateY(1.57);
            obj.userData.collidable = true;
            obj.position.set(THREE.MathUtils.randFloat(-45, 45), 1.5, THREE.MathUtils.randFloat(-500, 45))
            assetManager.hbTorreta = new THREE.Box3().setFromObject(obj);
            torretas.push(obj);
            hbtorretas.push(new THREE.Box3().setFromObject(obj));
            obj.receiveShadow = true;
        }

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
function unMuted() {
    isMuted = !isMuted;

    // Lógica para mutar/desmutar os sons
    if (isMuted) {
        som.pause();
    } else {
        som.play();
    }
}
function onKeyPress(event) {
    if (event.code === 'Escape') {
        toggleSimulation();
    }
    if(event.code === "KeyS"){
        trilhaSonora();
    }
    if (event.code === 'Digit1') {
        velocidade = 1.5;
    }
    if (event.code === 'Digit2') {
        velocidade = 2.5;
    }
    if (event.code === 'Digit3') {
        velocidade = 3;
    }
    if (event.code === 'KeyS') {
        unMuted();
    }
}


function onClick(event) {
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
    tiroSound.play();
}

function createBBHelper(bb, color) {
    // Create a bounding box helper
    let helper = new THREE.Box3Helper(bb, color);
    //scene.add(helper);
}


function updateAsset() {
    if (assetManager.allLoaded) {


        let distancia = (assetManager.aviao.position.x - mousePosition.x);
        rotateAviao(distancia);
        if (assetManager.aviao.position.y > 10) {
            cameraHolder.position.lerp(lerpConfig.destination, lerpConfig.alpha / 1.5);
        }
        if(assetManager.aviao.position.y < 10){
            cameraHolder.position.lerp(lerpConfig.destination, lerpConfig.alpha * 2);
        }

        assetManager.aviao.position.lerp(lerpConfig.destination, lerpConfig.alpha);
        assetManager.hbAviao.setFromObject(assetManager.aviao);
        plano.position.z -= velocidade;
        //cameraHolder.position.z -= velocidade;
        targetLuz.position.z -= velocidade;
        dirLight.position.z -= velocidade;
        //skybox.position.copy(assetManager.aviao.position).sub(skyboxSize.multiplyScalar(0.5))
        let pos = new THREE.Vector3();
        assetManager.aviao.getWorldPosition(pos);
        if (pos.z <= limitador / 2) {
            realocaPlanos();
            if (vezesChamada != 2) {
                vezesChamada++;
            }
            else {
                vezesChamada = 0;
            }
            limitador = limitador - 350;
        }
    }
}


function UpdateProjetil() {
    if (tiros != null) {
        tiros.forEach((b, i) => {
            b.translateZ(velocidade * 2);
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
    if (bala != null && torretas != null) {
        let collision;
        let i;
        for (i = 0; i < hbtorretas.length; i++) {
            if (torretas[i] != null) {
                collision = hbtorretas[i].intersectsBox(bala);
                if (collision) {
                    colisaoSound.play();
                    torretas[i].traverse(function (node) {
                        if (node.material) {
                            explosion.build();
                            if (torretas[i]) {
                                animateExplosion(torretas[i]);
                            }
                            scene.remove(torretas[i]); // Remova o objeto da cena
                            torretas.splice(i, 1);
                            hbtorretas.splice(i, 1);
                        }
                    });
                }
            }
        }
    }
}

// ---------------------MOVIMENTO AVIAO-----------------------//
function rotateAviao(distancia){
    let angle = distancia/100;
 
    if(distancia != 0){

        assetManager.aviao.lookAt(smallSquare.position); 
        assetManager.aviao.rotateZ(angle);  

    }
    else{
        assetManager.aviao.rotateZ(-angle);  
    }


}

function changeObjectColor() {
    if (assetManager.aviao && assetManager.aviao.material) {
        assetManager.aviao.traverse(function (child) {
            if (child.material)
                if (numTirosLevados < 5) {
                    numTirosLevados++;
                }
            child.material.color.set(colors[numTirosLevados]);
        });
    }
}

function CriarTrincheiras(numTrincheiras) {
    var cuboClone;
    var cuboCloneLateral;
    for (let k = 0; k < numTrincheiras; k++) {
        var grupo = new THREE.Group();
        //centro
        for (let j = 0; j < 5; j++) {
            for (let i = 0; i < 5; i++) {
                let cuboGeometry = new THREE.BoxGeometry(20, 20, 20);
                cuboClone = new THREE.Mesh(cuboGeometry, cubeMaterials[1]);
                cuboClone.receiveShadow = true;
                cuboClone.position.set(-40 + (i * 20), -10, fim - (j * 20));
                objects.push(cuboClone);
                grupo.add(cuboClone);
            }
        }
        //lateral esquerda
        for (let l = 0; l < 5; l++) {
            for (let m = 0; m < 3; m++) {
                let cuboGeometry = new THREE.BoxGeometry(20, 20, 20);
                if (m % 2 == 1) {
                    cuboCloneLateral = new THREE.Mesh(cuboGeometry, cubeMaterials);
                }
                else {
                    cuboCloneLateral = new THREE.Mesh(cuboGeometry, cubeMaterials[4]);
                }
                cuboCloneLateral.receiveShadow = true;
                cuboCloneLateral.position.set(-60, -10 + (m * 20), fim - (l * 20));
                objects.push(cuboCloneLateral);

                grupo.add(cuboCloneLateral);
            }
        }
        //lateral direita
        for (let n = 0; n < 5; n++) {
            for (let o = 0; o < 3; o++) {
                let cuboGeometry = new THREE.BoxGeometry(20, 20, 20);
                if (o % 2 == 1) {
                    cuboCloneLateral = new THREE.Mesh(cuboGeometry, cubeMaterials);
                }
                else {
                    cuboCloneLateral = new THREE.Mesh(cuboGeometry, cubeMaterials[4]);
                }
                cuboCloneLateral.receiveShadow = true;
                cuboCloneLateral.position.set(60, -10 + (o * 20), fim - (n * 20));
                objects.push(cuboCloneLateral);
                grupo.add(cuboCloneLateral);
            }
        }
        grupo.translateZ((limitador));
        limitador -= 100;
        for (let i = 0; i < 3; i++) {
            loadGLBFile('./objeto/', 'torreta', true, 13.0, loadingManager);
            if (assetManager.torreta) {
                let position = getRandomPosition(grupo);
                if (position.x < -42 || position.x > 42) {
                    position.y = 41.5;
                }
                assetManager.torreta.position.copy(position);
                torretas.push(assetManager.torreta);
                grupo.attach(assetManager.torreta);
            }
        }
        contadordeplanos.push(grupo);
        scene.add(grupo);
    }
}
function animateExplosion(object) {
    const initialScale = object.scale;

    // Exiba a explosão
    explosion.play();

    const duration = 500; // Duração da animação em milissegundos
    let startTime = null;

    function explosionAnimation(timestamp) {
        if (!startTime) startTime = timestamp;

        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1); // Progresso da animação (entre 0 e 1)

        // Ajuste a escala do objeto
        object.scale.set(
            initialScale.x * (1 + progress),
            initialScale.y * (1 + progress),
            initialScale.z * (1 + progress)
        );

        if (progress < 1) {
            // Continue a animação
            requestAnimationFrame(explosionAnimation);
        } else {
            // Remova o objeto da cena
            scene.remove(object);
        }
    }

    // Inicie a animação
    requestAnimationFrame(explosionAnimation);
}
function onButtonPressed() {
    const loadingScreen = document.getElementById('loading-screen');
    loadingScreen.transition = 0;
    loadingScreen.classList.add('fade-out');
    loadingScreen.addEventListener('transitionend', (e) => {
        const element = e.target;
        element.remove();
    });
    // Config and play the loaded audio
    let sound = new THREE.Audio(new THREE.AudioListener());
    audioLoader.load("./sounds/game-start.mp3", function (buffer) {
        sound.setBuffer(buffer);
        //sound.setLoop(true);
        sound.play();
    });
    som.play();
    document.body.style.cursor = 'none';
    vira = 1;
    velocidade = 1.0;
}
function loadAudio(manager, audio) {
    // Create ambient sound
    audioLoader = new THREE.AudioLoader(manager);
    audioPath = audio;
}
function createCylinder(radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded, color) {
    var geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded);
    var material;
    if (!color)
        material = new THREE.MeshPhongMaterial({ color: "rgb(255,0,0)" });
    else
        material = new THREE.MeshPhongMaterial({ color: "rgb(230,120,50)" });
    var object = new THREE.Mesh(geometry, material);
    object.castShadow = true;
    return object;
}
function setMaterial(color, file = null, repeatU = 1, repeatV = 1) {
    if (!color) color = 'rgb(255,255,255)';

    let mat;
    if (!file) {
        mat = new THREE.MeshLambertMaterial({ color: color });
        mat.receiveShadow = true;
    } else {
        mat = new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load(file), color: color });
        mat.map.wrapS = mat.map.wrapT = THREE.RepeatWrapping;
        mat.map.minFilter = mat.map.magFilter = THREE.LinearFilter;
        mat.map.repeat.set(repeatU, repeatV);
        mat.receiveShadow = true;
    }
    return mat;
}
function getRandomPosition(group) {
    const minX = -60; // Valor mínimo para a coordenada X
    const maxX = 60; // Valor máximo para a coordenada X
    const minY = 1.5; // Valor mínimo para a coordenada Y
    const maxY = 1.5; // Valor máximo para a coordenada Y
    const minZ = -100; // Valor mínimo para a coordenada Z
    const maxZ = 100; // Valor máximo para a coordenada Z

    const position = new THREE.Vector3(
        THREE.MathUtils.randFloat(minX, maxX),
        THREE.MathUtils.randFloat(minY, maxY),
        THREE.MathUtils.randFloat(minZ, maxZ)
    );

    group.localToWorld(position); // Converta a posição local para a posição global

    return position;
}
function realocaPlanos() {
    if (vezesChamada == 0) {
        contadordeplanos[0].translateZ(somadorEmZ);
        contadordeplanos[1].translateZ(somadorEmZ);
        
    }
    else if (vezesChamada == 1) {
        contadordeplanos[2].translateZ(somadorEmZ);
        contadordeplanos[3].translateZ(somadorEmZ);
    }
    else if (vezesChamada == 2) {
        contadordeplanos[4].translateZ(somadorEmZ);
    }
}

function tiroTorretas() {
    for(let i =0; i < torretas.length; i++){
        let tiro = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 4), new THREE.MeshPhongMaterial({ color: 'yellow' }));
        tiro.castShadow = true;
        tiro.receiveShadow = true;
        let pos = new THREE.Vector3();
        t.getWorldPosition(pos);
        tiro.position.copy(pos);
        let posAviao = new THREE.Vector3();
        assetManager.aviao.getWorldPosition(pos);
        tiro.getWorldDirection(posAviao);
        tiro.lookAt(posAviao);
        scene.add(tiro);
        tiros.push(tiro);
        let tiroHB = new THREE.Box3().setFromObject(tiro);
        tirosHB.push(tiroHB);
        tiro.userData = {};
        tiro.userData.initialPosition = new THREE.Vector3().copy(tiro.position);
        tiroTorretaSound.play();
    };
}
function UpdateProjetilTorreta() {
    if (tirosTorreta != null) {
        tirosTorreta.forEach((b, i) => {
            let direcao = new THREE.Vector3();
            assetManager.aviao.getWorldDirection(direcao);
            b.position.lerp(direcao, velocidade * 2);
            tirosTorretaHB[i].copy(b.geometry.boundingBox).applyMatrix4(b.matrixWorld);
            tirosTorretaHB[i].setFromObject(b);
            let distancia = b.position.distanceTo(b.userData.initialPosition);
            if (b.position.y < 0 || distancia > 500 || b.position.x < -45 || b.position.x > 45 || b.position.y > 100) {
                scene.remove(b);
                tirosTorreta.splice(i, 1);
                tirosTorretaHB.splice(i, 1);

                i--;
            }
            checkCollisionsAviao(tirosTorretaHB[i]);
        })
    }
}

function checkCollisionsAviao(bala) {
    if (bala != null && assetManager.aviao != null) {
        let collision;
        let i;
        collision = assetManager.hbAviao.intersectsBox(bala);
        if (collision) {
            colisaoAviaoSound.play();
            changeAviaoColor();
        }
    }
}