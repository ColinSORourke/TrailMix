class Menu extends Phaser.Scene {
    constructor() {
      super("menuScene");
    }
    
    create() {
        // Menu Config
      let menuConfig = {
        fontFamily: 'Garamond',
        fontSize: '28px',
        color: '#FFFFFF',
        align: 'right',
        padding: {
            top: 5,
            bottom: 5
        },
        fixedWidth: 0
    }

    // Intructions
    this.add.bitmapText(game.config.width/2, game.config.height/2 - 200, 'gem', 'F: Mix the ingredients', 64).setOrigin(0.5);
    this.add.bitmapText(game.config.width/2, game.config.height/2 - 100, 'gem', 'D: Use the power', 64).setOrigin(0.5);


    // Play
    //menuConfig.fontSize = "128px";
    let startButton = this.add.bitmapText(game.config.width/2, game.config.height/2 + 150, 'gem', 'PLAY', 128).setOrigin(0.5);

    // How to win this 'build'
    //menuConfig.fontSize = "28px";
    this.add.bitmapText(game.config.width/2, game.config.height/2 + 250, 'gem', "You need to cross the massive gap to win", 28).setOrigin(0.5);

    // Start Button
    startButton.setInteractive();
    startButton.on('pointerdown', () => {
      this.scene.start('playTileScene', "TiledTestJSON");
    });
  }
}