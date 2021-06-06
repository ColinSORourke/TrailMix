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
        let spacing = 48;
        this.add.bitmapText(game.config.width/2 , game.config.height/3 - spacing , 'gem', 'Move: LEFT and RIGHT arrow keys', 32).setOrigin(0.5);
        this.add.bitmapText(game.config.width/2 , game.config.height/3 , 'gem', 'Jump: SPACE', 32).setOrigin(0.5);
        this.add.bitmapText(game.config.width/2 , game.config.height/3 + spacing , 'gem', 'Eat/Mix: F', 32).setOrigin(0.5);
        this.add.bitmapText(game.config.width/2 , game.config.height/3 + spacing*2 , 'gem', 'Powers: D', 32).setOrigin(0.5);
        this.add.bitmapText(game.config.width/2 , game.config.height/3 + spacing*3 , 'gem', 'Discard: S', 32).setOrigin(0.5);
        this.add.bitmapText(game.config.width/2 , game.config.height/3 + spacing*4 , 'gem', 'Interact: UP arrow key', 32).setOrigin(0.5);
        this.add.bitmapText(game.config.width/2 , game.config.height/3 + spacing*5 , 'gem', 'Reset Level: R', 32).setOrigin(0.5);

        // Menu 
        let MenuButton = this.add.bitmapText(game.config.width/2, game.config.height/2 + 220, 'gem', 'Back', 40).setOrigin(0.5);

        // Menu Button
        MenuButton.setInteractive();
        MenuButton.on('pointerdown', () => {
            if(enterFromGame) {
                enterFromGame = false;
                this.sound.play('sfx_select');
                this.scene.start('pauseScene');
            } else {
                this.sound.play('sfx_select');
                this.scene.start('menuScene');
            }
            
        });
    }
}