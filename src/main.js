let config = {
    type: Phaser.WEBGL,
    width: 1000,
    height: 750,
    scene: [Play],
  }

let game = new Phaser.Game(config);

// reserve keyboard variables
let keyA, keyD, keyLEFT, keyRIGHT, keyW, keyS, keyUP, keyDown;