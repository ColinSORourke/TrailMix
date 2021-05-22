let config = {
    type: Phaser.WEBGL,
    width: 1024,
    height: 768,
    pixelArt: true,
    physics: {
      default: 'arcade',
      arcade: {
          debug: false,
          gravity: {
              x: 0,
              y: 0,
          }
      }
  },
    scene: [Preload, Menu, Level1, Level2, Pause],
  }

let game = new Phaser.Game(config);

// reserve keyboard variables
let keyA, keyD, keyLEFT, keyRIGHT, keyW, keyS, keyUP, keyDown, keySPACE, keyF;
let cursors;

// global variables and function
// variables and settings
ACCELERATION = 800;
MAX_X_VEL = 300;   // pixels/second
MAX_Y_VEL = 5000;
DRAG = 1600;    // DRAG < ACCELERATION = icy slide
JUMP_VELOCITY = -350;

const SCALE = 0.5;
const tileSize = 35;