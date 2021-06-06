class Ending extends Phaser.Scene {
    constructor() {
        super("endingScene");
    }
    
    preload() {
    }

    create(){
        // Background
        let graphics = this.add.graphics();
        var BackgroundWidth = 600, BackgroundLength = 550;
        graphics.fillStyle(0x000000, 1).fillRoundedRect(game.config.width/2 - BackgroundWidth/2, game.config.height/2 - BackgroundLength/2, BackgroundWidth, BackgroundLength, 8);

        this.add.bitmapText(game.config.width/2, game.config.height/3 - 100, 'gem', 'Ending:', 48).setOrigin(0.5);

        // Add text for controls
        let spaceing = 32;
        this.add.bitmapText(game.config.width/2 , game.config.height/3 - spaceing , 'gem', 'You have reached your group!', 32).setOrigin(0.5);

        // Credits Button
        let creditsButton = this.add.bitmapText(game.config.width/3, game.config.height/2, 'gem', 'Credits', 48).setOrigin(0.5);
        creditsButton.setInteractive();
        creditsButton.on('pointerdown', () => {
            this.scene.start('creditsScene');
        });

        // Menu Button
        let menuButton = this.add.bitmapText(game.config.width*2/3, game.config.height/2, 'gem', 'Menu', 48).setOrigin(0.5);
        menuButton.setInteractive();
        menuButton.on('pointerdown', () => {
            this.scene.start('menuScene');
        });
    }
}