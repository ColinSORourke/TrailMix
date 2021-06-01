class Controls extends Phaser.Scene {
    constructor() {
      super("controlsScene");
    }

    preload() {
    }

    create() {
        this.add.bitmapText(game.config.width/2, game.config.height/3 - 150, 'gem', 'CONTROLS:', 48).setOrigin(0.5);

        // Menu 
        let MenuButton = this.add.bitmapText(game.config.width/2, game.config.height/2 + 150, 'gem', 'Back', 40).setOrigin(0.5);

        // Menu Button
        MenuButton.setInteractive();
        MenuButton.on('pointerdown', () => {
        this.scene.start('menuScene');
        });
    }
}