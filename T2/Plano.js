import * as THREE from  '../build/three.module.js';

import { createGroundPlaneWired } from "../libs/util/util.js"; 
export function plane( scene){
  const planeSize = 1000; // Tamanho do plano
  const cubeSize = 25; // Tamanho dos cubos
  const numCubes = planeSize / cubeSize; // Quantidade de cubos em cada dimensão
  boxInPlane(cubeSize, numCubes, scene);
}

function boxInPlane(cubeSize, numCubes, scene){
    for (let i = 0; i < numCubes; i++) {
        for (let j = 0; j < numCubes; j++) {
        const cubeGeometry = new THREE.BoxGeometry(cubeSize, 2, cubeSize);
        const cubeMaterial = new THREE.MeshLambertMaterial({ color: 'lightgreen' });
        const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.position.x = (i - numCubes / 2) * cubeSize;
        cube.position.z = (j - numCubes / 2) * cubeSize;
        //cube.position.y = (999);
        cube.receiveShadow = true;
        scene.add(cube); // Adiciona o cubo à cena}
        }
    }
}
