import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls( camera, renderer.domElement );

camera.position.set(-4,3,-10); // Set position like this
camera.lookAt(new THREE.Vector3(0,0,0)); // Set look at coordinate like thiscontrols.update();

const loader = new GLTFLoader();

loader.load(
  "models/train/scene.gltf",
  function (gltf) {
    scene.add(gltf.scene);
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  function (error) {
    console.error(error);
  }
);

const light = new THREE.PointLight(0xffffff, 1, 100)
light.position.set(-4,2,-8)
scene.add(light)

scene.add( new THREE.PointLightHelper( light, 0.1 ) );

renderer.render( scene, camera );

function animate() {
  requestAnimationFrame( animate );
  controls.update();
  renderer.render( scene, camera );
};

animate();

/**
 * Detetar onde está o rato
 * https://threejs.org/examples/#webgl_interactive_cubes_gpu
 * 
 */