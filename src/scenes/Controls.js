class Controls extends Phaser.Scene {
    constructor() {
      super("controlsScene");
    }

    preload() {
    }

    create() {
        // Background
        let graphics = this.add.graphics();
        var BackgroundWidth = 600, BackgroundLength = 550;
        graphics.fillStyle(0x000000, 1).fillRoundedRect(game.config.width/2 - BackgroundWidth/2, game.config.height/2 - BackgroundLength/2, BackgroundWidth, BackgroundLength, 8);

        this.add.bitmapText(game.config.width/2, game.config.height/3 - 100, 'gem', 'CONTROLS:', 48).setOrigin(0.5);

        // Add text for controls
        let spaceing = 32;
        this.add.bitmapText(game.config.width/2 - BackgroundWidth/3, game.config.height/3 , 'gem', 'Jump: SPACE', 32).setOrigin(0.5);
        this.add.bitmapText(game.config.width/2 - BackgroundWidth/3, game.config.height/3 + spaceing , 'gem', 'EAT/MIX: F', 32).setOrigin(0.5);
        this.add.bitmapText(game.config.width/2 - BackgroundWidth/3, game.config.height/3 + spaceing*2 , 'gem', 'POWERS: D', 32).setOrigin(0.5);
        this.add.bitmapText(game.config.width/2 - BackgroundWidth/3, game.config.height/3 + spaceing*3 , 'gem', 'Discard: S', 32).setOrigin(0.5);

        // Menu 
        let MenuButton = this.add.bitmapText(game.config.width/2, game.config.height/2 + 150, 'gem', 'Back', 40).setOrigin(0.5);

        // Menu Button
        MenuButton.setInteractive();
        MenuButton.on('pointerdown', () => {
            if(enterFromGame) {
                enterFromGame = false;
                this.scene.start('pauseScene');
            } else {
                this.scene.start('menuScene');
            }
            
        });
    }
}