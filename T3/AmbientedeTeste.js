import * as THREE from 'three';
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';

// Criando a cena
var scene = new THREE.Scene();

// Criando o renderizador
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//Criando Camera
let camPos = new THREE.Vector3(0.0, 30.0, 60.0);
let camUp = new THREE.Vector3(0.0, 0.0, 0.0);


let camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.copy(camPos);
camera.up.copy(camUp);
let cameraHolder = new THREE.Object3D();
cameraHolder.add(camera);
scene.add(cameraHolder);


let orbit = new OrbitControls(camera, renderer.domElement); // Enable mouse rotation, pan, zoom etc.

//Criando Luz
const ambientColor = "rgb(50,50,50)";
let ambientLight = new THREE.AmbientLight(ambientColor);
scene.add(ambientLight);
let lightPosition = new THREE.Vector3(70, 90, 0);
let lightColor = "rgb(255,255,255)";
let dirLight = new THREE.DirectionalLight(lightColor);
const materialtarget = new THREE.MeshBasicMaterial({ color: 'lightgreen', visible: false });
const targetGeometry = new THREE.BoxGeometry(1, 1, 1);
const targetLuz = new THREE.Mesh(targetGeometry, materialtarget);
scene.add(targetLuz);
dirLight.target = targetLuz;
setDirectionalLighting(lightPosition);





const tamanhoPlano = 100;
var inicio = (tamanhoPlano / 2) - 10;//valor em x
var fim = (tamanhoPlano / 2) - 10;//valor em z

let linha = [];
let coluna = [];
var planoCubos = [];
var cuboClone;
var cuboCloneLateral;
for (let k = 0; k < 5; k++) {
        //centro
        for (let j = 0; j < 5; j++) {
            var materialcubo = new THREE.MeshLambertMaterial({
                color: 'green',
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.1
            });
            for (let i = 0; i < 5; i++) {
                var cubo = new THREE.BoxGeometry(20, 20, 20);
                cuboClone = new THREE.Mesh(cubo, materialcubo);
                cuboClone.material.color.set('green');
                cuboClone.receiveShadow = true;
                cuboClone.position.set(-inicio + (i * 20), -10, fim - (j * 20));
                linha.push(cuboClone);
                planoCubos.push(cuboClone);
                scene.add(cuboClone);
            }
            coluna.push(cuboClone);
            //console.log(cuboClone);
        }
        //lateral esquerda
        for (let l = 0; l < 5; l++) {
            for (let m = 0; m < 3; m++) {
                var cubo = new THREE.BoxGeometry(20, 20, 20);
                var materialcubo = new THREE.MeshLambertMaterial({
                    color: 'green',
                    side: THREE.DoubleSide,
                    transparent: true,
                    opacity: 1
                });
                cuboCloneLateral = new THREE.Mesh(cubo, materialcubo);
                cuboCloneLateral.receiveShadow = true;
                cuboCloneLateral.position.set(-60, -10 + (m * 20), fim - (l * 20));
                //scene.add(cuboCloneLateral);
                planoCubos.push(cuboCloneLateral);
            }
        }
        //lateral direita
        for (let n = 0; n < 5; n++) {
            for (let o = 0; o < 3; o++) {
                var cubo = new THREE.BoxGeometry(20, 20, 20);
                var materialcubo = new THREE.MeshLambertMaterial({
                    color: 'green',
                    side: THREE.DoubleSide,
                    transparent: true,
                    opacity: 0.5
                });
                cuboCloneLateral = new THREE.Mesh(cubo, materialcubo);
                cuboCloneLateral.receiveShadow = true;
                cuboCloneLateral.position.set(60, -10 + (o * 20), fim - (n * 20));
                //scene.add(cuboCloneLateral);
                planoCubos.push(cuboCloneLateral);
            }
        }
}
let contador = 0;
for (let teste = 110; teste < 115; teste++) {
    if(linha[teste].material!= null){
        console.log(linha[teste]);
        linha[teste].material.opacity = 1;
        contador++;
    }
}
console.log(contador);
// Função de animação
function animate() {
    requestAnimationFrame(animate);
    // Renderizando a cena com a câmera
    renderer.render(scene, camera);
}

// Iniciando a animação
animate();

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