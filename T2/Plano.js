import * as THREE from  '../build/three.module.js';

export function plane(initialPosition, planeSize){
  const cubeSize = 50; // Tamanho dos cubos
  const numCubes = planeSize / cubeSize; // Quantidade de cubos em cada dimensão
  const planeGroup = new THREE.Group();
  createCubePlane(cubeSize, numCubes, initialPosition, planeGroup);
  createCubePlaneLateralDir(cubeSize, numCubes, initialPosition, planeGroup, planeSize);
  createCubePlaneLateralEsq(cubeSize, numCubes, initialPosition, planeGroup, planeSize);
  
  return planeGroup;
} 

function createCubePlane(cubeSize, numCubes, initialPosition, planeGroup) {
  for (let i = 0; i < numCubes; i++) {
    for (let j = 0; j < numCubes; j++) {
      const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
      const cubeMaterial = new THREE.MeshLambertMaterial({ color: 'lightgreen'});
      const edges = new THREE.EdgesGeometry(cubeGeometry);
      const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xffffff }));
      const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
      line.position.x = cube.position.x = initialPosition.x + (i - numCubes / 2) * cubeSize;
      line.position.z = cube.position.z = initialPosition.z + (j - numCubes / 2) * cubeSize;
      cube.receiveShadow = true;
      planeGroup.add(cube); // Adiciona o cubo à cena
      planeGroup.add(line);
    }
  }
}
function createCubePlaneLateralDir(cubeSize, numCubes, initialPosition, planeGroup, planeSize) {
  for (let i = 0; i < numCubes; i++) {
    for (let j = 0; j < numCubes; j++) {
      const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
      const cubeMaterial = new THREE.MeshLambertMaterial({ color: 'lightgreen'});
      const edges = new THREE.EdgesGeometry(cubeGeometry);
      const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xffffff }));
      const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
      line.position.x = cube.position.x = initialPosition.x + (-planeSize / 2);
      line.position.y = cube.position.y = initialPosition.y + (i - numCubes / 2) * cubeSize;
      line.position.z = cube.position.z = initialPosition.z + (j - numCubes / 2) * cubeSize;
      cube.receiveShadow = true;
      if(cube.position.y >= 0){
        planeGroup.add(cube); // Adiciona o cubo à cena      
        planeGroup.add(line);
      }

    }
  }
}
function createCubePlaneLateralEsq(cubeSize, numCubes, initialPosition, planeGroup, planeSize) {
  for (let i = 0; i < numCubes; i++) {
    for (let j = 0; j < numCubes; j++) {
      const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
      const cubeMaterial = new THREE.MeshLambertMaterial({ color: 'lightgreen'});
      const edges = new THREE.EdgesGeometry(cubeGeometry);
      const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xffffff }));
      const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
      line.position.x = cube.position.x = initialPosition.x + (planeSize / 2);
      line.position.y = cube.position.y = initialPosition.y + (i - numCubes / 2) * cubeSize;
      line.position.z = cube.position.z = initialPosition.z + (j - numCubes / 2) * cubeSize;
      cube.receiveShadow = true;
      if(cube.position.y >= 0){
        planeGroup.add(cube); // Adiciona o cubo à cena
        planeGroup.add(line);
      }
    }
  }
}