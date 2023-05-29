import * as THREE from 'three';

export class Arvore{ 
    constructor(plano) {
        // create material
        var materialTrunk = new THREE.MeshPhongMaterial({ color: 'brown'});
       // materialTrunk.transparent = true;
        //material folha
        var materialLeaves = new THREE.MeshPhongMaterial({ color: 'green', shininess:"200"});
       // materialLeaves.transparent = true;


        // create a tree
        var trunk = new THREE.CylinderGeometry(0.6, 0.6, 3);//medidas do tronco
        var leaves = new THREE.ConeGeometry(1.5, 1.5);//medida das camadas da arvore
        var leaves2 = new THREE.ConeGeometry(2, 2);//medida das camadas da arvore
        var leaves3 = new THREE.ConeGeometry(2.5, 2.5);//medida das camadas da arvore

        // create the mesh
        var trunkMesh = new THREE.Mesh(trunk, materialTrunk);//mesh do tronco

        var leavesMesh = new THREE.Mesh(leaves, materialLeaves);//mesh da 1 camada

        var leaves2Mesh = new THREE.Mesh(leaves2, materialLeaves);//mesh da 2 camada

        var leaves3Mesh = new THREE.Mesh(leaves3, materialLeaves);//mesh da 3 camada

        // position the trunk. Set y to half of height of trunk
        trunkMesh.position.set(THREE.MathUtils.randInt(-150, 150), 1.5 , THREE.MathUtils.randInt(-250, 250));//posição do tronco
        leavesMesh.position.set(0, 4, 0);//posição em relação ao tronco da 1 camada
        leaves2Mesh.position.set(0, 3, 0);//posição em relação ao tronco da 2 camada
        leaves3Mesh.position.set(0, 2, 0);//posição em relação ao tronco da 3 camada


        trunkMesh.receiveShadow = true;
        trunkMesh.castShadow = true;
        leavesMesh.castShadow = true;//sombra da 1 camada
        leavesMesh.receiveShadow = true;
        leaves2Mesh.castShadow = true;//sombra da 2 camada
        leaves2Mesh.receiveShadow = true;
        leaves3Mesh.castShadow = true;//sombra da 3 camada
        leaves3Mesh.receiveShadow = true;

        trunkMesh.add(leavesMesh);//adiciona no tronco a 1 camada
        trunkMesh.add(leaves2Mesh);//adiciona a segunda camada ao tronco
        trunkMesh.add(leaves3Mesh);//adiciona a terceira camada ao tronco

        trunkMesh.rotation.y = Math.PI / 2;

        plano.add(trunkMesh);
    }

}
