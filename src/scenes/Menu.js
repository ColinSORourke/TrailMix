class Menu extends Phaser.Scene {
    constructor() {
      super("menuScene");
    }

    preload() {
      // Load char atlas
      this.load.atlas('Scout', './assets/ScoutAtlas.png', './assets/ScoutAtlas.json')
      // Load sfx
      //this.load.audio('sfx_', './assets/sfx/.wav');
      this.load.audio('sfx_jump', './assets/sfx/Jump.wav');
      this.load.audio('sfx_banana', './assets/sfx/Banana.wav');
      this.load.audio('sfx_nut', './assets/sfx/Nut.wav');
      this.load.audio('sfx_raisin', './assets/sfx/Raisin.wav');
      this.load.audio('sfx_chocolate', './assets/sfx/Chocolate.wav');
      this.load.audio('sfx_mixing', './assets/sfx/Mixing.wav');
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
    this.add.text(game.config.width/2, game.config.height/2, "F: Mix the ingredients", menuConfig).setOrigin(0.5);
    this.add.text(game.config.width/2, game.config.height/2 + 50, "D: Use the power", menuConfig).setOrigin(0.5);


    // Play
    menuConfig.fontSize = "128px";
    let startButton = this.add.text(game.config.width/2, game.config.height/2 + 150, 'PLAY', menuConfig).setOrigin(0.5);

    // How to win this 'build'
    menuConfig.fontSize = "28px";
    this.add.text(game.config.width/2, game.config.height/2 + 250, "You need to cross the massive gap to win", menuConfig).setOrigin(0.5);

    // Start Button
    startButton.setInteractive();
    startButton.on('pointerdown', () => {
      this.scene.start('level1Scene');
    });}
}