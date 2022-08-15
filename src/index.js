import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { cube, moveCube, cubeBBox, updateCubeBBox } from './cube';
import { wallRight, wallRBBox } from './wallRight';
import { wallLeft, wallLBBox } from './wallLeft';
import { floor, floorBBox } from './floor'
import { ceiling, ceilingBBox} from './ceiling';
import { tower, towerBBox, updateTowerBBox } from './blocks';

document.addEventListener("DOMContentLoaded", () => {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x7c8291);

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement)

  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
  camera.position.z = 13;
  
  // Resizes the game display whenever the size of the window changes
  window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  })

  // Objects
  tower.position.set(0, -5, 0);

  scene.add(cube);
  scene.add(wallRight);
  scene.add(wallLeft);
  scene.add(floor);
  scene.add(ceiling);
  scene.add(tower);
  
  // Helpers;
  const gridHelper = new THREE.GridHelper( 200, 50);
  scene.add(gridHelper);
  
  const controls = new OrbitControls(camera, renderer.domElement);
  
  const ambientLight = new THREE.AmbientLight(0xffffff);
  // pointLight.position.set(5, 5, 5);
  // const lightHelper = new THREE.PointLightHelper(pointLight);
  scene.add(ambientLight);
  // scene.add(lightHelper);

  // Bounding boxes;
  const cubeBBoxHelper = new THREE.Box3Helper( cubeBBox, 0x000000);
  scene.add(cubeBBoxHelper);
  
  const floorBBoxHelper = new THREE.Box3Helper( floorBBox, 0xffffff );
  scene.add(floorBBoxHelper);

  const ceilingBBoxHelper = new THREE.Box3Helper( ceilingBBox, 0xffffff );
  scene.add(ceilingBBoxHelper);

  const wallRBBoxHelper = new THREE.Box3Helper( wallRBBox, 0xffffff );
  scene.add(wallRBBoxHelper);

  const wallLBBoxHelper = new THREE.Box3Helper( wallLBBox, 0xffffff);
  scene.add(wallLBBoxHelper);

  // Have to call update{Block} because we set the position in the index file
  const towerBBoxHelper = new THREE.Box3Helper( towerBBox, 0x000000 )
  updateTowerBBox();
  scene.add(towerBBoxHelper);

  // Testing
  // window.cube = cube;
  // window.wallRight = wallRight;
  // window.a = new THREE.Vector3();
  // window.cubeBBoxHelper = cubeBBoxHelper;
  // 
  // window.cubeBBox = cubeBBox;
  // window.wallRBBox = wallRBBox;


  let nonPlayer = [wallLBBox, wallRBBox, floorBBox, ceilingBBox, towerBBox];
  
  function animate() {
		requestAnimationFrame( animate );

    moveCube(nonPlayer);
		renderer.render( scene, camera );
	};

	animate();
	
  renderer.render(scene, camera);
})
