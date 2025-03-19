let framesIdle = 4;
let currentFrame = 0;
let idleImages = [];
let characterIdle;
let counter = 0;
let t = 240;
let currentImg;

function preload(){
  for (let i = 1; i < 5; i++) {
  idleImages[i] = loadImage('/data/Idle' + i + '.png');
  }
}

function setup() {
  createCanvas(windowHeight, windowWidth);
  addIdle();
}

function addIdle(){
  if (counter < idleImages.length - 1){
    counter++;
  } else {
    counter = 1;
  }
  let currentImg = idleImages[counter];
  
  image(currentImg, 100, 100);
  
  setTimeout(clear, t);
  
  setTimeout(addIdle, t);
  console.log(counter);
}

function draw() {

}

  
