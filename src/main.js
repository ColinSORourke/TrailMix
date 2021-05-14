let config = {
    type: Phaser.WEBGL,
    width: 1000,
    height: 750,
    physics: {
      default: 'arcade',
      arcade: {
          debug: true,
          gravity: {
              x: 0,
              y: 3000
          }
      }
  },
    scene: [Menu, Level1, Level2],
  }

let game = new Phaser.Game(config);

// reserve keyboard variables
let keyA, keyD, keyLEFT, keyRIGHT, keyW, keyS, keyUP, keyDown;
let cursors;

// global variables and function
// variables and settings
let ACCELERATION = 500;
let MAX_X_VEL = 500;   // pixels/second
let MAX_Y_VEL = 5000;
let DRAG = 600;    // DRAG < ACCELERATION = icy slide
let JUMP_VELOCITY = -1000;

const SCALE = 0.5;
const tileSize = 35;
