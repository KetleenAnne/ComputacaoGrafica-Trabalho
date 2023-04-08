import * as THREE from 'three';

class Aviao{

  //INICIO
  constructor(scene){

  //angulos
  var angle90 = THREE.MathUtils.degToRad(90); //cria o angulo 90º

  // criando o avião
  var base = new THREE.CylinderGeometry(1.5, 1, 12); //cria base
  base.rotateZ(- angle90); //rotacinando o cilindro em 90°

  var janela = new THREE.CapsuleGeometry( 1, 1, 20, 25 ); //cria janela
  janela.rotateZ(- angle90); //rotacinando a janela em 90°

  var detalhe = new THREE.RingGeometry( 0.5, 1.55, 32 ); //detalhe em amarelo da frente do aviao
  detalhe.rotateY( angle90);

  var circulo = new THREE.CircleGeometry( 1, 32 ); //circulo preto da frente do avião
  circulo.rotateY( angle90); //rotacinando  em 90°

  var cilindro = new THREE.CylinderGeometry(0.2, 0.2 ,2); //cilindro que gira da frente do avião
  cilindro.rotateZ(angle90);

  var helice = new THREE.PlaneGeometry(5, 0.5);//helice do avião
  helice.rotateY(- angle90);

  var asaLateralMaior = new THREE.CapsuleGeometry( 1.5, 14, 30, 2); //asa maior que fica na lateral
  asaLateralMaior.rotateX( -angle90);
  asaLateralMaior.rotateZ( -angle90);

  var asaLateralMenor = new THREE.CapsuleGeometry(1, 6, 15, 2 ); // asa menor que fica mais atras do aviao
  asaLateralMenor.rotateX(- angle90);
  asaLateralMenor.rotateZ( -angle90);

  var asinha = new THREE.CapsuleGeometry(0.5 , 2, 30, 2); //asa que fica por cima

  //Mesh's
  var baseMesh = new THREE.Mesh(base, new THREE.MeshPhongMaterial({color: 0x797D7F}));
  baseMesh.position.set(0, 5, 0);

  var janelaMesh = new THREE.Mesh(janela, new THREE.MeshPhongMaterial({color: 0x1E90FF}));
  janelaMesh.position.set(3, 1, 0);

  var detalheMesh = new THREE.Mesh(detalhe, new THREE.MeshPhongMaterial({color: 0xF3B903, side: THREE.DoubleSide}));
  detalheMesh.position.set(5.99, 0, 0);

  var circuloMesh = new THREE.Mesh(circulo, new THREE.MeshPhongMaterial({color: 0x000000}));
  circuloMesh.position.set(6.01,0,0);

  var cilindroMesh = new THREE.Mesh(cilindro, new THREE.MeshPhongMaterial({color: 0x000000}));
  cilindroMesh.position.set(6.01,0,0);

  var heliceMesh = new THREE.Mesh(helice, new THREE.MeshPhongMaterial({color: 0xF3B903, side: THREE.DoubleSide})); 
  heliceMesh.position.set(0.98, 0, 0);

  var asaLateralMaiorMesh = new THREE.Mesh(asaLateralMaior, new THREE.MeshPhongMaterial({color: 0xF3B903, side: THREE.DoubleSide}));
  asaLateralMaiorMesh.position.set(2, 0, 0);

  var asaLateralMenorMesh = new THREE.Mesh(asaLateralMenor, new THREE.MeshPhongMaterial({color: 0x797D7F, side: THREE.DoubleSide}));
  asaLateralMenorMesh.position.set(-5, 0, 0);

  var asinhaMesh = new THREE.Mesh(asinha, new THREE.MeshPhongMaterial({color: 0x797D7F, side: THREE.DoubleSide}));
  asinhaMesh.position.set(-5.5, 1, 0);

  scene.add(baseMesh);
  baseMesh.add(janelaMesh);
  baseMesh.add(detalheMesh);
  baseMesh.add(circuloMesh);
  baseMesh.add(cilindroMesh);
  baseMesh.add(asaLateralMaiorMesh);
  baseMesh.add(asaLateralMenorMesh);
  baseMesh.add(asinhaMesh);
  cilindroMesh.add(heliceMesh);
  }
}
function rotateCylinder() {
  var speed = 0.08;
  var animationOn = true; // control if animation is on or of
  if (animationOn) {
    cilindroMesh.rotation.x +=speed; //girando o cilindro pois a helice esta nele e irá girar junto
  }
} 
export{Aviao};