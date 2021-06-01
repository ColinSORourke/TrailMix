let config = {
    type: Phaser.WEBGL,
    width: 1024,
    height: 768,
    render: {
      pixelArt: true,
    },
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
    scene: [Preload, Menu, PlayTile, Pause],
  }

let game = new Phaser.Game(config);

// reserve keyboard variables
let keyA, keyD, keyLEFT, keyRIGHT, keyW, keyS, keyUP, keyDown, keySPACE, keyF;
let cursors;

// global variables and function
// variables and settings
ACCELERATION = 500;
MAX_X_VEL = 200;   // pixels/second
MAX_Y_VEL = 800;
DRAG = 1600;    // DRAG < ACCELERATION = icy slide
JUMP_VELOCITY = -250;

const SCALE = 0.5;
const tileSize = 35;

// Player's known ingredients | Note: proper format for this map
// this.known.set(key: 'Name of powerup', value: ['Name of first Ingredient', 'Name of second Ingredients']);
let known = new Map();