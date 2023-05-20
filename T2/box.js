import * as THREE from "three";
export function createPlane(position){
    const material = new THREE.MeshLambertMaterial({ color: 'lightgreen'});

    const base = new THREE.BoxGeometry(300, 0, 500);
    const plano = new THREE.Mesh(base, material);
    plano.position.add(position);

    const lateralEsq = new THREE.Mesh(new THREE.BoxGeometry(0,150,500), material);
    baseMesh.position.set(-150, 15, 0);
    plano.add(lateralEsq);
  return plano;
} 
