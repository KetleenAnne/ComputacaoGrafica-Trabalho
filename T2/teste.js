// Importar a biblioteca THREE.js
import * as THREE from 'three';

// Configurar a cena
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Variáveis para armazenar a posição do mouse
const mouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
const planeSize = 10;
const planeGeometry = new THREE.PlaneGeometry(planeSize, planeSize);
const planeMaterial = new THREE.MeshBasicMaterial({ visible: false });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane);

// Função para obter a posição do mouse
function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Atualizar a posição das miras com base na posição do mouse
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObject(plane);

    if (intersects.length > 0) {
        const intersection = intersects[0];
        smallSquare.position.copy(intersection.point);

        const largeSquareSpeed = 0.05;
        const direction = intersection.point.clone().sub(largeSquare.position).normalize();

        largeSquare.position.add(direction.multiplyScalar(largeSquareSpeed));
    }
}

// Adicionar o evento de movimento do mouse
window.addEventListener('mousemove', onMouseMove, false);

// Criar as miras sem preenchimento interno
const smallSquareGeometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(-0.1, 0.1, 0),
    new THREE.Vector3(0.1, 0.1, 0),
    new THREE.Vector3(0.1, -0.1, 0),
    new THREE.Vector3(-0.1, -0.1, 0),
    new THREE.Vector3(-0.1, 0.1, 0) // Fechar o loop
]);
const largeSquareGeometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(-0.2, 0.2, 0),
    new THREE.Vector3(0.2, 0.2, 0),
    new THREE.Vector3(0.2, -0.2, 0),
    new THREE.Vector3(-0.2, -0.2, 0),
    new THREE.Vector3(-0.2, 0.2, 0) // Fechar o loop
]);
const linhaExterna1 = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(-0.2, 0.2, 0),
    new THREE.Vector3(-0.1, 0.1, 0)
]);
const linhaExterna2 = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0.2, 0.2, 0),
    new THREE.Vector3(0.1, 0.1, 0)
]);
const linhaExterna3 = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0.2, -0.2, 0),
    new THREE.Vector3(0.1, -0.1, 0),
]);
const linhaExterna4 = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(-0.2, -0.2, 0),
    new THREE.Vector3(-0.1, -0.1, 0)
]);
const linhaInterna1 = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(-0.1, 0.1, 0),
    new THREE.Vector3(-0.05, 0.05, 0)
]);
const linhaInterna2 = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0.1, 0.1, 0),
    new THREE.Vector3(0.05, 0.05, 0)
]);
const linhaInterna3 = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0.1, -0.1, 0),
    new THREE.Vector3(0.05, -0.05, 0),
]);
const linhaInterna4 = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(-0.1, -0.1, 0),
    new THREE.Vector3(-0.05, -0.05, 0)
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
scene.add(smallSquare);
scene.add(largeSquare);

// Posicionar e direcionar a câmera
camera.position.z = 5;

// Função de animação
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();
