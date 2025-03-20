let xAvatar = 300;
let yAvatar = 500;
let yVelocity = 0;
let gravity = 0.5;
let jumpStrength = 10;
let groundLevel = 500;
let canJump = true;
let xVelocity = 0;
let maxSpeed = 2;
let acceleration = 0.1;
let friction = 0.2;
let platforms = [{x: 200, y: 425, width: 150, height: 10, stable: true}, 
{x: 435, y: 360, width: 200, height: 10, stable: true, timeOn: 0},
{x: 300, y: 275, width: 100, height: 10, stable: true, timeOn: 0},
{x: 600, y: 400, width: 200, height: 10, stable: true, timeOn: 0},
{x: 200, y: 200, width: 150, height: 10, stable: true, timeOn: 0},
{x: 200, y: 125, width: 150, height: 10, stable: true, timeOn: 0},
{x: 500, y: 275, width: 150, height: 10, stable: false, timeOn: 0}];
let rain = 0;
let wind = 1;
let currentTime = 0;
let mistIntensitySlider;
let mistColor;
let windEffect = [];
let rainEffect = [];

//character additions
let framesIdle = 4;
let currentFrame = 0;
let idleImages = [];
let characterIdle;
let counter = 0;
let t = 40;
let currentImg;
let sizeAvatar = 100;

function preload(){
    for (let i = 1; i < 5; i++) {
    idleImages[i] = loadImage('/data/Idle' + i + '.png');
    }
  }

function setup() {
  createCanvas(600, 600);
  sliderFriction = createSlider(1, 20);
  sliderFriction.position(65, 78);
  sliderFriction.size(100);
  sliderWind = createSlider(-2, 2, 0.1, 0);
  sliderWind.position(65, 93);
  sliderWind.size(100);  
  sliderMist = createSlider(0, 255, 50);
  sliderMist.position(65, 108);
  sliderMist.size(100);
  sliderMistColor = createSlider(0, 255, 150);
  sliderMistColor.position(75, 123);
  sliderMistColor.size(90);
  sliderRain = createSlider(0, 2, 0, 0);
  sliderRain.position(65, 138);
  sliderRain.size(100);
  
}


function draw() {
  background(133, 194, 230); 
  textSize(10);
  currentTime = (millis())/1000;
  rain = sliderRain.value();
  friction = sliderFriction.value()/100;
  wind = sliderWind.value();
  mist = sliderMist.value();
  mistColor = sliderMistColor.value();
  avatarIdle(xAvatar, yAvatar);
  drawPlatforms();
  xAvatar = avatarMovementHorisontal(xAvatar);
  yAvatar = avatarMovementVertical(yAvatar);
  groundLevel = platformPhysics();
  windEffectInitiate();
  windEffects();
  rainEffectInitiate();
  rainEffects();
  mistGeneration();
  stroke(0);
  strokeWeight(2);
  fill('white');
  text(`x: ${mouseX}`, 10, 15);
  text(`y: ${mouseY}`, 10, 30);
  text(`xAvatar: ${int(xAvatar)}`, 10, 45);
  text(`yAvatar: ${int(yAvatar)}`, 10, 60);
  text(`xVelocity: ${round(xVelocity, 2)}`, 10, 75);
  text(`Friction: ${friction}`, 10, 90);
  text(`Wind: ${round(wind, 2)}`, 10, 105);
  text(`Mist: ${round(mist, 2)}`, 10, 120);
  text(`MistColor: ${round(mistColor, 2)}`, 10, 135);
  text(`Time: ${int(currentTime)}`, 550, 15);
  text(`Rain: ${round(rain, 2)}`, 10, 150);

  console.log(keyCode);
}

function avatarIdle(x, y){
    if (counter < idleImages.length - 1){
      counter++;
    } else {
      counter = 1;
    }
    let currentImg = idleImages[counter];
    
    image(currentImg, x-45, y-sizeAvatar+4, sizeAvatar, sizeAvatar);
    //setTimeout(avatar, t);
    
  }

