import * as THREE from "three";
import { Arvore } from "./Arvore.js";


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
  //material do plano
    const materialPlano = new THREE.MeshLambertMaterial({ color: 'lightgreen'});

<<<<<<< HEAD
    //largura do plano 100
    //tamanho do plano 100
    const planoGeometry = new THREE.BoxGeometry(20, 1, 20);
    const plano = new THREE.Mesh(planoGeometry, materialPlano);

    const lateralGeometry = new THREE.BoxGeometry(1, 50, 80);
=======
  // geometria plano e laterais
    const planoGeometry = new THREE.BoxGeometry(300, 0, 500); //largura 300, comprimento 500
    const lateralGeometry = new THREE.BoxGeometry(0, 150, 500);
>>>>>>> d80891bf68e23c313c8118b74fec100b71841812

  //Mesh plano e laterais
    const plano = new THREE.Mesh(planoGeometry, materialPlano);
    const lateralEsq = new THREE.Mesh(lateralGeometry, materialPlano);
<<<<<<< HEAD

    const lateralDir = new THREE.Mesh(new THREE.BoxGeometry(1, 50, 80), materialPlano);

    plano.position.set(1, 1 , 100);

    lateralEsq.position.set(-40, 25, 0);

    lateralDir.position.set(40, 25, 0);
=======
    const lateralDir = new THREE.Mesh(lateralGeometry, materialPlano);

  //Mesh linhas
    const linePlano = new THREE.Mesh(planoGeometry, materialLinha);
    const lineLateralEsq = new THREE.Mesh(lateralGeometry, materialLinha);
    const lineLateralDir = new THREE.Mesh(lateralGeometry, materialLinha);

  //Posicionamento
    plano.position.set(0, 0 , 0);
    lateralEsq.position.set(-150, 75, 0);
    lateralDir.position.set(150, 75, 0);
>>>>>>> d80891bf68e23c313c8118b74fec100b71841812

  //Sombras
    plano.receiveShadow = true;
   // linePlano.receiveShadow = true;
    lateralDir.receiveShadow = true;
   // lineLateralDir.receiveShadow = true;
    lateralEsq.receiveShadow = true;
   //s lineLateralDir.receiveShadow = true;

<<<<<<< HEAD
    plano.add(lateralEsq);
    plano.add(lateralDir);

=======
  //Adicionando ao plano
    plano.add(linePlano);
    plano.add(lateralEsq);
    plano.add(lateralDir);

    lateralEsq.add(lineLateralEsq);
    lateralDir.add(lineLateralDir);
    posicionaArvores(plano);
>>>>>>> d80891bf68e23c313c8118b74fec100b71841812

  return plano;
} 

<<<<<<< HEAD
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
  
=======
function posicionaArvores(plano) {
  var numArvores = 700;
  do{
    var arvore = new Arvore(plano);
    numArvores = numArvores - 1;
  }while(numArvores - 1 > 0);  
>>>>>>> d80891bf68e23c313c8118b74fec100b71841812
}