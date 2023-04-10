import * as THREE from "three";
//import { scene } from "./T1.js";
import { createGroundPlaneWired } from "../libs/util/util.js";

var Plano = function () {
  // Cria-se dois planos que alternarão entre si
  // produzindo um efeito de chão infinito
  this.plano1 = createGroundPlaneWired(600, 600);
  this.plano2 = createGroundPlaneWired(600, 600);
  this.plano2.position.set(0, 0, -600);
  this.limiteCriadorDePlano = -500;
  this.alternadorDePlano = true;
  this.proxPlano = -1200;
  this.novaPosition = 0;

  // Inicia os dois planos
  this.init = () => {
    scene.add(this.plano1);
    scene.add(this.plano2);
  };

  // Roda o estado dos planos,
  // verificando se o avião atingiu o limite necessário
  // do cenário, para transladar o plano de tras
  // para a frente do próximo plano
  this.update = () => {
    if (aviao.mesh.position.z < this.limiteCriadorDePlano) {
      this.limiteCriadorDePlano -= 600;
      if (this.alternadorDePlano) {
        this.novaPosition = this.plano1.position.z + this.proxPlano;
        this.plano1.position.set(0, 0, this.novaPosition);
        this.alternadorDePlano = false;
      } else {
        this.novaPosition = this.plano2.position.z + this.proxPlano;
        this.plano2.position.set(0, 0, this.novaPosition);
        this.alternadorDePlano = true;
      }
    }
  };

  this.init();
};

export default Plano;