import * as THREE from "three";
export function createPlane(){
    const materialPlano = new THREE.MeshLambertMaterial({ color: 'lightgreen'});
    const materialLinha = new THREE.MeshPhongMaterial({ color: 0xffffff, wireframe: true }); 

    const planoGeometry = new THREE.BoxGeometry(300, 0, 500);
    const plano = new THREE.Mesh(planoGeometry, materialPlano);
    const linePlano = new THREE.Mesh(planoGeometry, materialLinha);

    const lateralGeometry = new THREE.BoxGeometry(0, 150, 500);

    const lateralEsq = new THREE.Mesh(lateralGeometry, materialPlano);
    const lineLateralEsq = new THREE.Mesh(lateralGeometry, materialLinha);

    const lateralDir = new THREE.Mesh(new THREE.BoxGeometry(0, 150, 500), materialPlano);
    const lineLateralDir = new THREE.Mesh(lateralGeometry, materialLinha);

    plano.position.set(0, 0 , 0);

    lateralEsq.position.set(-150, 75, 0);

    lateralDir.position.set(150, 75, 0);

    plano.add(linePlano);
    plano.add(lateralEsq);
    plano.add(lateralDir);

    lateralEsq.add(lineLateralEsq);
    lateralDir.add(lineLateralDir);

  return plano;
} 
