import * as THREE from  '../build/three.module.js';
export class Plano {
  plano1;
  plano2;
  plano3;
  plano4;
  constructor(scena) {
    let positions = new THREE.Vector3(0,0,0);
    this.plano1 = createPlane(positions, 200)
    this.plano2 = 
    this.plano2.position.set(200, 0, 0);

    scena.add(this.plano1);
    scena.add(this.plano2);

    this.limiteCriadorDePlano = 100;
    this.alternadorDePlano = true;
    this.novaPosition = 0;
  }


  desenhaPlano(posicaoCameraX) {
    let proxPlano = 400;

    if (posicaoCameraX > this.limiteCriadorDePlano) {
      this.limiteCriadorDePlano += 100;

      if (this.alternadorDePlano) {
        this.novaPosition = this.plano1.position.x + proxPlano;
        this.plano1.position.set(this.novaPosition, 0, 0);
        this.alternadorDePlano = false;
      } else {
        this.novaPosition = this.plano2.position.x + proxPlano;
        this.plano2.position.set(this.novaPosition, 0, 0);
        this.alternadorDePlano = true;
      }
    }
  }

}

export function createPlane(initialPosition, planeSize){
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