import * as THREE from 'three';

// Criando a cena
    var scene = new THREE.Scene();

    // Criando a câmera
    var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Criando o renderizador
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Criando uma geometria
    var geometry = new THREE.BoxGeometry(1, 1, 1);

    // Criando um material
    var material = new THREE.MeshBasicMaterial({
      color: 0x00ff00
    });

    // Criando um objeto de malha (mesh) com a geometria e o material
    var cube = new THREE.Mesh(geometry, material);

    // Adicionando o objeto de malha à cena
    scene.add(cube);

    // Função de animação
    function animate() {
      requestAnimationFrame(animate);

      // Rotacionando o cubo
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;

      // Renderizando a cena com a câmera
      renderer.render(scene, camera);
    }

    // Iniciando a animação
    animate();
