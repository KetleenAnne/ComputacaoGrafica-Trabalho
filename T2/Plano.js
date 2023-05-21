import * as THREE from "three";

export class Plano {
  plano1;
  plano2;
  plano3;
  constructor(scena) {
    this.plano1 = createPlane();
    this.plano2 = createPlane();
    this.plano3 = createPlane();

    this.plano1.position.set(0, 0, 0);
    this.plano2.position.set(0, 0, -500);
    this.plano3.position.set(0, 0, -1000);

    scena.add(this.plano1);
    scena.add(this.plano2);
    scena.add(this.plano3);

    /*this.planoAtual = this.plano1;

    this.plano1.material.opacity = 1;
    this.plano2.material.opacity = 0.5;
    this.plano3.material.opacity = 0.25;*/

    this.limiteCriadorDePlano = -400;
    this.alternadorDePlano = 0;
    this.novaPosition = 0;
  }
  
  desenhaPlano(posicaoCameraX) {
    let proxPlano = -1500;

    if (posicaoCameraX < this.limiteCriadorDePlano) {
      this.limiteCriadorDePlano -= 500;

      if (this.alternadorDePlano === 0) {
        this.novaPosition = this.plano1.position.z + proxPlano;
        this.plano1.position.set(0, 0, this.novaPosition);
        this.alternadorDePlano = 1;
      } else if (this.alternadorDePlano === 1){
        this.novaPosition = this.plano2.position.z + proxPlano;
        this.plano2.position.set(0, 0, this.novaPosition);
        this.alternadorDePlano = 2;
      }
      else{
        this.novaPosition = this.plano3.position.z + proxPlano;
        this.plano3.position.set(0, 0, this.novaPosition);
        this.alternadorDePlano = 0;
      }
    }
  }

}

function createPlane(){
    const materialPlano = new THREE.MeshLambertMaterial({ color: 'lightgreen'});
    const materialLinha = new THREE.MeshPhongMaterial({ color: 0xffffff, wireframe: true }); 

    //largura do plano 300
    //tamanho do plano 500
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

    plano.receiveShadow = true;
    lateralDir.receiveShadow = true;
    lateralEsq.receiveShadow = true;

    plano.add(linePlano);
    plano.add(lateralEsq);
    plano.add(lateralDir);

    lateralEsq.add(lineLateralEsq);
    lateralDir.add(lineLateralDir);

  return plano;
} 
