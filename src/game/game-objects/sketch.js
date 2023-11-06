// Angry Birds with Matter.js
// The Coding Train / Daniel Shiffman
// https://thecodingtrain.com/challenges/content/videos/challenges/138-angry-birds-with-matterjs
// https://youtu.be/TDQzoe9nslY

// Code from Challenge: https://editor.p5js.org/codingtrain/sketches/UOR4nIcNS

const { Engine, World, Bodies, Mouse, MouseConstraint, Constraint } = Matter;

let ground;
let leftWall;
let rightWall;
let topWall;
const boxes = [];
let bird;
let world, engine;
let mConstraint;
let slingshot;

let dotImg;
let boxImg;
let bkgImg;
let birdGIF;

function preload() {
  birdGIF = loadImage('images/bird2.gif');
  dotImg = loadImage('images/Empty.png');
  boxImg = loadImage('images/box.jpeg');
  bkgImg = loadImage('images/background.jpeg');
}

function setup() {
  const canvas = createCanvas(711, 800);
  engine = Engine.create();
  world = engine.world;
  ground = new Ground(width / 2, height - 10, width, 20);
  leftWall = new Ground(5, height / 2, 10, height);
  rightWall = new Ground(width - 5, height / 2, 10, height);
  topWall = new Ground(width / 2, 5, width, 10);  

  for (let i = 0; i < 3; i++) {
    boxes[i] = new Box(450, 300 - i * 75, 84, 100);
  }
    bird = new Bird(150, 500, 25);

  slingshot = new SlingShot(150, 500, bird.body);

  const mouse = Mouse.create(canvas.elt);
  const options = {
    mouse: mouse
  };

  // A fix for HiDPI displays
  mouse.pixelRatio = pixelDensity();
  mConstraint = MouseConstraint.create(engine, options);
  World.add(world, mConstraint);
}

function keyPressed() {
  if (key == ' ') {
    
    World.remove(world, bird.body);
    let new_x_position = Math.floor(Math.random() * 400 + 100); //generates number between 1 and 500

    bird = new Bird(new_x_position, 500, 25);
    slingshot = new SlingShot(new_x_position, 500, bird.body);
    slingshot.attach(bird.body);
  }
}

function mouseReleased() {
  setTimeout(() => {
    slingshot.fly();
  }, 100);
}

function draw() {
  background(bkgImg);
  Matter.Engine.update(engine);
  ground.show();
  for (let box of boxes) {
    box.show();
  }
  slingshot.show();
  image(birdGIF, bird.body.position.x - 60, bird.body.position.y - 60, bird.r * 5, bird.r * 5);
  bird.show();
}