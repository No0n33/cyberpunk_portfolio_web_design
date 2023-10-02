/////////////////////////carousel\\\\\\\\\\\\\\\\\\\\\\\\\\\\
const galleryContainer = document.querySelector(".gallery-container");
const galleryControlsContainer = document.querySelector(".gallery-controls");
const galleryControls = ["previous", "next"];
const galleryItems = document.querySelectorAll(".gallery-item");

class Carousel {
  constructor(container, items, controls) {
    this.carouselContainer = container;
    this.carouselControls = controls;
    this.carouselArray = [...items];
  }

  updateGallery() {
    this.carouselArray.forEach((el) => {
      el.classList.remove("gallery-item-1");
      el.classList.remove("gallery-item-2");
      el.classList.remove("gallery-item-3");
      el.classList.remove("gallery-item-4");
      el.classList.remove("gallery-item-5");
    });
    this.carouselArray.slice(0, 5).forEach((el, i) => {
      el.classList.add(`gallery-item-${i + 1}`);
    });
  }

  setCarouselState(direction) {
    if (direction.className == "gallery-controls-previous") {
      this.carouselArray.unshift(this.carouselArray.pop());
    } else {
      this.carouselArray.push(this.carouselArray.shift());
    }
    this.updateGallery();
  }

  setControls() {
    this.carouselControls.forEach((control) => {
      galleryControlsContainer.appendChild(
        document.createElement("button")
      ).className = `gallery-controls-${control}`;
      document.querySelector(`.gallery-controls-${control}`).innerText =
        control;
    });
  }
  useControls() {
    const triggers = [...galleryControlsContainer.childNodes];
    triggers.forEach((control) => {
      control.addEventListener("click", (e) => {
        e.preventDefault();
        this.setCarouselState(control);
      });
    });
  }
}

const exampleCarousel = new Carousel(
  galleryContainer,
  galleryItems,
  galleryControls
);

exampleCarousel.setControls();
exampleCarousel.useControls();

//3d render three.js
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader";

const renderer = new THREE.WebGLRenderer({ alpha: true });

//width of the rendered model
const smallerWidth = 700;
// //height of the rendered model
const smallerHeight = 350;
//setting smaller "window"
renderer.setSize(smallerWidth, smallerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

document.getElementById("container3D").appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(-300, 190, -310);
camera.lookAt(0, 0, 0);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; //making camera move smoother
controls.enablePan = false; //turning sidewats movement of camera
controls.minDistance = 235; //min distane which camera can be close to object
controls.maxDistance = 800; //max distane from camera to object
controls.minPolarAngle = 0.5; //min angle to limit the down movement of camera
controls.maxPolarAngle = 1.5; // max angle to limit the up movement of camera
controls.autoRotate = false; //auto rotation of camera
controls.target = new THREE.Vector3(0, -50, 0); //points in which camera is looking
controls.update();

const topLight = new THREE.DirectionalLight(0xffffff, 5); //(control, intensity)
topLight.position.set(1500, 1500, 500); //top-left-ish
topLight.castShadow = true;
scene.add(topLight);

//Instantiate a lodaer for the .gltf file
const loader = new GLTFLoader().setPath("3d_render/cyberpunk_car_gltf/");
loader.load("scene.gltf", (gltf) => {
  let object = gltf.scene;
  object.position.set(0, 0, 0);
  object.scale.set(0.85, 0.85, 0.85);
  scene.add(object);
});

//ground
const planeGeometry = new THREE.CircleGeometry(220, 32);
const planeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
plane.position.y = 0;
scene.add(plane);

//render the scene
function animate() {
  console.log("Animation frame!");
  requestAnimationFrame(animate);
  //here we could add some code to update the scene, adding some automatic movement
  renderer.render(scene, camera);
}

//add eventlistener to the window, so we can resize the window and the camera
window.addEventListener("resize", () => {
  const width = window.innerWidth;
  const height = window.innerHeight;

  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});

//start the 3d adnimation
animate();
