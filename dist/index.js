// //three.js import

import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

//instantiate a new renderer and set its size
//Alpha: true allows for the transparent background
const renderer = new THREE.WebGLRenderer({ alpha: true });

//width of the rendered model
const smallerWidth = 700;
//height of the rendered model
const smallerHeight = 350;
//setting smaller "window"
renderer.setSize(smallerWidth, smallerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

//add the element to the DOM
document.getElementById("container3D").appendChild(renderer.domElement);

//create three.js scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xa0a0a0);
//create a new camera with positions and angels
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

//Set how far the camera will be from 3d model
camera.position.set(-300, 190, -310);
camera.lookAt(0, 0, 0);

////////////////~~CONTROL/MOVEMENT~~////////////////
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; //making camera move smoother
controls.enablePan = false; //turning sidewats movement of camera
controls.minDistance = 235; //min distane which camera can be close to object
// controls.maxDistance = 20; //max distane from camera to object
// controls.minPolarAngle = 0.5; //min angle to limit the down movement of camera
// controls.maxPolarAngle = 1.5; // max angle to limit the up movement of camera
controls.autoRotate = false; //turning off auto rotation of camera
controls.targer = new THREE.Vector3(0, 1, 0); //points in which camera is looking
//updateing all set ups above
controls.update();

//Add lights to the scene
const topLight = new THREE.DirectionalLight(0xffffff, 5); //(control, intensity)
topLight.position.set(1500, 1500, 500); //top-left-ish
topLight.castShadow = true;
scene.add(topLight);

//INstantiate a lodaer for the .gltf file
const loader = new GLTFLoader().setPath("3d_render/cyberpunk_car_gltf/");
//load the file
loader.load("scene.gltf", (gltf) => {
  //If the file is loaded add it to the scene
  let object = gltf.scene;
  object.position.set(0, 0, 0);
  object.scale.set(0.75, 0.75, 0.75);
  scene.add(object);
});

//render the scene
function animate() {
  requestAnimationFrame(animate);
  //here we could add some code to update the scene, adding some automatic movement
  renderer.render(scene, camera);
}

//add eventlistener to the window, so we can resize the window and the camera
window.addEventListener("resize", function () {
  camera.ascpet = window.innerWidth / this.window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

//start the 3d adnimation
animate();

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
