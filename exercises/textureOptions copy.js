import * as THREE from 'three';
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import {
  initRenderer,
  initCamera,
  initDefaultBasicLight,
  setDefaultMaterial,
  InfoBox,
  onWindowResize,
  createGroundPlaneXZ
} from "../libs/util/util.js";

let scene, renderer, camera, material, light, orbit; // Initial variables
scene = new THREE.Scene();    // Create main scene
renderer = initRenderer();    // Init a basic renderer
camera = initCamera(new THREE.Vector3(0, 15, 30)); // Init camera in this position
material = setDefaultMaterial(); // create a basic material
light = initDefaultBasicLight(scene); // Create a basic light to illuminate the scene
orbit = new OrbitControls(camera, renderer.domElement); // Enable mouse rotation, pan, zoom etc.

// Listen window size changes
window.addEventListener('resize', function () { onWindowResize(camera, renderer) }, false);

// Show axes (parameter is size of each axis)
let axesHelper = new THREE.AxesHelper(12);
scene.add(axesHelper);

// create the ground plane
let plane = createGroundPlaneXZ(20, 20)
scene.add(plane);


//criando um cubo
let spGroup;  // Will receive the auxiliary spheres representing the points

createCustomGeometry();
function createCustomGeometry()
{
  // Create all vertices of the object
  // In this example, we have five vertices
  let v = [-2.0, 0.0, 2.0, // p0
            2.0,  0.0,  2.0, // p1 
            -2.0, 0.0,  -2.0, // p2  
            2.0,  0.0,  -2.0, // p3
            -2.0, 2.0, 2.0, // p4
            2.0,  2.0,  2.0, // p5 
            -2.0, 2.0,  -2.0, // p6  
            2.0,  2.0,  -2.0,] // p7 

  // Create the triangular faces
  // In this example we have 3 triangular faces
  let f =  [//1, 3, 5, 7,
            2, 3, 4, 5,
            //0, 4, 5, 1,
            //0, 2, 4, 6
          ];

  // In this example normals = vertices because the center of the object is the origin. 
  // You may have to compute your normals manually.
  const n = v;

  // Set buffer attributes
  var vertices = new Float32Array( v );
  var normals = new Float32Array( n );  
  var indices = new Uint32Array( f );

  // Set the Buffer Geometry
  let geometry = new THREE.BufferGeometry();

  geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) ); // 3 components per vertex
  geometry.setAttribute( 'normal', new THREE.BufferAttribute( normals, 3 ) );  // 3 components per normal
  geometry.setIndex( new THREE.BufferAttribute( indices, 1 ) );
  geometry.computeVertexNormals(); 

  material = new THREE.MeshPhongMaterial({color:"rgb(255,255,255)"});
    material.side =  THREE.DoubleSide; // Show front and back polygons
    material.flatShading = true;
  const mesh = new THREE.Mesh( geometry, material );

  // This function will set UV coordinates and texture
  //setTexture(mesh);

  scene.add(mesh);
 
  // Create auxiliary spheres to visualize the points
  createPointSpheres(v);
}
function setTexture(mesh) {
  let geometry = mesh.geometry;
  let material = mesh.material;

  // You must set an individual UV coordinate for each vertex of your scene
  // Learn more here:
  // https://discoverthreejs.com/book/first-steps/textures-intro/
  var uvCoords = [0.0, 0.0,
                  0.3, 1.0,
                  0.5, 0.0,
                  0.7, 1.0,
                  1.0, 0.0];

  geometry.setAttribute( 'uv', new THREE.BufferAttribute( new Float32Array( uvCoords), 2 ) );

  // Load the texture and set to the material of the mesh
  let texture = new THREE.TextureLoader().load('../assets/textures/art.jpg');
  material.map =  texture;
}

function createPointSpheres(points)
{
  spGroup = new THREE.Object3D();
  var spMaterial = new THREE.MeshPhongMaterial({color:"rgb(255,255,0)"});
  var spGeometry = new THREE.SphereGeometry(0.1);
  for(let i = 0; i < points.length; i+=3){
    var spMesh = new THREE.Mesh(spGeometry, spMaterial);   
    spMesh.position.set(points[i], points[i+1], points[i+2]);
    spGroup.add(spMesh);
  };
  // add the points as a group to the scene
  scene.add(spGroup);  
}



render();
function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera) // Render scene
}