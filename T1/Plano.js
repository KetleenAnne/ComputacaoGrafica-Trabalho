import * as THREE from "three";
import { scene } from "./T1.js";
import { createGroundPlaneWired } from "../libs/util/util.js";

var Plano = function () {
  // Cria-se dois planos que alternarão entre si
  // produzindo um efeito de chão infinito
  let plano1 = createGroundPlaneWired(400, 80, 300, 50, 3, "dimgray", "gainsboro");
  let plano2 = createGroundPlaneWired(400, 80, 300, 50, 3, "dimgray", "gainsboro");
  plano2.position.set(400, 0, 0);
  let limiteCriadorDePlano = -300;
  let alternadorDePlano = true;
  let proxPlano = -800;
  let novaPosition = 0;



  // Inicia os dois planos
  let init = () => {
    scene.add(plano1);
    scene.add(plano2);
  };


  // Roda o estado dos planos,
  // verificando se o avião atingiu o limite necessário
  // do cenário, para transladar o plano de tras
  // para a frente do próximo plano
  let update = () => {
    if (flyCamera.mesh.position.z < limiteCriadorDePlano) {
      limiteCriadorDePlano -= 400;
      if (alternadorDePlano) {
        novaPosition = plano1.position.z + proxPlano;
        plano1.position.set(novaPosition, 0, 0);
        alternadorDePlano = false;
      } else {
        novaPosition = plano2.position.z + proxPlano;
        plano2.position.set(novaPosition, 0, 0);
        alternadorDePlano = true;
      }
    }
  };

  init();
};

export default Plano;
