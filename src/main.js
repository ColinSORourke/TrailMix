// ================================================================================================================
//  Scroggin
//  By Colin O'Rourke, Daniel Aughenbaugh, & Dennis Zabluda
//  Date Completed: Monday June 7th
//
//  Citations:
//
//  The ambient forest and wind sounds were used with permission from BurghRecords at the following links:
//  https://www.youtube.com/watch?v=wT2O-Egt_Hc
//  https://www.youtube.com/watch?v=2YuvPtsa91I
//
//  The pixel art animations of the game were inspired by the following:
//  https://appsandmojo.itch.io/character-template-animation-pack
//  https://pixelvspixel.itch.io/pixel-art-character-for-platformer-games
//  https://rvros.itch.io/animated-pixel-hero
//
// ================================================================================================================


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
          debug: false,
          gravity: {
              x: 0,
              y: 0,
          }
      }
  },
    scene: [Preload, Menu, PlayTile, Pause, Controls, Credits, Ending],
  }

let game = new Phaser.Game(config);

// reserve keyboard variables
let keyA, keyD, keyLEFT, keyRIGHT, keyW, keyS, keyUP, keyDown, keySPACE, keyF, keyR;
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

// If player is entering the controls (setting) scene
let enterFromGame = false;