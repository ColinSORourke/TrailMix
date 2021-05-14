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
              y: 0
          }
      }
  },
    scene: [Play],
  }

let game = new Phaser.Game(config);

// reserve keyboard variables
let keyF, keyD, keySPACE;
let cursors;