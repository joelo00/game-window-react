// Angry Birds with Matter.js
// The Coding Train / Daniel Shiffman
// https://thecodingtrain.com/challenges/content/videos/challenges/138-angry-birds-with-matterjs
// https://youtu.be/TDQzoe9nslY

// Code from Challenge: https://editor.p5js.org/codingtrain/sketches/UOR4nIcNS



class Ground extends Box {
    constructor(x, y, w, h) {
      super(x, y, w, h);
      this.body.isStatic = true;
    }
  
    show() {
      const pos = this.body.position;
      
      const angle = this.body.angle;
      push();
      translate(pos.x, pos.y);
      rotate(angle);
      noStroke();
      fill(255, 255, 255);
      rectMode(CENTER);
      rect(0, 0, this.w, this.h);
      pop();
    }
  }

