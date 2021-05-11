let config = {
    type: Phaser.WEBGL,
    width: 2000,
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
let keyA, keyD, keyLEFT, keyRIGHT, keyW, keyS, keyUP, keyDown;
let cursors;