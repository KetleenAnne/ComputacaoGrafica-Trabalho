import * as THREE from "three";

export class Plano {
  plano1;
  plano2;
  plano3;
  constructor(scena) {
    this.plano1 = createPlane();
    this.plano2 = createPlane();
    this.plano3 = createPlane();

    this.plano1.position.set(-100, -1, 100);
    this.plano2.position.set(0, 0, -80);
    this.plano3.position.set(0, 0, -160);

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

    //largura do plano 100
    //tamanho do plano 100
    const planoGeometry = new THREE.BoxGeometry(20, 1, 20);
    const plano = new THREE.Mesh(planoGeometry, materialPlano);

    const lateralGeometry = new THREE.BoxGeometry(1, 50, 80);

    const lateralEsq = new THREE.Mesh(lateralGeometry, materialPlano);

    const lateralDir = new THREE.Mesh(new THREE.BoxGeometry(1, 50, 80), materialPlano);

    plano.position.set(1, 1 , 100);

    lateralEsq.position.set(-40, 25, 0);

    lateralDir.position.set(40, 25, 0);

    plano.receiveShadow = true;
    lateralDir.receiveShadow = true;
    lateralEsq.receiveShadow = true;

    plano.add(lateralEsq);
    plano.add(lateralDir);


  return plano;
} 

function CriarPlano(inicio, fim) {
  const linha0 = [];
  const linha1 = [];
  const linha2 = [];
  const linha3 = [];
  const linha4 = [];
  const coluna = [[linha0],
                  [linha1],
                  [linha2],
                  [linha3],
                  [linha4]]
  for (let i = 0; i < 5; i++) {
    let posicaoX = inicio+i*50;
    
  }
  
}