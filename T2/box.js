import * as THREE from "three";
export function createPlane(){
    const material = new THREE.MeshLambertMaterial({ color: 'lightgreen'});

    const plano = new THREE.Mesh(new THREE.BoxGeometry(300, 0, 500), material);
    const lateralEsq = new THREE.Mesh(new THREE.BoxGeometry(0, 150, 500), material);
    const lateralDir = new THREE.Mesh(new THREE.BoxGeometry(0, 150, 500), material);

    plano.position.set(0, 0 , 0);
    lateralEsq.position.set(-150, 75, 0);
    lateralDir.position.set(150, 75, 0);
    plano.add(lateralEsq);
    plano.add(lateralDir);
  return plano;
} 
