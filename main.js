import * as THREE from "three";
import * as dat from 'dat.gui';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import Stats from 'three/examples/jsm/libs/stats.module'

let camera, scene, renderer, controls, stats, gui;

let world = {
  driver_select: {
    mesh: null,
    width: 1.8,
    height: 2.1,
    depth: 0.8,
    x: 0,
    y: 0,
    z: -5
  },
  wheel_select: {
    mesh: null,
    width: 2.2,
    height: 0.3,
    depth: 2.3,
    x: 0,
    y: -1,
    z: -4
  },
};
const pointer = new THREE.Vector2();

init()
renderer.render( scene, camera );
animate();

function generateWheel(){
  world.wheel_select.mesh.geometry.dispose()
  world.wheel_select.mesh.geometry = new THREE.BoxGeometry(world.wheel_select.width, world.wheel_select.height, world.wheel_select.depth)
  world.wheel_select.mesh.position.x = world.wheel_select.x 
  world.wheel_select.mesh.position.y = world.wheel_select.y 
  world.wheel_select.mesh.position.z = world.wheel_select.z 
}

function generateDriver(){
  world.driver_select.mesh.geometry.dispose()
  world.driver_select.mesh.geometry = new THREE.BoxGeometry(world.driver_select.width, world.driver_select.height, world.driver_select.depth)
  world.driver_select.mesh.position.x = world.driver_select.x 
  world.driver_select.mesh.position.y = world.driver_select.y 
  world.driver_select.mesh.position.z = world.driver_select.z 
}

function init() {
  gui = new dat.GUI()
  gui.add(world.wheel_select, 'width', 0.1, 5).onChange(generateWheel)
  gui.add(world.wheel_select, 'height', 0.1, 5).onChange(generateWheel)
  gui.add(world.wheel_select, 'depth', 0.1, 5).onChange(generateWheel)
  gui.add(world.wheel_select, 'x', -10.0, 10.0).onChange(generateWheel)
  gui.add(world.wheel_select, 'y', -10.0, 10.0).onChange(generateWheel)
  gui.add(world.wheel_select, 'z', -10.0, 10.0).onChange(generateWheel)

  // Initial setup
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(devicePixelRatio)
  document.body.appendChild(renderer.domElement);
  
  // Add Axes
  const axesHelper = new THREE.AxesHelper( 5 );
  scene.add( axesHelper );
  
  // Camera movement and position
  controls = new OrbitControls( camera, renderer.domElement );
  camera.position.set(-4,3,-10); // Set position like this
  camera.lookAt(new THREE.Vector3(0,0,0)); // Set look at coordinate like thiscontrols.update();
  
  // wheel_select
  const geometry = new THREE.BoxGeometry(world.wheel_select.width, world.wheel_select.height, world.wheel_select.depth)
  const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
  world.wheel_select.mesh = new THREE.Mesh( geometry, material );
  scene.add( world.wheel_select.mesh );
  generateWheel()

  // driver_select
  const geometry_driver = new THREE.BoxGeometry(world.driver_select.width, world.driver_select.height, world.driver_select.depth)
  world.driver_select.mesh = new THREE.Mesh( geometry, material );
  scene.add( world.driver_select.mesh );
  generateDriver()


  // Train model
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
  
  // Light
  const light = new THREE.PointLight(0xffffff, 1, 100)
  light.position.set(-4,2,-8)
  scene.add(light)
  scene.add( new THREE.PointLightHelper( light, 0.1 ) );

  // FPS
  stats = Stats()
  document.body.appendChild(stats.dom)

  // Event Listeners
  document.addEventListener( 'mousemove', onPointerMove );
	window.addEventListener( 'resize', onWindowResize );
}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}

function onPointerMove( event ) {
  pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

function animate() {
  requestAnimationFrame( animate );
  controls.update();
  renderer.render( scene, camera );
  stats.update()
};


/**
 * Detetar onde está o rato
 * https://threejs.org/examples/#webgl_interactive_cubes_gpu
 * 
 */