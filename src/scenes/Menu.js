class Menu extends Phaser.Scene {
    constructor() {
      super("menuScene");
    }

    preload() {
        this.load.atlas('Scout', './assets/ScoutAtlas.png', './assets/ScoutAtlas.json')
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
    // Play
    menuConfig.fontSize = "128px";
    let startButton = this.add.text(game.config.width/2, game.config.height/2 + 150, 'PLAY', menuConfig).setOrigin(0.5);

    // Start Button
    startButton.setInteractive();
    startButton.on('pointerdown', () => {
      this.scene.start('level1Scene');
    });}
}