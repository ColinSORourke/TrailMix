let config = {
    type: Phaser.WEBGL,
    width: 1000,
    height: 750,
    pixelArt: true,
    physics: {
      default: 'arcade',
      arcade: {
          debug: true,
          gravity: {
              x: 0,
              y: 0,
          }
      }
  },
    scene: [Menu, Level1, Level2],
  }

let game = new Phaser.Game(config);

// reserve keyboard variables
let keyA, keyD, keyLEFT, keyRIGHT, keyW, keyS, keyUP, keyDown, keySPACE, keyF;
let cursors;

// global variables and function
// variables and settings
ACCELERATION = 1000;
MAX_X_VEL = 500;   // pixels/second
MAX_Y_VEL = 5000;
DRAG = 1200;    // DRAG < ACCELERATION = icy slide
JUMP_VELOCITY = -500;

const SCALE = 0.5;
const tileSize = 35;