/*function avatar(x, y) {
  beginShape()
  fill(225, 172, 150);
  circle(x, y-45, 40);
  strokeWeight(5);
  stroke(0, 96, 255);
  line(x, y-45, x, y);
  endShape();
}*/

function windEffectInitiate(){
  let windClean = Math.floor(Math.abs(wind) * 25);
  if (wind >= 0) {
    while (windEffect.length <= windClean) {
      for (let i = 0; i <= wind * 25; i++) {
        let startX = random(-100, 500);
        let startY = random(20, 580);
        let vinden = {startX: startX, startY: startY, slutX: startX + wind * 25, slutY: startY};
        windEffect.push(vinden);
      }
    }
    while (windEffect.length > windClean) {
      windEffect.pop();
    }
  }
  if (wind < 0) {
    while (windEffect.length <= windClean) {
      for (let i = 0; i <= -wind * 25; i++) {
        let startX = random(-100, 500);
        let startY = random(20, 580);
        let vinden = {startX: startX, startY: startY, slutX: startX + wind * 25, slutY: startY};
        windEffect.push(vinden);
      }
    }
    while (windEffect.length > windClean) {
      windEffect.pop();
    }
  }
}

function windEffects() {
  stroke(100, 30);
  strokeWeight(1.5);

  for (let i = windEffect.length - 1; i >= 0; i--) {
    let luft = windEffect[i];

    luft.startX += (wind * 10) - xVelocity;
    luft.slutX += (wind * 10) - xVelocity;
    luft.startY += random(-0.8, 0.8);
    luft.slutY = luft.startY;

    if (wind >= 0 && luft.startX > 599) {
      luft.startX = -random(0, 100);
      luft.slutX = luft.startX + 50;
      luft.startY = random(20, 580);
      luft.slutY = luft.startY;
    } else if (wind < 0 && luft.startX < 0) {
      luft.startX = random(600, 700);
      luft.slutX = luft.startX + 50;
      luft.startY = random(20, 580);
      luft.slutY = luft.startY;
    }
    
    line(luft.startX, luft.startY, luft.slutX, luft.slutY);
  }
}

function rainEffectInitiate(){
  let rainClean = Math.floor(Math.abs(rain) * 50);
  if (rain >= 0) {
    while (rainEffect.length < rainClean) {
    let startX = random(0 - wind * 110, 600);
    let startY = random(0, 600);
    let regnen = {startX: startX, startY: startY, slutX: startX + (wind * 5), slutY: startY + 15};
    rainEffect.push(regnen);
}

    while (rainEffect.length > rainClean) {
      rainEffect.pop();
    }
  }
}

function rainEffects() {
  stroke(25,41,144, 200);
  strokeWeight(1.5);
  

  for (let i = rainEffect.length - 1; i >= 0; i--) {
    let regn = rainEffect[i];

    regn.startX += (wind * 10);
    regn.slutX = regn.startX + (wind * 5);
    regn.startY += 30;
    regn.slutY = regn.startY + 15;

    if (rain > 0 && regn.startX >= 599) {
      regn.startX = random(0 - wind * 200, 600);
      regn.slutX = regn.startX + wind * 5;
      regn.startY = 0;
      regn.slutY = regn.startY + 15;
    } 
    
    line(regn.startX, regn.startY, regn.slutX, regn.slutY);
  }
}


function drawPlatforms() {
  fill(150, 75, 0);
  stroke('black');
  for (let platform of platforms) {
    rect(platform.x, platform.y, platform.width, platform.height);
  }
  if (xAvatar < width/2) {
    for (let platform of platforms) {
      platform.x -= xVelocity
      xAvatar = width/2
    }
  } if (xAvatar > width/2) {
    for (let platform of platforms) {
      platform.x -= xVelocity
      xAvatar = width/2
    }
  } 
}



