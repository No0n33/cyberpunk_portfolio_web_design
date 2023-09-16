// //three.js import

import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

//create three.js scene
const scene = new THREE.Scene();
//create a new camera with positions and angels
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

//keep the 3d object on a global variable so we can acess it later
let object;
//OrbitControls allow the camera to move around the scene
let controls;
//Set which object to render
let objToRender = "car";
//INstantiate a lodaer for the .gltf file
const loader = new GLTFLoader();

//load the file
loader.load(
  "3d_render/cyberpunk_car_gltf/scene.gltf",
  function (gltf) {
    //If the file is loaded add it to the scene
    object = gltf.scene;
    scene.add(gltf.scene);
  },
  function (xhr) {
    //While file is loading show progress
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  function (error) {
    //if error, log it
    console.error(error);
  }
);

//instantiate a new renderer and set its size
const renderer = new THREE.WebGLRenderer({ alpha: true });
//Alpha: true allows for the transparent background
renderer.setSize(window.innerWidth, window.innerHeight);

//add the element to the DOM
document.getElementById("container3D").appendChild(renderer.domElement);

//Set how far the camera will be from 3d model
camera.position.z = objToRender == "dino" ? 25 : 500;

//Add lights to the scene
const topLight = new THREE.DirectionalLight(0xffffff, 1); //(control, intensity)
topLight.position.set(500, 500, 500); //top-left-ish
topLight.castShadow = true;
scene.add(topLight);

const ambientLight = new THREE.AmbientLight(
  0x333333,
  objToRender == "dino" ? 5 : 1
);
scene.add(ambientLight);

//render the scene
function animate() {
  requestAnimationFrame(animate);
  //here we could add some code to update the scene, adding some automatic movement
}

//add eventlistener to the window, so we can resize thje window and the camera
window.addEventListener("resize", function () {
  camera.ascpet = window.innerWidth / this.window.innerHeight;
  camera.updateProjectionMatrix();
  render.setSize(window.innerWidth, window.innerHeight);
});

//start the 3d adnimation
animate();
/////////////////////////
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
