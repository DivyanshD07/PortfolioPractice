import { render } from 'react-dom';
import './style.css'

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding;
camera.position.setZ(30);
camera.position.setX(-3);

renderer.render(scene, camera);


const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshStandardMaterial({ color: 0xFF6347 });
const torus = new THREE.Mesh(geometry, material);

scene.add(torus);

const pointLight = new THREE.PointLight(0xffffff , 10, 5000, 0 );
pointLight.position.set(0,0,0);

const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(pointLight, ambientLight)

// scene.add(pointLight);


//Helpers
const lighthelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(lighthelper, gridHelper);

const controls = new OrbitControls(camera, renderer.domElement);

function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh( geometry, material );

  const [x,y,z] =  Array(3).fill().map(() => THREE.MathUtils.randFloatSpread( 100 ) );
  star.position.set(x,y,z);
  scene.add(star);
}

Array(200).fill().forEach(addStar);

const textureLoader = new THREE.TextureLoader();
const spaceTexture = textureLoader.load('./space.jpg', function(texture){
  texture.encoding = THREE.sRGBEncoding;
  texture.needsUpdate = true;
}
)
scene.background = spaceTexture;


const avatarTexture = new THREE.TextureLoader().load("mypic.jpg");
const avatar = new THREE.Mesh(
  new THREE.BoxGeometry(4,4,4),
  new THREE.MeshBasicMaterial({ map: avatarTexture })
);

scene.add(avatar);


const moonTexture = new THREE.TextureLoader().load('moon.jpg');
const normalTexture = new THREE.TextureLoader().load('normal.jpg');

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3,32,32),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: normalTexture,
  })
);
moon.position.set(-10,0,30);
avatar.position.set(2,0,-5);

scene.add(moon);

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;

  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  avatar.rotation.y += 0.01;
  avatar.rotation.z += 0.01;

  camera.position.z = t * -0.01;
  camera.rotation.x = t * -0.0002;
  camera.rotation.y = t * -0.0002;
}

document.body.onscroll = moveCamera;
moveCamera();


function animate() {
  requestAnimationFrame(animate);

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  avatar.rotation.y += 0.01;

  moon.rotation.x += 0.005;

  // star.rotation.x += 0.0001;
  // star.rotation.y += 0.00005;
  // star.rotation.z += 0.0001;

  // controls.update();

  renderer.render(scene, camera);
}

animate();