function avatarMovementHorisontal(x) {
  let movingLeft = keyIsDown(65);
  let movingRight = keyIsDown(68);

  if (yAvatar < groundLevel) { //Wind!!! Påvirker xAvatar baseret på hvor meget vind der er. 
    if (!movingLeft && !movingRight) {      
    xVelocity += wind * 0.2;
    } else if (movingLeft && wind > 0) {
      xVelocity += wind * 0.1;
    } else if (movingRight && wind < 0) {
      xVelocity += wind * 0.1;
    } else {
      xVelocity += wind * 0.15;
    }
  } if (movingLeft && xVelocity > 0) { //Ændrer tempo baseret på hvilken retning man vil gå
    xVelocity -= acceleration * 3;
  } else if (movingRight && xVelocity < 0) {
    xVelocity += acceleration * 3;
  } else {
    if (movingLeft) {
      xVelocity -= acceleration;
    } if (movingRight) { 
      xVelocity += acceleration;
    }
  }
  xVelocity = constrain(xVelocity, -maxSpeed, maxSpeed); //Sætter en constraint omkring at xVelocity ikke kan være større eller mindre maxSpeed
  if (!movingLeft && !movingRight) { //Tilsætter friction til når man stopper med at løbe. 
    if (xVelocity > 0) {
      xVelocity = max(0, xVelocity - friction);
    } else if (xVelocity < 0) {
      xVelocity = min(0, xVelocity + friction);
    }
    } if (maxSpeed > 4) { //Gør at når man sprinter at maxspeed kun kan være højest 4.
      maxSpeed = 4;
    } if (maxSpeed < 2) {
      maxSpeed = 2;
    } if (keyIsDown(16) === true){ //Gør at hvis shift, holdes nede kan man få en højere topfart
      maxSpeed += 0.5;
    } else if (maxSpeed > 2){
      maxSpeed -= 0.05;
  }  return x + xVelocity;
} 


function avatarMovementVertical(y) { //Hoppefunktion
  if (keyIsDown (32) === true && canJump === true) { //Tjekker om man hopper/og at man kan
    yVelocity = -jumpStrength;
    canJump = false;
  } yVelocity += gravity;
  y += yVelocity
  if (y >= groundLevel) {
    y = groundLevel;
    yVelocity = 0;
    canJump = true;
  } if (yVelocity > 0){
    canJump = false;
  } if (keyIsDown (83) === true && groundLevel <= 500){//Gør at man kan "droppe" ned fra platforme
    y += 0.1
  }
  return y
}


function platformPhysics() {
  let newGroundLevel = 500; 
  for (let i = platforms.length - 1; i >= 0; i--) {
    let platform = platforms[i];
    if (yAvatar + yVelocity >= platform.y && yAvatar <= platform.y && xAvatar >= platform.x && xAvatar < platform.x + platform.width) {
      newGroundLevel = platform.y;
      if (!platform.stable) {
        if (platform.timeOn === 0) {
          platform.timeOn = millis(); // Starter en timer hvis platformen er false i stable value
        } if (millis() - platform.timeOn >= 1000) { //Når timeren rammer 3 sekunder starter dette statement
          platforms.splice(i, 1); // Fjerner platformen fra arrayen
        }
      }
    } else {
      platform.timeOn = 0; //Hvis man går væk fra platformen, så starter timeren forfra.
    }
  } return newGroundLevel;
}

function mistGeneration() {
  let mistGradient = mist/50 
  for (let i = 0; i < 51; i++){
    if (i == 50){
      strokeWeight(3.122/2);
      circle(xAvatar, yAvatar - 40, i*6 - 1.5)
      
    } else {
   noFill();
   stroke(mistColor, mistGradient*i);
   strokeWeight(3.122);
   circle(xAvatar, yAvatar - 40, i*6)
  }
  }
    
    
  
  noStroke();
  fill(mistColor, mist); 
  beginShape();
  
  vertex(0, 0);
  vertex(xAvatar, 0);
  for (let angle = PI/2; angle <= 5*PI/2; angle += 0.1){
    let xOffset = cos(angle) * (300/2);
    let yOffset = sin(angle) * (300/2);
    vertex(xAvatar + xOffset, yAvatar - 40 - yOffset);
  } vertex(xAvatar, yAvatar - 190);
  vertex(xAvatar, 0);
  vertex(600, 0);
  vertex(600, 600);
  vertex(0, 600);
  
  
  endShape(CLOSE);
}
