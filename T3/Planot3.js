import * as THREE from "three";
class Plano{
  CriarPlano(scene);

}

function CriarPlano(scene) {
  const planeMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100),
    new THREE.MeshLambertMaterial({
      side: THREE.DoubleSide,
      visible: false
    })
  );
  planeMesh.rotateX(-Math.PI / 2);
  screen.add(planeMesh);

  const grid = new THREE.GridHelper(100,100);
  scene.add(grid);
} 