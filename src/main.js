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
              y: 0
          }
      }
  },
    scene: [Play],
  }

let game = new Phaser.Game(config);

// reserve keyboard variables
let keySPACE, keyF, keyD;
let cursors;